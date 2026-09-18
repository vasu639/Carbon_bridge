import React, { useState } from 'react';
import { UserReport, updateReportAuditStatus, downloadUserReportCertificate } from '../../data/adminReportsAndBills';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  X,
  FileText,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Zap,
  Flame,
  Factory,
  Check,
  Edit3,
  ExternalLink,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: UserReport | null;
  adminName?: string;
  onStatusUpdated?: () => void;
  onViewAssociatedBill?: (billId: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  adminName = 'Vasu (Lead ESG Auditor)',
  onStatusUpdated,
  onViewAssociatedBill,
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'emissions' | 'user' | 'audit'>('certificate');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<UserReport['auditStatus']>('Bureau Certified');
  const [notesInput, setNotesInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !report) return null;

  const handleStartEdit = () => {
    setSelectedStatus(report.auditStatus);
    setNotesInput(report.auditorNotes || '');
    setIsEditingStatus(true);
  };

  const handleSaveStatus = () => {
    updateReportAuditStatus(report.id, selectedStatus, adminName, notesInput);
    report.auditStatus = selectedStatus;
    report.auditorNotes = notesInput;
    report.verifiedByAdmin = adminName;
    report.verifiedAt = new Date().toISOString().split('T')[0];
    setIsEditingStatus(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    onStatusUpdated?.();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-zinc-900 text-white px-6 py-5 flex items-start justify-between gap-4 border-b border-teal-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-400" />
                EU CBAM Compliance Audit Report
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-800 text-teal-200">
                {report.sector} Sector
              </span>
              <span className="text-[10px] text-teal-300 font-mono">
                {report.reportNumber}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {report.companyName}
            </h2>
            <p className="text-xs text-teal-200/90 flex flex-wrap items-center gap-3">
              <span>Submitted by: <strong className="text-white">{report.submittedBy}</strong> ({report.userRole})</span>
              <span>•</span>
              <span>Date: <strong className="text-white">{report.submittedDate}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {report.city}, {report.state}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => downloadUserReportCertificate(report)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Download Full CBAM Compliance Audit Certificate"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Cert</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-teal-900/80 hover:bg-teal-850 text-teal-200 text-xs transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-teal-900 text-teal-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {saveSuccess && (
          <div className="bg-emerald-900 text-emerald-100 px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Report certification signed off by Admin {adminName}!</span>
            </div>
            <span className="text-[10px] text-emerald-300">Synchronized</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-zinc-100 px-6 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'certificate'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Form 4 CBAM Declaration
          </button>
          <button
            onClick={() => setActiveTab('emissions')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'emissions'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Scope 1 &amp; 2 Carbon Intensity
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'user'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Submitting User &amp; Company
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Audit Approval &amp; Signature
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800 text-xs sm:text-sm">
          {/* TAB 1: CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-5">
              {/* Official Certificate Banner */}
              <div className="p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      Regulation (EU) 2023/956 Compliance Certification
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {report.consignmentName}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {report.auditStatus}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1 font-mono">
                      Ref: {report.reportNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Production Volume</span>
                    <span className="font-bold text-white text-sm font-mono">
                      {report.productionVolume.toLocaleString()} {report.productionUnit}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Specific GHG Intensity</span>
                    <span className="font-black text-emerald-400 text-sm font-mono">
                      {report.totalEmissionsKgPerTonne} kg/t
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">EU CBAM Readiness</span>
                    <div className="mt-0.5"><ReadinessBadge level={report.readiness} /></div>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Estimated EU ETS Carbon Tax</span>
                    <span className="font-bold text-amber-300 text-sm font-mono">
                      €{report.estimatedCbTaxEuros.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Manufacturing Process</span>
                    <span className="text-zinc-200">{report.productProcess}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Attached DISCOM Power Bill</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-teal-300 font-mono text-[11px] truncate mr-2">
                        {report.associatedBillDoc}
                      </span>
                      {onViewAssociatedBill && report.associatedBillId && (
                        <button
                          onClick={() => onViewAssociatedBill(report.associatedBillId)}
                          className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0"
                        >
                          <span>Inspect Bill</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Emissions Distribution Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Direct (Scope 1) Fuel &amp; Process
                  </span>
                  <div className="text-xl font-black text-teal-950 font-mono">
                    {report.scope1EmissionsKgPerTonne} <span className="text-xs font-normal text-zinc-500 font-sans">kg/t</span>
                  </div>
                  <p className="text-[10px] text-teal-700 font-medium">Fuel: {report.fuelConsumed} {report.fuelUnit} ({report.fuelType})</p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Indirect (Scope 2) Grid Power
                  </span>
                  <div className="text-xl font-black text-teal-950 font-mono">
                    {report.scope2EmissionsKgPerTonne} <span className="text-xs font-normal text-zinc-500 font-sans">kg/t</span>
                  </div>
                  <p className="text-[10px] text-teal-700 font-medium">Power: {report.electricityConsumedKwh.toLocaleString()} kWh</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Total Specific GHG
                  </span>
                  <div className="text-xl font-black text-emerald-950 font-mono">
                    {report.totalEmissionsKgPerTonne} <span className="text-xs font-normal text-zinc-500 font-sans">kg/t</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-medium">95% CI: {report.uncertaintyMin}–{report.uncertaintyMax} kg/t</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCOPE 1 & 2 CARBON INTENSITY */}
          {activeTab === 'emissions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="font-bold text-zinc-900 text-xs">Primary Emission Drivers Breakdown</h4>
                <div className="space-y-2 text-xs">
                  {report.assessment.drivers.map((d, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-700">{d.name} ({d.category.toUpperCase()})</span>
                        <span className="font-bold text-zinc-900 font-mono">{d.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.category === 'electricity'
                              ? 'bg-emerald-600'
                              : d.category === 'fuel'
                              ? 'bg-amber-600'
                              : 'bg-teal-700'
                          }`}
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="font-bold text-zinc-900 text-xs">Data Quality Verification Checks</h4>
                <div className="space-y-1.5 text-xs">
                  {report.assessment.dataQuality.map((dq, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200">
                      <span className="text-zinc-700 font-medium">{dq.label}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {dq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMITTING USER & COMPANY */}
          {activeTab === 'user' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Submitting Authorized User
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-900">{report.submittedBy}</p>
                    <p className="text-zinc-600">{report.userRole}</p>
                    <p className="font-mono text-teal-800">{report.submittedByEmail}</p>
                    <p className="text-zinc-500">{report.userPhone}</p>
                    <p className="text-zinc-400 text-[10px] pt-1">Report Generated on: {report.submittedDate}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                    Manufacturing Enterprise Details
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-900">{report.companyName}</p>
                    <p className="font-mono text-zinc-800">URN: {report.udyamNumber}</p>
                    <p className="font-mono text-zinc-600">GSTIN: {report.gstin}</p>
                    <p className="text-zinc-600">{report.enterpriseCategory} Enterprise • {report.sector}</p>
                    <p className="text-zinc-500">{report.city}, {report.state}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT APPROVAL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-teal-950 text-sm">Regulatory Bureau Audit Sign-Off</span>
                  </div>
                  {!isEditingStatus && (
                    <button
                      onClick={handleStartEdit}
                      className="px-3 py-1 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  )}
                </div>

                {isEditingStatus ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Select Verification Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="w-full py-2 px-3 rounded-xl border border-zinc-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-700"
                      >
                        <option value="Bureau Certified">Bureau Certified (Full Regulatory Approval)</option>
                        <option value="AI Validated">AI Validated (Primary Assessment Verified)</option>
                        <option value="Pending Review">Pending Review (Secondary Check Required)</option>
                        <option value="Flagged Discrepancy">Flagged Discrepancy (Requires Rectification)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Auditor Notes &amp; Verification Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Add specific auditor findings or verification stamp remarks..."
                        className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-teal-700"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleSaveStatus}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Save &amp; Sign Off
                      </button>
                      <button
                        onClick={() => setIsEditingStatus(false)}
                        className="px-3 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Current Status:</span>
                      <span className="font-bold text-emerald-800 font-mono px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                        {report.auditStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Signed Off By:</span>
                      <span className="font-semibold text-zinc-800">{report.verifiedByAdmin || 'None'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Date:</span>
                      <span className="text-zinc-700">{report.verifiedAt || 'Certified Active'}</span>
                    </div>
                    <div className="pt-2 border-t border-teal-200">
                      <span className="text-zinc-500 block mb-1">Auditor Remarks:</span>
                      <p className="p-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 text-xs italic">
                        "{report.auditorNotes || 'Standard EU CBAM calculation criteria validated.'}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-50 px-6 py-3.5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-zinc-500">
            CBAM Report ID: <strong className="font-mono text-zinc-800">{report.id}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadUserReportCertificate(report)}
              className="px-3.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Cert</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-medium text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
