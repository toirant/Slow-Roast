import React from 'react';

interface ImagePlaceholderProps {
  aspectRatio: '4/3' | '16/9';
  variant: 'hero' | 'timeline';
  badge?: React.ReactNode;
  altText: string;
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  aspectRatio,
  variant,
  badge,
  altText,
  className = '',
}) => {
  // CSS gradient placeholders with comment marking where real image will go
  const isHero = variant === 'hero';

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border border-[#DDD2BF]/60 shadow-inner select-none ${
        aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-[16/9]'
      } ${className}`}
      role="img"
      aria-label={altText}
    >
      {/* REAL IMAGE PLACEHOLDER: Replace this inner gradient container with <img src="..." alt="..." /> */}
      <div
        className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
          isHero
            ? 'bg-gradient-to-br from-[#24493A] via-[#854D38] to-[#F1E8D8]'
            : 'bg-gradient-to-tr from-[#314E40] via-[#D9633B]/80 to-[#EFE7DA]'
        } relative flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle decorative atmospheric shapes simulating coffee steam / terroir layers */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[#F1E8D8] blur-2xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#D9633B] blur-3xl" />
        </div>

        {/* Minimalist coffee craft geometric illustration overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 text-white/90">
          <div className="w-16 h-16 rounded-full border border-white/25 flex items-center justify-center mb-2 backdrop-blur-xs bg-black/10 shadow-sm">
            {isHero ? (
              <svg className="w-8 h-8 text-[#F1E8D8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                <line x1="6" y1="2" x2="6" y2="4" />
                <line x1="10" y1="2" x2="10" y2="4" />
                <line x1="14" y1="2" x2="14" y2="4" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-[#F1E8D8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
                <path d="M7 3l2 2" />
                <path d="M17 3l-2 2" />
              </svg>
            )}
          </div>
          <p
            className="text-xs uppercase tracking-widest text-[#FBF7F0]/85 font-medium"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {isHero ? 'Fresh Crop • Direct Trade Harvest' : 'Pour Over & Immersion Method Guide'}
          </p>
        </div>

        {/* Optional floating badge (e.g. bottom left for Hero) */}
        {badge && (
          <div className="absolute bottom-4 left-4 z-20">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
};
