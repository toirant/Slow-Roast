/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Coffee,
  Sparkles,
  CheckCircle2,
  Timer as TimerIcon,
  Flame,
  Scale,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import {
  BREW_METHODS,
  formatTime,
  getStepAtTime,
  BrewMethodConfig,
  calculateTotalSeconds,
} from '../utils/brewTimer.ts';
import { playChime } from '../utils/audioChime.ts';

interface BrewTimerProps {
  onJoinClick?: () => void;
  initialMethodId?: string;
}

export function BrewTimer({ onJoinClick, initialMethodId = 'pour-over' }: BrewTimerProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(initialMethodId);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const currentMethod: BrewMethodConfig = BREW_METHODS[selectedMethodId] || BREW_METHODS['pour-over'];
  const totalSeconds = calculateTotalSeconds(currentMethod.steps);

  const progress = getStepAtTime(currentMethod.steps, elapsedSeconds);
  const prevStepIndexRef = useRef<number>(progress.stepIndex);

  // Sound chime when moving to the next step
  useEffect(() => {
    if (isRunning && soundEnabled) {
      if (progress.isComplete) {
        playChime('complete');
      } else if (progress.stepIndex !== prevStepIndexRef.current) {
        playChime('step');
      }
    }
    prevStepIndexRef.current = progress.stepIndex;
  }, [progress.stepIndex, progress.isComplete, isRunning, soundEnabled]);

  // Timer interval hook
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (isRunning && !progress.isComplete) {
      intervalId = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= totalSeconds) {
            setIsRunning(false);
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, totalSeconds, progress.isComplete]);

  // Method change resets timer
  const handleSelectMethod = (methodId: string) => {
    setSelectedMethodId(methodId);
    setElapsedSeconds(0);
    setIsRunning(false);
    prevStepIndexRef.current = 0;
  };

  const handleTogglePlay = () => {
    if (progress.isComplete) {
      setElapsedSeconds(0);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    prevStepIndexRef.current = 0;
  };

  const handleSkipNext = () => {
    if (progress.isComplete) return;
    const nextStepIndex = progress.stepIndex + 1;
    if (nextStepIndex < currentMethod.steps.length) {
      // jump elapsed time to the start of the next step
      let accumulated = 0;
      for (let i = 0; i < nextStepIndex; i++) {
        accumulated += currentMethod.steps[i].durationSeconds;
      }
      setElapsedSeconds(accumulated);
      if (soundEnabled) playChime('step');
    } else {
      setElapsedSeconds(totalSeconds);
      setIsRunning(false);
      if (soundEnabled) playChime('complete');
    }
  };

  const handleSkipPrev = () => {
    if (progress.stepIndex > 0) {
      // If we are more than 2 seconds into the current step, jump back to start of current step
      if (progress.stepElapsed > 2) {
        let accumulated = 0;
        for (let i = 0; i < progress.stepIndex; i++) {
          accumulated += currentMethod.steps[i].durationSeconds;
        }
        setElapsedSeconds(accumulated);
      } else {
        // jump back to previous step
        let accumulated = 0;
        for (let i = 0; i < progress.stepIndex - 1; i++) {
          accumulated += currentMethod.steps[i].durationSeconds;
        }
        setElapsedSeconds(accumulated);
      }
    } else {
      setElapsedSeconds(0);
    }
  };

  return (
    <section id="brew-timer-section" aria-labelledby="brew-timer-heading" className="w-full">
      {/* Header */}
      <div className="text-center mb-6 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold tracking-wider uppercase mb-3">
          <TimerIcon className="w-3.5 h-3.5" />
          <span>Interactive Companion</span>
        </div>

        <h2
          id="brew-timer-heading"
          className="text-3xl sm:text-[38px] leading-tight font-semibold text-[#2B2B28] mb-3"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Built-in Brew Timer
        </h2>

        <p className="text-[16px] sm:text-[17px] text-[#6F6A60] max-w-md mx-auto leading-relaxed">
          Follow along in real time with the step-by-step technique guides shipped in every monthly box.
        </p>
      </div>

      {/* Brewing Method Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6" role="tablist" aria-label="Brewing methods">
        {Object.values(BREW_METHODS).map((method) => {
          const isSelected = method.id === selectedMethodId;
          return (
            <button
              key={method.id}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => handleSelectMethod(method.id)}
              className={`p-3 rounded-xl text-center transition-all cursor-pointer border text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#24493A] text-white border-[#24493A] shadow-sm ring-2 ring-[#24493A]/20'
                  : 'bg-[#F1E8D8] text-[#2B2B28] border-[#DDD2BF] hover:bg-[#EBE0CF]'
              }`}
            >
              <div className="font-semibold text-sm leading-tight mb-1">{method.name}</div>
              <div
                className={`text-[11px] leading-tight ${
                  isSelected ? 'text-[#F1E8D8]/80' : 'text-[#6F6A60]'
                }`}
              >
                {method.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recipe Parameters Specs Bar */}
      <div className="rounded-xl bg-[#F1E8D8] border border-[#DDD2BF] p-3.5 mb-6 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="flex flex-col items-center">
          <span className="text-[#6F6A60] flex items-center gap-1 font-medium mb-0.5">
            <Scale className="w-3.5 h-3.5 text-[#24493A]" /> Ratio
          </span>
          <span className="font-bold text-[#2B2B28] truncate max-w-full">
            {currentMethod.coffeeGrams}g : {currentMethod.waterGrams}g
          </span>
        </div>
        <div className="flex flex-col items-center border-x border-[#DDD2BF]/80">
          <span className="text-[#6F6A60] flex items-center gap-1 font-medium mb-0.5">
            <Gauge className="w-3.5 h-3.5 text-[#D9633B]" /> Grind
          </span>
          <span className="font-bold text-[#2B2B28] truncate max-w-full">
            {currentMethod.grind.split(' ')[0]}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[#6F6A60] flex items-center gap-1 font-medium mb-0.5">
            <Flame className="w-3.5 h-3.5 text-[#D9633B]" /> Water Temp
          </span>
          <span className="font-bold text-[#2B2B28] truncate max-w-full">
            {currentMethod.temp.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Main Timer Display Box */}
      <div className="rounded-2xl bg-white border border-[#DDD2BF] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1E8D8]/40 rounded-full blur-2xl pointer-events-none" />

        {/* Top Control Bar: Step badge and sound toggle */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1E8D8] text-[#24493A] text-xs font-bold tracking-wide">
            <span>
              STEP {progress.stepIndex + 1} OF {currentMethod.steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Mute timer sound chimes' : 'Unmute timer sound chimes'}
            className="p-1.5 rounded-lg text-[#6F6A60] hover:text-[#2B2B28] hover:bg-[#F1E8D8] transition-colors cursor-pointer"
            title={soundEnabled ? 'Sound alerts on' : 'Sound alerts muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#24493A]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>

        {/* Countdown Digits */}
        <div className="text-center my-2">
          <div
            className="text-6xl sm:text-7xl font-bold tracking-tight text-[#2B2B28] tabular-nums select-none"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {formatTime(progress.totalRemaining)}
          </div>
          <p className="text-xs uppercase tracking-widest text-[#6F6A60] mt-1 font-medium">
            {progress.isComplete ? 'Brew Completed' : `${formatTime(progress.stepRemaining)} remaining in this step`}
          </p>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-[#F1E8D8] h-2.5 rounded-full overflow-hidden my-6 border border-[#DDD2BF]/40">
          <div
            className="bg-[#24493A] h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress.overallProgressPercent}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress.overallProgressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Current Step Instruction Card */}
        <div className="rounded-xl bg-[#FBF7F0] border border-[#DDD2BF] p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3
              className="text-xl sm:text-2xl font-semibold text-[#2B2B28]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {progress.currentStep.title}
            </h3>

            {progress.currentStep.targetGrams && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D9633B] bg-[#D9633B]/10 px-2.5 py-1 rounded-md w-fit">
                <Scale className="w-3 h-3" /> Target: {progress.currentStep.targetGrams}
              </span>
            )}
          </div>

          <p className="text-[15px] sm:text-[16px] text-[#2B2B28] leading-relaxed mb-3">
            {progress.currentStep.instruction}
          </p>

          {progress.currentStep.tip && (
            <div className="flex items-start gap-2 text-xs text-[#6F6A60] bg-white/80 p-2.5 rounded-lg border border-[#DDD2BF]/60">
              <Sparkles className="w-4 h-4 text-[#D9633B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#2B2B28]">Roaster's Note:</strong> {progress.currentStep.tip}
              </span>
            </div>
          )}
        </div>

        {/* Timer Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSkipPrev}
            aria-label="Previous step"
            disabled={progress.stepIndex === 0 && progress.stepElapsed === 0}
            className="p-3 rounded-full bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EBE0CF] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-[#DDD2BF]"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isRunning ? 'Pause brew timer' : 'Start brew timer'}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#D9633B] text-white font-medium hover:bg-[#BF522E] hover:-translate-y-0.5 transition-all duration-200 shadow-md text-base cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D9633B] outline-none"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : progress.isComplete ? (
              <>
                <RotateCcw className="w-5 h-5" />
                <span>Brew Again</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>{elapsedSeconds === 0 ? 'Start Brew' : 'Resume'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset brew timer"
            disabled={elapsedSeconds === 0}
            className="p-3 rounded-full bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EBE0CF] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-[#DDD2BF]"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleSkipNext}
            aria-label="Next step"
            disabled={progress.isComplete}
            className="p-3 rounded-full bg-[#F1E8D8] text-[#2B2B28] hover:bg-[#EBE0CF] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-[#DDD2BF]"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Completion Banner */}
        {progress.isComplete && (
          <div className="mt-6 p-5 rounded-xl bg-[#24493A] text-white text-center animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 text-[#F1E8D8]">
              <Coffee className="w-5 h-5" />
            </div>
            <h4
              className="text-xl font-semibold mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Your coffee is ready to pour!
            </h4>
            <p className="text-xs text-[#F1E8D8] max-w-sm mx-auto mb-4">
              Give your cup a minute to cool slightly—the sweetest fruit and chocolate notes emerge as the brew temperature drops.
            </p>
            {onJoinClick && (
              <button
                type="button"
                onClick={onJoinClick}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D9633B] text-white text-xs font-semibold hover:bg-[#BF522E] transition-colors cursor-pointer"
              >
                <span>Get freshly roasted beans for this method</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sequential Step Overview Checklist */}
      <div className="mt-6 rounded-xl bg-[#F1E8D8] border border-[#DDD2BF] p-4 sm:p-5">
        <h4 className="text-xs uppercase font-bold tracking-wider text-[#6F6A60] mb-3">
          Method Breakdown: {currentMethod.name} ({formatTime(totalSeconds)})
        </h4>

        <div className="space-y-2">
          {currentMethod.steps.map((step, idx) => {
            const isStepActive = idx === progress.stepIndex && !progress.isComplete;
            const isStepDone = idx < progress.stepIndex || progress.isComplete;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2.5 rounded-lg text-xs sm:text-sm transition-all ${
                  isStepActive
                    ? 'bg-white font-semibold text-[#2B2B28] shadow-xs border border-[#24493A]/20'
                    : isStepDone
                    ? 'text-[#6F6A60] opacity-80'
                    : 'text-[#6F6A60]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isStepDone
                        ? 'bg-[#24493A] text-white'
                        : isStepActive
                        ? 'bg-[#D9633B] text-white animate-pulse'
                        : 'bg-[#DDD2BF] text-[#2B2B28]'
                    }`}
                  >
                    {isStepDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span>{step.title}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {step.targetGrams && (
                    <span className="text-[#6F6A60] hidden sm:inline">{step.targetGrams} •</span>
                  )}
                  <span className="font-mono text-[#6F6A60]">{step.durationSeconds}s</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
