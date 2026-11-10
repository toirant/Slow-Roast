/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ShieldAlert, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

export function ModeBanner() {
  const { mode, setMode, isStripeLiveConfigured, openOwnerPortal, resetDemo } = useCart();

  return (
    <aside
      aria-label="Application mode status"
      className="w-full bg-[#1F2A24] text-[#FBF7F0] border-b border-[#24493A] text-xs py-2 px-3 sm:px-4 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {mode === 'demo' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E69A3B]/20 text-[#E69A3B] font-semibold border border-[#E69A3B]/40 shrink-0">
              <Sparkles className="w-3 h-3" />
              DEMO MODE
            </span>
          ) : isStripeLiveConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              LIVE COMMERCE (Stripe Connected)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shrink-0">
              <ShieldAlert className="w-3 h-3" />
              LIVE PREVIEW (Stripe Keys Pending)
            </span>
          )}
          <span className="text-[#DDD2BF] hidden sm:inline break-words">
            {mode === 'demo'
              ? 'Sample products & simulated checkout. No Stripe credentials required • Zero real charges.'
              : isStripeLiveConfigured
              ? 'Live Stripe payments enabled.'
              : 'Live mode requires server-side STRIPE_SECRET_KEY. Use Demo Mode for simulated checkout.'}
          </span>
          <span className="text-[#DDD2BF] sm:hidden text-[11px]">
            {mode === 'demo' ? 'Simulated checkout (No Stripe needed)' : 'Live mode'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
          <button
            type="button"
            onClick={resetDemo}
            title="Reset cart and clear demo order state"
            className="inline-flex items-center gap-1 text-[#DDD2BF] hover:text-white transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3 h-3 text-[#E69A3B]" />
            <span>Reset Demo</span>
          </button>
          <span className="text-white/20 hidden xs:inline">|</span>
          <button
            type="button"
            onClick={() => setMode(mode === 'demo' ? 'live' : 'demo')}
            className="text-[#E69A3B] hover:text-white underline underline-offset-2 transition-colors cursor-pointer font-medium"
          >
            {mode === 'demo' ? 'Live Mode' : 'Demo Mode'}
          </button>
          <span className="text-white/20 hidden xs:inline">|</span>
          <button
            type="button"
            onClick={openOwnerPortal}
            className="inline-flex items-center gap-1 text-[#FBF7F0] hover:text-[#E69A3B] transition-colors cursor-pointer font-medium"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#E69A3B]" />
            <span className="hidden sm:inline">Roaster Launch Checklist</span>
            <span className="sm:hidden">Checklist</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
