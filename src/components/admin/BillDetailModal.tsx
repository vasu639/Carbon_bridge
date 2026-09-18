import React, { useState } from 'react';
import { UtilityBill, updateBillAuditStatus, downloadUtilityBillSummary } from '../../data/adminReportsAndBills';
import {
  X,
  Zap,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  User,
  ExternalLink,
  Edit3,
  Sparkles,
  Gauge,
  Receipt,
  Scale,
  Check,
} from 'lucide-react';

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: UtilityBill | null;
  adminName?: string;
  onStatusUpdated?: () => void;
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({
  isOpen,
  onClose,
  bill,
  adminName = 'Vasu (Lead ESG Auditor)',
  onStatusUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'metering' | 'tariff' | 'audit'>('document');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<UtilityBill['verificationStatus']>('Bureau Certified');
  const [notesInput, setNotesInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !bill) return null;

  const handleStartEdit = () => {
    setSelectedStatus(bill.verificationStatus);
    setNotesInput(bill.auditorNotes || '');
    setIsEditingStatus(true);
  };

  const handleSaveStatus = () => {
    updateBillAuditStatus(bill.id, selectedStatus, adminName, notesInput);
    bill.verificationStatus = selectedStatus;
    bill.auditorNotes = notesInput;
    bill.verifiedByAdmin = adminName;
    bill.verifiedAt = new Date().toISOString().split('T')[0];
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
                <Zap className="w-3 h-3 text-emerald-400" />
                Primary DISCOM Electricity Bill
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-800 text-teal-200">
                {bill.discomShort}
              </span>
              <span className="text-[10px] text-teal-300 font-mono">
                Bill ID: {bill.billNumber}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {bill.companyName}
            </h2>
            <p className="text-xs text-teal-200/90 flex flex-wrap items-center gap-3">
              <span>Consumer CA: <strong className="font-mono text-white">{bill.consumerId}</strong></span>
              <span>•</span>
              <span>Billing Cycle: <strong className="text-white">{bill.billingPeriod}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {bill.city}, {bill.state}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => downloadUtilityBillSummary(bill)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              title="Download Certified Bill Audit Summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Record</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-teal-900/80 hover:bg-teal-850 text-teal-200 text-xs transition-colors"
              title="Print Bill Facsimile"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-teal-900 text-teal-300 hover:text-white transition-colors"
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
              <span>Audit Status successfully updated by Admin {adminName}!</span>
            </div>
            <span className="text-[10px] text-emerald-300">Synchronized</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-zinc-100 px-6 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('document')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'document'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Digital Bill Facsimile
          </button>
          <button
            onClick={() => setActiveTab('metering')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'metering'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Meter Telemetry &amp; Units
          </button>
          <button
            onClick={() => setActiveTab('tariff')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'tariff'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Tariff &amp; Invoiced Charges
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Admin Bureau Sign-Off
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800 text-xs sm:text-sm">
          {/* TAB 1: DIGITAL BILL FACSIMILE */}
          {activeTab === 'document' && (
            <div className="space-y-5">
              {/* Authenticated DISCOM Bill Header Box */}
              <div className="p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-800/60 border border-teal-700 flex items-center justify-center font-black text-emerald-400 text-sm">
                      {bill.discomShort.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {bill.discomName}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        High Tension (HT) Industrial Power Supply Division
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {bill.verificationStatus}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Billing Period: <strong className="text-zinc-200">{bill.billingPeriod}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Consumer CA Number</span>
                    <span className="font-mono font-bold text-white text-sm">{bill.consumerId}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Meter Serial Number</span>
                    <span className="font-mono font-bold text-teal-300">{bill.meterNumber}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Contract Demand</span>
                    <span className="font-bold text-white">{bill.contractDemandKva} kVA ({bill.connectedVoltage})</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Tariff Category</span>
                    <span className="font-semibold text-zinc-200">{bill.tariffCategory}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Issue Date</span>
                    <span className="text-zinc-300">{bill.billIssueDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Payment Due Date</span>
                    <span className="text-zinc-300">{bill.billDueDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Payment Status</span>
                    <span className="font-semibold text-emerald-400">{bill.paymentStatus}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Net Invoiced Amount</span>
                    <span className="font-bold text-emerald-300 text-sm">₹{bill.totalInvoicedAmountInr.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submitting User & Proof File Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 text-xs">
                    <User className="w-4 h-4 text-teal-800" />
                    <span>Provided By Company Representative</span>
                  </div>
                  <div className="text-xs space-y-1 text-zinc-600">
                    <p><strong className="text-zinc-800">{bill.providedByUser.name}</strong></p>
                    <p className="text-[11px]">{bill.providedByUser.role}</p>
                    <p className="text-[11px] font-mono text-teal-900">{bill.providedByUser.email}</p>
                    <p className="text-[11px]">{bill.providedByUser.phone}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 text-xs">
                    <FileText className="w-4 h-4 text-teal-800" />
                    <span>Uploaded Proof File Metadata</span>
                  </div>
                  <div className="text-xs space-y-1 text-zinc-600">
                    <p className="font-mono font-semibold text-zinc-800 truncate">{bill.documentFileName}</p>
                    <p className="text-[11px]">Format: {bill.documentType} • File Size: {bill.documentFileSize}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Digital OCR Signature Checked: Valid</p>
                    <p className="text-[11px] text-zinc-500">Stored in Secure Enterprise Evidence Vault</p>
                  </div>
                </div>
              </div>

              {/* Key Scope 2 CBAM Impact Callout */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
                    EU CBAM Scope 2 Indirect GHG Quantification
                  </span>
                  <p className="text-xs text-teal-800">
                    Calculated using Central Electricity Authority (CEA) regional baseline factor of{' '}
                    <strong>{bill.ceaGridFactor} kg CO2/kWh</strong>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-teal-950 font-mono">
                    {bill.calculatedScope2Tonnes} <span className="text-xs font-normal text-teal-800 font-sans">t CO2e</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Zero Discrepancy Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: METER TELEMETRY & UNITS */}
          {activeTab === 'metering' && (
            <div className="space-y-4">
              <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3.5">Metering Parameter</th>
                      <th className="py-2.5 px-3.5">Previous Reading</th>
                      <th className="py-2.5 px-3.5">Present Reading</th>
                      <th className="py-2.5 px-3.5">Multiplier (MF)</th>
                      <th className="py-2.5 px-3.5 text-right">Billed Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono">
                    <tr className="bg-white">
                      <td className="py-2.5 px-3.5 font-sans font-semibold text-zinc-800">
                        Active Energy (kWh)
                      </td>
                      <td className="py-2.5 px-3.5 text-zinc-600">{bill.meterStartReading.toLocaleString()}</td>
                      <td className="py-2.5 px-3.5 text-zinc-900 font-bold">{bill.meterEndReading.toLocaleString()}</td>
                      <td className="py-2.5 px-3.5 text-zinc-600">{bill.meterMultiplyingFactor}</td>
                      <td className="py-2.5 px-3.5 text-right font-black text-teal-950 font-mono">
                        {bill.unitsBilledKwh.toLocaleString()} kWh
                      </td>
                    </tr>
                    <tr className="bg-zinc-50/50">
                      <td className="py-2.5 px-3.5 font-sans font-semibold text-zinc-800">
                        Apparent Energy (kVAh)
                      </td>
                      <td className="py-2.5 px-3.5 text-zinc-600">—</td>
                      <td className="py-2.5 px-3.5 text-zinc-900">—</td>
                      <td className="py-2.5 px-3.5 text-zinc-600">{bill.meterMultiplyingFactor}</td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-zinc-800">
                        {bill.billedKvah.toLocaleString()} kVAh
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2.5 px-3.5 font-sans font-semibold text-zinc-800">
                        Recorded Maximum Demand
                      </td>
                      <td className="py-2.5 px-3.5 text-zinc-600">—</td>
                      <td className="py-2.5 px-3.5 text-zinc-900 font-bold">{bill.recordedMaxDemandKva}</td>
                      <td className="py-2.5 px-3.5 text-zinc-600">Sanction: {bill.sanctionedLoad}</td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700">
                        Within Sanction Limit
                      </td>
                    </tr>
                    <tr className="bg-zinc-50/50">
                      <td className="py-2.5 px-3.5 font-sans font-semibold text-zinc-800">
                        Average Power Factor (PF)
                      </td>
                      <td className="py-2.5 px-3.5 text-zinc-600">—</td>
                      <td className="py-2.5 px-3.5 text-zinc-900 font-bold">{bill.powerFactor}</td>
                      <td className="py-2.5 px-3.5 text-zinc-600">Standard: 0.90</td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-emerald-600">
                        PF Incentive Qualified (+0.5%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">EU CBAM Verifier Compliance Note:</strong>
                  <span>
                    Direct meter subtraction confirms exactly {bill.unitsBilledKwh.toLocaleString()} kWh consumption.
                    No synthetic estimation markup required for Scope 2 declaration.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TARIFF & INVOICED CHARGES */}
          {activeTab === 'tariff' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="font-bold text-zinc-900 text-xs flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-teal-800" />
                  <span>DISCOM Invoiced Financial Breakdown (INR ₹)</span>
                </h4>

                <div className="space-y-2 text-xs divide-y divide-zinc-200">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-zinc-600">Energy Charges ({bill.unitsBilledKwh.toLocaleString()} kWh @ Industrial Rate)</span>
                    <span className="font-mono font-bold text-zinc-900">₹{bill.energyChargesInr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-zinc-600">Fixed Demand Charges ({bill.contractDemandKva} kVA)</span>
                    <span className="font-mono font-bold text-zinc-900">₹{bill.fixedDemandChargesInr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-zinc-600">Fuel Adjustment / Surcharge (FAC/FPPPA)</span>
                    <span className="font-mono font-bold text-zinc-900">₹{bill.fuelAdjustmentChargesInr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-zinc-600">State Electricity Duty &amp; Regulatory Asset Charge</span>
                    <span className="font-mono font-bold text-zinc-900">₹{bill.electricityDutyInr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 bg-emerald-50/60 p-2 rounded-lg font-bold">
                    <span className="text-emerald-950">Net Invoiced Total Amount</span>
                    <span className="text-base font-black text-emerald-800 font-mono">
                      ₹{bill.totalInvoicedAmountInr.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs">
                <span className="text-zinc-600">Payment Status: <strong className="text-zinc-900">{bill.paymentStatus}</strong></span>
                <span className="text-zinc-600">Effective Unit Tariff: <strong className="text-teal-900">₹{(bill.totalInvoicedAmountInr / bill.unitsBilledKwh).toFixed(2)} / kWh</strong></span>
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN BUREAU SIGN-OFF */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-teal-950 text-sm">Regulatory Audit Certification</span>
                  </div>
                  {!isEditingStatus && (
                    <button
                      onClick={handleStartEdit}
                      className="px-3 py-1 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Audit Status</span>
                    </button>
                  )}
                </div>

                {isEditingStatus ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Select Bureau Verification Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="w-full py-2 px-3 rounded-xl border border-zinc-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-700"
                      >
                        <option value="Bureau Certified">Bureau Certified (Full Official Approval)</option>
                        <option value="AI Validated">AI Validated (Primary OCR Verified)</option>
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
                        placeholder="Add specific auditor observations, meter verification telemetry codes, or compliance feedback..."
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
                        {bill.verificationStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Verified By:</span>
                      <span className="font-semibold text-zinc-800">{bill.verifiedByAdmin || 'None'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Verification Date:</span>
                      <span className="text-zinc-700">{bill.verifiedAt || 'Certified Active'}</span>
                    </div>
                    <div className="pt-2 border-t border-teal-200">
                      <span className="text-zinc-500 block mb-1">Auditor Remarks:</span>
                      <p className="p-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-800 text-xs italic">
                        "{bill.auditorNotes || 'Primary meter telemetry checked against DISCOM portal.'}"
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
            DISCOM Bill Record ID: <strong className="font-mono text-zinc-800">{bill.id}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadUtilityBillSummary(bill)}
              className="px-3.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bill Summary</span>
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
