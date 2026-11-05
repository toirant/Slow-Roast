import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Coffee,
  Flame,
  Droplet,
  Compass,
  SlidersHorizontal,
  Thermometer,
  BookOpen,
} from 'lucide-react';
import {
  QuizAnswers,
  QuizResult,
  calculateRoastRecommendation,
} from '../utils/quizLogic.ts';
import { RoastLevel, BrewMethod } from '../utils/coffeePlan.ts';
import { PrimaryButton } from './PrimaryButton.tsx';
import { OutlineButton } from './OutlineButton.tsx';

interface RoastQuizProps {
  onSelectRoastAndMethod?: (roast: RoastLevel, method: BrewMethod) => void;
  className?: string;
}

interface QuestionOption {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface QuestionConfig {
  id: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export const RoastQuiz: React.FC<RoastQuizProps> = ({
  onSelectRoastAndMethod,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const questions: QuestionConfig[] = [
    {
      id: 'brewingSetup',
      title: 'What brewing gear do you use most at home?',
      subtitle: 'We pair your roast with a technique guide calibrated for your method.',
      options: [
        {
          value: 'pour_over',
          label: 'Pour Over / Chemex / V60',
          description: 'Highlights nuanced floral aromatics and sparkling fruit clarity.',
          icon: <Droplet className="w-4 h-4 text-[#24493A]" />,
        },
        {
          value: 'french_press',
          label: 'French Press / Immersion',
          description: 'Full-bodied, velvety extraction with round natural sweetness.',
          icon: <Coffee className="w-4 h-4 text-[#24493A]" />,
        },
        {
          value: 'espresso',
          label: 'Espresso / Moka Pot',
          description: 'Intense extraction, dense crema, and syrupy body under pressure.',
          icon: <Flame className="w-4 h-4 text-[#D9633B]" />,
        },
        {
          value: 'drip',
          label: 'Automatic Drip / Batch Maker',
          description: 'Comforting, reliable daily cups with effortless consistency.',
          icon: <Coffee className="w-4 h-4 text-[#24493A]" />,
        },
      ],
    },
    {
      id: 'flavorPreference',
      title: 'Which flavor notes make your morning brighter?',
      subtitle: 'Pick the taste profile that gets you excited for your first sip.',
      options: [
        {
          value: 'bright_floral',
          label: 'Bright & Floral',
          description: 'Jasmine blossom, bergamot tea, white peach, and sparkling lemon.',
        },
        {
          value: 'sweet_balanced',
          label: 'Sweet & Harmonious',
          description: 'Dulce de leche, toasted hazelnut, red fuji apple, and milk chocolate.',
        },
        {
          value: 'deep_chocolaty',
          label: 'Deep & Chocolaty',
          description: '85% dark cocoa, dark molasses, toasted cacao nibs, and smoky warmth.',
        },
      ],
    },
    {
      id: 'milkPreference',
      title: 'How do you usually enjoy your cup?',
      subtitle: 'Roast intensity determines how well coffee notes marry with milk.',
      options: [
        {
          value: 'black',
          label: 'Always Black',
          description: 'You appreciate tasting single-origin terroir and clean complexity.',
        },
        {
          value: 'splash_milk',
          label: 'A Splash of Milk or Oat Milk',
          description: 'You like a creamy, rounded cup that still showcases coffee sweetness.',
        },
        {
          value: 'latte',
          label: 'Lattes, Flat Whites, or Sweetened',
          description: 'You need bold, punchy coffee depth that cuts smoothly through milk.',
        },
      ],
    },
    {
      id: 'goal',
      title: 'What is your main brewing goal this month?',
      subtitle: 'Every box includes a step-by-step masterclass matched to your goal.',
      options: [
        {
          value: 'palate_training',
          label: 'Train My Palate',
          description: 'Learn to detect high-altitude micro-lots and nuanced harvest notes.',
        },
        {
          value: 'everyday_sweet',
          label: 'Achieve Sweetness Without Bitterness',
          description: 'Dial in water temp and grind size for ultra-smooth morning cups.',
        },
        {
          value: 'bold_punch',
          label: 'Master Rich Crema & Body',
          description: 'Get thick, cafe-quality density and barista-level puck prep at home.',
        },
      ],
    },
  ];

  const currentQ = questions[currentStep];

  const handleSelectOption = (value: string) => {
    const updatedAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished all questions - compute result
      const calculated = calculateRoastRecommendation(updatedAnswers);
      setResult(calculated);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <div
      className={`rounded-2xl bg-[#F1E8D8] border border-[#DDD2BF] p-6 sm:p-8 text-[#2B2B28] shadow-xs relative overflow-hidden ${className}`}
    >
      {/* Decorative background watermark */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#D9633B]/5 blur-2xl pointer-events-none" />

      {!result ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24493A]/10 text-[#24493A] text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#D9633B]" />
              <span>Roast Matcher Quiz</span>
            </div>
            <span className="text-xs font-medium text-[#6F6A60] tracking-wide">
              Step {currentStep + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-1.5 bg-[#DDD2BF]/50 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-[#24493A] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Question Title & Subtitle */}
          <h3
            className="text-2xl sm:text-[26px] font-semibold text-[#2B2B28] leading-snug mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {currentQ.title}
          </h3>
          <p className="text-sm text-[#6F6A60] mb-6">
            {currentQ.subtitle}
          </p>

          {/* Options Grid */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = answers[currentQ.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 group ${
                    isSelected
                      ? 'border-[#24493A] bg-[#24493A] text-white shadow-xs'
                      : 'border-[#DDD2BF] bg-[#FBF7F0] hover:border-[#24493A]/60 hover:bg-white text-[#2B2B28]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border text-xs font-bold transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-[#24493A]'
                        : 'border-[#DDD2BF] bg-[#F1E8D8] text-[#6F6A60] group-hover:border-[#24493A]'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base leading-snug mb-0.5">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? 'text-white/85' : 'text-[#6F6A60]'
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-2">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6A60] hover:text-[#2B2B28] transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-black/5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#6F6A60] hover:text-[#D9633B] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9633B]/10 text-[#D9633B] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Custom Recommendation</span>
            </span>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-[#6F6A60] hover:text-[#24493A] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake</span>
            </button>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-semibold text-[#2B2B28] leading-tight mb-1"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {result.profileName}
          </h3>
          <p className="text-sm font-medium text-[#D9633B] mb-3">
            {result.tagline}
          </p>
          <p className="text-sm text-[#6F6A60] leading-relaxed mb-5">
            {result.description}
          </p>

          {/* Tasting Notes Chips */}
          <div className="mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B2B28] block mb-2">
              Signature Tasting Notes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FBF7F0] text-[#24493A] border border-[#DDD2BF] shadow-2xs"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Brew Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-[#FBF7F0] border border-[#DDD2BF] text-xs mb-6">
            <div>
              <span className="text-[#6F6A60] block text-[11px] uppercase font-semibold">
                Water Temp
              </span>
              <span className="font-medium text-[#2B2B28] flex items-center gap-1 mt-0.5">
                <Thermometer className="w-3 h-3 text-[#D9633B]" />
                {result.waterTemp}
              </span>
            </div>
            <div>
              <span className="text-[#6F6A60] block text-[11px] uppercase font-semibold">
                Grind Consistency
              </span>
              <span className="font-medium text-[#2B2B28] flex items-center gap-1 mt-0.5">
                <SlidersHorizontal className="w-3 h-3 text-[#24493A]" />
                {result.grindSize}
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#DDD2BF]/50">
              <span className="text-[#6F6A60] block text-[11px] uppercase font-semibold">
                Matched Technique Guide
              </span>
              <span className="font-medium text-[#24493A] flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3 h-3 text-[#24493A]" />
                {result.guideTitle}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <PrimaryButton
              className="flex-1 text-center justify-center text-sm"
              onClick={() => {
                if (onSelectRoastAndMethod) {
                  onSelectRoastAndMethod(result.roastLevel, result.matchedBrewMethod);
                }
              }}
            >
              Order Box With This Roast
            </PrimaryButton>

            <OutlineButton
              onClick={handleReset}
              className="text-xs sm:text-sm py-2.5 px-4"
            >
              Retake Quiz
            </OutlineButton>
          </div>
        </div>
      )}
    </div>
  );
};
