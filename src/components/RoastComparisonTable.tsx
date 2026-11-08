/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Coffee,
  Check,
  ChevronRight,
  HelpCircle,
  ArrowRightLeft,
  ThumbsUp,
  Droplets,
  Scale,
  Award,
} from 'lucide-react';
import {
  RoastType,
  getAllRoastProfiles,
  formatScoreMeter,
  RoastProfileDetail,
} from '../utils/roastComparison.ts';

interface RoastComparisonTableProps {
  onSelectRoast?: (roastKey: RoastType) => void;
  selectedRoast?: RoastType;
}

export function RoastComparisonTable({ onSelectRoast, selectedRoast = 'medium' }: RoastComparisonTableProps) {
  const [highlightedRoast, setHighlightedRoast] = useState<RoastType | 'all'>('all');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const profiles = getAllRoastProfiles();

  const handleSelect = (roast: RoastProfileDetail) => {
    onSelectRoast?.(roast.key);
  };

  const renderMeter = (score: number, maxScore = 5, color: string) => {
    const { filled, unfilled } = formatScoreMeter(score, maxScore);
    return (
      <div className="flex items-center gap-1" aria-label={`${score} of ${maxScore}`}>
        {Array.from({ length: filled }).map((_, i) => (
          <span
            key={`filled-${i}`}
            className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
            style={{ backgroundColor: color }}
          />
        ))}
        {Array.from({ length: unfilled }).map((_, i) => (
          <span
            key={`unfilled-${i}`}
            className="w-2.5 h-2.5 rounded-full inline-block bg-[#DDD2BF]/60 border border-[#DDD2BF]"
          />
        ))}
        <span className="text-[11px] font-mono font-bold text-[#6F6A60] ml-1">
          {score}/{maxScore}
        </span>
      </div>
    );
  };

  return (
    <section
      aria-labelledby="roast-comparison-heading"
      className="w-full rounded-2xl bg-[#FBF7F0] border border-[#DDD2BF] p-5 sm:p-7 shadow-xs relative overflow-hidden"
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#F1E8D8]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-left mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9633B]/10 text-[#D9633B] text-xs font-semibold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Taste Spectrum • Roast Comparison</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#6F6A60] bg-[#F1E8D8] px-2.5 py-1 rounded-md border border-[#DDD2BF]/60">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#24493A]" aria-hidden="true" />
            <span>Side-by-Side</span>
          </div>
        </div>

        <h2
          id="roast-comparison-heading"
          className="text-2xl sm:text-[32px] leading-tight font-semibold text-[#2B2B28] mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Compare Roast Profiles
        </h2>

        <p className="text-sm sm:text-[15px] leading-relaxed text-[#6F6A60]">
          Not sure which roast fits your morning ritual? Compare acidity, body, and tasting notes side-by-side to understand which flavors resonate with your cup.
        </p>
      </div>

      {/* Focus / Filter Pills on Mobile */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#DDD2BF]/60">
        <span className="text-xs font-bold text-[#6F6A60] uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-[#24493A]" aria-hidden="true" />
          <span>Highlight Profile:</span>
        </span>

        <div className="inline-flex rounded-lg bg-[#F1E8D8] p-1 border border-[#DDD2BF]/70 text-xs">
          <button
            type="button"
            onClick={() => setHighlightedRoast('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              highlightedRoast === 'all'
                ? 'bg-[#24493A] text-white shadow-2xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            All 3
          </button>
          <button
            type="button"
            onClick={() => setHighlightedRoast('light')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              highlightedRoast === 'light'
                ? 'bg-[#E69A3B] text-white shadow-2xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setHighlightedRoast('medium')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              highlightedRoast === 'medium'
                ? 'bg-[#D9633B] text-white shadow-2xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => setHighlightedRoast('dark')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              highlightedRoast === 'dark'
                ? 'bg-[#24493A] text-white shadow-2xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Table Container */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#DDD2BF] bg-[#FDFBF7] shadow-2xs focus-within:ring-2 focus-within:ring-[#24493A]/30">
        <table
          className="w-full text-left border-collapse min-w-[540px] text-xs sm:text-[13px]"
          aria-label="Detailed roast profile comparison table"
        >
          <thead>
            <tr className="border-b border-[#DDD2BF] bg-[#F1E8D8]/70">
              <th scope="col" className="p-3 sm:p-4 text-[#6F6A60] font-bold uppercase tracking-wider text-[11px] w-[26%]">
                Feature
              </th>
              {profiles.map((profile) => {
                const isSelected = selectedRoast === profile.key;
                const isHighlighted = highlightedRoast === 'all' || highlightedRoast === profile.key;

                return (
                  <th
                    key={profile.key}
                    scope="col"
                    className={`p-3 sm:p-4 transition-colors w-[24.6%] align-top ${
                      isHighlighted ? '' : 'opacity-40'
                    } ${isSelected ? 'bg-[#24493A]/5' : ''}`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-black/10"
                          style={{ backgroundColor: profile.color }}
                          aria-hidden="true"
                        />
                        <span
                          className="font-bold text-[#2B2B28] text-sm sm:text-[15px]"
                          style={{ fontFamily: "'Fraunces', serif" }}
                        >
                          {profile.name}
                        </span>
                      </div>

                      <span className="text-[11px] text-[#6F6A60] leading-tight font-medium">
                        {profile.tagline}
                      </span>

                      {profile.key === 'medium' && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#D9633B] text-white text-[9px] font-bold uppercase tracking-wider">
                            <Award className="w-2.5 h-2.5" />
                            Most Popular
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#DDD2BF]/60 text-[#2B2B28]">
            {/* ROW 1: Dominant Flavor Notes */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E69A3B] shrink-0" aria-hidden="true" />
                  <span>Flavor Notes</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Cup tasting characteristics
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`notes-${profile.key}`}
                  className={`p-3 sm:p-4 align-top ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  <div className="flex flex-wrap gap-1">
                    {profile.primaryNotes.map((note) => (
                      <span
                        key={note}
                        className="inline-block px-1.5 py-0.5 rounded-md bg-[#F1E8D8] text-[#2B2B28] text-[11px] font-medium border border-[#DDD2BF]/70"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#6F6A60] mt-1.5 italic">
                    "{profile.aromaProfile}"
                  </p>
                </td>
              ))}
            </tr>

            {/* ROW 2: Acidity & Brightness */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Droplets className="w-3.5 h-3.5 text-[#D9633B] shrink-0" aria-hidden="true" />
                  <span>Acidity & Brightness</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Sparkling fruit vs. mellow
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`acidity-${profile.key}`}
                  className={`p-3 sm:p-4 align-top ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  {renderMeter(profile.acidityLevel, 5, profile.color)}
                  <span className="text-[11px] font-medium text-[#6F6A60] block mt-1">
                    {profile.acidityLevel >= 4
                      ? 'High, wine-like & crisp'
                      : profile.acidityLevel === 3
                      ? 'Balanced, smooth apple'
                      : 'Low, gentle & mellow'}
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW 3: Body & Mouthfeel */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Coffee className="w-3.5 h-3.5 text-[#24493A] shrink-0" aria-hidden="true" />
                  <span>Body & Texture</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Mouthfeel weight on tongue
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`body-${profile.key}`}
                  className={`p-3 sm:p-4 align-top ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  {renderMeter(profile.bodyLevel, 5, profile.color)}
                  <span className="text-[11px] font-medium text-[#6F6A60] block mt-1">
                    {profile.bodyLevel <= 2
                      ? 'Tea-like, silky & clean'
                      : profile.bodyLevel === 3
                      ? 'Velvety & medium weight'
                      : 'Heavy, syrupy & dense'}
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW 4: Natural Sweetness */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E69A3B] shrink-0" aria-hidden="true" />
                  <span>Caramel Sweetness</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Sugar browning intensity
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`sweetness-${profile.key}`}
                  className={`p-3 sm:p-4 align-top ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  {renderMeter(profile.sweetnessLevel, 5, profile.color)}
                  <span className="text-[11px] font-medium text-[#6F6A60] block mt-1">
                    {profile.sweetnessLevel === 5
                      ? 'Peak brown sugar & panela'
                      : profile.sweetnessLevel === 4
                      ? 'Cane sugar & blossom honey'
                      : 'Molasses & bittersweet cocoa'}
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW 5: Roast Development */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Flame className="w-3.5 h-3.5 text-[#D9633B] shrink-0" aria-hidden="true" />
                  <span>Roast Heat & Crack</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Internal drum temperatures
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`dev-${profile.key}`}
                  className={`p-3 sm:p-4 align-top ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  <div className="font-mono font-bold text-[#2B2B28] text-xs">
                    {profile.roastTemp}
                  </div>
                  <span className="text-[11px] text-[#6F6A60] block mt-0.5">
                    {profile.developmentTime}
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW 6: Recommended Gear */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Coffee className="w-3.5 h-3.5 text-[#24493A] shrink-0" aria-hidden="true" />
                  <span>Best Brew Gear</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Optimal extraction style
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`gear-${profile.key}`}
                  className={`p-3 sm:p-4 align-top ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  <ul className="space-y-1 text-xs">
                    {profile.bestBrewMethods.map((method) => (
                      <li key={method} className="flex items-center gap-1 text-[#2B2B28]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#24493A]" />
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* ROW 7: Milk & Dairy Pairing */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <Droplets className="w-3.5 h-3.5 text-[#E69A3B] shrink-0" aria-hidden="true" />
                  <span>Milk Pairing</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  With oat milk or dairy
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`milk-${profile.key}`}
                  className={`p-3 sm:p-4 align-top text-xs text-[#5F5A50] leading-snug ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  {profile.milkPairing}
                </td>
              ))}
            </tr>

            {/* ROW 8: Ideal For / Palate Match */}
            <tr className="hover:bg-[#F1E8D8]/30 transition-colors">
              <th scope="row" className="p-3 sm:p-4 align-top font-semibold text-[#2B2B28] bg-[#FBF7F0]/40">
                <div className="flex items-center gap-1.5 text-xs">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#24493A] shrink-0" aria-hidden="true" />
                  <span>Palate Match</span>
                </div>
                <span className="text-[10px] text-[#6F6A60] font-normal block mt-0.5">
                  Who loves this cup
                </span>
              </th>

              {profiles.map((profile) => (
                <td
                  key={`ideal-${profile.key}`}
                  className={`p-3 sm:p-4 align-top text-xs text-[#5F5A50] leading-snug ${
                    highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                  } ${selectedRoast === profile.key ? 'bg-[#24493A]/5' : ''}`}
                >
                  {profile.idealFor}
                </td>
              ))}
            </tr>

            {/* ROW 9: Action Button */}
            <tr className="bg-[#F1E8D8]/50">
              <th scope="row" className="p-3 sm:p-4 align-middle text-xs font-semibold text-[#6F6A60]">
                Select Profile
              </th>
              {profiles.map((profile) => {
                const isSelected = selectedRoast === profile.key;
                return (
                  <td
                    key={`btn-${profile.key}`}
                    className={`p-3 sm:p-4 align-middle ${
                      highlightedRoast !== 'all' && highlightedRoast !== profile.key ? 'opacity-40' : ''
                    } ${isSelected ? 'bg-[#24493A]/5' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(profile)}
                      className={`w-full py-2 px-2.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#24493A] text-white shadow-xs'
                          : 'bg-white hover:bg-[#EAE0CD] text-[#2B2B28] border border-[#DDD2BF]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Choose {profile.name.split(' ')[0]}</span>
                          <ChevronRight className="w-3 h-3 text-[#6F6A60]" />
                        </>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Roaster Pro-Tip Callout Box */}
      <div className="mt-5 p-4 rounded-xl bg-[#F1E8D8]/70 border border-[#DDD2BF] flex items-start gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-[#D9633B] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold text-[#2B2B28]">
            Roaster’s Tip: Can’t decide on just one?
          </p>
          <p className="text-[#5F5A50] leading-relaxed">
            Every monthly club shipment includes <strong>two 12oz bags</strong>. You can choose a single roast profile for consistency or opt for our curated <em>Roaster’s Choice</em> rotation to experience light-roast floral notes on weekend mornings and medium-roast chocolate sweetness for daily busy mornings.
          </p>
        </div>
      </div>
    </section>
  );
}
