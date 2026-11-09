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
  AlertTriangle,
} from 'lucide-react';
import { useCart, PolicyType } from '../context/CartContext.tsx';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

export function PolicyModal() {
  const { activePolicy, closePolicy, openPolicy } = useCart();
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
    { id: 'about', label: 'About Roastery', icon: BookOpen },
    { id: 'contact', label: 'Contact & Support', icon: Mail },
    { id: 'faq', label: 'Frequently Asked', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'returns', label: 'Returns & Guarantee', icon: RotateCcw },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
  ];

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
                {navItems.find((n) => n.id === activePolicy)?.label}
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
          {/* ABOUT */}
          {activePolicy === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Owner Note:</strong> This About story can be personalized with your roastery’s heritage, local origin story, head roaster philosophy, and equipment specs.
              </div>
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                Mindful Coffee, Roasted in Small Batches
              </h3>
              <p>
                {ROASTER_CONFIG.business.name} is dedicated to connecting curious home coffee drinkers with smallholder micro-lots around the world. We believe extraordinary coffee should not require pretentious vocabulary or thousands of dollars of commercial machinery.
              </p>
              <h4 className="text-base font-bold text-[#24493A] pt-2">Our 3 Core Commitments:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#6F6A60]">
                <li><strong>Direct Sourcing Transparency:</strong> Every coffee we release traces back to specific washing stations, grower cooperatives, or single estates.</li>
                <li><strong>Monday Roasting Discipline:</strong> We roast once a week to order, ensuring beans arrive during their peak degassing window (days 4 through 21 post-roast).</li>
                <li><strong>Practical Technique Guides:</strong> Each box includes straightforward, jargon-free recipes matched to your preferred brewer.</li>
              </ul>
            </div>
          )}

          {/* CONTACT */}
          {activePolicy === 'contact' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#DDD2BF]">
                  <span className="text-xs font-bold uppercase text-[#6F6A60] block mb-1">Email Support</span>
                  <a
                    href={`mailto:${ROASTER_CONFIG.business.contactEmail}`}
                    className="text-sm font-bold text-[#24493A] hover:underline"
                  >
                    {ROASTER_CONFIG.business.contactEmail}
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
                      className="py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#24493A]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#24493A]"
                    />
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about brew advice, grind sizing, or subscription questions..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-[#DDD2BF] rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#24493A]"
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

          {/* FAQ */}
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

          {/* SHIPPING POLICY */}
          {activePolicy === 'shipping' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>[DRAFT FOR ROASTER & LEGAL REVIEW]:</strong> Review carrier contracts, domestic shipping zones, cutoff times, and state delivery laws before public deployment.
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2B2B28]">Shipping & Delivery Guidelines</h3>
              <p className="text-xs text-[#6F6A60]">
                <strong>Roast Schedule:</strong> Orders placed before Sunday 11:59pm PT are queued for Monday roasting and Tuesday carrier dispatch. Orders placed after the cutoff are queued for the following week’s roast.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>Shipping Costs:</strong> All monthly subscriptions include free standard tracked shipping. Single bag orders under $35.00 incur a standard flat rate of $5.00.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>Lost or Damaged Parcels:</strong> If a package is marked lost by the carrier or arrives damaged, please notify {ROASTER_CONFIG.business.contactEmail} within 7 days for a free replacement dispatch.
              </p>
            </div>
          )}

          {/* RETURNS POLICY */}
          {activePolicy === 'returns' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>[DRAFT FOR ROASTER & LEGAL REVIEW]:</strong> Perishable roasted coffee regulations and satisfaction resolution policies.
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2B2B28]">Returns & Taste Guarantee</h3>
              <p className="text-xs text-[#6F6A60]">
                Due to the perishable nature of freshly roasted whole bean and ground coffee, we cannot accept physical returns of opened or unopened coffee bags once dispatched.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>Our Taste Calibration Guarantee:</strong> If a roast profile is not to your preference, contact us within 14 days of delivery. Our head roaster will troubleshoot your brewing technique or send an alternative roast profile on us in your next delivery.
              </p>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activePolicy === 'privacy' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>[DRAFT FOR ROASTER & LEGAL REVIEW]:</strong> Ensure compliance with GDPR, CCPA, and your jurisdiction’s consumer data protection statutes.
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2B2B28]">Privacy & Data Protection</h3>
              <p className="text-xs text-[#6F6A60]">
                We respect your personal privacy. We collect customer contact and shipping information solely to process orders, dispatch fresh roast notifications, and provide customer support.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>No Raw Card Storage:</strong> Payment card numbers, CVVs, and billing tokens are handled securely by our PCI-DSS Level 1 compliant payment processor (Stripe). We never view or store raw card information on our servers.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>No Third-Party Ad Trackers:</strong> We do not sell customer lists, track browsing across unrelated sites, or install invasive ad network pixels.
              </p>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {activePolicy === 'terms' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>[DRAFT FOR ROASTER & LEGAL REVIEW]:</strong> Standard merchant terms for recurring subscription billing and service agreements.
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2B2B28]">Subscription Terms of Service</h3>
              <p className="text-xs text-[#6F6A60]">
                <strong>Recurring Billing:</strong> By subscribing, you authorize recurring charges to your payment method at the chosen frequency until paused or cancelled.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>Cancellation Cutoff:</strong> Cancellations or skips must be submitted before the Sunday 11:59pm PT weekly roasting cutoff to prevent dispatch of that week’s shipment.
              </p>
              <p className="text-xs text-[#6F6A60]">
                <strong>Pricing Changes:</strong> Any price adjustment to ongoing subscriptions requires at least 30 days prior written notice via email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
