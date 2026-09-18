import React, { useState } from 'react';
import { AssessmentFormData, Sector } from '../../types';
import { INDIAN_REGIONS, SECTORS } from '../../data/mockAssessments';
import { ArrowLeft, ArrowRight, AlertCircle, HelpCircle, Info } from 'lucide-react';

interface ProjectDefinitionScreenProps {
  initialData: AssessmentFormData;
  onBack: () => void;
  onContinue: (data: AssessmentFormData) => void;
}

export const ProjectDefinitionScreen: React.FC<ProjectDefinitionScreenProps> = ({
  initialData,
  onBack,
  onContinue,
}) => {
  const [formData, setFormData] = useState<AssessmentFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (data: AssessmentFormData) => {
    const newErrors: Record<string, string> = {};

    if (!data.name || !data.name.trim()) {
      newErrors.name = 'Please enter your project name.';
    }

    if (!data.sector) {
      newErrors.sector = 'Please select an export sector.';
    }

    if (!data.region) {
      newErrors.region = 'Please select your manufacturing region/state.';
    }

    if (!data.productProcess || !data.productProcess.trim()) {
      newErrors.productProcess = 'Please enter the product or manufacturing process.';
    }

    return newErrors;
  };

  const handleChange = (field: keyof AssessmentFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field] || '',
      }));
    }
  };

  const handleBlur = (field: keyof AssessmentFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field] || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = {
      name: true,
      sector: true,
      region: true,
      productProcess: true,
    };
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onContinue(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      {/* Header text */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Define Your Assessment
        </h1>
        <p className="text-sm text-zinc-600">
          Tell us about the product and manufacturing process.
        </p>
      </div>

      {/* Form Container Card */}
      <form
        id="project-definition-form"
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs"
        noValidate
      >
        {/* Project Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="input-project-name"
            className="block text-sm font-medium text-zinc-800"
          >
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="input-project-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="e.g., Structural Steel Rebars for Export"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
              errors.name && touched.name
                ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                : 'border-zinc-300 bg-white text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
            }`}
          />
          {errors.name && touched.name ? (
            <p id="error-project-name" className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          ) : (
            <p className="text-xs text-zinc-600">
              A recognizable title for your internal report or buyer audit.
            </p>
          )}
        </div>

        {/* Sector and Region Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Sector */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-sector"
              className="block text-sm font-medium text-zinc-800"
            >
              Export Sector <span className="text-red-500">*</span>
            </label>
            <select
              id="select-sector"
              value={formData.sector}
              onChange={(e) => handleChange('sector', e.target.value)}
              onBlur={() => handleBlur('sector')}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 bg-white ${
                errors.sector && touched.sector
                  ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                  : 'border-zinc-300 text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
              }`}
            >
              <option value="">Select sector ▼</option>
              {SECTORS.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.sector && touched.sector && (
              <p id="error-sector" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.sector}</span>
              </p>
            )}
          </div>

          {/* Manufacturing Region */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-region"
              className="block text-sm font-medium text-zinc-800"
            >
              Manufacturing Region <span className="text-red-500">*</span>
            </label>
            <select
              id="select-region"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              onBlur={() => handleBlur('region')}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 bg-white ${
                errors.region && touched.region
                  ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                  : 'border-zinc-300 text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
              }`}
            >
              <option value="">Select state/region ▼</option>
              {INDIAN_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && touched.region && (
              <p id="error-region" className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.region}</span>
              </p>
            )}
          </div>
        </div>

        {/* Product / Process */}
        <div className="space-y-1.5">
          <label
            htmlFor="input-product-process"
            className="block text-sm font-medium text-zinc-800"
          >
            Product / Process <span className="text-red-500">*</span>
          </label>
          <input
            id="input-product-process"
            type="text"
            value={formData.productProcess}
            onChange={(e) => handleChange('productProcess', e.target.value)}
            onBlur={() => handleBlur('productProcess')}
            placeholder="e.g., Hot-rolled wire rod via electric induction furnace"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
              errors.productProcess && touched.productProcess
                ? 'border-red-300 bg-red-50/30 text-zinc-900 focus:ring-red-200'
                : 'border-zinc-300 bg-white text-zinc-900 focus:border-teal-700 focus:ring-teal-100'
            }`}
          />
          {errors.productProcess && touched.productProcess ? (
            <p id="error-product-process" className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.productProcess}</span>
            </p>
          ) : (
            <p className="text-xs text-zinc-600">
              Helps select the right industrial emission baseline.
            </p>
          )}
        </div>

        {/* Optional short description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="textarea-description"
              className="block text-sm font-medium text-zinc-800"
            >
              Optional Short Description
            </label>
            <span className="text-xs text-zinc-400">Optional</span>
          </div>
          <textarea
            id="textarea-description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g., Batch 4A production log covering Q3 dispatch for EU export customer."
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm bg-white text-zinc-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-100 focus:outline-none"
          />
        </div>

        {/* Helpful Tip */}
        <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-900">
          <Info className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
          <span>
            Regional selection links your unit to CEA (Central Electricity Authority) state grid emission intensity factors automatically.
          </span>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            id="btn-project-definition-back"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            id="btn-project-definition-continue"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
