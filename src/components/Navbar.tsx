/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Settings, Menu, X, Coffee } from 'lucide-react';
import { useCart, PolicyType } from '../context/CartContext.tsx';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

export function Navbar() {
  const { items, openCart, openOwnerPortal, openPolicy } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePolicyClick = (policy: PolicyType) => {
    setMobileMenuOpen(false);
    openPolicy(policy);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF7F0]/95 backdrop-blur-md border-b border-[#DDD2BF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <a
            href="#hero-section"
            className="flex items-center gap-2.5 text-[#24493A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24493A] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#24493A] text-[#FBF7F0] flex items-center justify-center shadow-sm">
              <Coffee className="w-5 h-5 text-[#E69A3B]" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-2xl font-bold tracking-tight text-[#24493A] leading-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {ROASTER_CONFIG.business.name}
              </span>
              <span className="text-[11px] font-medium text-[#6F6A60] tracking-wider uppercase">
                {ROASTER_CONFIG.business.locationNote}
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#2B2B28]"
        >
          <button
            type="button"
            onClick={() => handleNavClick('#subscriptions-section')}
            className="text-[#2B2B28] hover:text-[#D9633B] transition-colors cursor-pointer py-1 focus-visible:ring-2 focus-visible:ring-[#24493A] rounded"
          >
            Subscriptions
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#shop-section')}
            className="text-[#2B2B28] hover:text-[#D9633B] transition-colors cursor-pointer py-1 focus-visible:ring-2 focus-visible:ring-[#24493A] rounded"
          >
            Coffee Shop
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#origins-section')}
            className="text-[#2B2B28] hover:text-[#D9633B] transition-colors cursor-pointer py-1 focus-visible:ring-2 focus-visible:ring-[#24493A] rounded"
          >
            Origin Sourcing
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#brewing-school-section')}
            className="text-[#2B2B28] hover:text-[#D9633B] transition-colors cursor-pointer py-1 focus-visible:ring-2 focus-visible:ring-[#24493A] rounded"
          >
            Brew School
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#roast-quiz-section')}
            className="text-[#2B2B28] hover:text-[#D9633B] transition-colors cursor-pointer py-1 focus-visible:ring-2 focus-visible:ring-[#24493A] rounded"
          >
            Roast Matcher
          </button>
          <button
            type="button"
            onClick={() => handlePolicyClick('about')}
            className="text-[#2B2B28] hover:text-[#D9633B] transition-colors cursor-pointer py-1 focus-visible:ring-2 focus-visible:ring-[#24493A] rounded"
          >
            About Roastery
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Roaster Owner Admin button */}
          <button
            type="button"
            onClick={openOwnerPortal}
            aria-label="Open Roaster Owner Dashboard & Launch Checklist"
            className="p-2.5 rounded-xl border border-[#DDD2BF] bg-[#F1E8D8] text-[#24493A] hover:bg-[#EAE0CD] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#24493A]"
            title="Roaster Owner Settings & Launch Checklist"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping Cart, ${totalQuantity} items`}
            className="relative p-2.5 rounded-xl bg-[#24493A] text-white hover:bg-[#1B372C] transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-[#24493A] flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 text-[#E69A3B]" />
            <span className="text-sm font-semibold hidden sm:inline">Cart</span>
            {totalQuantity > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D9633B] text-white text-xs font-bold flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="md:hidden p-2.5 rounded-xl border border-[#DDD2BF] text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDD2BF] bg-[#FBF7F0] px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNavClick('#subscriptions-section')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            Subscriptions
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#shop-section')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            Coffee Shop
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#origins-section')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            Origin Sourcing
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#brewing-school-section')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            Brew School
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('#roast-quiz-section')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            Roast Matcher
          </button>
          <button
            type="button"
            onClick={() => handlePolicyClick('about')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            About Roastery
          </button>
          <button
            type="button"
            onClick={() => handlePolicyClick('contact')}
            className="block w-full text-left py-2 px-3 text-base font-semibold text-[#2B2B28] rounded-lg hover:bg-[#F1E8D8]"
          >
            Contact & Support
          </button>
        </div>
      )}
    </header>
  );
}
