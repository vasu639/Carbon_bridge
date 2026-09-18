import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number; // 1, 2, 3, 4
  totalSteps?: number;
  onStepClick?: (step: number) => void;
  allowStepClick?: boolean;
}

const STEPS = [
  { step: 1, title: 'Project Definition', short: 'Definition' },
  { step: 2, title: 'Operational Data', short: 'Operations' },
  { step: 3, title: 'Review & Validate', short: 'Review' },
  { step: 4, title: 'Estimation', short: 'Estimate' },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps = 4,
  onStepClick,
  allowStepClick = false,
}) => {
  return (
    <div className="w-full bg-white border-b border-zinc-200 py-3.5 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Mobile View: Compact label + Progress bar */}
        <div className="sm:hidden flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-teal-900 tracking-wider">
              STEP {currentStep} OF {totalSteps}
            </span>
            <span className="text-zinc-600 font-medium">
              {STEPS[currentStep - 1]?.title || 'Assessment'}
            </span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-800 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop View: Numbered Circles + connecting lines */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Connector bar background */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 -z-0" />
          {/* Active connector bar */}
          <div
            className="absolute top-4 left-6 h-0.5 bg-teal-800 -z-0 transition-all duration-300"
            style={{
              width: `${Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 90))}%`,
            }}
          />

          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isClickable = allowStepClick && isCompleted && onStepClick;

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(s.step)}
                id={`stepper-step-${s.step}`}
                className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-teal-900 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-white border-2 border-teal-800 text-teal-900 ring-4 ring-teal-50'
                      : 'bg-white border border-zinc-300 text-zinc-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.step}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-teal-900 font-semibold'
                      : isCompleted
                      ? 'text-zinc-700'
                      : 'text-zinc-600'
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
