import React from 'react';

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center bg-transparent border-[1.5px] border-[#24493A] text-[#24493A] font-medium rounded-full px-7 py-3 cursor-pointer hover:bg-[#24493A] hover:text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#24493A]/40 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
