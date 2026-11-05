import React, { useState, useEffect } from 'react';

interface MediaFrameProps {
  aspectRatio: '4/3' | '3/2' | '16/9';
  imageSrc: string;
  videoSrc?: string;
  altText: string;
  isHero?: boolean;
  badge?: React.ReactNode;
  fallbackVariant?: 'hero' | 'timeline' | 'box';
  className?: string;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  aspectRatio,
  imageSrc,
  videoSrc,
  altText,
  isHero = false,
  badge,
  fallbackVariant = 'hero',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '3/2'
      ? 'aspect-[3/2]'
      : 'aspect-[16/9]';

  const dimensions =
    aspectRatio === '4/3'
      ? { width: 1200, height: 900 }
      : aspectRatio === '3/2'
      ? { width: 1200, height: 800 }
      : { width: 1200, height: 675 };

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border border-[#DDD2BF]/60 shadow-sm select-none bg-[#F1E8D8] ${aspectClass} ${className}`}
    >
      {/* If file failed to load, show the original warm gradient placeholder */}
      {hasError ? (
        <div
          className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
            fallbackVariant === 'hero'
              ? 'bg-gradient-to-br from-[#24493A] via-[#854D38] to-[#F1E8D8]'
              : 'bg-gradient-to-tr from-[#314E40] via-[#D9633B]/80 to-[#EFE7DA]'
          } relative flex items-center justify-center overflow-hidden`}
          role="img"
          aria-label={altText}
        >
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 text-white/90">
            <p
              className="text-xs uppercase tracking-widest text-[#FBF7F0]/85 font-medium"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {altText}
            </p>
          </div>
        </div>
      ) : videoSrc && !prefersReducedMotion ? (
        /* Video playback in hero frame: muted, looping, autoplay, playsInline, with image poster */
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={imageSrc}
          width={dimensions.width}
          height={dimensions.height}
          onError={() => setHasError(true)}
          aria-label={altText}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback image if video element cannot play source */}
          <img
            src={imageSrc}
            alt={altText}
            width={dimensions.width}
            height={dimensions.height}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </video>
      ) : (
        /* Standard Image (with lazy loading if not hero, eager for hero) */
        <img
          src={imageSrc}
          alt={altText}
          width={dimensions.width}
          height={dimensions.height}
          loading={isHero ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={isHero ? 'high' : 'auto'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      )}

      {/* Floating Badge (e.g. Hero badge) */}
      {badge && <div className="absolute bottom-4 left-4 z-20">{badge}</div>}
    </div>
  );
};
