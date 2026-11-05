import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl bg-[#F1E8D8] p-5 border border-[#DDD2BF]/40 shadow-xs flex flex-col justify-start transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <div
        className="w-10 h-10 rounded-full bg-[#24493A] text-white flex items-center justify-center shrink-0 mb-3.5 shadow-xs"
        aria-hidden="true"
      >
        <Icon className="w-5 h-5 text-white stroke-[2]" />
      </div>
      <h3 className="font-bold text-[#2B2B28] text-base leading-snug mb-1">
        {title}
      </h3>
      <p className="text-[#6F6A60] text-sm leading-normal line-clamp-1">
        {description}
      </p>
    </div>
  );
};
