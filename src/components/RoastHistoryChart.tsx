/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import {
  Sparkles,
  Coffee,
  Award,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  DEFAULT_MEMBER_MONTHLY_HISTORY,
  calculateLifetimeRoastStats,
  RoastDistributionItem,
} from '../utils/memberRoastData.ts';

interface RoastHistoryChartProps {
  onAdjustPreferences?: () => void;
}

export function RoastHistoryChart({ onAdjustPreferences }: RoastHistoryChartProps) {
  const [activeView, setActiveView] = useState<'distribution' | 'timeline'>('distribution');
  const stats = calculateLifetimeRoastStats(DEFAULT_MEMBER_MONTHLY_HISTORY);

  return (
    <section
      aria-labelledby="roast-history-heading"
      className="w-full rounded-2xl bg-[#FBF7F0] border border-[#DDD2BF] p-6 sm:p-8 shadow-xs relative overflow-hidden"
    >
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#F1E8D8]/50 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="text-left mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold tracking-wider uppercase mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Member Vault Archive</span>
        </div>

        <h2
          id="roast-history-heading"
          className="text-2xl sm:text-[34px] leading-tight font-semibold text-[#2B2B28] mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Your Lifetime Roast Journey
        </h2>

        <p className="text-[15px] sm:text-[16px] text-[#6F6A60] leading-relaxed">
          A personal breakdown of the small-batch origins and roast profiles delivered to your door over your 12 months in the club.
        </p>
      </div>

      {/* Lifetime Key Metrics Bar */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#F1E8D8] border border-[#DDD2BF]/70 text-center">
          <div className="text-xs text-[#6F6A60] flex items-center justify-center gap-1 font-medium mb-0.5">
            <Coffee className="w-3.5 h-3.5 text-[#24493A]" />
            <span>Total Bags</span>
          </div>
          <div
            className="text-xl sm:text-2xl font-bold text-[#2B2B28]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {stats.totalBags}
          </div>
          <span className="text-[10px] text-[#6F6A60]">2 bags / month</span>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-[#F1E8D8] border border-[#DDD2BF]/70 text-center">
          <div className="text-xs text-[#6F6A60] flex items-center justify-center gap-1 font-medium mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#D9633B]" />
            <span>Member Tenure</span>
          </div>
          <div
            className="text-xl sm:text-2xl font-bold text-[#2B2B28]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {stats.totalMonths} mos
          </div>
          <span className="text-[10px] text-[#6F6A60]">Since Dec 2025</span>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-[#F1E8D8] border border-[#DDD2BF]/70 text-center">
          <div className="text-xs text-[#6F6A60] flex items-center justify-center gap-1 font-medium mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E69A3B]" />
            <span>Favorite Roast</span>
          </div>
          <div
            className="text-base sm:text-lg font-bold text-[#2B2B28] truncate"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {stats.dominantRoast.name.split(' ')[0]}
          </div>
          <span className="text-[10px] font-semibold text-[#D9633B]">
            {stats.dominantRoast.percentage}% of shipments
          </span>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center justify-between border-b border-[#DDD2BF]/60 pb-3 mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6F6A60] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#24493A]" />
          Visual Distribution
        </span>

        <div className="inline-flex rounded-lg bg-[#F1E8D8] p-1 border border-[#DDD2BF]/70 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('distribution')}
            className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
              activeView === 'distribution'
                ? 'bg-[#24493A] text-white shadow-2xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Total Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
              activeView === 'timeline'
                ? 'bg-[#24493A] text-white shadow-2xs'
                : 'text-[#6F6A60] hover:text-[#2B2B28]'
            }`}
          >
            Monthly History
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-[230px] w-full pt-1 mb-6">
        {activeView === 'distribution' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.distribution}
              layout="vertical"
              margin={{ top: 10, right: 24, left: 16, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 15]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6F6A60', fontSize: 11 }}
                unit=" bags"
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#2B2B28', fontSize: 12, fontWeight: 600 }}
                width={95}
              />
              <Tooltip
                cursor={{ fill: 'rgba(217, 99, 59, 0.06)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RoastDistributionItem;
                    return (
                      <div className="rounded-xl bg-[#FBF7F0] border border-[#DDD2BF] p-3 shadow-lg text-xs space-y-1">
                        <div className="font-bold text-[#2B2B28] flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: data.color }}
                          />
                          {data.name}
                        </div>
                        <div className="text-[#6F6A60]">
                          <strong className="text-[#2B2B28]">{data.bags} bags</strong> ({data.percentage}% of lifetime total)
                        </div>
                        <div className="text-[11px] text-[#6F6A60] max-w-xs pt-1 border-t border-[#DDD2BF]/50">
                          <strong>Tasting Notes:</strong> {data.notes}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="bags" radius={[0, 8, 8, 0]} barSize={26}>
                {stats.distribution.map((entry) => (
                  <Cell key={entry.roastKey} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DEFAULT_MEMBER_MONTHLY_HISTORY}
              margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
            >
              <XAxis
                dataKey="shortMonth"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6F6A60', fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6F6A60', fontSize: 10 }}
                domain={[0, 2]}
                ticks={[0, 1, 2]}
              />
              <Tooltip
                cursor={{ fill: 'rgba(36, 73, 58, 0.05)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const record = payload[0].payload;
                    return (
                      <div className="rounded-xl bg-[#FBF7F0] border border-[#DDD2BF] p-3 shadow-lg text-xs space-y-1">
                        <div className="font-bold text-[#2B2B28]">{record.month}</div>
                        <div className="text-[11px] text-[#D9633B] font-medium">
                          Featured: {record.featuredCoffee}
                        </div>
                        <div className="pt-1 border-t border-[#DDD2BF]/50 space-y-0.5">
                          {record.light > 0 && <div className="text-[#E69A3B]">Light Roast: {record.light} bag</div>}
                          {record.medium > 0 && <div className="text-[#D9633B]">Medium Roast: {record.medium} bags</div>}
                          {record.dark > 0 && <div className="text-[#24493A]">Dark Roast: {record.dark} bag</div>}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }}
              />
              <Bar name="Light" dataKey="light" stackId="a" fill="#E69A3B" radius={[0, 0, 0, 0]} />
              <Bar name="Medium" dataKey="medium" stackId="a" fill="#D9633B" radius={[0, 0, 0, 0]} />
              <Bar name="Dark" dataKey="dark" stackId="a" fill="#24493A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Flavor Profile Legend Cards */}
      <div className="space-y-2 pt-1 border-t border-[#DDD2BF]/50">
        {stats.distribution.map((item) => (
          <div
            key={item.roastKey}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F1E8D8]/60 hover:bg-[#F1E8D8] border border-[#DDD2BF]/40 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <div>
                <span className="font-bold text-[#2B2B28]">{item.name}: </span>
                <span className="text-[#6F6A60]">{item.notes}</span>
              </div>
            </div>
            <div className="font-mono font-semibold text-[#2B2B28] shrink-0 ml-2">
              {item.bags} bags ({item.percentage}%)
            </div>
          </div>
        ))}
      </div>

      {/* Adjust Palette CTA Footer */}
      {onAdjustPreferences && (
        <div className="mt-5 pt-4 border-t border-[#DDD2BF]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#6F6A60] text-center sm:text-left">
            Want to shift towards more fruit-forward light roasts or rich dark espressos?
          </p>
          <button
            type="button"
            onClick={onAdjustPreferences}
            className="inline-flex items-center gap-1 font-semibold text-[#D9633B] hover:text-[#BF522E] hover:underline cursor-pointer shrink-0"
          >
            <span>Update taste profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}
