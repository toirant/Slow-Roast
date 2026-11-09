/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Coffee,
  Package,
  BookOpen,
  Map,
  Repeat,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Truck,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CartProvider, useCart, PolicyType } from './context/CartContext.tsx';
import { ModeBanner } from './components/ModeBanner.tsx';
import { Navbar } from './components/Navbar.tsx';
import { SubscriptionOffer } from './components/SubscriptionOffer.tsx';
import { ProductShop } from './components/ProductShop.tsx';
import { MediaFrame } from './components/MediaFrame.tsx';
import { WorldOriginMap } from './components/WorldOriginMap.tsx';
import { RoastQuiz } from './components/RoastQuiz.tsx';
import { BrewingSchool } from './components/BrewingSchool.tsx';
import { BrewTimer } from './components/BrewTimer.tsx';
import { RoastComparisonTable } from './components/RoastComparisonTable.tsx';
import { RecentBrews } from './components/RecentBrews.tsx';
import { FAQSection } from './components/FAQSection.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { CustomerPortalModal } from './components/CustomerPortalModal.tsx';
import { OwnerPortalModal } from './components/OwnerPortalModal.tsx';
import { PolicyModal } from './components/PolicyModal.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { ROASTER_CONFIG } from './config/roasterConfig.ts';
import { ToastItem, ToastVariant, createToast, addToast, removeToast } from './utils/toast.ts';
import { RoastLevel, BrewMethod } from './utils/coffeePlan.ts';
import { RoastType } from './utils/roastComparison.ts';

function MainAppContent() {
  const { addItem, openCheckout, openPolicy, confirmedOrder } = useCart();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);

  const showToast = (title: string, message: string, variant: ToastVariant = 'success') => {
    const newToast = createToast(title, message, variant);
    setToasts((prev) => addToast(prev, newToast));
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => removeToast(prev, id));
  };

  const handleHeroSubscribe = () => {
    const subProduct = ROASTER_CONFIG.products[0];
    addItem(subProduct, {
      bagWeight: '12oz',
      grind: 'Whole Bean',
      frequency: '4-weeks',
      isSubscription: true,
    });
    openCheckout();
  };

  const handleQuizRecommendation = (roast: RoastLevel, method: BrewMethod) => {
    // Map quiz recommendation to matching subscription
    const matchedProduct =
      roast === 'light'
        ? ROASTER_CONFIG.products[1]
        : roast === 'dark'
        ? ROASTER_CONFIG.products[2]
        : ROASTER_CONFIG.products[0];

    const grindMap: Record<BrewMethod, string> = {
      'pour over': 'Pour Over / V60 / Chemex',
      'french press': 'French Press / Immersion / Cold Brew',
      espresso: 'AeroPress / Moka Pot',
    };

    addItem(matchedProduct, {
      bagWeight: '12oz',
      grind: grindMap[method] || 'Whole Bean',
      frequency: '4-weeks',
      isSubscription: true,
    });

    showToast(
      'Roast Matched & Added to Cart',
      `${matchedProduct.title} configured with ${grindMap[method]}. Opening checkout.`,
      'coffee'
    );

    openCheckout();
  };

  const handleRoastProfileSelect = (roastKey: RoastType) => {
    const matchedProduct =
      roastKey === 'light'
        ? ROASTER_CONFIG.products[1]
        : roastKey === 'dark'
        ? ROASTER_CONFIG.products[2]
        : ROASTER_CONFIG.products[0];

    addItem(matchedProduct, {
      bagWeight: '12oz',
      grind: 'Whole Bean',
      frequency: '4-weeks',
      isSubscription: true,
    });

    showToast(
      `${roastKey.toUpperCase()} Profile Selected`,
      `Added ${matchedProduct.title} to your cart. Opening checkout.`,
      'info'
    );

    openCheckout();
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#2B2B28] antialiased flex flex-col selection:bg-[#D9633B]/20 selection:text-[#2B2B28]">
      {/* Top Banner indicating Demo vs Live Mode */}
      <ModeBanner />

      {/* Main Responsive Header */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* HERO SECTION: Responsive 2-Column Desktop Grid */}
        <section
          id="hero-section"
          aria-labelledby="hero-heading"
          className="relative bg-linear-to-b from-[#FBF7F0] to-[#EFE7DA]/40 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#DDD2BF]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Editorial Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-bold tracking-wider uppercase">
                  <Coffee className="w-3.5 h-3.5 text-[#D9633B]" />
                  <span>{ROASTER_CONFIG.business.badgeText}</span>
                  <span className="text-[#6F6A60]">·</span>
                  <span className="text-[#6F6A60]">{ROASTER_CONFIG.business.roastDays}</span>
                </div>

                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#2B2B28] leading-[1.08]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Brew a <span className="italic text-[#D9633B]">better morning</span>, one fresh roast at a time.
                </h1>

                <p className="text-lg sm:text-xl leading-relaxed text-[#6F6A60] max-w-2xl">
                  Small-batch, single-origin coffees from independent farms delivered to your door with
                  clear, jargon-free technique guides. Taste the difference of fresh-roasted beans.
                </p>

                {/* Primary & Secondary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={handleHeroSubscribe}
                    className="py-4 px-8 rounded-2xl bg-[#24493A] hover:bg-[#1B372C] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#24493A]"
                  >
                    <span>Start My Subscription</span>
                    <ArrowRight className="w-4 h-4 text-[#E69A3B]" />
                  </button>

                  <a
                    href="#shop-section"
                    className="py-4 px-6 rounded-2xl border-2 border-[#24493A] text-[#24493A] hover:bg-[#24493A]/5 font-bold text-base text-center transition-colors cursor-pointer"
                  >
                    Browse Single Bags
                  </a>
                </div>

                {/* Verified Operational Commitments (No fake metrics) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DDD2BF]/80">
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-[#D9633B] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-[#2B2B28]">Dispatched Tuesdays</strong>
                      <span className="text-[#6F6A60]">Expedited 2–3 day shipping</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#24493A] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-[#2B2B28]">Peak Degassing</strong>
                      <span className="text-[#6F6A60]">Lands days 4–6 post-roast</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#24493A] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-[#2B2B28]">1-Click Flexibility</strong>
                      <span className="text-[#6F6A60]">Skip, pause, or cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Media */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-[#DDD2BF] shadow-xl bg-white p-3">
                  <MediaFrame
                    aspectRatio="4/3"
                    imageSrc="/Hero.jpg"
                    videoSrc="/Hero.mp4"
                    altText="Barista pouring steamed milk into coffee at an espresso bar"
                    isHero={true}
                    fallbackVariant="hero"
                    badge={
                      <div className="inline-flex items-center gap-2 bg-[#FBF7F0]/95 backdrop-blur-xs text-[#24493A] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-[#DDD2BF]/70">
                        <Coffee className="w-3.5 h-3.5 text-[#D9633B]" />
                        <span>Mondays: Fresh Roast Day</span>
                      </div>
                    }
                  />

                  {/* Customer Portal Quick Link if user has an active order */}
                  {confirmedOrder && (
                    <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <span className="text-emerald-900 font-medium">
                        Active Order: <strong>{confirmedOrder.orderId}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomerPortalOpen(true)}
                        className="text-[#24493A] font-bold underline hover:text-[#183127] cursor-pointer"
                      >
                        Manage Subscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SUBSCRIPTIONS CONFIGURATOR & PLANS */}
        <SubscriptionOffer />

        {/* SECTION: PRODUCT SHOP (Catalog of Single Bags & Subscriptions) */}
        <ProductShop />

        {/* SECTION: SOURCING ORIGINS (Map + Accessible List Alternative) */}
        <section
          id="origins-section"
          aria-labelledby="origins-heading"
          className="py-16 sm:py-24 bg-[#FBF7F0] border-t border-[#DDD2BF]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WorldOriginMap
              onSelectOrigin={(origin) => {
                showToast(
                  `${origin.country} Selected`,
                  `Your next club box will feature micro-lots from ${origin.region}.`,
                  'coffee'
                );
              }}
            />
          </div>
        </section>

        {/* SECTION: ROAST MATCHER QUIZ */}
        <section
          id="roast-quiz-section"
          aria-labelledby="quiz-heading"
          className="py-16 sm:py-24 bg-[#EFE7DA]/40 border-t border-[#DDD2BF]"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9633B] block mb-2">
                Personalized Coffee Matching
              </span>
              <h2
                id="quiz-heading"
                className="text-3xl sm:text-4xl font-semibold text-[#2B2B28] tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Find your perfect roast profile
              </h2>
              <p className="text-sm sm:text-base text-[#6F6A60] mt-1">
                Answer 4 quick questions about your brewing setup and taste desires. We will pair your box with a roast and guide.
              </p>
            </div>

            <RoastQuiz onSelectRoastAndMethod={handleQuizRecommendation} />
          </div>
        </section>

        {/* SECTION: BREWING SCHOOL (Pour Over, French Press, AeroPress) */}
        <section
          id="brewing-school-section"
          aria-labelledby="brewing-school-heading"
          className="py-16 sm:py-24 bg-[#FBF7F0] border-t border-[#DDD2BF]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BrewingSchool
              onPracticeWithTimer={(methodId) => {
                const element = document.querySelector('#brew-timer-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
                showToast(
                  'Timer Activated',
                  `Live timer calibrated for ${methodId.replace('-', ' ')}. Tap Start to begin.`,
                  'info'
                );
              }}
              onSelectMethodForBox={(methodId) => {
                showToast(
                  'Brew Method Saved',
                  `Your box profile has been configured for ${methodId.replace('-', ' ')} extraction.`,
                  'coffee'
                );
              }}
            />
          </div>
        </section>

        {/* SECTION: BUILT-IN BREW TIMER */}
        <section
          id="brew-timer-section"
          aria-labelledby="timer-heading"
          className="py-16 sm:py-24 bg-[#EFE7DA]/50 border-t border-[#DDD2BF]"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BrewTimer onJoinClick={handleHeroSubscribe} />
          </div>
        </section>

        {/* SECTION: ROAST COMPARISON TABLE */}
        <section
          id="roast-comparison-section"
          aria-labelledby="comparison-heading"
          className="py-16 sm:py-24 bg-[#FBF7F0] border-t border-[#DDD2BF]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RoastComparisonTable onSelectRoast={handleRoastProfileSelect} />
          </div>
        </section>

        {/* SECTION: RECENT BREWS (Filtered rating history) */}
        <section
          id="recent-brews-section"
          aria-labelledby="recent-brews-heading"
          className="py-16 sm:py-24 bg-[#EFE7DA]/40 border-t border-[#DDD2BF]"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecentBrews
              onRateCoffee={(brew, rating, feedback) => {
                showToast(
                  `${brew.name} Rated ${rating}/5 Stars`,
                  feedback,
                  'coffee'
                );
              }}
            />
          </div>
        </section>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
        <section
          id="faq-section"
          aria-labelledby="faq-heading"
          className="py-16 sm:py-24 bg-[#FBF7F0] border-t border-[#DDD2BF]"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection onJoinClick={handleHeroSubscribe} />
          </div>
        </section>
      </main>

      {/* COMPREHENSIVE RESPONSIVE FOOTER */}
      <footer className="bg-[#1F2A24] text-white border-t border-[#24493A] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Col 1 & 2: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <span
                className="text-2xl font-bold tracking-tight text-[#FBF7F0] inline-block"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {ROASTER_CONFIG.business.name}
              </span>
              <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
                {ROASTER_CONFIG.business.description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#instagram"
                  aria-label="Slow Roast Instagram"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#1F2A24] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#twitter"
                  aria-label="Slow Roast Twitter"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#1F2A24] transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  aria-label="Slow Roast YouTube"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#1F2A24] transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${ROASTER_CONFIG.business.contactEmail}`}
                  aria-label="Email Roastery"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#1F2A24] transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 3: Shop & Explore */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E69A3B]">
                Shop & Explore
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <a href="#subscriptions-section" className="hover:text-white transition-colors">
                    Monthly Subscriptions
                  </a>
                </li>
                <li>
                  <a href="#shop-section" className="hover:text-white transition-colors">
                    Single-Origin Coffee Bags
                  </a>
                </li>
                <li>
                  <a href="#origins-section" className="hover:text-white transition-colors">
                    Global Terroir Map
                  </a>
                </li>
                <li>
                  <a href="#brewing-school-section" className="hover:text-white transition-colors">
                    Brewing School Guides
                  </a>
                </li>
                <li>
                  <a href="#roast-quiz-section" className="hover:text-white transition-colors">
                    Roast Matcher Quiz
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Roastery & Customer Care */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E69A3B]">
                Customer Care
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('about')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    About Roastery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('contact')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Contact & Roaster Advice
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('faq')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCustomerPortalOpen(true)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Customer Subscription Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Legal & Policies (Drafts marked for review) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E69A3B]">
                Store Policies
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('shipping')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Shipping Policy (Draft)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('returns')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Returns & Taste Guarantee
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('privacy')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Privacy Policy (Draft)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openPolicy('terms')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Terms of Service (Draft)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>© 2026 {ROASTER_CONFIG.business.name}. All sample products and pricing for demonstration.</p>
            <div className="flex items-center gap-3">
              <span>Direct Trade Sourcing</span>
              <span>·</span>
              <span>Small Batch Roasted Mondays</span>
              <span>·</span>
              <span>PCI-DSS Hosted Checkout</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
      />
      <OwnerPortalModal />
      <PolicyModal />
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}
