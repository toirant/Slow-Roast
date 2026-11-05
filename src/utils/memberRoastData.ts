/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MonthlyRoastRecord {
  month: string;
  shortMonth: string;
  light: number;
  medium: number;
  dark: number;
  total: number;
  featuredCoffee: string;
}

export interface RoastDistributionItem {
  name: string;
  roastKey: 'light' | 'medium' | 'dark';
  bags: number;
  percentage: number;
  color: string;
  notes: string;
  exampleOrigin: string;
}

export const DEFAULT_MEMBER_MONTHLY_HISTORY: MonthlyRoastRecord[] = [
  { month: 'Dec 2025', shortMonth: 'Dec', light: 0, medium: 2, dark: 0, total: 2, featuredCoffee: 'Guatemala Antigua' },
  { month: 'Jan 2026', shortMonth: 'Jan', light: 1, medium: 1, dark: 0, total: 2, featuredCoffee: 'Ethiopia Yirgacheffe' },
  { month: 'Feb 2026', shortMonth: 'Feb', light: 0, medium: 1, dark: 1, total: 2, featuredCoffee: 'Sumatra Mandheling' },
  { month: 'Mar 2026', shortMonth: 'Mar', light: 1, medium: 1, dark: 0, total: 2, featuredCoffee: 'Colombia Huila' },
  { month: 'Apr 2026', shortMonth: 'Apr', light: 2, medium: 0, dark: 0, total: 2, featuredCoffee: 'Kenya Nyeri' },
  { month: 'May 2026', shortMonth: 'May', light: 1, medium: 1, dark: 0, total: 2, featuredCoffee: 'Costa Rica Tarrazu' },
  { month: 'Jun 2026', shortMonth: 'Jun', light: 1, medium: 0, dark: 1, total: 2, featuredCoffee: 'Papua New Guinea' },
  { month: 'Jul 2026', shortMonth: 'Jul', light: 0, medium: 2, dark: 0, total: 2, featuredCoffee: 'Honduras Marcala' },
  { month: 'Aug 2026', shortMonth: 'Aug', light: 1, medium: 1, dark: 0, total: 2, featuredCoffee: 'Rwanda Gisenyi' },
  { month: 'Sep 2026', shortMonth: 'Sep', light: 0, medium: 1, dark: 1, total: 2, featuredCoffee: 'Brazil Cerrado' },
  { month: 'Oct 2026', shortMonth: 'Oct', light: 1, medium: 1, dark: 0, total: 2, featuredCoffee: 'Burundi Kayanza' },
  { month: 'Nov 2026', shortMonth: 'Nov', light: 0, medium: 2, dark: 0, total: 2, featuredCoffee: 'Colombia Pink Bourbon' },
];

export function calculateLifetimeRoastStats(history: MonthlyRoastRecord[]) {
  const totals = {
    light: 0,
    medium: 0,
    dark: 0,
    all: 0,
  };

  history.forEach((record) => {
    totals.light += record.light;
    totals.medium += record.medium;
    totals.dark += record.dark;
    totals.all += record.total;
  });

  const getPercent = (count: number) => (totals.all > 0 ? Math.round((count / totals.all) * 100) : 0);

  const distribution: RoastDistributionItem[] = [
    {
      name: 'Light Roast',
      roastKey: 'light',
      bags: totals.light,
      percentage: getPercent(totals.light),
      color: '#E69A3B', // warm honey amber
      notes: 'Floral, jasmine, Meyer lemon, stone fruit',
      exampleOrigin: 'Ethiopia & Kenya SL28',
    },
    {
      name: 'Medium Roast',
      roastKey: 'medium',
      bags: totals.medium,
      percentage: getPercent(totals.medium),
      color: '#D9633B', // slow roast signature terracotta
      notes: 'Caramelized brown sugar, milk chocolate, balanced acidity',
      exampleOrigin: 'Colombia & Guatemala',
    },
    {
      name: 'Dark Roast',
      roastKey: 'dark',
      bags: totals.dark,
      percentage: getPercent(totals.dark),
      color: '#24493A', // roastery deep pine green
      notes: 'Dark cacao nibs, toasted hazelnut, syrupy crema',
      exampleOrigin: 'Sumatra & Brazil',
    },
  ];

  return {
    totalBags: totals.all,
    totalMonths: history.length,
    distribution,
    dominantRoast: distribution.reduce((max, item) => (item.bags > max.bags ? item : max), distribution[0]),
  };
}
