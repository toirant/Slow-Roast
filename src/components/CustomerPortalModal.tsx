/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, RefreshCw, Calendar, Pause, Play, Trash2, CheckCircle2, AlertCircle, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { transitionSubscriptionStatus } from '../utils/commerceLogic.ts';

export function CustomerPortalModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { confirmedOrder, setConfirmedOrder } = useCart();
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  // Use confirmedOrder or fallback demo subscription
  const currentStatus = confirmedOrder?.subscriptionStatus || 'active';
  const orderId = confirmedOrder?.orderId || 'SR-DEMO-PORTAL';
  const planTitle = confirmedOrder?.items[0]?.title || "The Roaster's Choice Club";
  const planGrind = confirmedOrder?.items[0]?.grind || 'Whole Bean';
  const nextRoastDate = confirmedOrder?.nextRoastDate || 'Upcoming Monday';

  const handleAction = async (action: 'skip' | 'pause' | 'resume' | 'cancel') => {
    setIsUpdating(true);
    setFeedbackMessage('');

    try {
      // Call server portal management endpoint
      const res = await fetch('/api/portal/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await res.json();
      const transition = transitionSubscriptionStatus(currentStatus, action);

      if (confirmedOrder) {
        setConfirmedOrder({
          ...confirmedOrder,
          subscriptionStatus: transition.newStatus,
        });
      }

      setFeedbackMessage(data.message || transition.message);
    } catch {
      const transition = transitionSubscriptionStatus(currentStatus, action);
      if (confirmedOrder) {
        setConfirmedOrder({
          ...confirmedOrder,
          subscriptionStatus: transition.newStatus,
        });
      }
      setFeedbackMessage(transition.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-lg bg-[#FBF7F0] rounded-3xl border border-[#DDD2BF] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD2BF] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#24493A] text-[#FBF7F0] flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-[#E69A3B]" />
            </div>
            <div>
              <h2
                id="portal-modal-title"
                className="text-lg font-bold text-[#2B2B28]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Customer Subscription Portal
              </h2>
              <span className="text-xs text-[#6F6A60]">Self-Service Coffee Delivery Management</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close portal"
            className="p-2 rounded-xl text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Active Plan Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDD2BF] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9633B]">
                  Active Membership
                </span>
                <h3
                  className="text-xl font-bold text-[#2B2B28] mt-0.5"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {planTitle}
                </h3>
                <p className="text-xs text-[#6F6A60]">Grind profile: {planGrind} • 2 Bags / shipment</p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  currentStatus === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentStatus === 'paused'
                    ? 'bg-amber-100 text-amber-800'
                    : currentStatus === 'skipped_next'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {currentStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="pt-3 border-t border-[#DDD2BF]/40 flex items-center justify-between text-xs text-[#6F6A60]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#24493A]" />
                Next roast batch: <strong>{nextRoastDate}</strong>
              </span>
              <span>Ref: {orderId}</span>
            </div>
          </div>

          {feedbackMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6A60] block mb-1">
              Subscription Controls
            </span>

            {/* Skip Next Month */}
            <button
              type="button"
              disabled={isUpdating || currentStatus === 'cancelled'}
              onClick={() => handleAction('skip')}
              className="w-full p-3.5 rounded-xl border border-[#DDD2BF] bg-white hover:bg-[#FBF7F0] text-xs font-bold text-[#2B2B28] flex items-center justify-between transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D9633B]" />
                <span>Skip Upcoming Month</span>
              </span>
              <span className="text-[11px] text-[#6F6A60]">Skip next box, resume after</span>
            </button>

            {/* Pause / Resume */}
            {currentStatus === 'paused' ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleAction('resume')}
                className="w-full p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-900 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-700" />
                  <span>Resume Subscription</span>
                </span>
                <span className="text-[11px] text-emerald-800">Reactivate Monday roast</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isUpdating || currentStatus === 'cancelled'}
                onClick={() => handleAction('pause')}
                className="w-full p-3.5 rounded-xl border border-[#DDD2BF] bg-white hover:bg-[#FBF7F0] text-xs font-bold text-[#2B2B28] flex items-center justify-between transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Pause className="w-4 h-4 text-[#E69A3B]" />
                  <span>Pause Deliveries</span>
                </span>
                <span className="text-[11px] text-[#6F6A60]">Traveling or surplus coffee</span>
              </button>
            )}

            {/* Cancel */}
            {currentStatus !== 'cancelled' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleAction('cancel')}
                className="w-full p-3.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-xs font-bold text-red-700 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Cancel Subscription</span>
                </span>
                <span className="text-[11px] text-red-600">Zero fees or penalty</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
