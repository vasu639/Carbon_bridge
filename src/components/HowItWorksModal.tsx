import React from 'react';
import { X, CheckCircle2, Factory, Zap, Flame, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onStartAssessment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        id="how-it-works-modal"
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">How CarbonBridge Works</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Simple carbon decision-support designed for Indian MSME manufacturers & exporters
            </p>
          </div>
          <button
            id="close-how-it-works-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-zinc-600">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">
              1. What is an embedded product carbon footprint?
            </h3>
            <p className="leading-relaxed">
              When exporting products like steel, aluminium, or cement to international buyers (such as in the EU), customers increasingly ask for the greenhouse gas emissions embedded per tonne of finished product. CarbonBridge gives you an immediate statistical first estimate without hiring expensive consultants or buying complicated software.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">
              2. What information do you need to begin?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Factory className="w-4 h-4" />
                </div>
                <span className="font-semibold text-zinc-900 text-xs">Production Volume</span>
                <span className="text-xs text-zinc-500">Monthly or annual tonnage from dispatch logs.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-semibold text-zinc-900 text-xs">Electricity Consumption</span>
                <span className="text-xs text-zinc-500">kWh numbers straight from your DISCOM bills.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-1.5">
                <div className="w-8 h-8 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="font-semibold text-zinc-900 text-xs">Fuel Consumed</span>
                <span className="text-xs text-zinc-500">Diesel, furnace oil, coal, or gas volume logged.</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">
              3. The 4-Step Guided Journey
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded bg-zinc-50">
                <span className="font-bold text-teal-900 w-5">01</span>
                <div>
                  <span className="font-semibold text-zinc-900">Define</span>: Select your sector (Steel, Aluminium, Cement, Fertiliser) and Indian manufacturing state.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded bg-zinc-50">
                <span className="font-bold text-teal-900 w-5">02</span>
                <div>
                  <span className="font-semibold text-zinc-900">Enter Data</span>: Fill in standard operational metrics. Missing data will not break the tool; it will just reflect in the uncertainty range.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded bg-zinc-50">
                <span className="font-bold text-teal-900 w-5">03</span>
                <div>
                  <span className="font-semibold text-zinc-900">Review</span>: Verify inputs and check inline data quality flags before calculating.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded bg-zinc-50">
                <span className="font-bold text-teal-900 w-5">04</span>
                <div>
                  <span className="font-semibold text-zinc-900">Results & Next Steps</span>: View your estimated kg CO₂e/tonne, see main drivers, and get practical tips on which records to sharpen.
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">Important Academic & Advisory Boundary:</span>
              CarbonBridge is a statistical decision-support tool. It is intended to help Indian MSME managers understand operational hotspots and benchmark readiness. It is not an officially certified CBAM declaration or a third-party accredited audit.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 bg-zinc-50 border-t border-zinc-200">
          <button
            id="modal-close-secondary-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            Close
          </button>
          <button
            id="modal-start-assessment-btn"
            onClick={() => {
              onClose();
              onStartAssessment();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Start First Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
