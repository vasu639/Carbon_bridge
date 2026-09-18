import React from 'react';
import { Assessment } from '../../types';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Zap,
  Flame,
  Factory,
  Globe2,
  Layers,
  Inbox,
  ArrowRight,
} from 'lucide-react';

interface DriversScreenProps {
  assessment: Assessment;
  onBackToResult: () => void;
  onGoToReport: () => void;
}

export const DriversScreen: React.FC<DriversScreenProps> = ({
  assessment,
  onBackToResult,
  onGoToReport,
}) => {
  const { drivers, dataQuality, readiness, recommendedSteps } = assessment;

  const getDriverIcon = (category: string) => {
    switch (category) {
      case 'electricity':
        return <Zap className="w-4 h-4 text-teal-800" />;
      case 'fuel':
        return <Flame className="w-4 h-4 text-amber-700" />;
      case 'process':
        return <Factory className="w-4 h-4 text-zinc-700" />;
      case 'grid':
        return <Globe2 className="w-4 h-4 text-blue-700" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getQualityIcon = (status: 'valid' | 'warning' | 'missing') => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'missing':
        return <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <button
          id="btn-drivers-back-to-result"
          onClick={onBackToResult}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Result</span>
        </button>
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
          Why Is My Estimate This High?
        </h1>
        <p className="text-sm text-zinc-600">
          A transparent breakdown of the operational factors shaping your product emission footprint.
        </p>
      </div>

      {/* Section: MAIN EMISSION DRIVERS */}
      <div
        id="section-main-drivers"
        className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-500">
              Main Emission Drivers
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Proportion of total embedded emissions per tonne of finished product
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-medium">100% Total</span>
        </div>

        {/* Horizontal Bar Chart as explicitly requested in Section 10 */}
        {!drivers || drivers.length === 0 ? (
          <div id="drivers-empty-state" className="p-8 text-center text-zinc-500 text-xs">
            <Inbox className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
            <p>Driver analysis is not available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 text-zinc-800">
                    {getDriverIcon(driver.category)}
                    <span className="font-semibold">{driver.name}</span>
                  </div>
                  <span className="font-bold text-zinc-900">{driver.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      driver.category === 'electricity'
                        ? 'bg-teal-800'
                        : driver.category === 'fuel'
                        ? 'bg-teal-700'
                        : driver.category === 'process'
                        ? 'bg-teal-600'
                        : 'bg-zinc-400'
                    }`}
                    style={{ width: `${driver.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
          <span>
            <strong>Key Insight:</strong> Electricity is your single biggest driver at 42%, followed by thermal fuel at 21%. Switching furnace batches to off-peak solar hours or verifying grid tariffs can significantly adjust this metric.
          </span>
        </div>
      </div>

      {/* Section: DATA QUALITY */}
      <div
        id="section-data-quality"
        className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-500">
              Data Quality
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review how complete your operational records are
            </p>
          </div>
          <ReadinessBadge level={readiness} size="md" />
        </div>

        <div className="space-y-3">
          {dataQuality.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                item.status === 'valid'
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : item.status === 'warning'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-red-50/50 border-red-200 text-red-950'
              }`}
            >
              {getQualityIcon(item.status)}
              <div className="space-y-0.5">
                <span className="font-semibold">{item.label}</span>
                {item.detail && (
                  <p className="text-[11px] text-zinc-600">{item.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: RECOMMENDED NEXT DATA */}
      <div
        id="section-recommended-data"
        className="bg-teal-50/60 border border-teal-200 rounded-xl p-6 sm:p-8 space-y-4"
      >
        <div>
          <h2 className="text-xs uppercase tracking-wider font-bold text-teal-950">
            Recommended Next Data
          </h2>
          <p className="text-xs text-teal-800 mt-0.5">
            Sharpens your uncertainty range in the next estimation cycle
          </p>
        </div>

        <ol className="space-y-2 text-xs text-zinc-800 list-decimal list-inside font-medium">
          {recommendedSteps.map((step, idx) => (
            <li key={idx} className="bg-white/80 border border-teal-100 p-2.5 rounded-lg">
              <span className="text-zinc-900">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Bottom Nav Action */}
      <div className="pt-2 flex items-center justify-between border-t border-zinc-200">
        <button
          type="button"
          id="btn-drivers-bottom-back"
          onClick={onBackToResult}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Result</span>
        </button>

        <button
          type="button"
          id="btn-drivers-to-report"
          onClick={onGoToReport}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
        >
          <span>Readiness Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
