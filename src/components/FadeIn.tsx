import React from 'react';
import { useInView } from '../hooks/useInView.ts';

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: '500' | '700' | '1000';
  direction?: 'up' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  duration = '700',
  direction = 'up',
  style,
  ...props
}) => {
  const { ref, isInView } = useInView<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -25px 0px',
    triggerOnce: true,
  });

  const durationClass =
    duration === '500'
      ? 'duration-500'
      : duration === '1000'
      ? 'duration-1000'
      : 'duration-700';

  const transformInitial = direction === 'up' ? 'translate-y-5' : '';

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transitionDelay: delay ? `${delay}ms` : style?.transitionDelay,
      }}
      className={`transition-all ${durationClass} ease-out will-change-[opacity,transform] ${
        isInView ? 'opacity-100 translate-y-0' : `opacity-0 ${transformInitial}`
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
