/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FileText,
  Mail,
  HelpCircle,
  Truck,
  RotateCcw,
  Shield,
  BookOpen,
  Send,
  CheckCircle2,
  RefreshCw,
  Info,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useCart, PolicyType } from '../context/CartContext.tsx';
import {
  ROASTER_CONFIG,
  getDisplaySupportEmail,
  getSupportEmailHref,
} from '../config/roasterConfig.ts';

export function PolicyModal() {
  const {
    activePolicy,
    closePolicy,
    openPolicy,
    mode,
    openCustomerPortal,
  } = useCart();

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  if (!activePolicy) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  const navItems: { id: PolicyType; label: string; icon: any }[] = [
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'returns', label: 'Refunds & Cancellations', icon: RotateCcw },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'manage-subscription', label: 'Manage Subscription', icon: RefreshCw },
    { id: 'about', label: 'About Roastery', icon: BookOpen },
    { id: 'contact', label: 'Contact & Support', icon: Mail },
    { id: 'faq', label: 'Frequently Asked', icon: HelpCircle },
  ];

  const currentTab = navItems.find((n) => n.id === activePolicy);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-3xl bg-[#FBF7F0] rounded-3xl border border-[#DDD2BF] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD2BF] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#24493A] text-[#FBF7F0] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#E69A3B]" />
            </div>
            <div>
              <h2
                id="policy-modal-title"
                className="text-lg font-bold text-[#2B2B28]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {currentTab?.label || 'Roastery Information'}
              </h2>
              <span className="text-xs text-[#6F6A60]">
                {ROASTER_CONFIG.business.name} • Roastery Information
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closePolicy}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex overflow-x-auto border-b border-[#DDD2BF] bg-[#F1E8D8]/50 px-4 py-2 gap-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePolicy === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setContactSubmitted(false);
                  openPolicy(item.id);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#24493A] text-white shadow-xs'
                    : 'text-[#6F6A60] hover:text-[#2B2B28] hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5 text-sm text-[#2B2B28] leading-relaxed">
          {/* Top disclaimer required for all demonstration policies */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                Template for demonstration; the business owner must review before launch.
              </span>
              <span className="text-[11px] text-amber-800">
                Replace placeholder provisions, fulfillment carrier details, and local regulatory requirements with your verified roastery terms.
              </span>
            </div>
          </div>

          {/* SHIPPING POLICY */}
          {activePolicy === 'shipping' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#2B2B28]" style={{ fontFamily: "'Fraunces', serif" }}>
                Shipping & Delivery Policy
              </h3>
              
              <div className="space-y-3 text-xs text-[#4A463F] leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">1. Eligible Shipping Regions</h4>
                  <p>
                    {ROASTER_CONFIG.business.name} ships roasted coffee throughout {ROASTER_CONFIG.commerce.shippingRegion}. For international orders or military addresses outside standard domestic carrier routing, please contact <a href={getSupportEmailHref()} className="text-[#24493A] font-semibold underline">{getDisplaySupportEmail(mode)}</a> to arrange tailored postal logistics.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">2. Roast Schedule & Weekly Dispatch</h4>
                  <p>
                    We maintain strict weekly roast cycles to safeguard freshness. All subscriber and retail bags are roasted in small batches every Monday. Orders placed by <strong>Sunday at 11:59 PM PT</strong> enter the Monday morning roast schedule and dispatch via carrier on Tuesday. Orders received after Sunday are queued for the subsequent week’s roast.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">3. Delivery Transit & Tracking</h4>
                  <p>
                    Domestic delivery typically arrives in 2 to 4 business days (Wednesday through Friday), allowing your micro-lot beans to arrive right as they reach their ideal degassing window (day 4 to 21 post-roast). A tracking number is emailed the moment your box leaves our dispatch dock.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">4. Shipping Rates & Free Shipping</h4>
                  <p>
                    All recurring club subscriptions include <strong>free standard tracked shipping</strong>. Single-bag and one-time retail purchases of ${ROASTER_CONFIG.commerce.freeShippingThreshold}.00 or more also receive free shipping. Orders under ${ROASTER_CONFIG.commerce.freeShippingThreshold}.00 incur a standard flat carrier fee of ${ROASTER_CONFIG.commerce.standardShippingFee.toFixed(2)}.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">5. Damaged or Delayed Shipments</h4>
                  <p>
                    If your shipment is significantly delayed, damaged in transit, or marked delivered without arrival, contact <a href={getSupportEmailHref()} className="text-[#24493A] font-semibold underline">{getDisplaySupportEmail(mode)}</a> within 7 calendar days. We will dispatch a prompt replacement box at no cost.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* REFUNDS & CANCELLATIONS POLICY */}
          {activePolicy === 'returns' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#2B2B28]" style={{ fontFamily: "'Fraunces', serif" }}>
                Refunds & Cancellations Policy
              </h3>

              <div className="space-y-3 text-xs text-[#4A463F] leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">1. Perishable Coffee Food Safety</h4>
                  <p>
                    Because roasted whole bean and ground coffee are perishable food products roasted to order, we cannot accept physical returns of coffee bags once shipped from our roasting facility.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">2. 100% Taste Calibration Guarantee</h4>
                  <p>
                    Your satisfaction is paramount. If a particular micro-lot or roast profile does not match your taste preference, reach out to our team at <a href={getSupportEmailHref()} className="text-[#24493A] font-semibold underline">{getDisplaySupportEmail(mode)}</a> within 14 days of receipt. Our roaster will review your water ratio, grinder setting, and water temperature, or dispatch a different origin profile free of charge on your next cycle.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">3. Subscription Pauses, Skips & Cancellations</h4>
                  <p>
                    Subscriptions can be paused, skipped, or cancelled at any time through your self-service Customer Portal with zero cancellation fees or penalties. To avoid being charged for an upcoming batch, adjustments must be saved before the weekly roasting cutoff: <strong>Sunday at 11:59 PM PT</strong>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">4. Refund Processing</h4>
                  <p>
                    Where a monetary refund is issued (e.g. for damaged shipments or hardware defects), the credit will be automatically processed back to your original payment method within 3 to 5 business days, depending on your card issuer.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">5. Brewing Equipment & Merchandise</h4>
                  <p>
                    Unused brewing gear (drippers, carafes, filters) in original packaging may be returned within 30 days of purchase for a full refund minus return shipping costs. Contact support for return authorization.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activePolicy === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#2B2B28]" style={{ fontFamily: "'Fraunces', serif" }}>
                Privacy & Data Protection Policy
              </h3>

              <div className="space-y-3 text-xs text-[#4A463F] leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">1. Information We Collect</h4>
                  <p>
                    {ROASTER_CONFIG.business.name} collects customer name, email address, physical delivery address, grind and brew preferences, and order history solely to fulfill your orders, provide dispatch tracking, and customize roast recommendations.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">2. Payment Security & Zero Raw Card Storage</h4>
                  <p>
                    All payment processing is handled through hosted, PCI-DSS Level 1 compliant gateways (such as Stripe). {ROASTER_CONFIG.business.name} servers never receive, store, or process raw credit card numbers or security CVV codes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">3. No Sale or Brokerage of Personal Data</h4>
                  <p>
                    We do not sell, rent, lease, or distribute your email address or personal details to third-party marketing companies, brokers, or external advertising exchanges.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">4. Service Communications & Unsubscribing</h4>
                  <p>
                    We send essential transactional communications (order confirmation, roast notification, carrier tracking). If you opt into roaster tasting notes or seasonal announcements, every message includes an immediate one-click unsubscribe link.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">5. Data Subject Rights & Contact</h4>
                  <p>
                    To request access to, correction of, or permanent deletion of your stored customer records, write to our privacy contact at <a href={getSupportEmailHref()} className="text-[#24493A] font-semibold underline">{getDisplaySupportEmail(mode)}</a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {activePolicy === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#2B2B28]" style={{ fontFamily: "'Fraunces', serif" }}>
                Terms of Service
              </h3>

              <div className="space-y-3 text-xs text-[#4A463F] leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">1. Agreement to Terms</h4>
                  <p>
                    By placing an order or joining a recurring coffee club through {ROASTER_CONFIG.business.name}, you agree to these Terms of Service and applicable commerce policies.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">2. Recurring Subscription Billing</h4>
                  <p>
                    Selecting a coffee subscription authorizes recurring charges to your chosen payment method at the frequency selected (every 2, 4, or 6 weeks) at current published prices until you pause or cancel.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">3. Sunday Roast Cutoff</h4>
                  <p>
                    Because fresh coffee is roasted to order on Mondays, modifications, address changes, pauses, or cancellations must be executed before Sunday 11:59 PM PT to apply to that week’s delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">4. Price Adjustments</h4>
                  <p>
                    If green coffee market prices necessitate a change in ongoing subscription rates, {ROASTER_CONFIG.business.name} will provide at least 30 calendar days advance notice via email to your registered address.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#24493A] mb-1">5. Governing Law</h4>
                  <p>
                    These terms are governed by the commercial statutes applicable to {ROASTER_CONFIG.business.name} operations within {ROASTER_CONFIG.commerce.shippingRegion}. For questions regarding terms, contact <a href={getSupportEmailHref()} className="text-[#24493A] font-semibold underline">{getDisplaySupportEmail(mode)}</a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE SUBSCRIPTION / UNSUBSCRIBE */}
          {activePolicy === 'manage-subscription' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD2BF]/60 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#2B2B28]" style={{ fontFamily: "'Fraunces', serif" }}>
                    Unsubscribe & Manage Subscription
                  </h3>
                  <p className="text-xs text-[#6F6A60] mt-0.5">
                    Total control over your deliveries. No hidden locks, contracts, or cancellation fees.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closePolicy();
                    openCustomerPortal();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#24493A] hover:bg-[#1B372C] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#E69A3B]" />
                  <span>Open Customer Portal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF] space-y-1.5">
                  <span className="text-xs font-bold text-[#D9633B] uppercase tracking-wider block">
                    1. Skip A Delivery
                  </span>
                  <p className="text-xs text-[#6F6A60]">
                    Traveling or have leftover beans? Skip your next scheduled shipment with one click. Your billing advances to the subsequent cycle automatically.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF] space-y-1.5">
                  <span className="text-xs font-bold text-[#24493A] uppercase tracking-wider block">
                    2. Pause Indefinitely
                  </span>
                  <p className="text-xs text-[#6F6A60]">
                    Need a break without losing your roast preferences? Pause your deliveries for weeks or months. Resume anytime without having to re-enter your details.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF] space-y-1.5">
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                    3. Cancel Anytime
                  </span>
                  <p className="text-xs text-[#6F6A60]">
                    Zero contracts. Cancel online with immediate effect. If canceled before Sunday 11:59 PM PT, no further orders will be roasted or billed.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F1E8D8] border border-[#DDD2BF] space-y-2 text-xs text-[#2B2B28]">
                <div className="flex items-center gap-2 font-bold text-[#24493A]">
                  <Calendar className="w-4 h-4 text-[#D9633B]" />
                  <span>Sunday 11:59 PM PT Cutoff Reminder</span>
                </div>
                <p className="text-[#6F6A60]">
                  To allow our roast master to source, batch, and test coffees for Monday morning production, all skips, address updates, and cancellations should be submitted prior to midnight Sunday.
                </p>
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] text-[#6F6A60]">
                    Prefer personal assistance? Email our support team:
                  </span>
                  <a
                    href={getSupportEmailHref()}
                    className="font-bold text-[#24493A] underline text-xs"
                  >
                    {getDisplaySupportEmail(mode)}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT ROASTERY */}
          {activePolicy === 'about' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                Mindful Coffee, Roasted in Small Batches
              </h3>
              <p>
                {ROASTER_CONFIG.business.name} connects curious home coffee drinkers with smallholder micro-lots around the world. We believe extraordinary coffee should not require pretentious vocabulary or thousands of dollars of commercial machinery.
              </p>
              <h4 className="text-base font-bold text-[#24493A] pt-2">Our 3 Core Commitments:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#6F6A60]">
                <li><strong>Direct Sourcing Transparency:</strong> Every coffee we release traces back to specific washing stations, grower cooperatives, or single estates.</li>
                <li><strong>Monday Roasting Discipline:</strong> We roast once a week to order, ensuring beans arrive during their peak degassing window (days 4 through 21 post-roast).</li>
                <li><strong>Practical Technique Guides:</strong> Each box includes straightforward, jargon-free recipes matched to your preferred brewer.</li>
              </ul>
            </div>
          )}

          {/* CONTACT & SUPPORT */}
          {activePolicy === 'contact' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF]">
                  <span className="text-xs font-bold uppercase text-[#6F6A60] block mb-1">Email Support</span>
                  <a
                    href={getSupportEmailHref()}
                    className="text-sm font-bold text-[#24493A] hover:underline"
                  >
                    {getDisplaySupportEmail(mode)}
                  </a>
                  <p className="text-xs text-[#6F6A60] mt-1">Guaranteed response within 1 business day.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF]">
                  <span className="text-xs font-bold uppercase text-[#6F6A60] block mb-1">Roastery Hours</span>
                  <span className="text-sm font-bold text-[#2B2B28]">{ROASTER_CONFIG.business.supportHours}</span>
                  <p className="text-xs text-[#6F6A60] mt-1">Roasting schedule: Mondays 6am–2pm PT.</p>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-950">Message Received</h4>
                  <p className="text-xs text-emerald-800">
                    Thank you, {contactForm.name}. A roaster on our team will reply to{' '}
                    <strong>{contactForm.email}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6F6A60]">
                    Send A Message to Our Roasters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-[#24493A]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-[#24493A]"
                    />
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about brew advice, grind sizing, or subscription questions..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-[#24493A]"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#24493A] text-white text-xs font-bold hover:bg-[#1B372C] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* FREQUENTLY ASKED QUESTIONS */}
          {activePolicy === 'faq' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-[#DDD2BF]">
                  <h4 className="text-sm font-bold text-[#2B2B28]">When is my coffee roasted and shipped?</h4>
                  <p className="text-xs text-[#6F6A60] mt-1 leading-relaxed">
                    All subscription and retail orders are roasted in small batches on Monday mornings and dispatched every Tuesday via expedited carrier. Packages typically land on your doorstep by Thursday or Friday, right when beans enter their peak flavor window.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#DDD2BF]">
                  <h4 className="text-sm font-bold text-[#2B2B28]">Can I pause, skip, or cancel anytime?</h4>
                  <p className="text-xs text-[#6F6A60] mt-1 leading-relaxed">
                    Yes, 100%. Through your self-service Customer Portal, you can skip an upcoming month or pause deliveries with one click. Cancellations take effect immediately with zero cancellation fees.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#DDD2BF]">
                  <h4 className="text-sm font-bold text-[#2B2B28]">Do you ship whole bean or pre-ground coffee?</h4>
                  <p className="text-xs text-[#6F6A60] mt-1 leading-relaxed">
                    Both! We always recommend Whole Bean for maximum aroma preservation, but we gladly grind fresh to order for Pour Over, French Press, Auto Drip, or AeroPress at no extra charge.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
