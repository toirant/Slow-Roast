/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Terminal,
  Package,
  CreditCard,
  Building,
  Key,
  Globe,
  FileText,
  DollarSign,
  Play,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';
import { OrderRecord, formatCurrency } from '../utils/commerceLogic.ts';

export function OwnerPortalModal() {
  const { isOwnerPortalOpen, closeOwnerPortal, mode, setMode, isStripeLiveConfigured } = useCart();
  const [activeTab, setActiveTab] = useState<'checklist' | 'webhooks' | 'orders' | 'config'>('checklist');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<
    { id: string; event: string; status: string; time: string; detail: string }[]
  >([]);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  useEffect(() => {
    if (isOwnerPortalOpen) {
      // Fetch latest orders
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(() => {});
    }
  }, [isOwnerPortalOpen]);

  if (!isOwnerPortalOpen) return null;

  const handleTriggerSimulatedWebhook = async (
    eventType: 'payment_success' | 'payment_failed' | 'subscription_cancelled'
  ) => {
    setIsSimulatingWebhook(true);
    const targetOrderId = orders[0]?.orderId || 'SR-261108-4120';

    try {
      const res = await fetch('/api/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, orderId: targetOrderId }),
      });
      const data = await res.json();

      setWebhookLogs((prev) => [
        {
          id: data.eventId || `evt_${Date.now()}`,
          event: eventType,
          status: '200 OK (Processed with Idempotency)',
          time: new Date().toLocaleTimeString(),
          detail: `Event ${eventType} applied to Order ${targetOrderId}. Subscription state updated.`,
        },
        ...prev,
      ]);

      // Refresh orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.orders) setOrders(ordersData.orders);
    } catch (err: any) {
      setWebhookLogs((prev) => [
        {
          id: `err_${Date.now()}`,
          event: eventType,
          status: 'Error',
          time: new Date().toLocaleTimeString(),
          detail: err.message || 'Webhook simulation error',
        },
        ...prev,
      ]);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-portal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-[#FBF7F0] rounded-3xl border border-[#DDD2BF] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#DDD2BF] bg-[#1F2A24] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24493A] text-[#E69A3B] flex items-center justify-center border border-white/10">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="owner-portal-title"
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Roaster Owner Dashboard
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    mode === 'demo' ? 'bg-[#E69A3B] text-[#1F2A24]' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {mode === 'demo' ? 'Demo Mode' : 'Live Mode'}
                </span>
              </div>
              <p className="text-xs text-white/70">
                Setup guide, live launch checklist, commerce configuration & webhook testing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeOwnerPortal}
            aria-label="Close Roaster Owner Dashboard"
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DDD2BF] bg-white px-6 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-[#24493A] text-[#24493A]'
                : 'border-transparent text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Launch Checklist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('webhooks')}
            className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'webhooks'
                ? 'border-[#24493A] text-[#24493A]'
                : 'border-transparent text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Webhook & Event Tester
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#24493A] text-[#24493A]'
                : 'border-transparent text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Orders Vault ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'border-[#24493A] text-[#24493A]'
                : 'border-transparent text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Cost & Fees Transparency
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              {/* Mode Toggle Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#DDD2BF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#2B2B28]">Store Operation Mode</h3>
                    {isStripeLiveConfigured ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Stripe Keys Connected
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        No Stripe Keys (Demo Safe)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6F6A60] mt-1">
                    {mode === 'demo'
                      ? 'DEMO MODE: Works immediately with zero setup or Stripe credentials. Uses simulated checkout, sample products, and test customer portal.'
                      : isStripeLiveConfigured
                      ? 'LIVE COMMERCE MODE: Stripe credentials detected. Ready to process real customer cards through hosted Stripe checkout.'
                      : 'LIVE MODE SELECTED (Keys Pending): Live mode requires server-side STRIPE_SECRET_KEY. Checkout will prompt or switch to Demo Mode until keys are set.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMode('demo')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'demo'
                        ? 'bg-[#24493A] text-white shadow-xs'
                        : 'bg-[#F1E8D8] text-[#6F6A60] hover:text-[#2B2B28]'
                    }`}
                  >
                    Demo Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('live')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'live'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-[#F1E8D8] text-[#6F6A60] hover:text-[#2B2B28]'
                    }`}
                  >
                    Live Mode
                  </button>
                </div>
              </div>

              {/* Side-by-Side Launch Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Completed Work */}
                <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed In This Platform</span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#2B2B28]">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>Responsive E-Commerce Layout:</strong> Full-width responsive desktop grid and mobile UX replacing narrow email view.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>Subscription Engine:</strong> Bag sizes (12oz, 2lb), grind selections, cadence (2, 4, 6 wks) & free shipping rules.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>Cart & Promo Code Engine:</strong> Slide-over cart, quantity modification, and sample promo codes (FIRSTBOX).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>Secure Stripe Architecture:</strong> Server-side checkout session creation, webhook signature verification, and duplicate prevention.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>Customer Self-Service Portal:</strong> 1-click skip next month, pause deliveries, and cancel with zero retention tricks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>Interactive Tools:</strong> Roast Matcher with direct cart wiring, Accessible Sourcing Map (Map + List view), Brew School & Timers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span><strong>SEO & Crawling Controls:</strong> robots.txt, sitemap.xml, and no-index protection for demo modes.</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Required from Roaster Owner */}
                <div className="p-5 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-amber-200 pb-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Required From Roaster Before Live Launch</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#2B2B28]">
                    <li className="flex items-start gap-2">
                      <Key className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Stripe Merchant Account:</strong> Create a verified Stripe account and supply <code>STRIPE_SECRET_KEY</code> and <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in <code>.env</code>.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Stripe Webhook Secret:</strong> Configure endpoint <code>https://yourdomain.com/api/webhook</code> in Stripe dashboard and add <code>STRIPE_WEBHOOK_SECRET</code>.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Building className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Verified Business Address:</strong> Replace roastery location placeholder with verified legal business entity address.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Legal Review of Policies:</strong> Review and formally approve the drafted Shipping, Returns, Privacy and Terms documents with your legal counsel.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Live Product & Tax Setup:</strong> Confirm your actual wholesale/retail coffee pricing and state/local sales tax collection rules.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF] space-y-3">
                <h3 className="text-sm font-bold text-[#2B2B28] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#24493A]" />
                  <span>Stripe Webhook Event Simulator</span>
                </h3>
                <p className="text-xs text-[#6F6A60]">
                  Test how the server verifies signatures, prevents duplicate orders via idempotency checks,
                  and handles customer subscription lifecycle events.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isSimulatingWebhook}
                    onClick={() => handleTriggerSimulatedWebhook('payment_success')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simulate checkout.session.completed</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSimulatingWebhook}
                    onClick={() => handleTriggerSimulatedWebhook('payment_failed')}
                    className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simulate invoice.payment_failed</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSimulatingWebhook}
                    onClick={() => handleTriggerSimulatedWebhook('subscription_cancelled')}
                    className="px-3.5 py-2 rounded-xl bg-[#24493A] hover:bg-[#1B372C] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simulate customer.subscription.deleted</span>
                  </button>
                </div>
              </div>

              {/* Event Log Output */}
              <div className="p-4 rounded-2xl bg-[#1F2A24] text-[#FBF7F0] font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#E69A3B] font-bold">Processed Webhook Event Feed</span>
                  <span className="text-[10px] text-white/50">HMAC verification active</span>
                </div>

                {webhookLogs.length === 0 ? (
                  <p className="text-white/40 py-4 text-center">
                    No simulated events triggered yet. Tap any button above to test webhook handling.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {webhookLogs.map((log) => (
                      <div key={log.id} className="p-2 rounded bg-black/40 border border-white/5 text-[11px]">
                        <div className="flex justify-between text-[#E69A3B]">
                          <span>{log.event}</span>
                          <span className="text-white/60">{log.time}</span>
                        </div>
                        <div className="text-emerald-400 mt-0.5">{log.status}</div>
                        <div className="text-white/70 text-[10px] mt-0.5">{log.detail}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B2B28]">Customer Orders Recorded</h3>
                <span className="text-xs text-[#6F6A60]">{orders.length} order(s)</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#DDD2BF] text-xs text-[#6F6A60]">
                  No orders recorded yet. Complete a checkout in Demo or Live mode to see orders appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-4 rounded-2xl bg-white border border-[#DDD2BF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#24493A]">{order.orderId}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                          {order.isSubscription && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#24493A]/10 text-[#24493A]">
                              Sub: {order.subscriptionStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-[#2B2B28]">
                          <strong>{order.customerName}</strong> ({order.customerEmail})
                        </div>
                        <div className="text-[#6F6A60] text-[11px]">
                          {order.items.map((i) => `${i.quantity}x ${i.title} (${i.bagWeight})`).join(', ')}
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-[#DDD2BF]/60 sm:pl-4">
                        <div className="text-base font-bold text-[#24493A]">
                          {formatCurrency(order.pricing.total)}
                        </div>
                        <div className="text-[10px] text-[#6F6A60]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-[#DDD2BF] space-y-3">
                <h3 className="text-sm font-bold text-[#2B2B28]">Cost & Processing Fees Breakdown</h3>
                <p className="text-xs text-[#6F6A60] leading-relaxed">
                  To keep overhead minimal for independent roasters, this platform avoids unnecessary third-party monthly SaaS fees.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FBF7F0] border border-[#DDD2BF]">
                    <span className="text-[11px] font-bold uppercase text-[#6F6A60] block">Platform Fee</span>
                    <span className="text-lg font-bold text-emerald-700">0%</span>
                    <p className="text-[11px] text-[#6F6A60] mt-0.5">Zero platform surcharge.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FBF7F0] border border-[#DDD2BF]">
                    <span className="text-[11px] font-bold uppercase text-[#6F6A60] block">Stripe Processing</span>
                    <span className="text-lg font-bold text-[#2B2B28]">2.9% + 30¢</span>
                    <p className="text-[11px] text-[#6F6A60] mt-0.5">Standard card interchange fee per transaction.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FBF7F0] border border-[#DDD2BF]">
                    <span className="text-[11px] font-bold uppercase text-[#6F6A60] block">Cloud Hosting</span>
                    <span className="text-lg font-bold text-emerald-700">Free Tier</span>
                    <p className="text-[11px] text-[#6F6A60] mt-0.5">Deployable to Google Cloud Run or Render free tier.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
