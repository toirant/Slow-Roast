/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TestimonialAnimationState {
  isInView: boolean;
  prefersReducedMotion?: boolean;
}

/**
 * Returns Tailwind classes for the testimonial block entrance animation.
 * Features a smooth slide-in from bottom (translate-y-8 to translate-y-0),
 * fade-in (opacity-0 to opacity-100), and subtle scale settling (scale-98 to scale-100).
 */
export function getTestimonialCardAnimationClasses(
  isInView: boolean,
  prefersReducedMotion: boolean = false
): string {
  if (prefersReducedMotion) {
    return 'opacity-100 translate-y-0 scale-100';
  }

  const base =
    'transition-all duration-700 ease-out will-change-[transform,opacity]';
  const active = 'opacity-100 translate-y-0 scale-100 shadow-sm';
  const inactive = 'opacity-0 translate-y-8 scale-[0.98] shadow-none';

  return `${base} ${isInView ? active : inactive}`;
}

/**
 * Returns classes for the decorative quotation mark staggered entrance
 */
export function getQuoteIconAnimationClasses(
  isInView: boolean,
  prefersReducedMotion: boolean = false
): string {
  if (prefersReducedMotion) {
    return 'opacity-90 scale-100 translate-y-0';
  }

  const base =
    'transition-all duration-500 delay-150 ease-out will-change-[transform,opacity]';
  const active = 'opacity-90 scale-100 translate-y-0';
  const inactive = 'opacity-0 scale-75 -translate-y-2';

  return `${base} ${isInView ? active : inactive}`;
}
