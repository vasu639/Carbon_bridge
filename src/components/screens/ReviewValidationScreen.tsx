import React from 'react';
import { AssessmentFormData } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  Building2,
  MapPin,
  Flame,
  Zap,
  Factory,
  Sparkles,
  Info,
} from 'lucide-react';

interface ReviewValidationScreenProps {
  formData: AssessmentFormData;
  onEditData: () => void;
  onCalculateEstimate: () => void;
}

export const ReviewValidationScreen: React.FC<ReviewValidationScreenProps> = ({
  formData,
  onEditData,
  onCalculateEstimate,
}) => {
  // Format numbers nicely
  const formatNum = (val: string) => {
    const n = Number(val);
    if (isNaN(n)) return val;
    return n.toLocaleString('en-IN');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Review Your Data
        </h1>
        <p className="text-sm text-zinc-600">
          Confirm the submitted operational details before running the statistical estimation.
        </p>
      </div>

      {/* Project Summary Card */}
      <div
        id="review-project-summary-card"
        className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            Project Overview
          </span>
          <button
            id="review-edit-definition-btn"
            onClick={onEditData}
            className="text-xs text-teal-800 hover:text-teal-950 font-medium inline-flex items-center gap-1 hover:underline"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-zinc-900">{formData.name || 'Steel Export'}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold">
              {formData.sector || 'Steel'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{formData.region || 'Maharashtra'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              <span className="truncate max-w-xs">{formData.productProcess || 'Induction Furnace'}</span>
            </div>
          </div>

          {formData.description && (
            <p className="text-xs text-zinc-500 italic pt-1 border-t border-zinc-100">
              "{formData.description}"
            </p>
          )}
        </div>
      </div>

      {/* Operational Data Card */}
      <div
        id="review-operational-data-card"
        className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            Operational Data
          </span>
          <button
            id="review-edit-operations-btn"
            onClick={onEditData}
            className="text-xs text-teal-800 hover:text-teal-950 font-medium inline-flex items-center gap-1 hover:underline"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-100 text-sm">
          {/* Production */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-zinc-700">
              <div className="w-6 h-6 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                <Factory className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">
                {formatNum(formData.productionVolume)} {formData.productionUnit}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Electricity */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-zinc-700">
              <div className="w-6 h-6 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-medium">Electricity</span>
                {formData.billVerified && (
                  <span className="ml-2 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    DISCOM Audited Proof
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">
                {formatNum(formData.electricityConsumed)} {formData.electricityUnit}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Fuel */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-zinc-700">
              <div className="w-6 h-6 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Fuel ({formData.fuelType || 'Diesel'})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">
                {formatNum(formData.fuelConsumed)} {formData.fuelUnit}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Section as requested in Section 7 */}
      <div
        id="review-data-quality-section"
        className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-3"
      >
        <span className="text-xs uppercase tracking-wider text-zinc-600 font-semibold block">
          Data Quality Checks
        </span>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Required data available</span>
              <p className="text-emerald-800/90 text-[11px] mt-0.5">
                Baseline production, power utility, and thermal quantities are complete.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-amber-900 bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Fuel information may need verification</span>
              <p className="text-amber-800/90 text-[11px] mt-0.5">
                Using national average calorific values. Sub-meter logs will sharpen future confidence intervals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-zinc-200">
        <button
          type="button"
          id="btn-review-edit-data"
          onClick={onEditData}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Data</span>
        </button>

        <button
          type="button"
          id="btn-review-calculate-estimate"
          onClick={onCalculateEstimate}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <span>Calculate Estimate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
