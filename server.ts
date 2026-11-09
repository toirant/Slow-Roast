/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { ROASTER_CONFIG } from './src/config/roasterConfig.ts';
import {
  calculateOrderPricing,
  generateDemoOrderId,
  getNextMondayRoastDate,
  type OrderRecord,
} from './src/utils/commerceLogic.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Default to 3000 to match container Nginx proxy; avoid Cloud Run's outer PORT=8080 collision
const PORT = process.env.APP_PORT
  ? parseInt(process.env.APP_PORT, 10)
  : (process.env.PORT && process.env.PORT !== '8080' ? parseInt(process.env.PORT, 10) : 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

// Explicit health check endpoints for Cloud Run & container probes
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Initialize Stripe if secret key is provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// In-memory store for demo orders & processed webhook event IDs (for idempotency)
const demoOrders = new Map<string, OrderRecord>();
const processedWebhookEventIds = new Set<string>();

// Pre-populate with a sample demo order so roaster owner sees how orders appear
const initialDemoOrder: OrderRecord = {
  orderId: 'SR-261108-4120',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  customerName: 'Marcus Vance',
  customerEmail: 'marcus.v@example.com',
  items: [
    {
      id: 'item-demo-initial',
      productId: 'sub-roasters-choice',
      title: "The Roaster's Choice Club",
      subtitle: 'Curated 2-Bag Monthly Rotation',
      image: '/Hero.jpg',
      isSubscription: true,
      grind: 'Whole Bean',
      bagWeight: '12oz',
      frequency: '4-weeks',
      unitPrice: 32.4,
      quantity: 1,
    },
  ],
  pricing: {
    subtotal: 32.4,
    discount: 0,
    shipping: 0,
    tax: 2.75,
    total: 35.15,
    isFreeShipping: true,
    qualifiesForFreeShippingDueToSubscription: true,
    amountNeededForFreeShipping: 0,
  },
  shippingAddress: {
    street: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
  },
  status: 'confirmed',
  mode: 'demo',
  isSubscription: true,
  subscriptionStatus: 'active',
  nextRoastDate: getNextMondayRoastDate(),
};
demoOrders.set(initialDemoOrder.orderId, initialDemoOrder);

// Raw body parser for Stripe webhook signature verification
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!stripe || !stripeWebhookSecret) {
      console.log('[Webhook] Stripe or webhook secret not configured. Returning 200 in Demo mode.');
      return res.status(200).json({
        received: true,
        note: 'Stripe secret or webhook secret not configured; running in demo simulation.',
      });
    }

    if (!sig || typeof sig !== 'string') {
      return res.status(400).send('Missing Stripe signature header');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } catch (err: any) {
      console.error(`[Webhook Error] Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Signature Error: ${err.message}`);
    }

    // Idempotency check: prevent duplicate order processing
    if (processedWebhookEventIds.has(event.id)) {
      console.log(`[Webhook] Event ${event.id} already processed. Skipping duplicate.`);
      return res.status(200).json({ received: true, duplicate: true });
    }
    processedWebhookEventIds.add(event.id);

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.orderId || `STRIPE-${session.id.slice(-8)}`;
          console.log(`[Webhook] Payment confirmed for Order ${orderId}`);
          break;
        }
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Webhook] Subscription updated: ${subscription.id}`);
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);
          break;
        }
        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
          break;
        }
        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      return res.status(200).json({ received: true });
    } catch (err: any) {
      console.error(`[Webhook Handler Error]: ${err.message}`);
      return res.status(500).json({ error: 'Internal handler error' });
    }
  }
);

// Standard JSON middleware for API endpoints
app.use(express.json());

// 1. Config endpoint
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    business: ROASTER_CONFIG.business,
    currency: ROASTER_CONFIG.commerce.currency,
    currencySymbol: ROASTER_CONFIG.commerce.currencySymbol,
    freeShippingThreshold: ROASTER_CONFIG.commerce.freeShippingThreshold,
    standardShippingFee: ROASTER_CONFIG.commerce.standardShippingFee,
    isStripeLiveConfigured: Boolean(stripeSecretKey && stripeWebhookSecret),
    stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    mode: stripeSecretKey ? 'live' : 'demo',
    productsCount: ROASTER_CONFIG.products.length,
  });
});

// 2. Checkout endpoint
app.post('/api/checkout', async (req: Request, res: Response) => {
  try {
    const { items, customer, couponCode, mode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add at least one coffee.' });
    }

    if (!customer || !customer.email || !customer.fullName) {
      return res.status(400).json({ error: 'Customer contact information is incomplete.' });
    }

    const pricing = calculateOrderPricing(items, couponCode);
    const isSubscription = items.some((item) => item.isSubscription);
    const orderId = generateDemoOrderId();

    // Live Mode validation: requires verified server-side Stripe credentials
    if (mode === 'live') {
      if (!stripe) {
        return res.status(400).json({
          error:
            'Live payments are disabled because Stripe credentials (STRIPE_SECRET_KEY) have not been configured on the server. Please switch to Demo Mode for simulated checkout.',
          requiresStripeKeys: true,
        });
      }

      const origin = req.headers.origin || `http://localhost:${PORT}`;

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
        price_data: {
          currency: ROASTER_CONFIG.commerce.currency.toLowerCase(),
          product_data: {
            name: `${item.title} (${item.bagWeight})`,
            description: `Grind: ${item.grind}${item.frequency ? ` • ${item.frequency}` : ''}`,
          },
          unit_amount: Math.round(item.unitPrice * 100),
          ...(item.isSubscription && {
            recurring: {
              interval: item.frequency === '2-weeks' ? 'week' : 'month',
              interval_count: item.frequency === '2-weeks' ? 2 : item.frequency === '6-weeks' ? 2 : 1,
            },
          }),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: isSubscription ? 'subscription' : 'payment',
        success_url: `${origin}/?checkout=success&orderId=${orderId}`,
        cancel_url: `${origin}/?checkout=cancel`,
        customer_email: customer.email,
        metadata: {
          orderId,
          customerName: customer.fullName,
          mode: 'live',
        },
      });

      return res.json({
        simulated: false,
        orderId,
        checkoutUrl: session.url,
      });
    }

    // Demo Mode: Completely standalone simulated checkout requiring NO Stripe credentials.
    // Creates realistic simulated order record and stores it in demo memory.
    const orderRecord: OrderRecord = {
      orderId,
      createdAt: new Date().toISOString(),
      customerName: customer.fullName,
      customerEmail: customer.email,
      items,
      pricing,
      shippingAddress: {
        street: customer.streetAddress || '123 Coffee Lane',
        apartment: customer.apartment,
        city: customer.city || 'Portland',
        state: customer.stateProvince || 'OR',
        postalCode: customer.postalCode || '97201',
        country: customer.country || 'United States',
      },
      status: 'confirmed',
      mode: 'demo',
      isSubscription,
      subscriptionStatus: isSubscription ? 'active' : undefined,
      nextRoastDate: getNextMondayRoastDate(),
    };

    demoOrders.set(orderId, orderRecord);

    return res.json({
      simulated: true,
      orderId,
      order: orderRecord,
      message: 'Demo checkout completed successfully without charging your card.',
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message || 'Unable to process checkout.' });
  }
});

// 3. Simulated webhook tester (for owner demonstration in demo mode)
app.post('/api/simulate-webhook', (req: Request, res: Response) => {
  const { eventType, orderId } = req.body;
  const targetOrder = demoOrders.get(orderId);

  if (!targetOrder && eventType !== 'ping') {
    return res.status(404).json({ error: `Order ${orderId} not found in demo session.` });
  }

  const simulatedEventId = `sim_evt_${Date.now()}`;
  if (processedWebhookEventIds.has(simulatedEventId)) {
    return res.status(200).json({ success: true, duplicate: true });
  }
  processedWebhookEventIds.add(simulatedEventId);

  switch (eventType) {
    case 'payment_success':
      if (targetOrder) targetOrder.status = 'confirmed';
      break;
    case 'payment_failed':
      if (targetOrder) targetOrder.status = 'failed';
      break;
    case 'subscription_skipped':
      if (targetOrder) targetOrder.subscriptionStatus = 'skipped_next';
      break;
    case 'subscription_paused':
      if (targetOrder) targetOrder.subscriptionStatus = 'paused';
      break;
    case 'subscription_cancelled':
      if (targetOrder) targetOrder.subscriptionStatus = 'cancelled';
      break;
  }

  return res.json({
    success: true,
    eventId: simulatedEventId,
    eventType,
    orderId,
    order: targetOrder,
    timestamp: new Date().toISOString(),
  });
});

// 4. Orders list (for Roaster Admin preview in demo mode)
app.get('/api/orders', (_req: Request, res: Response) => {
  const ordersList = Array.from(demoOrders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ orders: ordersList, total: ordersList.length });
});

// 5. Subscription management portal action (skip, pause, resume, cancel)
app.post('/api/portal/manage', (req: Request, res: Response) => {
  const { orderId, action } = req.body;
  const order = demoOrders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Subscription order not found.' });
  }

  switch (action) {
    case 'skip':
      order.subscriptionStatus = 'skipped_next';
      break;
    case 'pause':
      order.subscriptionStatus = 'paused';
      break;
    case 'resume':
      order.subscriptionStatus = 'active';
      break;
    case 'cancel':
      order.subscriptionStatus = 'cancelled';
      break;
    default:
      return res.status(400).json({ error: 'Invalid subscription action.' });
  }

  return res.json({
    success: true,
    action,
    order,
    message: `Subscription successfully updated to ${order.subscriptionStatus}.`,
  });
});

// Mount Vite or serve static assets
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Slow Roast Coffee Club running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
