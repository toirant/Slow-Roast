import React from 'react';
import { X, Coffee, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { getSampleBoxDetails } from '../utils/coffeePlan.ts';

interface SampleBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleBoxModal: React.FC<SampleBoxModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sample = getSampleBoxDetails();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-[#FBF7F0] rounded-2xl shadow-2xl border border-[#DDD2BF] overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close sample box preview"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F1E8D8] text-[#2B2B28] flex items-center justify-center hover:bg-[#DDD2BF] cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9633B] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curator's Preview</span>
        </div>

        <h2
          id="sample-modal-title"
          className="text-2xl sm:text-3xl font-semibold text-[#2B2B28] mb-1"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          What's in {sample.edition}
        </h2>
        <p className="text-sm text-[#6F6A60] mb-6">
          Theme: <strong className="text-[#2B2B28] font-medium">{sample.theme}</strong>. Two coffees roasted within 48 hours of dispatch.
        </p>

        <div className="space-y-4 mb-6">
          {sample.coffees.map((coffee, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F1E8D8]/70 border border-[#DDD2BF]/60 flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-full bg-[#24493A] text-white flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-bold text-[#2B2B28] text-sm sm:text-base">
                    {coffee.name}
                  </h4>
                  <span className="text-xs text-[#6F6A60] font-mono">{coffee.altitude}</span>
                </div>
                <p className="text-xs text-[#6F6A60] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D9633B]" />
                  {coffee.origin} • {coffee.process}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {coffee.notes.map((note, nIdx) => (
                    <span
                      key={nIdx}
                      className="px-2 py-0.5 rounded-full text-xs bg-[#FBF7F0] text-[#24493A] border border-[#DDD2BF] font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#24493A]/5 border border-[#24493A]/15 mb-6 space-y-2">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-[#24493A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#2B2B28]">
              <strong>Technique Booklet:</strong> {sample.includedGuide}
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#D9633B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#2B2B28]">
              <strong>Farmer Spotlight:</strong> {sample.storyCard}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#24493A] text-white font-medium hover:bg-[#1B372C] transition-colors cursor-pointer text-sm"
        >
          Got it, close preview
        </button>
      </div>
    </div>
  );
};
