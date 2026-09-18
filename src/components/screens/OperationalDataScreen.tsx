import React, { useState } from 'react';
import { AssessmentFormData } from '../../types';
import { FUEL_TYPES } from '../../data/mockAssessments';
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Factory,
  Zap,
  Flame,
  Info,
  Sparkles,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

interface OperationalDataScreenProps {
  initialData: AssessmentFormData;
  onBack: () => void;
  onContinue: (data: AssessmentFormData) => void;
  onOpenBillAnalyzer?: () => void;
}

export const OperationalDataScreen: React.FC<OperationalDataScreenProps> = ({
  initialData,
  onBack,
  onContinue,
  onOpenBillAnalyzer,
}) => {
  const [formData, setFormData] = useState<AssessmentFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateNumber = (val: string, fieldName: string, isRequired = true) => {
    if (!val || !val.trim()) {
      return isRequired ? `${fieldName} is required.` : '';
    }
    const num = Number(val);
    if (isNaN(num)) {
      return 'Enter a valid number.';
    }
    if (num < 0) {
      return 'Value must be greater than or equal to zero.';
    }
    return '';
  };

  const validate = (data: AssessmentFormData) => {
    const newErrors: Record<string, string> = {};

    const prodErr = validateNumber(data.productionVolume, 'Production Volume', true);
    if (prodErr) newErrors.productionVolume = prodErr;

    const elecErr = validateNumber(data.electricityConsumed, 'Electricity Consumed', true);
    if (elecErr) newErrors.electricityConsumed = elecErr;

    const fuelErr = validateNumber(data.fuelConsumed, 'Fuel Consumed', true);
    if (fuelErr) newErrors.fuelConsumed = fuelErr;

    if (!data.fuelType) {
      newErrors.fuelType = 'Please select a fuel type.';
    }

    return newErrors;
  };

  const handleChange = (field: keyof AssessmentFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const currentErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: currentErrors[field] || '',
      }));
    }
  };

  const handleBlur = (field: keyof AssessmentFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: currentErrors[field] || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      productionVolume: true,
      electricityConsumed: true,
      fuelConsumed: true,
      fuelType: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onContinue(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      {/* Heading */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Enter Your Operational Data
        </h1>
        <p className="text-sm text-zinc-600">
          Enter the information available to you. Missing information may increase uncertainty.
        </p>
      </div>

      <form
        id="operational-data-form"
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {/* SECTION: PRODUCTION */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">
                Section: Production
              </h2>
              <p className="text-xs text-zinc-500">Finished goods produced in the reference period</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="input-production-volume"
              className="block text-sm font-medium text-zinc-800"
            >
              Production Volume <span className="text-red-500">*</span>
            </label>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  id="input-production-volume"
                  type="number"
                  step="any"
                  value={formData.productionVolume}
                  onChange={(e) => handleChange('productionVolume', e.target.value)}
                  onBlur={() => handleBlur('productionVolume')}
                  placeholder="e.g., 1000"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.productionVolume && touched.productionVolume
                      ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                      : 'border-zinc-300 bg-white text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
                  }`}
                />
              </div>
              <select
                id="select-production-unit"
                value={formData.productionUnit}
                onChange={(e) => handleChange('productionUnit', e.target.value)}
                className="w-32 px-3 py-2.5 rounded-lg border border-zinc-300 text-sm bg-zinc-50 font-medium text-zinc-700 focus:outline-none focus:border-teal-700"
              >
                <option value="tonnes">tonnes ▼</option>
                <option value="kg">kg ▼</option>
              </select>
            </div>
            {errors.productionVolume && touched.productionVolume && (
              <p id="error-production-volume" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.productionVolume}</span>
              </p>
            )}
          </div>
        </div>

        {/* SECTION: ELECTRICITY */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">
                  Section: Electricity
                </h2>
                <p className="text-xs text-zinc-500">Total grid electricity consumption for manufacturing</p>
              </div>
            </div>

            {onOpenBillAnalyzer && (
              <button
                type="button"
                id="btn-trigger-bill-ai-extract"
                onClick={onOpenBillAnalyzer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload Bill & AI Auto-Fill</span>
              </button>
            )}
          </div>

          {/* If verified with bill */}
          {formData.billVerified && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Audited DISCOM Bill:</strong> {formData.billDiscom || 'MSEDCL'} (
                  {formData.billDocName || 'Attached PDF'})
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                High Readiness
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="input-electricity-consumed"
              className="block text-sm font-medium text-zinc-800"
            >
              Electricity Consumed <span className="text-red-500">*</span>
            </label>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  id="input-electricity-consumed"
                  type="number"
                  step="any"
                  value={formData.electricityConsumed}
                  onChange={(e) => handleChange('electricityConsumed', e.target.value)}
                  onBlur={() => handleBlur('electricityConsumed')}
                  placeholder="e.g., 50000"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.electricityConsumed && touched.electricityConsumed
                      ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                      : 'border-zinc-300 bg-white text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
                  }`}
                />
              </div>
              <select
                id="select-electricity-unit"
                value={formData.electricityUnit}
                onChange={(e) => handleChange('electricityUnit', e.target.value)}
                className="w-32 px-3 py-2.5 rounded-lg border border-zinc-300 text-sm bg-zinc-50 font-medium text-zinc-700 focus:outline-none focus:border-teal-700"
              >
                <option value="kWh">kWh ▼</option>
                <option value="MWh">MWh ▼</option>
              </select>
            </div>
            {errors.electricityConsumed && touched.electricityConsumed && (
              <p id="error-electricity-consumed" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.electricityConsumed}</span>
              </p>
            )}
          </div>
        </div>

        {/* SECTION: FUEL */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide">
                Section: Fuel
              </h2>
              <p className="text-xs text-zinc-500">Thermal energy, generators, and process combustion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fuel Consumed */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-fuel-consumed"
                className="block text-sm font-medium text-zinc-800"
              >
                Fuel Consumed <span className="text-red-500">*</span>
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  id="input-fuel-consumed"
                  type="number"
                  step="any"
                  value={formData.fuelConsumed}
                  onChange={(e) => handleChange('fuelConsumed', e.target.value)}
                  onBlur={() => handleBlur('fuelConsumed')}
                  placeholder="e.g., 5000"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                    errors.fuelConsumed && touched.fuelConsumed
                      ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                      : 'border-zinc-300 bg-white text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
                  }`}
                />
                <select
                  id="select-fuel-unit"
                  value={formData.fuelUnit}
                  onChange={(e) => handleChange('fuelUnit', e.target.value)}
                  className="w-24 px-2 py-2.5 rounded-lg border border-zinc-300 text-sm bg-zinc-50 font-medium text-zinc-700 focus:outline-none focus:border-teal-700"
                >
                  <option value="litres">litres ▼</option>
                  <option value="tonnes">tonnes ▼</option>
                  <option value="Nm³">Nm³ ▼</option>
                </select>
              </div>
              {errors.fuelConsumed && touched.fuelConsumed && (
                <p id="error-fuel-consumed" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fuelConsumed}</span>
                </p>
              )}
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5">
              <label
                htmlFor="select-fuel-type"
                className="block text-sm font-medium text-zinc-800"
              >
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                id="select-fuel-type"
                value={formData.fuelType}
                onChange={(e) => handleChange('fuelType', e.target.value)}
                onBlur={() => handleBlur('fuelType')}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 bg-white ${
                  errors.fuelType && touched.fuelType
                    ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                    : 'border-zinc-300 text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
                }`}
              >
                {FUEL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type} ▼
                  </option>
                ))}
              </select>
              {errors.fuelType && touched.fuelType && (
                <p id="error-fuel-type" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.fuelType}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Small Information Box as requested in Section 6 */}
        <div
          id="operational-data-info-box"
          className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-3 shadow-xs"
        >
          <div className="w-6 h-6 rounded-full bg-teal-200/70 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-semibold text-teal-950">Don't have all the data?</p>
            <p className="text-teal-800/90 leading-relaxed">
              That's okay. CarbonBridge can identify missing information and show how it affects your result.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-zinc-200">
          <button
            type="button"
            id="btn-operational-data-back"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            id="btn-operational-data-review"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Review Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
