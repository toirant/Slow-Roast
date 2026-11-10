/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { FAQS, filterFaqs, FAQItem } from '../data/faqs.ts';
import { getSupportEmailHref, getDisplaySupportEmail } from '../config/roasterConfig.ts';
import { useCart } from '../context/CartContext.tsx';

interface FAQSectionProps {
  onJoinClick?: () => void;
}

export function FAQSection({ onJoinClick }: FAQSectionProps) {
  const { mode } = useCart();
  // First item open by default to invite interaction
  const [openId, setOpenId] = useState<string | null>('shipping-speed');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayedFaqs = filterFaqs(searchQuery, selectedCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'shipping', label: 'Shipping & Delivery' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'coffee', label: 'Coffee & Origin' },
    { id: 'gear', label: 'Brew Gear' },
  ];

  return (
    <section aria-labelledby="faq-heading" className="w-full">
      {/* Section Header */}
      <div className="text-center mb-8 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold tracking-wider uppercase mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>

        <h2
          id="faq-heading"
          className="text-3xl sm:text-[38px] leading-[1.15] font-semibold text-[#2B2B28] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Frequently Asked Questions
        </h2>

        <p className="text-[16px] sm:text-[17px] text-[#6F6A60] max-w-md mx-auto leading-relaxed">
          Everything you need to know about fresh roasting dates, doorstep delivery, and zero-hassle membership.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 px-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#24493A] outline-none ${
              selectedCategory === cat.id
                ? 'bg-[#24493A] text-white shadow-xs'
                : 'bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#E7DDCB] border border-[#DDD2BF]/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3" role="region" aria-label="Questions and answers">
        {displayedFaqs.length === 0 ? (
          <div className="text-center py-8 rounded-xl bg-[#F1E8D8]/50 border border-[#DDD2BF] p-6">
            <p className="text-sm text-[#6F6A60] mb-2">No matching questions found.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#D9633B] hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          displayedFaqs.map((faq: FAQItem) => {
            const isOpen = openId === faq.id;
            const contentId = `faq-content-${faq.id}`;
            const headerId = `faq-header-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#F1E8D8] border-[#24493A]/30 shadow-xs ring-1 ring-[#24493A]/10'
                    : 'bg-[#F1E8D8]/70 hover:bg-[#F1E8D8] border-[#DDD2BF]'
                }`}
              >
                <button
                  id={headerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleItem(faq.id)}
                  className="w-full py-4 px-5 text-left flex items-start justify-between gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#24493A] focus-visible:ring-inset outline-none"
                >
                  <div className="space-y-1 pr-2">
                    {faq.tag && (
                      <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-[#D9633B]">
                        {faq.tag}
                      </span>
                    )}
                    <h3
                      className="text-[17px] sm:text-[18px] font-medium text-[#2B2B28] leading-snug"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isOpen ? 'bg-[#24493A] text-white' : 'bg-white/80 text-[#6F6A60]'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-5 pb-5 pt-1 text-[15px] sm:text-[16px] text-[#2B2B28] leading-relaxed border-t border-[#DDD2BF]/40"
                  >
                    <p className="text-[#3D3A34]">{faq.answer}</p>
                    {faq.id === 'subscription-cancel' && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#24493A] bg-[#24493A]/8 px-3 py-1.5 rounded-lg w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#24493A]" />
                        <span>Self-serve 1-click pause or cancel anytime</span>
                      </div>
                    )}
                    {faq.id === 'shipping-speed' && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#D9633B] bg-[#D9633B]/10 px-3 py-1.5 rounded-lg w-fit">
                        <Sparkles className="w-3.5 h-3.5 text-[#D9633B]" />
                        <span>Roasted Mondays, shipped Tuesdays with live tracking</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Trust & Direct Help Callout */}
      <div className="mt-8 rounded-xl bg-white/70 border border-[#DDD2BF] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#24493A]/10 text-[#24493A] flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2B2B28]">Still have questions?</h4>
            <p className="text-xs text-[#6F6A60]">
              Our roasting team is here to help with grind size or gear advice.
            </p>
          </div>
        </div>

        <a
          href={getSupportEmailHref()}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold text-[#24493A] border border-[#24493A]/40 hover:bg-[#24493A] hover:text-white transition-colors cursor-pointer"
        >
          Email roasters: {getDisplaySupportEmail(mode)}
        </a>
      </div>
    </section>
  );
}
