/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQItem {
  id: string;
  category: 'shipping' | 'subscription' | 'coffee' | 'gear';
  question: string;
  answer: string;
  tag?: string;
}

export const FAQS: FAQItem[] = [
  {
    id: 'shipping-speed',
    category: 'shipping',
    tag: 'Fast & Fresh',
    question: 'How fast is shipping and when does my coffee arrive after roasting?',
    answer:
      'Every single bag is roasted to order on Monday mornings at our dedicated roastery. We hand-pack and dispatch each box on Tuesday via expedited carrier shipping (typically 2–3 business days with live tracking). Your coffee lands on your doorstep between day 4 and 6 post-roast—the exact sweet spot when beans have finished initial degassing and flavors reach peak vibrancy.',
  },
  {
    id: 'subscription-cancel',
    category: 'subscription',
    tag: '100% Flexible',
    question: 'Can I pause, skip a month, or cancel my subscription anytime?',
    answer:
      'Yes, absolutely. There are no commitments, lock-in contracts, or cancellation fees. Inside your member dashboard, you can pause your subscription, skip an upcoming month with one tap, or adjust your delivery frequency (every 2, 3, or 4 weeks). If you ever need to cancel, you can do so directly online before your next billing cycle without having to email or call anyone.',
  },
  {
    id: 'whole-bean-or-ground',
    category: 'coffee',
    tag: 'Ground or Whole',
    question: 'Do you ship whole bean or pre-ground coffee?',
    answer:
      'All coffees ship as whole bean by default to seal in freshness and fragile aromatics. However, if you don’t own a burr grinder yet, simply select your preferred brew method at checkout (pour over, drip, French press, AeroPress, or moka pot). We will precision-grind your beans on an industrial Mahlkönig burr grinder minutes before nitrogen-sealing your valve bags.',
  },
  {
    id: 'origin-sourcing',
    category: 'coffee',
    tag: 'Direct Trade',
    question: 'Where do your coffees come from and are farmers treated fairly?',
    answer:
      'We work directly with independent, family-owned micro-lots and smallholder cooperatives in Ethiopia, Colombia, Guatemala, Kenya, and Peru. We pay directly to producers at prices consistently 20% to 50% above Fair Trade minimums. Every monthly box includes a provenance card detailing the exact farm, washing station altitude, cultivar varieties, and fair pricing transparency.',
  },
  {
    id: 'equipment-needed',
    category: 'gear',
    tag: 'No Fancy Gear',
    question: 'Do I need expensive or professional coffee gear?',
    answer:
      'Not at all! You don’t need an expensive commercial setup to brew exceptional coffee. Each month’s 12-page printed booklet features straightforward brew recipes calibrated for kitchen staples: standard pour-over cones (V60/Kalita/Chemex), French press, Clever dripper, AeroPress, and classic stovetop moka pots.',
  },
  {
    id: 'taste-guarantee',
    category: 'coffee',
    tag: 'Taste Guarantee',
    question: 'What happens if a particular roast profile isn’t my style?',
    answer:
      'Palates differ, and that’s part of the exploration! If you receive a coffee that doesn’t suit your taste preferences, reach out to our team within 14 days. We’ll gladly send an alternate roast profile from our cellar or apply a 100% store credit toward your next edition.',
  },
];

export function filterFaqs(query: string, categoryFilter?: string): FAQItem[] {
  const cleanQuery = query.trim().toLowerCase();

  return FAQS.filter((faq) => {
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || faq.category === categoryFilter;
    if (!matchesCategory) return false;

    if (!cleanQuery) return true;

    return (
      faq.question.toLowerCase().includes(cleanQuery) ||
      faq.answer.toLowerCase().includes(cleanQuery) ||
      faq.category.toLowerCase().includes(cleanQuery) ||
      (faq.tag && faq.tag.toLowerCase().includes(cleanQuery))
    );
  });
}
