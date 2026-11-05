import React, { useState } from 'react';
import { X, Check, Flame, Sliders, ShieldCheck } from 'lucide-react';
import {
  RoastLevel,
  BrewMethod,
  calculateSubscriptionPrice,
  getBrewRecommendation,
} from '../utils/coffeePlan.ts';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoast?: RoastLevel;
  initialMethod?: BrewMethod;
  onJoined?: (roast: RoastLevel, method: BrewMethod) => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  initialRoast = 'medium',
  initialMethod = 'pour over',
  onJoined,
}) => {
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel>(initialRoast);
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod>(initialMethod);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync state if initial props change
  React.useEffect(() => {
    if (isOpen) {
      setSelectedRoast(initialRoast);
      setSelectedMethod(initialMethod);
    }
  }, [isOpen, initialRoast, initialMethod]);

  if (!isOpen) return null;

  const price = calculateSubscriptionPrice();
  const recommendation = getBrewRecommendation(selectedMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onJoined) {
      onJoined(selectedRoast, selectedMethod);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-started-title"
    >
      <div className="relative w-full max-w-lg bg-[#FBF7F0] rounded-2xl shadow-2xl border border-[#DDD2BF] overflow-hidden p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleReset}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F1E8D8] text-[#2B2B28] flex items-center justify-center hover:bg-[#DDD2BF] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D9633B] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Customize Your Box</span>
            </div>
            <h2
              id="get-started-title"
              className="text-2xl sm:text-3xl font-semibold text-[#2B2B28] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Start Your First Box
            </h2>
            <p className="text-sm text-[#6F6A60] mb-6">
              Pick your profile to receive two small-batch coffees and matched brewing instructions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Roast level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-2">
                  1. Select Roast Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'medium', 'dark'] as RoastLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedRoast(level)}
                      className={`py-2.5 px-3 rounded-xl border text-sm capitalize font-medium transition-all cursor-pointer text-center ${
                        selectedRoast === level
                          ? 'border-[#24493A] bg-[#24493A] text-white shadow-xs'
                          : 'border-[#DDD2BF] bg-[#F1E8D8] text-[#2B2B28] hover:border-[#24493A]/50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Brew method */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2B28] mb-2">
                  2. Your Brew Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pour over', 'french press', 'espresso'] as BrewMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`py-2.5 px-2 rounded-xl border text-xs sm:text-sm capitalize font-medium transition-all cursor-pointer text-center ${
                        selectedMethod === method
                          ? 'border-[#24493A] bg-[#24493A] text-white shadow-xs'
                          : 'border-[#DDD2BF] bg-[#F1E8D8] text-[#2B2B28] hover:border-[#24493A]/50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation card */}
              <div className="p-3.5 rounded-xl bg-[#F1E8D8] border border-[#DDD2BF] text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#24493A] font-semibold">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Matched Guide & Profile</span>
                </div>
                <p className="text-[#2B2B28]">
                  <strong>Guide:</strong> {recommendation.brewGuideTitle}
                </p>
                <p className="text-[#6F6A60]">
                  <strong>Recommended Ratio:</strong> {recommendation.waterRatio}
                </p>
              </div>

              {/* Price summary */}
              <div className="p-3.5 rounded-xl bg-white/70 border border-[#DDD2BF] flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#2B2B28]">First Box Total</div>
                  <div className="text-xs text-[#24493A] font-medium">Free First Month Shipping ($5 saved)</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#2B2B28] font-mono">${price.totalFirstMonth}</span>
                  <span className="text-xs text-[#6F6A60] block">2 full 250g bags</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#D9633B] hover:bg-[#BF522E] text-white font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-base"
              >
                Confirm Membership & Order Box
              </button>

              <p className="text-center text-xs text-[#6F6A60] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#24493A]" />
                Cancel, pause, or switch grind level any time.
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#24493A] text-white flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3
              className="text-2xl font-bold text-[#2B2B28] mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Welcome to the Club!
            </h3>
            <p className="text-[#6F6A60] text-sm max-w-sm mx-auto mb-6">
              Your first box is scheduled for Monday's roast. We've locked in your preference for <strong>{selectedRoast} roast</strong> and our <strong>{selectedMethod}</strong> technique guide.
            </p>
            <button
              onClick={handleReset}
              className="px-7 py-2.5 rounded-full bg-[#24493A] text-white font-medium hover:bg-[#1B372C] transition-colors cursor-pointer text-sm"
            >
              Back to Landing Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
