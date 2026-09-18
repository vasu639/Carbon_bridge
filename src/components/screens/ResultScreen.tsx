import React from 'react';
import { Assessment } from '../../types';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  PieChart,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Factory,
  MapPin,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

interface ResultScreenProps {
  assessment: Assessment;
  onViewDrivers: () => void;
  onViewDataQuality: () => void;
  onGenerateReport: () => void;
  onBackToDashboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  assessment,
  onViewDrivers,
  onViewDataQuality,
  onGenerateReport,
  onBackToDashboard,
}) => {
  const {
    name,
    sector,
    region,
    estimatedEmissions,
    uncertaintyMin,
    uncertaintyMax,
    readiness,
  } = assessment;

  // Calculate percentage range position for the visual bar
  const rangeSpan = uncertaintyMax - uncertaintyMin;
  const pointOffset = rangeSpan > 0 ? ((estimatedEmissions - uncertaintyMin) / rangeSpan) * 100 : 50;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Top Breadcrumb / Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-result-back-dashboard"
          onClick={onBackToDashboard}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-800 flex items-center gap-1 hover:underline"
        >
          <span>← Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Project:</span>
          <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded">
            {name}
          </span>
        </div>
      </div>

      {/* Screen Heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
            CarbonBridge Result
          </h1>
        </div>
        <p className="text-sm text-zinc-600">
          Statistical first estimate of product embedded greenhouse gas emissions.
        </p>
      </div>

      {/* Primary Result Card as specified in Section 9 */}
      <div
        id="carbon-result-primary-card"
        className="bg-white border-2 border-teal-900/10 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8"
      >
        {/* Project Meta header */}
        <div className="flex items-start justify-between flex-wrap gap-2 pb-5 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">{name}</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
              <span className="font-medium text-teal-800">{sector}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {region}
              </span>
            </div>
          </div>
          <ReadinessBadge level={readiness} size="lg" />
        </div>

        {/* Central Metric */}
        <div className="text-center py-2 space-y-2">
          <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-zinc-500">
            Estimated Embedded Emissions
          </span>

          <div className="flex items-baseline justify-center gap-2">
            <span
              id="result-emissions-value"
              className="text-5xl sm:text-6xl font-extrabold text-zinc-900 tracking-tight"
            >
              {estimatedEmissions}
            </span>
            <span className="text-base sm:text-lg font-medium text-zinc-600">
              kg CO₂e / tonne
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto pt-1">
            Your estimate is based on the operational information provided.
          </p>
        </div>

        {/* Uncertainty Range Card */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-700 block">
                Uncertainty Range
              </span>
              <p className="text-base sm:text-lg font-bold text-zinc-900 mt-0.5">
                {uncertaintyMin} – {uncertaintyMax} kg CO₂e / tonne
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-zinc-200/70 text-zinc-700 text-xs font-medium">
              95% Confidence Interval
            </span>
          </div>

          {/* Visual Dispersion Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="relative w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-teal-800/80 rounded-full"
                style={{ left: '10%', right: '10%' }}
              />
              {/* Point Marker */}
              <div
                className="absolute top-0 bottom-0 w-2 bg-zinc-900 rounded-full -ml-1 shadow-sm"
                style={{ left: `${Math.max(15, Math.min(85, pointOffset))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 font-medium">
              <span>Min ({uncertaintyMin})</span>
              <span className="text-teal-900 font-semibold">Mean ({estimatedEmissions})</span>
              <span>Max ({uncertaintyMax})</span>
            </div>
          </div>
        </div>

        {/* Action Buttons as specified in Section 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            id="btn-view-drivers"
            onClick={onViewDrivers}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            <PieChart className="w-4 h-4 text-teal-800" />
            <span>View Main Drivers</span>
          </button>

          <button
            id="btn-view-data-quality"
            onClick={onViewDataQuality}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            <ClipboardCheck className="w-4 h-4 text-teal-800" />
            <span>View Data Quality</span>
          </button>

          <button
            id="btn-generate-report"
            onClick={onGenerateReport}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Generate Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Non-Regulatory Disclaimer as explicitly required */}
        <div
          id="result-disclaimer"
          className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> This is a statistical decision-support estimate and is not a certified CBAM declaration.
          </p>
        </div>
      </div>
    </div>
  );
};
