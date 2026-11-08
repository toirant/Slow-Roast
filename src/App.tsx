/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { PrimaryButton } from './components/PrimaryButton.tsx';
import { OutlineButton } from './components/OutlineButton.tsx';
import { Divider } from './components/Divider.tsx';
import { FeatureCard } from './components/FeatureCard.tsx';
import { MediaFrame } from './components/MediaFrame.tsx';
import { AnimatedSection } from './components/AnimatedSection.tsx';
import { FadeIn } from './components/FadeIn.tsx';
import { RoastQuiz } from './components/RoastQuiz.tsx';
import { StickyJoinBar } from './components/StickyJoinBar.tsx';
import { SampleBoxModal } from './components/SampleBoxModal.tsx';
import { GetStartedModal } from './components/GetStartedModal.tsx';
import { FAQSection } from './components/FAQSection.tsx';
import { BrewTimer } from './components/BrewTimer.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { ReadingProgressBar } from './components/ReadingProgressBar.tsx';
import { RoastHistoryChart } from './components/RoastHistoryChart.tsx';
import { RoastComparisonTable } from './components/RoastComparisonTable.tsx';
import { RoastType } from './utils/roastComparison.ts';
import { WorldOriginMap } from './components/WorldOriginMap.tsx';
import { RecentBrews } from './components/RecentBrews.tsx';
import { RecentBrew } from './utils/recentBrews.ts';
import { TestimonialBlock } from './components/TestimonialBlock.tsx';
import { RoastLevel, BrewMethod } from './utils/coffeePlan.ts';
import { calculateScrollProgress } from './utils/scrollProgress.ts';
import {
  ToastItem,
  ToastVariant,
  createToast,
  addToast,
  removeToast,
} from './utils/toast.ts';

export default function App() {
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const [customRoast, setCustomRoast] = useState<RoastLevel>('medium');
  const [customMethod, setCustomMethod] = useState<BrewMethod>('pour over');
  const [showStickyJoin, setShowStickyJoin] = useState(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  const showToast = (
    title: string,
    message: string,
    variant: ToastVariant = 'success'
  ) => {
    const newToast = createToast(title, message, variant);
    setToasts((prev) => addToast(prev, newToast));
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => removeToast(prev, id));
  };

  const handleJoinTheClub = (contextMsg?: string) => {
    showToast(
      'Action Confirmed',
      contextMsg || 'First box reserved! Free shipping promo applied ($5 saved).',
      'success'
    );
    setIsGetStartedModalOpen(true);
  };

  const handleSelectRoastProfile = (roastKey: RoastType) => {
    setCustomRoast(roastKey);
    const descriptors: Record<RoastType, string> = {
      light: 'Light Roast (Floral, Meyer Lemon & Peach)',
      medium: 'Medium Roast (Caramel, Milk Chocolate & Apple)',
      dark: 'Dark Roast (Rich Cocoa Nibs, Molasses & Crema)',
    };
    showToast(
      `${roastKey.charAt(0).toUpperCase() + roastKey.slice(1)} Roast Selected`,
      `Preference set to ${descriptors[roastKey]}. Tap to finalize your box.`,
      'info'
    );
    setIsGetStartedModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      // 1. Reading progress calculation
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const progress = calculateScrollProgress(scrollTop, docHeight, clientHeight);
      setReadingProgress(progress);

      // 2. Sticky Join bar visibility
      if (!heroRef.current) return;
      const heroRect = heroRef.current.getBoundingClientRect();
      setShowStickyJoin(heroRect.bottom <= 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      num: 1,
      text: 'Pick your roast level: light, medium, or dark.',
    },
    {
      num: 2,
      text: 'Tell us how you brew: pour over, French press, or espresso.',
    },
    {
      num: 3,
      text: 'Your box arrives with a guide matched to your method.',
    },
    {
      num: 4,
      text: 'Rate what you tried, and we tune the next box.',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 bg-[#EFE7DA] text-[#2B2B28] antialiased flex flex-col items-center justify-start selection:bg-[#D9633B]/20 selection:text-[#2B2B28]">
      {/* Email Container Card */}
      <main className="w-full max-w-[600px] mx-auto rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-[#FBF7F0] relative">
        {/* Subtle Reading Progress Bar at the top of the main container */}
        <ReadingProgressBar progress={readingProgress} />

        {/* SECTION 1: HERO */}
        <div ref={heroRef} id="hero-section">
          <AnimatedSection className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#DDD2BF]/50 pb-4 mb-7">
              <span
                className="text-xl sm:text-2xl font-semibold tracking-tight text-[#24493A]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Slow Roast
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#6F6A60] tracking-wide">
                Issue 04, November
              </span>
            </div>

            {/* Headline */}
            <FadeIn delay={60}>
              <h1
                className="text-4xl sm:text-[52px] leading-[1.05] tracking-tight font-semibold text-[#2B2B28] text-left mb-4"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Brew a <span className="italic text-[#D9633B]">better morning</span>, one bag at a time
              </h1>
            </FadeIn>

            {/* Short supporting sentence */}
            <FadeIn delay={120}>
              <p className="text-[17px] leading-relaxed text-[#6F6A60] text-left mb-6">
                Small-batch, single-origin coffees from independent farms delivered to your door with gentle technique guides.
              </p>
            </FadeIn>

            {/* Primary CTA */}
            <FadeIn delay={180} className="mb-8">
              <PrimaryButton
                onClick={() => handleJoinTheClub('First box reserved! Free shipping promo applied.')}
                aria-label="Start my first box"
              >
                Start my first box
              </PrimaryButton>
            </FadeIn>

            {/* Hero Media: 4/3 ratio with video and image poster */}
            <FadeIn delay={240}>
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
                    <span>Fresh roasted every Monday</span>
                  </div>
                }
              />
            </FadeIn>
          </AnimatedSection>
        </div>

        {/* SECTION 2: INTRO */}
        <AnimatedSection className="px-6 sm:px-10 pt-8 pb-4">
          <FadeIn delay={40}>
            <p className="text-[17px] leading-relaxed text-[#2B2B28] text-left mb-8">
              Every month we send two small-batch coffees from independent farms, along with a short guide that teaches you one new brewing skill. No jargon, no expensive gear required.
            </p>
          </FadeIn>

          {/* Row of 3 stats with subtle staggered fade-in */}
          <div className="grid grid-cols-3 gap-3 border-y border-[#DDD2BF]/60 py-5">
            <FadeIn delay={60} className="text-center sm:text-left">
              <div
                className="text-2xl sm:text-3xl font-semibold text-[#24493A]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                40+
              </div>
              <div className="text-xs sm:text-sm text-[#6F6A60] font-medium mt-0.5">
                farms
              </div>
            </FadeIn>
            <FadeIn delay={140} className="text-center sm:text-left border-x border-[#DDD2BF]/60 px-2 sm:px-4">
              <div
                className="text-2xl sm:text-3xl font-semibold text-[#24493A]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                12
              </div>
              <div className="text-xs sm:text-sm text-[#6F6A60] font-medium mt-0.5">
                brew guides
              </div>
            </FadeIn>
            <FadeIn delay={220} className="text-center sm:text-left pl-2">
              <div
                className="text-2xl sm:text-3xl font-semibold text-[#24493A]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                4.9
              </div>
              <div className="text-xs sm:text-sm text-[#6F6A60] font-medium mt-0.5">
                average rating
              </div>
            </FadeIn>
          </div>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 3: WHAT LANDS IN YOUR BOX */}
        <AnimatedSection className="px-6 sm:px-10">
          <FadeIn delay={40}>
            <h2
              className="text-3xl sm:text-[40px] leading-tight font-semibold text-[#2B2B28] text-center mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              What lands in your box
            </h2>
          </FadeIn>

          {/* Box section image: 3/2 ratio above feature cards */}
          <FadeIn delay={100} className="mb-8">
            <MediaFrame
              aspectRatio="3/2"
              imageSrc="/Box.jpg"
              altText="Artisan bowl of freshly roasted dark coffee beans on a wooden surface"
              fallbackVariant="box"
            />
          </FadeIn>

          {/* 2x2 grid with staggered fade-in */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 mb-8">
            <FadeIn delay={120}>
              <FeatureCard
                icon={Package}
                title="Two fresh bags"
                description="Roasted days before shipping."
              />
            </FadeIn>
            <FadeIn delay={200}>
              <FeatureCard
                icon={BookOpen}
                title="One brew guide"
                description="A new technique every month."
              />
            </FadeIn>
            <FadeIn delay={280}>
              <FeatureCard
                icon={Map}
                title="Farm story card"
                description="Know who grew your coffee."
              />
            </FadeIn>
            <FadeIn delay={360}>
              <FeatureCard
                icon={Repeat}
                title="Skip or pause"
                description="Change your plan any time."
              />
            </FadeIn>
          </div>

          {/* Centered Outline Button */}
          <FadeIn delay={200} className="text-center">
            <OutlineButton
              onClick={() => setIsSampleModalOpen(true)}
              aria-label="See a sample box"
            >
              See a sample box
            </OutlineButton>
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 3.5: GLOBAL ORIGIN MAP (LAST 3 MONTHS) */}
        <AnimatedSection className="px-6 sm:px-10 py-6">
          <FadeIn delay={60}>
            <WorldOriginMap
              onSelectOrigin={(origin) => {
                const roast: RoastLevel =
                  origin.roastProfile === 'Light'
                    ? 'light'
                    : origin.roastProfile === 'Medium'
                    ? 'medium'
                    : 'dark';
                setCustomRoast(roast);
                showToast(
                  `${origin.country} Selected`,
                  `Preference set to ${origin.roastProfile} Roast (${origin.region}).`,
                  'info'
                );
                setIsGetStartedModalOpen(true);
              }}
            />
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION: ROAST MATCHER QUIZ */}
        <AnimatedSection className="px-6 sm:px-10">
          <FadeIn delay={60}>
            <RoastQuiz
              onSelectRoastAndMethod={(roast, method) => {
                setCustomRoast(roast);
                setCustomMethod(method);
                setIsGetStartedModalOpen(true);
              }}
            />
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 4: YOUR FIRST MONTH, STEP BY STEP */}
        <AnimatedSection className="px-6 sm:px-10">
          <FadeIn delay={40}>
            <h2
              className="text-3xl sm:text-[40px] leading-tight font-semibold text-[#2B2B28] text-left mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Your first month, step by step
            </h2>
          </FadeIn>

          {/* Vertical Timeline with sequential step fade-in */}
          <div className="relative pl-8 sm:pl-9 mb-8 space-y-6 sm:space-y-7">
            {/* 2px vertical line in border color */}
            <div
              className="absolute left-[13px] top-2 bottom-3 w-[2px] bg-[#DDD2BF]"
              aria-hidden="true"
            />

            {steps.map((step, idx) => (
              <FadeIn
                key={step.num}
                delay={80 + idx * 90}
                className="relative flex items-start group"
              >
                {/* Small circular marker per step: primary green fill, white number */}
                <div
                  className="absolute -left-8 sm:-left-9 w-7 h-7 rounded-full bg-[#24493A] text-white text-xs font-bold flex items-center justify-center shrink-0 ring-4 ring-[#FBF7F0] shadow-xs"
                  aria-hidden="true"
                >
                  {step.num}
                </div>
                <p className="text-[15px] sm:text-[16px] leading-snug text-[#2B2B28] pt-0.5 font-medium">
                  {step.text}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Timeline Image: 16/9 frame below timeline steps */}
          <FadeIn delay={150}>
            <MediaFrame
              aspectRatio="16/9"
              imageSrc="/Brew-steps.jpg"
              altText="Steaming freshly brewed coffee pouring from a stovetop moka pot into a dark ceramic cup"
              fallbackVariant="timeline"
            />
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 4.5: INTERACTIVE BREW TIMER */}
        <AnimatedSection className="px-6 sm:px-10 py-4">
          <FadeIn delay={60}>
            <BrewTimer
              onJoinClick={() => handleJoinTheClub('Custom brew profile selected — free shipping applied!')}
              initialMethodId={
                customMethod === 'espresso'
                  ? 'moka-pot'
                  : customMethod === 'french press'
                  ? 'french-press'
                  : 'pour-over'
              }
            />
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 4.75: RECENT BREWS */}
        <AnimatedSection className="px-6 sm:px-10 py-6">
          <FadeIn delay={60}>
            <RecentBrews
              onRateCoffee={(brew: RecentBrew, rating: number, feedback: string) => {
                showToast(
                  `${brew.name} Rated (${rating}★)`,
                  feedback,
                  'success'
                );
              }}
            />
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 5: TESTIMONIAL */}
        <AnimatedSection className="px-6 sm:px-10 py-8">
          <TestimonialBlock />
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 5.25: MEMBER LIFETIME ROAST VISUALIZATION */}
        <AnimatedSection className="px-6 sm:px-10 py-4">
          <FadeIn delay={60}>
            <RoastHistoryChart
              onAdjustPreferences={() => setIsGetStartedModalOpen(true)}
            />
          </FadeIn>
        </AnimatedSection>

        {/* DIVIDER */}
        <Divider />

        {/* SECTION 5.35: ROAST PROFILES COMPARISON TABLE */}
        <AnimatedSection className="px-6 sm:px-10 py-4">
          <FadeIn delay={60}>
            <RoastComparisonTable
              selectedRoast={customRoast}
              onSelectRoast={handleSelectRoastProfile}
            />
          </FadeIn>
        </AnimatedSection>

        {/* Divider before FAQ */}
        <Divider />

        {/* SECTION 5.5: FREQUENTLY ASKED QUESTIONS */}
        <AnimatedSection className="px-6 sm:px-10 py-6">
          <FadeIn delay={60}>
            <FAQSection onJoinClick={() => handleJoinTheClub('First box reserved! Free shipping promo applied.')} />
          </FadeIn>
        </AnimatedSection>

        {/* Divider before Final CTA */}
        <Divider />

        {/* SECTION 6: FINAL CTA */}
        <AnimatedSection className="px-6 sm:px-10 pb-10">
          <FadeIn delay={60}>
            <div className="w-full rounded-2xl bg-[#24493A] p-8 sm:p-10 text-center shadow-md relative overflow-hidden">
              {/* Subtle atmospheric glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />

              <h2
                className="text-3xl sm:text-[44px] leading-tight font-semibold text-white mb-3"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Your next cup starts here
              </h2>

              <p className="text-[17px] leading-relaxed text-[#F1E8D8] max-w-md mx-auto mb-7">
                Join the club today and get free shipping on your first box.
              </p>

              <div>
                <PrimaryButton
                  onClick={() => handleJoinTheClub('First box reserved! Free shipping promo applied ($5 saved).')}
                  aria-label="Join the club"
                >
                  Join the club
                </PrimaryButton>
              </div>
            </div>
          </FadeIn>
        </AnimatedSection>

        {/* FOOTER */}
        <footer className="bg-[#1F2A24] text-white p-8 sm:p-10 text-center">
          {/* Wordmark */}
          <div className="mb-2">
            <span
              className="text-[28px] font-semibold tracking-tight transition-colors duration-200 hover:text-[#D9633B] cursor-default inline-block"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Slow Roast
            </span>
          </div>

          {/* Short tagline in muted light text */}
          <p className="text-xs sm:text-sm text-white/70 max-w-xs mx-auto mb-6">
            Cultivating mindful home coffee rituals, roast by roast.
          </p>

          {/* Four circular social icon buttons with 1px white/20 border */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <button
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-[#1F2A24] transition-all duration-200 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </button>
            <button
              aria-label="Twitter"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-[#1F2A24] transition-all duration-200 cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              aria-label="Youtube"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-[#1F2A24] transition-all duration-200 cursor-pointer"
            >
              <Youtube className="w-4 h-4" />
            </button>
            <button
              aria-label="Email Newsletter"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-[#1F2A24] transition-all duration-200 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          {/* Link row: Help, Privacy, Terms, Unsubscribe, separated by thin vertical bars */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/60 mb-6 font-medium">
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Help
            </a>
            <span className="text-white/25 select-none">|</span>
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </a>
            <span className="text-white/25 select-none">|</span>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </a>
            <span className="text-white/25 select-none">|</span>
            <a
              href="#unsubscribe"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Unsubscribe
            </a>
          </div>

          {/* Copyright line */}
          <p className="text-[11px] text-white/40 tracking-wide">
            © 2026 Slow Roast Coffee Club. A design concept, not a real business.
          </p>
        </footer>
      </main>

      {/* Sticky Bottom Join Bar: Appears only after user has scrolled past Hero */}
      <StickyJoinBar
        isVisible={showStickyJoin && !isGetStartedModalOpen && !isSampleModalOpen}
        onJoin={() => handleJoinTheClub('First box reserved! Free shipping promo applied ($5 saved).')}
      />

      {/* Interactive Modals */}
      <SampleBoxModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />
      <GetStartedModal
        isOpen={isGetStartedModalOpen}
        onClose={() => setIsGetStartedModalOpen(false)}
        initialRoast={customRoast}
        initialMethod={customMethod}
        onJoined={(roast, method) =>
          showToast(
            'Welcome to the Club!',
            `Your subscription is active with ${roast} roast and ${method} guides. Roasted fresh Mondays!`,
            'coffee'
          )
        }
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
