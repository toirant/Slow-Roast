/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ToastVariant = 'success' | 'coffee' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
  timestamp: number;
}

export function createToast(
  title: string,
  message: string,
  variant: ToastVariant = 'success',
  durationMs: number = 4500
): ToastItem {
  return {
    id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    message,
    variant,
    durationMs,
    timestamp: Date.now(),
  };
}

export function addToast(
  currentToasts: ToastItem[],
  newToast: ToastItem,
  maxToasts: number = 3
): ToastItem[] {
  // Prepend new toast and keep only up to maxToasts
  return [newToast, ...currentToasts].slice(0, maxToasts);
}

export function removeToast(currentToasts: ToastItem[], id: string): ToastItem[] {
  return currentToasts.filter((t) => t.id !== id);
}

export function isToastExpired(toast: ToastItem, now: number = Date.now()): boolean {
  if (!toast.durationMs) return false;
  return now - toast.timestamp >= toast.durationMs;
}
