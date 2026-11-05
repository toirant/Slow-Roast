/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ReadingProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progress,
  className = '',
}) => {
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <>
      {/* Resting bar at the top of the main container */}
      <div
        role="progressbar"
        aria-valuenow={roundedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        className={`w-full h-[3px] bg-[#DDD2BF]/40 overflow-hidden ${className}`}
      >
        <div
          className="h-full bg-gradient-to-r from-[#24493A] via-[#D9633B] to-[#D9633B] transition-[width] duration-150 ease-out"
          style={{ width: `${roundedProgress}%` }}
        />
      </div>

      {/* Floating sticky bar aligned with the container as the user scrolls down */}
      <div
        aria-hidden="true"
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-40 px-4 pointer-events-none transition-opacity duration-300 ${
          progress > 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full h-[3px] rounded-full overflow-hidden bg-[#DDD2BF]/60 backdrop-blur-xs shadow-xs">
          <div
            className="h-full bg-gradient-to-r from-[#24493A] via-[#D9633B] to-[#D9633B] transition-[width] duration-150 ease-out rounded-full"
            style={{ width: `${roundedProgress}%` }}
          />
        </div>
      </div>
    </>
  );
};
