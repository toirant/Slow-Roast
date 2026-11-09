/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROASTER_CONFIG } from '../config/roasterConfig.ts';

export function ModeBanner() {
  const { mode, setMode, isStripeLiveConfigured, openOwnerPortal } = useCart();

  return (
    <aside
      aria-label="Application mode status"
      className="w-full bg-[#1F2A24] text-[#FBF7F0] border-b border-[#24493A] text-xs py-2 px-4 select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {mode === 'demo' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E69A3B]/20 text-[#E69A3B] font-semibold border border-[#E69A3B]/40">
              <Sparkles className="w-3 h-3" />
              DEMO MODE
            </span>
          ) : isStripeLiveConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" />
              LIVE COMMERCE (Stripe Connected)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
              <ShieldAlert className="w-3 h-3" />
              LIVE PREVIEW (Stripe Keys Pending)
            </span>
          )}
          <span className="text-[#DDD2BF] hidden sm:inline">
            {mode === 'demo'
              ? 'Sample products & simulated checkout. No Stripe credentials required • Zero real charges.'
              : isStripeLiveConfigured
              ? 'Live Stripe payments enabled.'
              : 'Live mode requires server-side STRIPE_SECRET_KEY. Use Demo Mode for simulated checkout.'}
          </span>
          <span className="text-[#DDD2BF] sm:hidden">
            {mode === 'demo' ? 'Simulated checkout (No Stripe needed)' : 'Live mode'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode(mode === 'demo' ? 'live' : 'demo')}
            className="text-[#E69A3B] hover:text-white underline underline-offset-2 transition-colors cursor-pointer font-medium"
          >
            Switch to {mode === 'demo' ? 'Live Mode' : 'Demo Mode'}
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={openOwnerPortal}
            className="inline-flex items-center gap-1 text-[#FBF7F0] hover:text-[#E69A3B] transition-colors cursor-pointer font-medium"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#E69A3B]" />
            <span>Roaster Launch Checklist</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
