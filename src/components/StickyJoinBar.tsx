import React from 'react';
import { Coffee, ArrowUpRight } from 'lucide-react';

interface StickyJoinBarProps {
  isVisible: boolean;
  onJoin: () => void;
  className?: string;
}

export const StickyJoinBar: React.FC<StickyJoinBarProps> = ({
  isVisible,
  onJoin,
  className = '',
}) => {
  return (
    <aside
      aria-label="Quick subscription signup"
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[560px] transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto scale-100'
          : 'translate-y-20 opacity-0 pointer-events-none scale-95'
      } ${className}`}
    >
      <div className="rounded-full bg-[#FBF7F0]/95 backdrop-blur-md border border-[#DDD2BF] shadow-xl ring-1 ring-black/5 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Brand & Perk summary */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#24493A] text-white flex items-center justify-center shrink-0 shadow-2xs"
            aria-hidden="true"
          >
            <Coffee className="w-4 h-4 text-[#F1E8D8]" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 leading-tight">
              <span
                className="font-bold text-xs sm:text-sm text-[#2B2B28]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Slow Roast Club
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#D9633B]/10 text-[#D9633B]">
                Issue 04
              </span>
            </div>
            <p className="text-[11px] text-[#6F6A60] truncate">
              $36/mo • Free shipping on 1st box
            </p>
          </div>
        </div>

        {/* Right: Sticky Join CTA button */}
        <button
          onClick={onJoin}
          aria-label="Join the club"
          className="group inline-flex items-center justify-center bg-[#D9633B] hover:bg-[#BF522E] text-white font-medium rounded-full px-4 sm:px-6 py-2 sm:py-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:translate-y-0 shrink-0 text-xs sm:text-sm"
        >
          <span>Join</span>
          <span className="hidden min-[380px]:inline ml-1">the club</span>
          <ArrowUpRight
            className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </aside>
  );
};
