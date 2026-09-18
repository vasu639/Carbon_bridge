import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle, RefreshCw, FileEdit, ShieldAlert } from 'lucide-react';

interface ProcessingScreenProps {
  onSuccess: () => void;
  onEditData: () => void;
}

const STEPS = [
  'Validating inputs',
  'Preparing reference data',
  'Running statistical estimation',
  'Calculating uncertainty',
  'Preparing results',
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  onSuccess,
  onEditData,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const [simulateErrorMode, setSimulateErrorMode] = useState(false);

  useEffect(() => {
    if (hasFailed) return;

    if (currentStepIndex < STEPS.length) {
      const timer = setTimeout(() => {
        if (simulateErrorMode && currentStepIndex === 2) {
          setHasFailed(true);
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 700);
      return () => clearTimeout(timer);
    } else {
      // Completed all steps
      const finalTimer = setTimeout(() => {
        onSuccess();
      }, 600);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStepIndex, hasFailed, simulateErrorMode, onSuccess]);

  const handleRetry = () => {
    setHasFailed(false);
    setSimulateErrorMode(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      {hasFailed ? (
        /* Error State as specified in Section 8 */
        <div
          id="processing-failure-container"
          className="bg-white border border-red-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-6"
        >
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-zinc-900">
              We couldn't complete the estimation.
            </h1>
            <p className="text-sm text-zinc-600">
              Your assessment data has been saved.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 text-left">
            <span className="font-semibold text-zinc-800 block mb-1">Notice:</span>
            A temporary connection timeout occurred while accessing the regional grid emission factors. Your entered values are intact.
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="processing-retry-btn"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-sm font-semibold transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              id="processing-edit-btn"
              onClick={onEditData}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm font-medium transition-colors"
            >
              <FileEdit className="w-4 h-4" />
              <span>Edit Data</span>
            </button>
          </div>
        </div>
      ) : (
        /* Processing Progress as specified in Section 8 */
        <div
          id="processing-active-container"
          className="bg-white border border-zinc-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-6"
        >
          {/* Animated Spinner Icon */}
          <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 animate-spin text-teal-800" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Analyzing Your Data
            </h1>
            <p className="text-sm text-zinc-500">
              This may take a few seconds.
            </p>
          </div>

          {/* Clean Step Checklist */}
          <div className="max-w-xs mx-auto text-left space-y-3 pt-2">
            {STEPS.map((stepTitle, idx) => {
              const isDone = idx < currentStepIndex;
              const isRunning = idx === currentStepIndex;
              const isPending = idx > currentStepIndex;

              return (
                <div
                  key={stepTitle}
                  id={`processing-step-${idx}`}
                  className="flex items-center gap-3 text-sm transition-all"
                >
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : isRunning ? (
                    <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-teal-800 animate-ping" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-300 bg-zinc-50 text-zinc-400 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                    </div>
                  )}

                  <span
                    className={`${
                      isDone
                        ? 'text-zinc-800 font-medium'
                        : isRunning
                        ? 'text-teal-900 font-semibold'
                        : 'text-zinc-400'
                    }`}
                  >
                    {stepTitle}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Student/Evaluator helper to test error recovery state */}
          <div className="pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setSimulateErrorMode(!simulateErrorMode)}
              className="text-[11px] text-zinc-500 hover:text-zinc-800 underline"
            >
              {simulateErrorMode
                ? 'Simulation: Error mode active (will fail step 3)'
                : 'Test feature: Simulate calculation failure state'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
