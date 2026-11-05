import React from 'react';

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      role="separator"
      aria-label="Section divider"
      className={`py-10 flex items-center justify-center gap-2 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#D9633B]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#D9633B]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#D9633B]" />
    </div>
  );
};
