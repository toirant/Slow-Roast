/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`opacity-100 transition-opacity motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
};
