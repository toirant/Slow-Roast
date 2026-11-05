/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates reading scroll progress percentage (0 - 100).
 *
 * @param scrollTop Current vertical scroll offset (pixels)
 * @param scrollHeight Total scrollable height of the document or container (pixels)
 * @param clientHeight Visible viewport height (pixels)
 * @returns Progress percentage clamped between 0 and 100 rounded to 1 decimal place.
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return 0;

  const rawPercent = (scrollTop / maxScroll) * 100;
  const clamped = Math.min(100, Math.max(0, rawPercent));
  return Math.round(clamped * 10) / 10;
}
