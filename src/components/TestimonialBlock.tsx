/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useInView } from '../hooks/useInView.ts';
import {
  getTestimonialCardAnimationClasses,
  getQuoteIconAnimationClasses,
} from '../utils/testimonialAnimation.ts';

interface TestimonialBlockProps {
  quote?: string;
  author?: string;
  role?: string;
  className?: string;
}

export function TestimonialBlock({
  quote = 'I went from bitter grocery store coffee to brewing sweet, balanced pour overs in three weeks. The monthly guides make all the difference.',
  author = 'Amara',
  role = 'home brewer',
  className = '',
}: TestimonialBlockProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
    triggerOnce: true,
  });

  const cardAnimClasses = getTestimonialCardAnimationClasses(isInView);
  const quoteAnimClasses = getQuoteIconAnimationClasses(isInView);

  return (
    <div
      ref={ref}
      className={`rounded-2xl bg-[#F1E8D8] p-8 sm:p-9 border border-[#DDD2BF]/60 relative overflow-hidden transition-all duration-300 hover:border-[#24493A]/30 ${cardAnimClasses} ${className}`}
      data-testid="testimonial-block"
    >
      {/* Subtle warm decorative glow */}
      <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-[#E69A3B]/10 blur-xl pointer-events-none" />

      {/* Decorative Fraunces quotation mark with staggered entrance */}
      <div className="flex items-center justify-between mb-1">
        <div
          className={`text-6xl sm:text-7xl font-serif text-[#D9633B] leading-none select-none ${quoteAnimClasses}`}
          style={{ fontFamily: "'Fraunces', serif" }}
          aria-hidden="true"
        >
          “
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#24493A]/10 text-[#24493A] border border-[#24493A]/20">
          Sample member quote (demo)
        </span>
      </div>

      <blockquote
        className="text-[22px] sm:text-[25px] italic leading-snug text-[#2B2B28] font-normal mb-5 -mt-3 relative z-10"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {quote}
      </blockquote>

      <div className="text-sm font-medium text-[#6F6A60] tracking-wide relative z-10 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[#2B2B28] font-bold">{author}</span>, {role}
        </div>
        <span className="text-[11px] text-[#6F6A60] italic">
          (Demonstration quote — replace with real customer reviews upon launch)
        </span>
      </div>
    </div>
  );
}
