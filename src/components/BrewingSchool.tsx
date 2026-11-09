/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Coffee,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Eye,
  Scale,
  Thermometer,
  Clock,
  Flame,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Check,
} from 'lucide-react';
import {
  BrewingSchoolMethodId,
  BREWING_SCHOOL_GUIDES,
  calculateCustomBrewRecipe,
  getAllBrewingSchoolGuides,
  BrewingMethodGuide,
} from '../utils/brewingSchool.ts';

interface BrewingSchoolProps {
  onPracticeWithTimer?: (methodId: string) => void;
  onSelectMethodForBox?: (methodId: string) => void;
  initialMethodId?: BrewingSchoolMethodId;
}

export function BrewingSchool({
  onPracticeWithTimer,
  onSelectMethodForBox,
  initialMethodId = 'pour-over',
}: BrewingSchoolProps) {
  const [activeMethodId, setActiveMethodId] = useState<BrewingSchoolMethodId>(initialMethodId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedServingIndex, setSelectedServingIndex] = useState<number>(1); // default to standard middle serving
  const [expandedTroubleId, setExpandedTroubleId] = useState<number | null>(null);
  const [showEquipment, setShowEquipment] = useState<boolean>(false);

  const guides = getAllBrewingSchoolGuides();
  const currentGuide: BrewingMethodGuide = BREWING_SCHOOL_GUIDES[activeMethodId] || BREWING_SCHOOL_GUIDES['pour-over'];

  const currentServing = currentGuide.servings[selectedServingIndex] || currentGuide.servings[0];
  const recipe = calculateCustomBrewRecipe(activeMethodId, currentServing.coffeeGrams);

  const currentStep = currentGuide.steps[currentStepIndex] || currentGuide.steps[0];
  const totalSteps = currentGuide.steps.length;

  const handleMethodChange = (methodId: BrewingSchoolMethodId) => {
    setActiveMethodId(methodId);
    setCurrentStepIndex(0);
    setSelectedServingIndex(1);
    setExpandedTroubleId(null);
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const toggleTrouble = (idx: number) => {
    setExpandedTroubleId(expandedTroubleId === idx ? null : idx);
  };

  // Compute target step grams for display
  const getStepWaterTarget = (fraction: number) => {
    if (fraction === 0) return null;
    return `${Math.round(recipe.waterGrams * fraction)}g`;
  };

  return (
    <section
      id="brewing-school-section"
      aria-labelledby="brewing-school-heading"
      className="w-full rounded-2xl bg-[#FBF7F0] border border-[#DDD2BF] p-5 sm:p-7 shadow-xs relative overflow-hidden"
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-[#F1E8D8]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-left mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold tracking-wider uppercase">
            <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Masterclass • Brewing School</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-[#6F6A60] bg-[#F1E8D8] px-2.5 py-1 rounded-md border border-[#DDD2BF]/60">
            <Clock className="w-3.5 h-3.5 text-[#D9633B]" aria-hidden="true" />
            <span>{currentGuide.totalTime}</span>
          </div>
        </div>

        <h2
          id="brewing-school-heading"
          className="text-2xl sm:text-[32px] leading-tight font-semibold text-[#2B2B28] mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Home Barista Brewing School
        </h2>

        <p className="text-sm sm:text-[15px] leading-relaxed text-[#6F6A60]">
          Unlock café-quality extraction at home. Explore interactive step-by-step master guides with dynamic water ratios, equipment essentials, and roaster-tested pro tips.
        </p>
      </div>

      {/* Method Selector Tabs */}
      <div
        className="grid grid-cols-3 gap-2 mb-6"
        role="tablist"
        aria-label="Brewing method guides"
      >
        {guides.map((guide) => {
          const isSelected = activeMethodId === guide.id;
          return (
            <button
              key={guide.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="brewing-school-content"
              onClick={() => handleMethodChange(guide.id)}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-[#24493A] text-white border-[#24493A] shadow-xs'
                  : 'bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EAE0CD] border-[#DDD2BF]/70'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {guide.id === 'pour-over' ? (
                  <Coffee className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#24493A]'}`} />
                ) : guide.id === 'french-press' ? (
                  <Layers className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#D9633B]'}`} />
                ) : (
                  <Sparkles className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#E69A3B]'}`} />
                )}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#DDD2BF]/80 text-[#6F6A60]'
                  }`}
                >
                  {guide.difficulty}
                </span>
              </div>

              <div>
                <span
                  className="font-bold text-xs sm:text-sm block"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {guide.name}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] truncate block ${
                    isSelected ? 'text-[#DDD2BF]' : 'text-[#6F6A60]'
                  }`}
                >
                  {guide.subtitle.split('/')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Method Overview & Flavor Tagline */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#F1E8D8]/70 border border-[#DDD2BF] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2B2B28] text-sm">
              {currentGuide.name} ({currentGuide.ratioDisplay} Ratio)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#24493A]/10 text-[#24493A] text-[10px] font-semibold border border-[#24493A]/20">
              <Flame className="w-2.5 h-2.5" />
              <span>{currentGuide.idealRoast}</span>
            </span>
          </div>
          <p className="text-[#6F6A60] leading-snug">
            {currentGuide.tagline}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEquipment(!showEquipment)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#24493A] hover:text-[#183127] cursor-pointer shrink-0 self-start sm:self-auto bg-white/70 px-2.5 py-1.5 rounded-lg border border-[#DDD2BF]/80"
        >
          <span>{showEquipment ? 'Hide Gear' : 'View Gear Setup'}</span>
          {showEquipment ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Equipment Checklist Dropdown */}
      {showEquipment && (
        <div className="p-4 rounded-xl bg-white border border-[#DDD2BF] mb-5 animate-fadeIn">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6F6A60] mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#24493A]" />
            <span>Recommended Gear Checklist:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2B2B28]">
            {currentGuide.equipment.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24493A]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Serving Size Scaler & Recipe Specs Bar */}
      <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-white border border-[#DDD2BF] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-[#DDD2BF]/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6F6A60] uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#24493A]" />
            <span>Serving Size Scaler:</span>
          </div>

          <div className="inline-flex rounded-lg bg-[#F1E8D8] p-1 border border-[#DDD2BF]/70 text-xs">
            {currentGuide.servings.map((serving, idx) => (
              <button
                key={serving.label}
                type="button"
                onClick={() => setSelectedServingIndex(idx)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  selectedServingIndex === idx
                    ? 'bg-[#24493A] text-white shadow-2xs'
                    : 'text-[#6F6A60] hover:text-[#2B2B28]'
                }`}
              >
                {serving.label.split(' ')[0]} {serving.label.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Spec Metrics */}
        <div className="grid grid-cols-2 min-[460px]:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/60">
            <span className="text-[10px] text-[#6F6A60] block font-medium">Coffee Dose</span>
            <span className="font-mono font-bold text-[#2B2B28] text-sm">
              {recipe.coffeeGrams}g
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/60">
            <span className="text-[10px] text-[#6F6A60] block font-medium">Total Water</span>
            <span className="font-mono font-bold text-[#D9633B] text-sm">
              {recipe.waterGrams}g
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/60">
            <span className="text-[10px] text-[#6F6A60] block font-medium">Grind Size</span>
            <span className="font-bold text-[#2B2B28] text-xs truncate block">
              {currentGuide.grindSize}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#FBF7F0] border border-[#DDD2BF]/60">
            <span className="text-[10px] text-[#6F6A60] block font-medium">Water Temp</span>
            <span className="font-mono font-bold text-[#24493A] text-xs">
              {currentGuide.waterTemp.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Guide Card */}
      <div
        id="brewing-school-content"
        className="rounded-xl border border-[#DDD2BF] bg-[#FDFBF7] p-5 sm:p-6 shadow-2xs mb-5"
      >
        {/* Step Progress Tracker & Scrubber */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D9633B] uppercase tracking-wider">
              Step {currentStep.stepNumber} of {totalSteps}
            </span>
            <span className="text-xs text-[#6F6A60] font-medium">
              • {currentStep.timeRange}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {currentGuide.steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Jump to step ${idx + 1}`}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-6 h-6 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  currentStepIndex === idx
                    ? 'bg-[#24493A] text-white shadow-2xs scale-110'
                    : currentStepIndex > idx
                    ? 'bg-[#24493A]/20 text-[#24493A] hover:bg-[#24493A]/30'
                    : 'bg-[#DDD2BF]/60 text-[#6F6A60] hover:bg-[#DDD2BF]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Step Title & Target Grams */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
            <h3
              className="text-lg sm:text-xl font-semibold text-[#2B2B28]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {currentStep.title}
            </h3>

            {getStepWaterTarget(currentStep.targetWaterFraction) && (
              <span className="text-xs font-mono font-semibold text-[#D9633B] bg-[#D9633B]/10 px-2.5 py-0.5 rounded-full border border-[#D9633B]/20 shrink-0 self-start sm:self-auto">
                Target: {getStepWaterTarget(currentStep.targetWaterFraction)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-[#2B2B28]">
            {currentStep.action}
          </p>
        </div>

        {/* Roaster Pro-Tip Box */}
        <div className="p-3.5 rounded-xl bg-[#F1E8D8]/60 border border-[#DDD2BF]/80 mb-3.5 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-[#E69A3B] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-[#2B2B28]">Roaster’s Pro Tip: </span>
            <span className="text-[#5F5A50] leading-relaxed">{currentStep.proTip}</span>
          </div>
        </div>

        {/* Sensory Cue Box */}
        <div className="p-3 rounded-lg bg-white border border-[#DDD2BF]/60 mb-5 flex items-start gap-2.5 text-xs">
          <Eye className="w-3.5 h-3.5 text-[#24493A] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-[11px] text-[#6F6A60]">
            <strong className="text-[#2B2B28]">Sensory Cue:</strong> {currentStep.sensoryCue}
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-[#DDD2BF]/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-[#F1E8D8] text-[#6F6A60]'
                  : 'bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EAE0CD] border border-[#DDD2BF]'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors cursor-pointer"
              title="Reset to step 1"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden min-[400px]:inline">Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex < totalSteps - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#24493A] text-white font-semibold hover:bg-[#1A382C] transition-colors shadow-2xs cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24493A]/10 text-[#24493A] font-semibold border border-[#24493A]/20">
                <Check className="w-3.5 h-3.5 text-[#24493A]" />
                <span>Guide Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Troubleshooting Accordion */}
      <div className="mb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6F6A60] mb-2.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#D9633B]" />
          <span>Troubleshooting & Taste Calibration:</span>
        </h4>

        <div className="space-y-2">
          {currentGuide.troubleshooting.map((item, idx) => {
            const isExpanded = expandedTroubleId === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#DDD2BF] bg-[#F1E8D8]/40 overflow-hidden text-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleTrouble(idx)}
                  className="w-full p-3 text-left font-semibold text-[#2B2B28] hover:bg-[#F1E8D8]/70 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9633B]" />
                    <span>{item.problem}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#6F6A60] shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-[#6F6A60] shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-[#DDD2BF]/50 bg-white/70 space-y-1.5 animate-fadeIn">
                    <p className="text-[#6F6A60] text-[11px]">
                      <strong className="text-[#2B2B28]">Why it happens:</strong> {item.diagnosis}
                    </p>
                    <p className="text-[#24493A] font-medium text-[11px] bg-[#24493A]/10 p-2 rounded-lg border border-[#24493A]/20">
                      <strong>Barista Fix:</strong> {item.fix}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer: Practice with Timer or Tune Box */}
      <div className="pt-4 border-t border-[#DDD2BF]/60 flex flex-col min-[480px]:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-center min-[480px]:text-left">
          <span className="font-semibold text-[#2B2B28] block">
            Ready to test your {currentGuide.name} technique?
          </span>
          <span className="text-[#6F6A60] text-[11px]">
            Follow along in real time with audio chimes and step timers.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onPracticeWithTimer && (
            <button
              type="button"
              onClick={() => onPracticeWithTimer(activeMethodId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#24493A] text-white font-semibold hover:bg-[#1A382C] transition-colors shadow-2xs cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Practice with Live Timer</span>
            </button>
          )}

          {onSelectMethodForBox && (
            <button
              type="button"
              onClick={() => onSelectMethodForBox(activeMethodId)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-[#2B2B28] font-semibold border border-[#DDD2BF] hover:bg-[#EAE0CD] transition-colors cursor-pointer"
            >
              <span>Pair Box to {currentGuide.name}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
