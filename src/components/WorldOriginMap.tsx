/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Mountain,
  Compass,
  Sparkles,
  Layers,
  Flame,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';
import {
  LAST_THREE_MONTHS_ORIGINS,
  MAP_DIMENSIONS,
  CoffeeOrigin,
  projectCoordinates,
  getCoffeeBeltYBounds,
  formatAltitude,
} from '../utils/coffeeOrigins.ts';
import { CONTINENT_PATHS, GRATICULES } from '../data/worldMapData.ts';

interface WorldOriginMapProps {
  onSelectOrigin?: (origin: CoffeeOrigin) => void;
}

export function WorldOriginMap({ onSelectOrigin }: WorldOriginMapProps) {
  const [selectedOriginId, setSelectedOriginId] = useState<string | null>(
    LAST_THREE_MONTHS_ORIGINS[0].id
  );
  const [showCoffeeBelt, setShowCoffeeBelt] = useState(true);
  const [hoveredOriginId, setHoveredOriginId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const activeOrigin = LAST_THREE_MONTHS_ORIGINS.find((o) => o.id === selectedOriginId) || null;
  const coffeeBeltBounds = getCoffeeBeltYBounds();

  const handleMarkerClick = (id: string) => {
    setSelectedOriginId((prev) => (prev === id ? null : id));
  };

  /**
   * Staggered label pill offsets to guarantee non-overlapping readability
   */
  const getPillOffset = (id: string) => {
    switch (id) {
      case 'guatemala-antigua':
        return { dx: -22, dy: -20 }; // northwest of marker
      case 'colombia-huila':
        return { dx: 22, dy: 22 }; // southeast of marker
      case 'ethiopia-yirgacheffe':
      default:
        return { dx: 0, dy: -22 }; // north of marker
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold tracking-wide uppercase mb-3">
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Global Sourcing Traceability</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-semibold text-[#2B2B28] tracking-tight leading-tight mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Where our last 3 months came from
          </h2>
          <p className="text-sm sm:text-[15px] leading-relaxed text-[#6F6A60]">
            Every month, club members receive fresh single-origin coffees from high-altitude
            terroirs across the equatorial Coffee Belt. Explore by map or accessible list.
          </p>
        </div>

        {/* Map vs List View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#DDD2BF]/50 rounded-xl border border-[#DDD2BF] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-[#24493A] shadow-xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Interactive Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#24493A] shadow-xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Readable List View
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* Accessible List View Alternative */
        <div className="space-y-4" role="region" aria-label="Readable list of recent coffee origins">
          {LAST_THREE_MONTHS_ORIGINS.map((origin) => (
            <div
              key={origin.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD2BF] shadow-xs hover:border-[#24493A]/50 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD2BF]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{origin.flagEmoji}</span>
                  <div>
                    <h3
                      className="text-lg font-bold text-[#2B2B28]"
                      style={{ fontFamily: "'Fraunces', serif" }}
                    >
                      {origin.country} — {origin.region}
                    </h3>
                    <p className="text-xs text-[#6F6A60]">{origin.farmOrCoop} • {origin.farmer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6F6A60] uppercase tracking-wider bg-[#F1E8D8] px-2.5 py-1 rounded">
                    {origin.month} Selection
                  </span>
                  <span className="text-xs font-bold text-[#24493A] bg-[#24493A]/10 px-2.5 py-1 rounded">
                    {origin.roastProfile}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/40">
                  <span className="text-[11px] text-[#6F6A60] font-medium block">Altitude</span>
                  <span className="font-bold text-[#2B2B28]">{formatAltitude(origin)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/40">
                  <span className="text-[11px] text-[#6F6A60] font-medium block">Varietal</span>
                  <span className="font-bold text-[#2B2B28]">{origin.varietal}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/40">
                  <span className="text-[11px] text-[#6F6A60] font-medium block">Process</span>
                  <span className="font-bold text-[#2B2B28]">{origin.process}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/40">
                  <span className="text-[11px] text-[#6F6A60] font-medium block">Harvest Window</span>
                  <span className="font-bold text-[#2B2B28]">{origin.harvestWindow}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#2B2B28] block mb-1.5">Tasting Profile:</span>
                <div className="flex flex-wrap gap-1.5">
                  {origin.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#24493A]/8 text-[#24493A]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#6F6A60] italic border-l-2 border-[#D9633B] pl-3 py-0.5">
                &ldquo;{origin.terroirStory}&rdquo;
              </p>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => onSelectOrigin?.(origin)}
                  className="py-2 px-4 rounded-xl bg-[#24493A] text-white text-xs font-bold hover:bg-[#1B372C] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Select {origin.country} for Next Box</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E69A3B]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Origin Selection Pills & Coffee Belt Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
            {/* Origin Quick Tabs */}
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Origin selection">
              <button
                type="button"
                role="tab"
                aria-selected={selectedOriginId === null}
                onClick={() => setSelectedOriginId(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  selectedOriginId === null
                    ? 'bg-[#24493A] text-white shadow-xs'
                    : 'bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EAE0CD] border border-[#DDD2BF]/60'
                }`}
              >
                All 3 Origins
              </button>

              {LAST_THREE_MONTHS_ORIGINS.map((origin) => {
                const isSelected = selectedOriginId === origin.id;
                return (
                  <button
                    key={origin.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedOriginId(origin.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'text-white shadow-xs ring-2 ring-offset-1 ring-[#FBF7F0]'
                        : 'bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EAE0CD] border border-[#DDD2BF]/60'
                    }`}
                    style={isSelected ? { backgroundColor: origin.flavorAccentColor } : {}}
                  >
                    <span>{origin.flagEmoji}</span>
                    <span>
                      {origin.month.slice(0, 3)}: {origin.country}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Coffee Belt Highlight Toggle */}
            <button
              type="button"
              onClick={() => setShowCoffeeBelt((prev) => !prev)}
              aria-pressed={showCoffeeBelt}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border ${
                showCoffeeBelt
                  ? 'bg-[#E69A3B]/15 text-[#915B17] border-[#E69A3B]/40 font-semibold shadow-2xs'
                  : 'bg-transparent text-[#6F6A60] hover:text-[#2B2B28] border-[#DDD2BF]'
              }`}
              title="Toggle equatorial Coffee Belt band (23.5°N - 23.5°S)"
            >
              <Layers className="w-3.5 h-3.5 text-[#E69A3B]" aria-hidden="true" />
              <span>Coffee Belt</span>
            </button>
          </div>

      {/* World Map SVG Container */}
      <div className="relative w-full rounded-xl overflow-hidden border border-[#DDD2BF] bg-[#F7F2E8] shadow-xs">
        {/* Top Floating Badge */}
        <div className="absolute top-2.5 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FBF7F0]/90 backdrop-blur-xs border border-[#DDD2BF]/70 text-[11px] text-[#6F6A60] pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#E69A3B] animate-pulse" />
          <span>Equatorial Coffee Belt (23.5°N – 23.5°S)</span>
        </div>

        <svg
          viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Interactive world map indicating coffee origin locations from the last three months in Ethiopia, Colombia, and Guatemala"
        >
          <defs>
            {/* Linear gradient for the Coffee Belt band */}
            <linearGradient id="coffeeBeltGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E69A3B" stopOpacity="0.03" />
              <stop offset="50%" stopColor="#E69A3B" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#E69A3B" stopOpacity="0.03" />
            </linearGradient>

            {/* Marker Drop Shadow */}
            <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#1F2A24" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Graticule Background Grid */}
          <g className="graticules pointer-events-none" stroke="#DDD2BF" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6">
            {GRATICULES.map((g) => (
              <line key={g.id} x1="0" y1={g.y} x2={MAP_DIMENSIONS.width} y2={g.y} />
            ))}
            {/* Prime Meridian & Longitude intervals */}
            <line x1="180" y1="0" x2="180" y2={MAP_DIMENSIONS.height} />
            <line x1="370" y1="0" x2="370" y2={MAP_DIMENSIONS.height} />
            <line x1="560" y1="0" x2="560" y2={MAP_DIMENSIONS.height} />
          </g>

          {/* Coffee Belt Band (23.5° N to 23.5° S) */}
          {showCoffeeBelt && (
            <g className="coffee-belt pointer-events-none transition-opacity duration-300">
              <rect
                x="0"
                y={coffeeBeltBounds.yTop}
                width={MAP_DIMENSIONS.width}
                height={coffeeBeltBounds.height}
                fill="url(#coffeeBeltGradient)"
              />
              <line
                x1="0"
                y1={coffeeBeltBounds.yTop}
                x2={MAP_DIMENSIONS.width}
                y2={coffeeBeltBounds.yTop}
                stroke="#E69A3B"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <line
                x1="0"
                y1={coffeeBeltBounds.yBottom}
                x2={MAP_DIMENSIONS.width}
                y2={coffeeBeltBounds.yBottom}
                stroke="#E69A3B"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              {/* Latitude Belt Labels */}
              <text
                x={MAP_DIMENSIONS.width - 8}
                y={coffeeBeltBounds.yTop - 4}
                textAnchor="end"
                className="fill-[#A16A28] text-[9px] font-sans font-medium"
              >
                23.5° N (Tropic of Cancer)
              </text>
              <text
                x={MAP_DIMENSIONS.width - 8}
                y={coffeeBeltBounds.yBottom + 11}
                textAnchor="end"
                className="fill-[#A16A28] text-[9px] font-sans font-medium"
              >
                23.5° S (Tropic of Capricorn)
              </text>
            </g>
          )}

          {/* Continents */}
          <g className="continents pointer-events-none">
            {CONTINENT_PATHS.map((continent) => (
              <path
                key={continent.id}
                d={continent.d}
                fill="#E2D8C7"
                stroke="#C6B59D"
                strokeWidth="1.2"
                strokeLinejoin="round"
                className="transition-colors duration-200"
              />
            ))}
          </g>

          {/* Connecting Sourcing Arcs between Origin Hubs */}
          <g className="origin-arcs pointer-events-none" opacity={selectedOriginId === null ? 0.8 : 0.4}>
            {(() => {
              const p1 = projectCoordinates(
                LAST_THREE_MONTHS_ORIGINS[2].lat,
                LAST_THREE_MONTHS_ORIGINS[2].lng
              ); // Guatemala
              const p2 = projectCoordinates(
                LAST_THREE_MONTHS_ORIGINS[1].lat,
                LAST_THREE_MONTHS_ORIGINS[1].lng
              ); // Colombia
              const p3 = projectCoordinates(
                LAST_THREE_MONTHS_ORIGINS[0].lat,
                LAST_THREE_MONTHS_ORIGINS[0].lng
              ); // Ethiopia

              return (
                <>
                  {/* Guatemala to Colombia */}
                  <path
                    d={`M ${p1.x} ${p1.y} Q ${(p1.x + p2.x) / 2 + 10} ${(p1.y + p2.y) / 2 - 15} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke="#D9633B"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="transition-all duration-300"
                  />
                  {/* Colombia to Ethiopia */}
                  <path
                    d={`M ${p2.x} ${p2.y} Q ${(p2.x + p3.x) / 2} ${(p2.y + p3.y) / 2 - 45} ${p3.x} ${p3.y}`}
                    fill="none"
                    stroke="#E69A3B"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="transition-all duration-300"
                  />
                </>
              );
            })()}
          </g>

          {/* Interactive Origin Markers */}
          {LAST_THREE_MONTHS_ORIGINS.map((origin) => {
            const { x, y } = projectCoordinates(origin.lat, origin.lng);
            const isSelected = selectedOriginId === origin.id;
            const isHovered = hoveredOriginId === origin.id;
            const isDimmed = selectedOriginId !== null && !isSelected;
            const { dx, dy } = getPillOffset(origin.id);

            return (
              <g
                key={origin.id}
                role="button"
                tabIndex={0}
                aria-label={`Origin marker: ${origin.country}, ${origin.region}. Month: ${origin.month}. Tap for tasting profile.`}
                onClick={() => handleMarkerClick(origin.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMarkerClick(origin.id);
                  }
                }}
                onMouseEnter={() => setHoveredOriginId(origin.id)}
                onMouseLeave={() => setHoveredOriginId(null)}
                className="cursor-pointer focus:outline-hidden group pointer-events-auto"
                transform={`translate(${x}, ${y})`}
                opacity={isDimmed ? 0.5 : 1}
              >
                {/* Generous transparent hit area for click and touch tolerance */}
                <circle r="26" fill="transparent" className="cursor-pointer" />

                {/* Visible Keyboard Focus Ring */}
                <circle
                  r="20"
                  fill="none"
                  stroke="#E69A3B"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="opacity-0 group-focus-visible:opacity-100 group-focus:opacity-100 transition-opacity"
                />

                {/* Radar Pulse Effect for Active or Hovered Marker */}
                {(isSelected || isHovered) && (
                  <circle
                    r="16"
                    fill="none"
                    stroke={origin.flavorAccentColor}
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.8"
                  />
                )}

                {/* Outer Glow Halo */}
                <circle
                  r={isSelected ? '14' : isHovered ? '12' : '9'}
                  fill={origin.flavorAccentColor}
                  opacity={isSelected ? 0.35 : 0.2}
                  className="transition-all duration-200"
                />

                {/* Main Pin Base */}
                <circle
                  r={isSelected ? '7' : '5.5'}
                  fill={origin.flavorAccentColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  filter="url(#markerShadow)"
                  className="transition-all duration-200"
                />

                {/* Center Core Dot */}
                <circle
                  r={isSelected ? '2.5' : '2'}
                  fill="#FFFFFF"
                  className="transition-all duration-200"
                />

                {/* Floating Map Label Tag with Anti-Collision Offsets */}
                <g
                  transform={`translate(${dx}, ${dy})`}
                  className={`pointer-events-none transition-all duration-200 ${
                    isSelected
                      ? 'opacity-100 scale-105'
                      : isHovered
                      ? 'opacity-100'
                      : selectedOriginId === null
                      ? 'opacity-90'
                      : 'opacity-70 group-hover:opacity-100'
                  }`}
                >
                  {/* Label Background Pill */}
                  <rect
                    x="-40"
                    y="-9"
                    width="80"
                    height="18"
                    rx="9"
                    fill="#1F2A24"
                    stroke={isSelected ? origin.flavorAccentColor : '#3D4D43'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    filter="url(#markerShadow)"
                  />
                  {/* Label Text */}
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className="fill-white text-[9px] font-semibold tracking-tight font-sans"
                  >
                    {origin.flagEmoji} {origin.country}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Bottom Map Sub-Bar with Sourcing Note */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#EFE7DA]/90 border-t border-[#DDD2BF] text-[11px] text-[#6F6A60]">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#24493A]" aria-hidden="true" />
            <span>3 Global Micro-Lots • 100% Traceable Direct Trade</span>
          </div>
          <span className="hidden sm:inline-block font-semibold text-[#24493A]">
            Roasted fresh in small batches
          </span>
        </div>
      </div>

      {/* Selected Origin Story Card / Overview Section */}
      <div className="mt-5">
        {activeOrigin ? (
          <div className="rounded-xl border border-[#DDD2BF] bg-[#F1E8D8]/70 p-5 sm:p-6 relative transition-all duration-200 shadow-xs">
            {/* Top Row: Country, Month, and Profile Badge */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{activeOrigin.flagEmoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6F6A60]">
                    {activeOrigin.issueNumber} • {activeOrigin.month} Selection
                  </span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-semibold text-[#2B2B28] tracking-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {activeOrigin.region}
                </h3>
                <p className="text-xs sm:text-sm text-[#6F6A60] font-medium mt-0.5">
                  {activeOrigin.farmOrCoop} • {activeOrigin.farmer}
                </p>
              </div>

              {/* Roast Profile Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${activeOrigin.accentBadgeColor}`}
              >
                <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{activeOrigin.roastProfile} Roast</span>
              </div>
            </div>

            {/* Terroir & Agronomy Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {/* Altitude */}
              <div className="rounded-lg bg-[#FBF7F0] p-2.5 border border-[#DDD2BF]/60">
                <div className="flex items-center gap-1 text-[11px] text-[#6F6A60] font-medium mb-1">
                  <Mountain className="w-3 h-3 text-[#24493A]" aria-hidden="true" />
                  <span>Altitude</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-[#2B2B28]">
                  {formatAltitude(activeOrigin)}
                </div>
              </div>

              {/* Varietal */}
              <div className="rounded-lg bg-[#FBF7F0] p-2.5 border border-[#DDD2BF]/60">
                <div className="text-[11px] text-[#6F6A60] font-medium mb-1">Varietal</div>
                <div className="text-xs sm:text-[13px] font-bold text-[#2B2B28] truncate" title={activeOrigin.varietal}>
                  {activeOrigin.varietal}
                </div>
              </div>

              {/* Processing */}
              <div className="rounded-lg bg-[#FBF7F0] p-2.5 border border-[#DDD2BF]/60">
                <div className="text-[11px] text-[#6F6A60] font-medium mb-1">Process</div>
                <div className="text-xs sm:text-[13px] font-bold text-[#2B2B28] truncate" title={activeOrigin.process}>
                  {activeOrigin.process}
                </div>
              </div>

              {/* Harvest Window */}
              <div className="rounded-lg bg-[#FBF7F0] p-2.5 border border-[#DDD2BF]/60">
                <div className="flex items-center gap-1 text-[11px] text-[#6F6A60] font-medium mb-1">
                  <Calendar className="w-3 h-3 text-[#24493A]" aria-hidden="true" />
                  <span>Harvest</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-[#2B2B28]">
                  {activeOrigin.harvestWindow}
                </div>
              </div>
            </div>

            {/* Tasting Notes */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2B2B28] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D9633B]" aria-hidden="true" />
                <span>Distinctive Tasting Notes:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeOrigin.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FBF7F0] text-[#2B2B28] border border-[#DDD2BF] shadow-2xs"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Terroir Sourcing Story Quote */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#5F5A50] italic border-l-2 border-[#D9633B] pl-3 py-0.5 mb-5">
              "{activeOrigin.terroirStory}"
            </p>

            {/* Call to action within the card */}
            <div className="flex items-center justify-between pt-3 border-t border-[#DDD2BF]/70">
              <div className="text-xs text-[#6F6A60]">
                Included in our standard 2-bag monthly rotation.
              </div>
              <button
                type="button"
                onClick={() => onSelectOrigin?.(activeOrigin)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24493A] hover:text-[#183127] transition-colors cursor-pointer group"
              >
                <span>Reserve this profile</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          /* Overview when All Origins is active */
          <div className="rounded-xl border border-[#DDD2BF] bg-[#F1E8D8]/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#24493A]" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#2B2B28]">
                Last Quarter at a Glance: 3 Origins, 3 Continents
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LAST_THREE_MONTHS_ORIGINS.map((origin) => (
                <div
                  key={origin.id}
                  onClick={() => setSelectedOriginId(origin.id)}
                  className="rounded-lg bg-[#FBF7F0] p-3 border border-[#DDD2BF]/80 hover:border-[#24493A]/50 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{origin.flagEmoji}</span>
                    <span className="text-[10px] font-bold text-[#6F6A60] uppercase tracking-wider">
                      {origin.month}
                    </span>
                  </div>
                  <div
                    className="text-sm font-semibold text-[#2B2B28] group-hover:text-[#24493A] transition-colors"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {origin.country}
                  </div>
                  <div className="text-[11px] text-[#6F6A60] truncate">{origin.region}</div>
                  <div className="mt-2 text-[11px] text-[#D9633B] font-medium flex items-center gap-1">
                    <span>{origin.roastProfile}</span>
                    <span>•</span>
                    <span>{origin.tastingNotes[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
}
