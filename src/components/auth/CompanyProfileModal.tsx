import React, { useState } from 'react';
import { MSMECompany } from '../../types';
import {
  X,
  Building2,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  LogOut,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Award,
  Edit2,
  Check,
  RotateCcw,
} from 'lucide-react';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: MSMECompany | null;
  onLogout: () => void;
  onSwitchAccount?: () => void;
  onUpdateCompany?: (updated: MSMECompany) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  company,
  onLogout,
  onSwitchAccount,
  onUpdateCompany,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState(company?.phone || '');
  const [editedEmail, setEditedEmail] = useState(company?.email || '');
  const [editedCity, setEditedCity] = useState(company?.city || '');
  const [editedPerson, setEditedPerson] = useState(company?.authorizedPerson || '');

  if (!isOpen || !company) return null;

  const handleSaveEdit = () => {
    if (onUpdateCompany) {
      onUpdateCompany({
        ...company,
        phone: editedPhone,
        email: editedEmail,
        city: editedCity,
        authorizedPerson: editedPerson,
      });
    }
    setIsEditing(false);
  };

  return (
    <div
      id="company-profile-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="company-profile-modal-card"
        className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden text-zinc-900 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-teal-950 text-white p-5 sm:p-6 relative">
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-900/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-emerald-300 flex items-center justify-center font-bold text-lg border border-teal-700 shadow-sm shrink-0">
              {company.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
                {company.companyName}
              </h2>
              <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                Udyam Verified MSME • {company.enterpriseCategory}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Statutory Registration Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                Udyam Reg. (URN)
              </span>
              <p className="font-mono text-xs font-bold text-teal-950 break-all">
                {company.udyamNumber}
              </p>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                GSTIN Tax ID
              </span>
              <p className="font-mono text-xs font-bold text-zinc-800 break-all">
                {company.gstin}
              </p>
            </div>
          </div>

          {/* Plant & Representative Details */}
          <div className="space-y-3 text-xs text-zinc-700 border-t border-b border-zinc-100 py-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                Plant Location
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCity}
                  onChange={(e) => setEditedCity(e.target.value)}
                  className="px-2 py-1 rounded border border-zinc-300 text-xs w-48 text-right font-medium text-zinc-900"
                />
              ) : (
                <span className="font-medium text-zinc-900">{company.city}, {company.state}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                Manufacturing Sector
              </span>
              <span className="font-medium text-zinc-900">{company.sector} Industry</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-zinc-400" />
                Authorized Signatory
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPerson}
                  onChange={(e) => setEditedPerson(e.target.value)}
                  className="px-2 py-1 rounded border border-zinc-300 text-xs w-48 text-right font-medium text-zinc-900"
                />
              ) : (
                <span className="font-medium text-zinc-900">
                  {company.authorizedPerson} ({company.designation})
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                Corporate Email
              </span>
              {isEditing ? (
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="px-2 py-1 rounded border border-zinc-300 text-xs w-48 text-right font-medium text-zinc-900"
                />
              ) : (
                <span className="font-medium text-zinc-900 font-mono">{company.email}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                Contact Phone
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="px-2 py-1 rounded border border-zinc-300 text-xs w-48 text-right font-medium text-zinc-900"
                />
              ) : (
                <span className="font-medium text-zinc-900 font-mono">{company.phone}</span>
              )}
            </div>
          </div>

          {/* Status Box */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-teal-950">Active Exporter Account</p>
              <p className="text-teal-800 text-[11px] leading-relaxed mt-0.5">
                Assessments, DISCOM utility verifications, and downloadable CBAM readiness reports are archived under this enterprise profile.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Contact</span>
                </button>
              )}

              {onSwitchAccount && (
                <button
                  id="btn-switch-msme-account"
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchAccount();
                  }}
                  className="text-xs text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-4"
                >
                  Switch Account
                </button>
              )}
            </div>

            <button
              id="btn-logout-msme"
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
