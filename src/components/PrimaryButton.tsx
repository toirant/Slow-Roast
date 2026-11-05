import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon = true,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`group inline-flex items-center justify-center bg-[#D9633B] hover:bg-[#BF522E] text-white font-medium rounded-full px-7 py-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#D9633B]/40 focus:ring-offset-2 ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </button>
  );
};
