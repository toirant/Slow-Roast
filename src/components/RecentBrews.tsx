/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  Check,
  SlidersHorizontal,
  Flame,
  MapPin,
  Coffee,
  Filter,
  RotateCcw,
} from 'lucide-react';
import {
  RecentBrew,
  DEFAULT_RECENT_BREWS,
  BrewMethodFilter,
  filterBrewsByMethod,
  getBrewMethodOptions,
  updateBrewRating,
  getRatingFeedback,
  calculateAverageRating,
} from '../utils/recentBrews.ts';

interface RecentBrewsProps {
  onRateCoffee?: (coffee: RecentBrew, rating: number, feedback: string) => void;
}

export function RecentBrews({ onRateCoffee }: RecentBrewsProps) {
  const [brews, setBrews] = useState<RecentBrew[]>(DEFAULT_RECENT_BREWS);
  const [selectedMethod, setSelectedMethod] = useState<BrewMethodFilter>('all');
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [lastRatedId, setLastRatedId] = useState<string | null>(null);

  const handleRating = (brew: RecentBrew, rating: number) => {
    setBrews((prev) => updateBrewRating(prev, brew.id, rating));
    setLastRatedId(brew.id);
    const feedback = getRatingFeedback(rating, brew.name);
    onRateCoffee?.(brew, rating, feedback);
  };

  const methodOptions = getBrewMethodOptions(brews);
  const filteredBrews = filterBrewsByMethod(brews, selectedMethod);
  const averageScore = calculateAverageRating(brews);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold tracking-wide uppercase">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Step 4 • Taste Profile Tuning</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-[#6F6A60] bg-[#F1E8D8] px-2.5 py-1 rounded-md border border-[#DDD2BF]/60">
            <Star className="w-3.5 h-3.5 fill-[#E69A3B] text-[#E69A3B]" aria-hidden="true" />
            <span>Example rating (demo): {averageScore} / 5</span>
          </div>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-semibold text-[#2B2B28] tracking-tight leading-tight mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Recent Brews
        </h2>
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#6F6A60]">
          Here are the last 3 coffees received in your monthly shipments. Rate what you tried to help our roasters calibrate the roast balance and origins in your next box.
        </p>
      </div>

      {/* Filter by Brew Method */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6F6A60] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#24493A]" aria-hidden="true" />
            <span>Filter by brew method:</span>
          </div>

          {selectedMethod !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedMethod('all')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#24493A] hover:text-[#183127] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Show all ({brews.length})</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter recent brews by brewing method"
        >
          {methodOptions.map((option) => {
            const isSelected = selectedMethod === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="recent-brews-list"
                onClick={() => setSelectedMethod(option.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#24493A] text-white shadow-xs'
                    : 'bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EAE0CD] border border-[#DDD2BF]/70'
                }`}
              >
                {option.id !== 'all' && (
                  <Coffee
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-white' : 'text-[#6F6A60]'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span>{option.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#DDD2BF]/70 text-[#6F6A60]'
                  }`}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Helper Indicator */}
        {selectedMethod !== 'all' && (
          <div className="mt-2 text-xs text-[#6F6A60] font-medium flex items-center gap-1.5">
            <span>
              Showing {filteredBrews.length}{' '}
              {selectedMethod === 'pour-over'
                ? 'Pour Over'
                : selectedMethod === 'aeropress'
                ? 'AeroPress'
                : 'French Press'}{' '}
              {filteredBrews.length === 1 ? 'brew' : 'brews'}
            </span>
          </div>
        )}
      </div>

      {/* Coffee List */}
      <div
        id="recent-brews-list"
        className="space-y-3.5"
        role="list"
        aria-label="Recent brews received by member"
      >
        {filteredBrews.length > 0 ? (
          filteredBrews.map((brew) => {
            const hoveredRating = hoveredStars[brew.id] || 0;
            const displayRating = hoveredRating > 0 ? hoveredRating : brew.rating;
            const isJustRated = lastRatedId === brew.id;

            return (
              <div
                key={brew.id}
                role="listitem"
                className="rounded-xl border border-[#DDD2BF] bg-[#FBF7F0] p-4 sm:p-5 transition-all duration-200 hover:border-[#24493A]/30 hover:shadow-xs shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  {/* Coffee Origin & Title */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E69A3B]/20 text-[#B85025] border border-[#E69A3B]/40 uppercase tracking-wider">
                        Sample review
                      </span>
                      <span className="text-base" role="img" aria-label={brew.origin}>
                        {brew.flagEmoji}
                      </span>
                      <span className="text-[11px] font-bold text-[#6F6A60] uppercase tracking-wider">
                        {brew.receivedMonth}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${brew.roastBadgeColor}`}
                      >
                        <Flame className="w-3 h-3" aria-hidden="true" />
                        <span>{brew.roastLevel} Roast</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#24493A]/10 text-[#24493A] border border-[#24493A]/20">
                        <Coffee className="w-3 h-3" aria-hidden="true" />
                        <span>{brew.brewMethodLabel}</span>
                      </span>
                    </div>

                    <h3
                      className="text-base sm:text-lg font-semibold text-[#2B2B28] tracking-tight"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {brew.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#6F6A60] font-medium mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#24493A] shrink-0" aria-hidden="true" />
                      <span>Origin: {brew.origin}</span>
                    </div>
                  </div>

                  {/* Interactive Star-Rating Input */}
                  <div className="shrink-0 flex flex-col sm:items-end">
                    <div className="text-[11px] font-semibold text-[#6F6A60] uppercase tracking-wider mb-1">
                      Rated {displayRating}/5:
                    </div>

                    <div
                      className="flex items-center gap-1 focus-within:ring-2 focus-within:ring-[#24493A]/40 rounded-lg p-1 -m-1"
                      role="radiogroup"
                      aria-label={`Star rating for ${brew.name}`}
                    >
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isFilled = starValue <= displayRating;
                        return (
                          <button
                            key={starValue}
                            type="button"
                            role="radio"
                            aria-checked={brew.rating === starValue}
                            aria-label={`Rate ${starValue} of 5 stars for ${brew.name}`}
                            onClick={() => handleRating(brew, starValue)}
                            onMouseEnter={() =>
                              setHoveredStars((prev) => ({ ...prev, [brew.id]: starValue }))
                            }
                            onMouseLeave={() =>
                              setHoveredStars((prev) => ({ ...prev, [brew.id]: 0 }))
                            }
                            className="p-1 rounded-md text-[#DDD2BF] hover:scale-115 active:scale-95 transition-all cursor-pointer focus:outline-hidden"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                isFilled
                                  ? 'fill-[#E69A3B] text-[#E69A3B]'
                                  : 'fill-transparent text-[#DDD2BF] hover:text-[#E69A3B]/60'
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[11px] text-[#6F6A60] font-medium mt-1">
                      {displayRating > 0 ? `${displayRating} / 5 stars` : 'Not yet rated'}
                    </div>
                  </div>
                </div>

                {/* Tasting Notes & Brew Method Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#DDD2BF]/60 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[#6F6A60] font-medium">Notes:</span>
                    {brew.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2 py-0.5 rounded-md bg-[#F1E8D8] text-[#2B2B28] text-[11px] font-medium"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-[#6F6A60] font-medium">
                    Brewed as:{' '}
                    <span className="text-[#2B2B28] font-semibold">
                      {brew.brewRecommendation}
                    </span>
                  </div>
                </div>

                {/* Rating Saved Feedback Banner */}
                {isJustRated && (
                  <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#24493A]/10 border border-[#24493A]/20 text-[11px] text-[#24493A] font-medium flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{getRatingFeedback(brew.rating, brew.name)}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-[#DDD2BF] bg-[#F1E8D8]/50 p-6 text-center">
            <Coffee className="w-6 h-6 text-[#6F6A60] mx-auto mb-2 opacity-60" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-[#2B2B28] mb-1">
              No recent brews found
            </h4>
            <p className="text-xs text-[#6F6A60] mb-3">
              No coffees in your recent history were tagged with this brew method.
            </p>
            <button
              type="button"
              onClick={() => setSelectedMethod('all')}
              className="px-3 py-1.5 rounded-lg bg-[#24493A] text-white text-xs font-semibold cursor-pointer"
            >
              Show all brews
            </button>
          </div>
        )}
      </div>

      {/* Roaster Calibration Note */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-[#F1E8D8]/60 border border-[#DDD2BF]/70 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#D9633B] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-[#5F5A50] leading-relaxed">
          <strong className="text-[#2B2B28] font-semibold">How ratings shape your box:</strong> Our roasting team uses your star ratings and preferred brew methods to dynamically weigh coffee origin regions and roast development times before each monthly dispatch.
        </p>
      </div>
    </div>
  );
}
