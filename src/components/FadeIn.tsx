/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

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
  direction = 'none',
  style,
  ...props
}) => {
  // Ensure all content is immediately visible without hiding behind scroll triggers
  return (
    <div
      style={{
        ...style,
      }}
      className={`opacity-100 transition-opacity motion-reduce:transition-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
