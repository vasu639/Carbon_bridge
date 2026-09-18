import React, { useState } from 'react';
import { Assessment } from '../../types';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Building2,
  MapPin,
  Calendar,
  AlertTriangle,
  Share2,
  Inbox,
  Check,
} from 'lucide-react';

interface ReportScreenProps {
  assessment: Assessment | null;
  onBackToDashboard: () => void;
  onBackToResult: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  assessment,
  onBackToDashboard,
  onBackToResult,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!assessment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-400 flex items-center justify-center mx-auto">
          <Inbox className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900">No report has been generated.</h2>
        <p className="text-sm text-zinc-500">
          Run or select an operational assessment first to view and download your readiness summary.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-lg bg-teal-900 text-white text-xs font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const {
    name,
    sector,
    region,
    productProcess,
    estimatedEmissions,
    uncertaintyMin,
    uncertaintyMax,
    readiness,
    drivers,
    recommendedSteps,
    createdAt,
  } = assessment;

  const handleDownload = () => {
    // Generate clean text / markdown export
    const content = `=====================================================
CARBONBRIDGE READINESS REPORT
Statistical Decision-Support for Indian MSME Exporters
=====================================================
Project: ${name}
Export Sector: ${sector}
Region: ${region}
Product / Process: ${productProcess}
Date Generated: ${new Date().toLocaleDateString('en-IN')}

EMBEDDED EMISSIONS ESTIMATE
-----------------------------------------------------
Estimated Footprint: ${estimatedEmissions} kg CO2e / tonne
Uncertainty Range: ${uncertaintyMin} – ${uncertaintyMax} kg CO2e / tonne (95% CI)
Data Readiness: ${readiness.toUpperCase()}

MAIN EMISSION DRIVERS
-----------------------------------------------------
${drivers.map((d) => `• ${d.name}: ${d.percentage}%`).join('\n')}

RECOMMENDED NEXT STEPS
-----------------------------------------------------
${recommendedSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

DISCLAIMER
-----------------------------------------------------
CarbonBridge provides a statistical decision-support estimate. 
It is not a certified CBAM declaration or verified regulatory report.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CarbonBridge-Report-${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          id="btn-report-back-to-result"
          onClick={onBackToResult}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Result</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-report-print"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            id="btn-report-download"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Report Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report summary downloaded successfully. You can attach this to internal exporter planning files.</span>
        </div>
      )}

      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
          CarbonBridge Readiness Report
        </h1>
        <p className="text-sm text-zinc-600">
          Executive summary of estimated product carbon footprint and data improvement roadmap.
        </p>
      </div>

      {/* Main Printable / Formatted Report Card */}
      <div
        id="readiness-report-document"
        className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6"
      >
        {/* Report Document Header */}
        <div className="border-b border-zinc-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-teal-900">CarbonBridge</span>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
                MSME Assessment
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ref ID: {assessment.id}
            </p>
          </div>

          <div className="text-xs text-zinc-500 sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Date: {createdAt}</span>
            </div>
            <p className="mt-0.5 font-medium text-zinc-700">Indian Industrial Baseline v1.2</p>
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-100 space-y-1">
            <span className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">
              Project
            </span>
            <p className="font-bold text-zinc-900 text-sm">{name}</p>
            <p className="text-zinc-600 truncate">{productProcess}</p>
          </div>

          <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-100 space-y-1">
            <span className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">
              Sector & Region
            </span>
            <p className="font-bold text-zinc-900 text-sm">
              {sector} • {region}
            </p>
            <p className="text-zinc-600">Manufacturing State: {region}</p>
          </div>
        </div>

        {/* Results Block */}
        <div className="bg-teal-50/40 border border-teal-200/80 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 block">
                Estimated Footprint
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl font-extrabold text-zinc-900">
                  {estimatedEmissions}
                </span>
                <span className="text-sm font-semibold text-zinc-600">
                  kg CO₂e/t
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 block">
                Data Readiness
              </span>
              <div className="mt-1">
                <ReadinessBadge level={readiness} size="md" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-teal-100 flex items-center justify-between text-xs text-zinc-700">
            <span>Uncertainty Range:</span>
            <span className="font-bold text-zinc-900">
              {uncertaintyMin}–{uncertaintyMax} kg CO₂e/t
            </span>
          </div>
        </div>

        {/* Main Drivers Breakdown as specified in Section 11 */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-500">
            Main Drivers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {drivers.slice(0, 3).map((driver) => (
              <div
                key={driver.name}
                className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-center justify-between"
              >
                <span className="font-medium text-zinc-700">{driver.name}</span>
                <span className="font-bold text-zinc-900">{driver.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Steps as specified in Section 11 */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-500">
            Recommended Next Steps
          </h2>
          <ol className="space-y-2 text-xs text-zinc-700 list-decimal list-inside">
            {recommendedSteps.map((step, idx) => (
              <li key={idx} className="bg-zinc-50 border border-zinc-200 rounded-lg p-2.5">
                <span className="text-zinc-900 font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Non-regulatory disclaimer as explicitly required in Section 11 */}
        <div
          id="report-disclaimer-box"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> CarbonBridge provides a statistical decision-support estimate. It is not a certified CBAM declaration or verified regulatory report.
          </p>
        </div>
      </div>

      {/* Buttons as specified in Section 11 */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200">
        <button
          type="button"
          id="btn-report-back-to-dashboard"
          onClick={onBackToDashboard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          id="btn-report-download-primary"
          onClick={handleDownload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>Download Report</span>
        </button>
      </div>
    </div>
  );
};
