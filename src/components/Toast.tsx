/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Coffee, Sparkles, X } from 'lucide-react';
import { ToastItem } from '../utils/toast.ts';

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.durationMs) return;

    const intervalTime = 50;
    const step = (intervalTime / toast.durationMs) * 100;

    const interval = setInterval(() => {
      if (!isHovered) {
        setProgress((prev) => {
          const next = prev - step;
          return next > 0 ? next : 0;
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [toast.id, toast.durationMs, isHovered]);

  useEffect(() => {
    if (progress <= 0) {
      onDismiss(toast.id);
    }
  }, [progress, toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.variant) {
      case 'coffee':
        return <Coffee className="w-4 h-4 text-[#F1E8D8]" />;
      case 'info':
        return <Sparkles className="w-4 h-4 text-[#D9633B]" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#F1E8D8]" />;
    }
  };

  const getIconBg = () => {
    switch (toast.variant) {
      case 'info':
        return 'bg-[#D9633B]/15 text-[#D9633B]';
      case 'coffee':
      case 'success':
      default:
        return 'bg-[#24493A] text-white';
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full max-w-sm rounded-2xl bg-[#FBF7F0] border border-[#DDD2BF] shadow-2xl p-4 sm:p-4.5 transition-all duration-300 ease-out transform translate-y-0 opacity-100 hover:shadow-2xl overflow-hidden ring-1 ring-black/5"
    >
      <div className="flex items-start gap-3">
        {/* Leading icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${getIconBg()}`}
        >
          {getIcon()}
        </div>

        {/* Text copy */}
        <div className="flex-1 min-w-0 pr-1">
          <h4
            className="text-[15px] sm:text-[16px] font-semibold text-[#2B2B28] leading-snug mb-0.5"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {toast.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#6F6A60] leading-relaxed">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="w-7 h-7 -mr-1 -mt-1 rounded-full flex items-center justify-center text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtle bottom progress line */}
      {toast.durationMs && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DDD2BF]/40 overflow-hidden">
          <div
            className="h-full bg-[#D9633B] transition-all duration-100 ease-linear rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-auto"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
