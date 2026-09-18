import React, { useState } from 'react';
import { CompanyRegistryEntry, downloadCompanyReportFile } from '../../data/companyRegistryService';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  X,
  Building2,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  User,
  Calendar,
  Download,
  Printer,
  FileText,
  Zap,
  Flame,
  Factory,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface CompanyDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: CompanyRegistryEntry | null;
  adminName?: string;
}

export const CompanyDossierModal: React.FC<CompanyDossierModalProps> = ({
  isOpen,
  onClose,
  entry,
  adminName,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'operational' | 'cbam' | 'audit'>('profile');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !entry) return null;

  const { company, assessment, source } = entry;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-teal-950 text-white px-6 py-5 flex items-start justify-between gap-4 border-b border-teal-900">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-teal-800 text-teal-200">
                Official Enterprise Dossier
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Udyam Verified
              </span>
              <span className="text-[10px] text-teal-300 font-mono">
                Source: {source}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {company.companyName}
            </h2>
            <p className="text-xs text-teal-200/90 flex flex-wrap items-center gap-3">
              <span>{company.enterpriseCategory} Enterprise</span>
              <span>•</span>
              <span>Sector: {company.sector}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {company.city}, {company.state}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => downloadCompanyReportFile(entry)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              title="Download Full CBAM Compliance Audit Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-teal-900/80 hover:bg-teal-850 text-teal-200 text-xs transition-colors"
              title="Print Dossier"
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

        {/* Tab Navigation */}
        <div className="bg-zinc-100 px-6 border-b border-zinc-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Statutory &amp; Company Info
          </button>
          <button
            onClick={() => setActiveTab('operational')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'operational'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Energy &amp; Operational Data
          </button>
          <button
            onClick={() => setActiveTab('cbam')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cbam'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            EU CBAM Carbon Intensity
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-teal-800 text-teal-950 font-bold bg-white -mb-px rounded-t-lg'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Verification Checks &amp; Next Steps
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800">
          {/* TAB 1: Profile & Statutory */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Statutory Registration */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Statutory Identification
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-zinc-200/60">
                      <span className="text-zinc-500">Udyam Reg. Number (URN):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-teal-950 bg-teal-100/70 px-2 py-0.5 rounded">
                          {company.udyamNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(company.udyamNumber, 'urn')}
                          className="text-zinc-400 hover:text-zinc-700"
                          title="Copy URN"
                        >
                          {copiedText === 'urn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-200/60">
                      <span className="text-zinc-500">GSTIN:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-zinc-900">
                          {company.gstin}
                        </span>
                        <button
                          onClick={() => handleCopy(company.gstin, 'gstin')}
                          className="text-zinc-400 hover:text-zinc-700"
                          title="Copy GSTIN"
                        >
                          {copiedText === 'gstin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-200/60">
                      <span className="text-zinc-500">Enterprise Scale:</span>
                      <span className="font-semibold text-zinc-800">
                        {company.enterpriseCategory} (MSME Act 2006)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-zinc-500">Onboarding Date:</span>
                      <span className="font-medium text-zinc-700">
                        {company.createdAt || 'Registered'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Authorized Contact & Plant */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Authorized Signatory &amp; Plant
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-zinc-200/60">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Signatory:
                      </span>
                      <span className="font-semibold text-zinc-900">
                        {company.authorizedPerson}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-200/60">
                      <span className="text-zinc-500">Designation:</span>
                      <span className="text-zinc-800 font-medium">
                        {company.designation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-200/60">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email:
                      </span>
                      <a href={`mailto:${company.email}`} className="font-mono text-teal-800 hover:underline">
                        {company.email}
                      </a>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Phone:
                      </span>
                      <span className="font-mono text-zinc-800">
                        {company.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manufacturing Location */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-center shrink-0">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Manufacturing Works &amp; Plant Facility</p>
                    <p className="text-xs text-zinc-600">
                      {company.city}, State of {company.state}, India
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  Sector: {company.sector}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Operational & Energy Data */}
          {activeTab === 'operational' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                  <span className="text-zinc-500 text-xs">Production Volume</span>
                  <p className="text-xl font-bold text-zinc-900 mt-1">
                    {assessment.productionVolume.toLocaleString()}
                    <span className="text-xs font-normal text-zinc-500 ml-1">
                      {assessment.productionUnit}
                    </span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">Active manufacturing output cycle</p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                  <span className="text-zinc-500 text-xs">Electricity Consumed</span>
                  <p className="text-xl font-bold text-teal-950 mt-1">
                    {assessment.electricityConsumed.toLocaleString()}
                    <span className="text-xs font-normal text-zinc-500 ml-1">
                      {assessment.electricityUnit}
                    </span>
                  </p>
                  <p className="text-[10px] text-teal-700 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    {assessment.billDiscom || 'Main State DISCOM'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                  <span className="text-zinc-500 text-xs">Direct Fuel Consumed</span>
                  <p className="text-xl font-bold text-zinc-900 mt-1">
                    {assessment.fuelConsumed.toLocaleString()}
                    <span className="text-xs font-normal text-zinc-500 ml-1">
                      {assessment.fuelUnit}
                    </span>
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-600" />
                    {assessment.fuelType}
                  </p>
                </div>
              </div>

              {/* Utility Audit Verification */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Utility DISCOM Primary Metering Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    assessment.billVerified ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {assessment.billVerified ? 'Verified with DISCOM Bill' : 'Unverified / Self-Declared'}
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  Document Reference: <span className="font-mono font-medium">{assessment.billDocName || 'Official Utility Statement Annexure'}</span>
                </p>
              </div>

              {/* Specific Manufacturing Process */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Manufacturing Process Line
                </h4>
                <p className="text-sm font-semibold text-zinc-900">
                  {assessment.productProcess}
                </p>
                {assessment.description && (
                  <p className="text-xs text-zinc-600 mt-1">{assessment.description}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EU CBAM Carbon Intensity */}
          {activeTab === 'cbam' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-teal-300 font-semibold tracking-wide uppercase">
                    Specific Embedded Emissions (Scope 1 + 2)
                  </span>
                  <div className="text-3xl font-extrabold mt-1">
                    {assessment.estimatedEmissions}{' '}
                    <span className="text-sm font-normal text-teal-200">kg CO2e / tonne</span>
                  </div>
                  <p className="text-xs text-teal-300/80 mt-1 font-mono">
                    95% Uncertainty Range: {assessment.uncertaintyMin} – {assessment.uncertaintyMax} kg CO2e / tonne
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-teal-300 block mb-1">EU CBAM Data Readiness:</span>
                  <ReadinessBadge level={assessment.readiness} />
                </div>
              </div>

              {/* Emission Drivers */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Emission Source Breakdown (Drivers)
                </h4>
                <div className="space-y-2.5">
                  {assessment.drivers.map((driver) => (
                    <div key={driver.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-zinc-800">{driver.name}</span>
                        <span className="font-bold text-teal-900">{driver.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-800 h-2 rounded-full"
                          style={{ width: `${driver.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Verification Checks & Next Steps */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Data Quality &amp; Compliance Checks
                </h4>
                <div className="space-y-2">
                  {assessment.dataQuality.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-zinc-200 bg-white flex items-start gap-3"
                    >
                      {check.status === 'valid' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">{check.label}</p>
                        {check.detail && (
                          <p className="text-xs text-zinc-500 mt-0.5">{check.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Recommended Decarbonization Steps for European Importers
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-700 list-disc pl-5">
                  {assessment.recommendedSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-zinc-500">
            Audit inspected by Admin: <span className="font-bold text-teal-900">{adminName || 'AUTHORIZED AUDITOR'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 font-semibold"
            >
              Close Dossier
            </button>
            <button
              onClick={() => downloadCompanyReportFile(entry)}
              className="px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Compliance Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
