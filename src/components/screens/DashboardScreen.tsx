import React from 'react';
import { Assessment, MSMECompany } from '../../types';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  Plus,
  ArrowRight,
  HelpCircle,
  Factory,
  MapPin,
  FileCheck2,
  Scale,
  Sparkles,
  Inbox,
  RotateCcw,
  Zap,
  Building2,
  ShieldCheck,
  LogIn,
  Upload,
} from 'lucide-react';

interface DashboardScreenProps {
  assessments: Assessment[];
  onStartNew: () => void;
  onViewAssessment: (assessment: Assessment) => void;
  onOpenHelp: () => void;
  onToggleEmptyState?: () => void;
  isEmptyView?: boolean;
  msmeCompany: MSMECompany | null;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenBillAnalyzer: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  assessments,
  onStartNew,
  onViewAssessment,
  onOpenHelp,
  onToggleEmptyState,
  isEmptyView = false,
  msmeCompany,
  onOpenAuthModal,
  onOpenBillAnalyzer,
}) => {
  const displayAssessments = isEmptyView ? [] : assessments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* MSME Company Account Status Banner */}
      {msmeCompany ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-teal-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-800 text-emerald-300 flex items-center justify-center font-bold text-sm border border-teal-700">
              {msmeCompany.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-base tracking-tight">
                  {msmeCompany.companyName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Udyam Verified
                </span>
              </div>
              <p className="text-xs text-teal-200 mt-0.5">
                URN: <span className="font-mono text-emerald-300">{msmeCompany.udyamNumber}</span> •{' '}
                {msmeCompany.enterpriseCategory} Enterprise • {msmeCompany.city}, {msmeCompany.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="dash-upload-bill-btn"
              onClick={onOpenBillAnalyzer}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-teal-950" />
              <span>Upload Electricity Bill</span>
            </button>
            <button
              id="dash-new-assessment-btn"
              onClick={onStartNew}
              className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>New Assessment</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-teal-900 to-zinc-900 text-white border border-teal-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> MSME Exporter Portal
              </span>
              <span className="text-xs text-teal-300">Udyam Registration Linked</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Log In or Create Your MSME Account
            </h3>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              Register your manufacturing enterprise with your URN to archive carbon assessments, auto-match state electricity CEA factors, and attach DISCOM bills for verified CBAM reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="dash-btn-login"
              type="button"
              onClick={() => onOpenAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>

            <button
              id="dash-btn-register"
              type="button"
              onClick={() => onOpenAuthModal('register')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 text-xs font-bold transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            Designed for Indian MSME Industrial Exporters
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
            Understand Your Product Carbon Footprint
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
            Get a statistical first estimate using the operational data you already have.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-hero-new-btn"
              onClick={onStartNew}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-medium text-sm transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>+ New Assessment</span>
            </button>

            <button
              id="dashboard-hero-upload-bill-btn"
              onClick={onOpenBillAnalyzer}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-semibold text-sm transition-all shadow-xs"
            >
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>⚡ Upload Electricity Bill (AI Audit)</span>
            </button>

            <button
              id="dashboard-hero-how-it-works-btn"
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-teal-900 font-medium py-2 px-2 hover:underline transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>How it works</span>
            </button>
          </div>
        </div>

        {/* Quick MSME benefit badges */}
        <div className="mt-8 pt-6 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-teal-800 shrink-0" />
            <span>Covers Steel, Aluminium, Cement & Fertilisers</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-800 shrink-0" />
            <span>Honest uncertainty bounds with 95% CI</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-teal-800 shrink-0" />
            <span>Prepares data for global buyer compliance</span>
          </div>
        </div>
      </div>

      {/* Featured AI Bill Audit Banner Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 border border-teal-800 shadow-md">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>EU CBAM Utility Verification Requirement</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Have your monthly DISCOM electricity bill?
          </h3>
          <p className="text-xs text-teal-100/90 leading-relaxed">
            Our AI energy auditor parses your active energy (kWh), contract demand, and industrial tariff category to apply official state CEA grid emission baselines. See what proof is needed and get an instant audit-grade estimate.
          </p>
        </div>

        <button
          id="btn-banner-open-bill-audit"
          type="button"
          onClick={onOpenBillAnalyzer}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-bold text-sm transition-all shadow-sm"
        >
          <Upload className="w-4 h-4 text-teal-950" />
          <span>Upload Bill & Audit Proof</span>
          <ArrowRight className="w-4 h-4 text-teal-950" />
        </button>
      </div>

      {/* Assessments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Your Assessments</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Saved operational reviews and product footprint evaluations
            </p>
          </div>

          {onToggleEmptyState && (
            <button
              id="dashboard-toggle-empty-state-btn"
              onClick={onToggleEmptyState}
              className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-200 hover:bg-zinc-50 transition-colors"
              title="Preview empty state requirement"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEmptyView ? 'Show Sample Assessments' : 'Preview Empty State'}</span>
            </button>
          )}
        </div>

        {displayAssessments.length === 0 ? (
          /* Empty State as requested in Section 4 & Section 12 */
          <div
            id="dashboard-empty-state"
            className="bg-white border border-dashed border-zinc-300 rounded-xl p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900">No assessments yet.</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Create your first CarbonBridge assessment to get started.
              </p>
            </div>

            <div className="pt-2">
              <button
                id="empty-state-create-btn"
                onClick={onStartNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-sm font-medium transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assessment</span>
              </button>
            </div>
          </div>
        ) : (
          /* Assessment Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayAssessments.map((assessment) => (
              <div
                key={assessment.id}
                id={`assessment-card-${assessment.id}`}
                className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-zinc-900 text-base">
                        {assessment.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span className="font-medium text-teal-800">{assessment.sector}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          {assessment.region}
                        </span>
                      </div>
                    </div>
                    <ReadinessBadge level={assessment.readiness} size="sm" />
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-2">
                    {assessment.productProcess}
                  </p>

                  <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-zinc-600 font-medium block">
                        Estimated Emissions
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-bold text-zinc-900">
                          {assessment.estimatedEmissions}
                        </span>
                        <span className="text-xs font-normal text-zinc-600">
                          kg CO₂e/t
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-zinc-600">
                      <span>Uncertainty</span>
                      <p className="font-medium text-zinc-700">
                        {assessment.uncertaintyMin}–{assessment.uncertaintyMax} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600">
                    Logged: {assessment.createdAt}
                  </span>
                  <button
                    id={`view-assessment-${assessment.id}-btn`}
                    onClick={() => onViewAssessment(assessment)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 hover:text-teal-700 hover:underline transition-colors"
                  >
                    <span>View Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
