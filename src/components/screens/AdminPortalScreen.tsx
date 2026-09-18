import React, { useState, useEffect, useMemo } from 'react';
import {
  AdminUser,
  AdminSession,
  AUTHORIZED_ADMINS,
  authenticateAdmin,
  getActiveAdminSession,
  clearAdminSession,
} from '../../data/adminUsers';
import {
  CompanyRegistryEntry,
  getAllCompaniesRegistry,
  downloadCompanyReportFile,
  downloadAllCompaniesCSV,
  downloadAllCompaniesJSON,
} from '../../data/companyRegistryService';
import {
  UserReport,
  UtilityBill,
  getAllUserReports,
  getAllUtilityBills,
  downloadAllReportsCSV,
  downloadAllBillsCSV,
  downloadUserReportCertificate,
  downloadUtilityBillSummary,
} from '../../data/adminReportsAndBills';
import { CompanyDossierModal } from '../admin/CompanyDossierModal';
import { BillDetailModal } from '../admin/BillDetailModal';
import { ReportDetailModal } from '../admin/ReportDetailModal';
import { ReadinessBadge } from '../ui/ReadinessBadge';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  Key,
  LogIn,
  LogOut,
  Building2,
  Download,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  Eye,
  EyeOff,
  Factory,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  BarChart3,
  Calendar,
  Zap,
  MapPin,
  Receipt,
  FileText,
  Users,
  PieChart,
  Check,
  TrendingDown,
  Scale,
  Award,
  Clock,
} from 'lucide-react';
import { Sector, ReadinessLevel } from '../../types';

interface AdminPortalScreenProps {
  onBackToDashboard: () => void;
  onNavigateHome: () => void;
  activeAdminSession?: AdminSession | null;
  onLogoutAdmin?: () => void;
}

type AdminSection = 'reports' | 'bills' | 'companies' | 'users' | 'analytics';

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({
  onBackToDashboard,
  onNavigateHome,
  activeAdminSession,
  onLogoutAdmin,
}) => {
  // Admin Authentication State
  const [activeSession, setActiveSession] = useState<AdminSession | null>(
    activeAdminSession || getActiveAdminSession()
  );
  const [adminNameInput, setAdminNameInput] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize if prop changes
  useEffect(() => {
    if (activeAdminSession !== undefined) {
      setActiveSession(activeAdminSession || getActiveAdminSession());
    }
  }, [activeAdminSession]);

  // Navigation section
  const [currentSection, setCurrentSection] = useState<AdminSection>('reports');

  // Datasets
  const [companies, setCompanies] = useState<CompanyRegistryEntry[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modals state
  const [selectedCompanyEntry, setSelectedCompanyEntry] = useState<CompanyRegistryEntry | null>(null);
  const [isCompanyDossierOpen, setIsCompanyDossierOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [selectedBill, setSelectedBill] = useState<UtilityBill | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [readinessFilter, setReadinessFilter] = useState<string>('ALL');

  // Success Notification
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Load all datasets
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const comps = await getAllCompaniesRegistry();
      setCompanies(comps);
      const reps = getAllUserReports();
      setReports(reps);
      const blls = getAllUtilityBills();
      setBills(blls);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (activeSession) {
      loadAllData();
    }
  }, [activeSession]);

  // Handle Admin Login submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    const res = authenticateAdmin(adminNameInput, adminPasswordInput, adminEmailInput);
    if (res.success && res.admin) {
      const session = getActiveAdminSession();
      setActiveSession(session);
      setAdminPasswordInput('');
    } else {
      setAuthError(res.error || 'Authentication failed. Please verify username, email, and password.');
    }
    setIsSubmitting(false);
  };

  // Quick select helper for the 4 specified admins
  const handleQuickSelectAdmin = (admin: AdminUser) => {
    setAdminNameInput(admin.name);
    setAdminEmailInput(admin.email);
    setAdminPasswordInput(admin.password);
    setAuthError(null);
  };

  // Handle Logout
  const handleLogout = () => {
    clearAdminSession();
    setActiveSession(null);
    setAdminNameInput('');
    setAdminEmailInput('');
    setAdminPasswordInput('');
    onLogoutAdmin?.();
  };

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  // Open modal helpers
  const handleOpenBillFromReport = (billId: string) => {
    const targetBill = bills.find((b) => b.id === billId);
    if (targetBill) {
      setSelectedBill(targetBill);
      setIsBillModalOpen(true);
    } else {
      triggerToast(`Bill record ${billId} located in encrypted telemetry vault.`);
    }
  };

  const handleOpenReportFromBill = (reportId?: string) => {
    if (!reportId) return;
    const targetRep = reports.find((r) => r.id === reportId);
    if (targetRep) {
      setSelectedReport(targetRep);
      setIsReportModalOpen(true);
    }
  };

  // --------------------------------------------------------------------------
  // FILTERED DATASETS
  // --------------------------------------------------------------------------

  // 1. Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !q ||
        (rep.companyName || '').toLowerCase().includes(q) ||
        (rep.submittedBy || '').toLowerCase().includes(q) ||
        (rep.submittedByEmail || '').toLowerCase().includes(q) ||
        (rep.reportNumber || '').toLowerCase().includes(q) ||
        (rep.udyamNumber || '').toLowerCase().includes(q) ||
        (rep.city || '').toLowerCase().includes(q) ||
        (rep.state || '').toLowerCase().includes(q) ||
        (rep.consignmentName || '').toLowerCase().includes(q);

      const matchesSector = sectorFilter === 'ALL' || rep.sector === sectorFilter;
      const matchesStatus = statusFilter === 'ALL' || rep.auditStatus === statusFilter;
      const matchesReadiness = readinessFilter === 'ALL' || rep.readiness === readinessFilter;

      return matchesSearch && matchesSector && matchesStatus && matchesReadiness;
    });
  }, [reports, searchQuery, sectorFilter, statusFilter, readinessFilter]);

  // 2. Filtered Utility Bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.companyName || '').toLowerCase().includes(q) ||
        (b.providedByUser?.name || '').toLowerCase().includes(q) ||
        (b.providedByUser?.email || '').toLowerCase().includes(q) ||
        (b.billNumber || '').toLowerCase().includes(q) ||
        (b.consumerId || '').toLowerCase().includes(q) ||
        (b.meterNumber || '').toLowerCase().includes(q) ||
        (b.discomName || '').toLowerCase().includes(q) ||
        (b.discomShort || '').toLowerCase().includes(q) ||
        (b.city || '').toLowerCase().includes(q) ||
        (b.state || '').toLowerCase().includes(q);

      const matchesSector = sectorFilter === 'ALL' || b.sector === sectorFilter;
      const matchesStatus = statusFilter === 'ALL' || b.verificationStatus === statusFilter;

      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [bills, searchQuery, sectorFilter, statusFilter]);

  // 3. Filtered Companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(({ company, assessment }) => {
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !q ||
        (company.companyName || '').toLowerCase().includes(q) ||
        (company.udyamNumber || '').toLowerCase().includes(q) ||
        (company.gstin || '').toLowerCase().includes(q) ||
        (company.city || '').toLowerCase().includes(q) ||
        (company.state || '').toLowerCase().includes(q) ||
        (company.authorizedPerson || '').toLowerCase().includes(q) ||
        (company.email || '').toLowerCase().includes(q);

      const matchesSector = sectorFilter === 'ALL' || company.sector === sectorFilter;
      const matchesReadiness = readinessFilter === 'ALL' || assessment.readiness === readinessFilter;

      return matchesSearch && matchesSector && matchesReadiness;
    });
  }, [companies, searchQuery, sectorFilter, readinessFilter]);

  // 4. Users Matrix
  const allUsersList = useMemo(() => {
    const userMap = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string;
        role: string;
        companyName: string;
        companyId: string;
        sector: Sector;
        state: string;
        reportsCount: number;
        billsCount: number;
        lastActive: string;
      }
    >();

    // From reports
    for (const r of reports) {
      const emailVal = r.submittedByEmail || '';
      const key = emailVal.toLowerCase();
      if (!key) continue;
      if (!userMap.has(key)) {
        userMap.set(key, {
          name: r.submittedBy || 'Authorized Officer',
          email: r.submittedByEmail || '',
          phone: r.userPhone || '',
          role: r.userRole || 'Representative',
          companyName: r.companyName || '',
          companyId: r.companyId || '',
          sector: r.sector,
          state: r.state || '',
          reportsCount: 1,
          billsCount: 0,
          lastActive: r.submittedDate || '',
        });
      } else {
        const u = userMap.get(key)!;
        u.reportsCount += 1;
      }
    }

    // From bills
    for (const b of bills) {
      const emailVal = b.providedByUser?.email || '';
      const key = emailVal.toLowerCase();
      if (!key) continue;
      if (!userMap.has(key)) {
        userMap.set(key, {
          name: b.providedByUser?.name || 'Authorized Officer',
          email: b.providedByUser?.email || '',
          phone: b.providedByUser?.phone || '',
          role: b.providedByUser?.role || 'Representative',
          companyName: b.companyName || '',
          companyId: b.companyId || '',
          sector: b.sector,
          state: b.state || '',
          reportsCount: 0,
          billsCount: 1,
          lastActive: b.billIssueDate || '',
        });
      } else {
        const u = userMap.get(key)!;
        u.billsCount += 1;
      }
    }

    const list = Array.from(userMap.values());
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.companyName || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q) ||
        (u.state || '').toLowerCase().includes(q)
    );
  }, [reports, bills, searchQuery]);

  // Overall Aggregate Statistics
  const stats = useMemo(() => {
    const totalReportsCount = reports.length;
    const certifiedReportsCount = reports.filter(
      (r) => r.auditStatus === 'Bureau Certified' || r.auditStatus === 'AI Validated'
    ).length;
    const totalBillsCount = bills.length;
    const verifiedBillsCount = bills.filter(
      (b) => b.verificationStatus === 'Bureau Certified' || b.verificationStatus === 'AI Validated'
    ).length;
    const totalElectricityKwh = bills.reduce((acc, b) => acc + b.unitsBilledKwh, 0);
    const totalInvoicedInr = bills.reduce((acc, b) => acc + b.totalInvoicedAmountInr, 0);
    const totalScope2Tonnes = bills.reduce((acc, b) => acc + b.calculatedScope2Tonnes, 0);
    const totalEstimatedTaxEuros = reports.reduce((acc, r) => acc + r.estimatedCbTaxEuros, 0);
    const avgEmissions =
      reports.length > 0
        ? Math.round(reports.reduce((acc, r) => acc + r.totalEmissionsKgPerTonne, 0) / reports.length)
        : 710;

    return {
      totalReportsCount,
      certifiedReportsCount,
      totalBillsCount,
      verifiedBillsCount,
      totalElectricityKwh,
      totalInvoicedInr,
      totalScope2Tonnes,
      totalEstimatedTaxEuros,
      avgEmissions,
    };
  }, [reports, bills]);

  // --------------------------------------------------------------------------
  // VIEW A: ADMIN AUTHENTICATION SCREEN (VASU, HARRY, ZAZU, ATHARVA)
  // --------------------------------------------------------------------------
  if (!activeSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-teal-950 to-zinc-900 text-zinc-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-900/60 border border-teal-700/60 text-emerald-400 shadow-xl mb-1">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              CarbonBridge Admin Portal
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Centralized administrative gateway for authorized audit officers: Vasu, Harry, ZAZU, and Atharva.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md space-y-5">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-teal-400 block mb-2">
                Authorized Admin Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {AUTHORIZED_ADMINS.map((adm) => (
                  <button
                    key={adm.id}
                    type="button"
                    onClick={() => handleQuickSelectAdmin(adm)}
                    className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-teal-500 hover:bg-teal-950/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 font-mono">
                        {adm.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                        {adm.badge.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate mt-1">
                      {adm.role}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Admin Name (Identifier)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-input-name"
                    type="text"
                    required
                    value={adminNameInput}
                    onChange={(e) => setAdminNameInput(e.target.value)}
                    placeholder="e.g. VASU, HARRY, ZAZU, ATHARVA"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase font-mono tracking-wider"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Admin Official Email ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-input-email"
                    type="email"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    placeholder="e.g. vasu.auditor@carbonbridge.gov.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Admin Security Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter assigned 6-digit access code"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                id="btn-admin-submit-login"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Unlock &amp; Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <button
                onClick={onBackToDashboard}
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                ← Return to Public App
              </button>
              <span className="text-[11px] font-mono text-zinc-600">
                EU CBAM Reg (EU) 2023/956
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW B: AUTHENTICATED ADMIN PORTAL
  // --------------------------------------------------------------------------
  const { admin } = activeSession;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-teal-950 text-white border-b border-teal-900 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  CarbonBridge Admin Portal
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {admin.badge}
                </span>
              </div>
              <p className="text-[11px] text-teal-300/80">
                {admin.department} • Regulatory Inspection Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Admin Identity Badge */}
            <div className="bg-teal-900/70 border border-teal-800 px-3 py-1.5 rounded-xl text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white font-mono">
                  Admin: {admin.name}
                </span>
              </div>
              <p className="text-[10px] text-teal-300 truncate max-w-[200px]">
                {admin.role}
              </p>
            </div>

            {/* Quick Switch Admin Dropdown */}
            <div className="relative group">
              <button
                className="px-2.5 py-1.5 rounded-lg border border-teal-800 bg-teal-900/60 hover:bg-teal-850 text-teal-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Switch between the 4 authorized admins"
              >
                <span>Switch Admin</span>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-teal-950 border border-teal-800 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
                {AUTHORIZED_ADMINS.map((adm) => (
                  <button
                    key={adm.id}
                    onClick={() => {
                      authenticateAdmin(adm.name, adm.password);
                      setActiveSession(getActiveAdminSession());
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-teal-900 cursor-pointer ${
                      adm.name === admin.name ? 'text-emerald-400 font-bold' : 'text-zinc-200'
                    }`}
                  >
                    <div>
                      <span className="block font-mono">{adm.name}</span>
                      <span className="text-[10px] text-teal-400 block">{adm.role}</span>
                    </div>
                    <span className="text-[10px] text-teal-300">{adm.badge.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              id="btn-admin-logout"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-teal-900/80 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            id="nav-tab-reports"
            onClick={() => setCurrentSection('reports')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentSection === 'reports'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-teal-900/40'
                : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-900/20'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>All User Reports</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
              {reports.length}
            </span>
          </button>

          <button
            id="nav-tab-bills"
            onClick={() => setCurrentSection('bills')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentSection === 'bills'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-teal-900/40'
                : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-900/20'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Electricity Bills Repository</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 text-[10px] border border-amber-800">
              {bills.length}
            </span>
          </button>

          <button
            id="nav-tab-companies"
            onClick={() => setCurrentSection('companies')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentSection === 'companies'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-teal-900/40'
                : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-900/20'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Companies Master Registry</span>
            <span className="px-1.5 py-0.2 rounded-full bg-teal-950 text-teal-300 text-[10px] border border-teal-800">
              {companies.length}
            </span>
          </button>

          <button
            id="nav-tab-users"
            onClick={() => setCurrentSection('users')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentSection === 'users'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-teal-900/40'
                : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-900/20'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Exporters &amp; Users Directory</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-800">
              {allUsersList.length}
            </span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => setCurrentSection('analytics')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              currentSection === 'analytics'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-teal-900/40'
                : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-900/20'
            }`}
          >
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>National CBAM Exposure</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* SECTION HEADER & EXPORT ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {currentSection === 'reports' && 'All Reports of Every User & Company'}
              {currentSection === 'bills' && "All Users' Companies & Uploaded Utility Bills"}
              {currentSection === 'companies' && 'National MSME Exporters Compliance Registry'}
              {currentSection === 'users' && 'Enterprise Exporters & Authorized Representatives'}
              {currentSection === 'analytics' && 'National Industrial CBAM Risk & Sector Metrics'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              {currentSection === 'reports' &&
                'Inspect, verify, and certify Form 4 declarations, embedded carbon calculations, and EU compliance dossiers across all registered users.'}
              {currentSection === 'bills' &&
                'Primary DISCOM electricity bills provided by every enterprise for CEA-aligned Scope 2 greenhouse gas auditing.'}
              {currentSection === 'companies' &&
                'Master directory of registered manufacturing companies, Udyam identification, and operational profiles.'}
              {currentSection === 'users' &&
                'Authorized industrial plant heads, managing directors, and ESG auditors who submitted data.'}
              {currentSection === 'analytics' &&
                'Aggregated macroeconomic EU ETS carbon tax exposure and regional grid emission factor distributions.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentSection === 'reports' && (
              <button
                id="btn-download-reports-csv"
                onClick={() => {
                  downloadAllReportsCSV(reports);
                  triggerToast('Master User Reports CSV exported successfully!');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export All Reports (CSV)</span>
              </button>
            )}

            {currentSection === 'bills' && (
              <button
                id="btn-download-bills-csv"
                onClick={() => {
                  downloadAllBillsCSV(bills);
                  triggerToast('Master Utility Bills CSV exported successfully!');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Export All Bills (CSV)</span>
              </button>
            )}

            {currentSection === 'companies' && (
              <button
                id="btn-download-companies-csv"
                onClick={() => {
                  downloadAllCompaniesCSV(companies);
                  triggerToast('Master Companies Registry CSV downloaded successfully!');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Companies (CSV)</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              disabled={isLoadingData}
              className="p-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-600 transition-colors cursor-pointer"
              title="Refresh Records from Registry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-teal-800' : ''}`} />
            </button>
          </div>
        </div>

        {/* OVERVIEW STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Total User Reports
            </span>
            <div className="text-2xl font-extrabold text-zinc-900 mt-1">
              {stats.totalReportsCount}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">From All Registered Users</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Audited Utility Bills
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1 flex items-center gap-1.5">
              <span>{stats.totalBillsCount}</span>
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-[10px] text-emerald-800 mt-1">{stats.verifiedBillsCount} Verified by Bureau</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Metered Electricity
            </span>
            <div className="text-2xl font-extrabold text-teal-950 mt-1">
              {Math.round(stats.totalElectricityKwh / 1000)}
              <span className="text-xs font-normal text-zinc-500 ml-1">MWh</span>
            </div>
            <p className="text-[10px] text-teal-700 mt-1">₹{(stats.totalInvoicedInr / 100000).toFixed(1)}L Invoiced Energy</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Scope 2 Indirect GHG
            </span>
            <div className="text-2xl font-extrabold text-teal-900 mt-1">
              {Math.round(stats.totalScope2Tonnes)}
              <span className="text-xs font-normal text-zinc-400 ml-1">t CO2e</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">CEA Verified Grid Factor</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs col-span-2 lg:col-span-1">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Est. EU Carbon Tax
            </span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              €{Math.round(stats.totalEstimatedTaxEuros / 1000)}k
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">At €85/t EU ETS Benchmark</p>
          </div>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                id="admin-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across reports, company names, users, DISCOMs, bills, or locations..."
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <select
                id="admin-filter-sector"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-zinc-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="ALL">All Sectors</option>
                <option value="Steel">Steel</option>
                <option value="Aluminium">Aluminium</option>
                <option value="Cement">Cement</option>
                <option value="Fertiliser">Fertiliser</option>
              </select>

              <select
                id="admin-filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-zinc-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="ALL">All Audit Statuses</option>
                <option value="Bureau Certified">Bureau Certified</option>
                <option value="AI Validated">AI Validated</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Flagged Discrepancy">Flagged Discrepancy</option>
              </select>

              <select
                id="admin-filter-readiness"
                value={readinessFilter}
                onChange={(e) => setReadinessFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-zinc-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="ALL">All Readiness Tiers</option>
                <option value="High">High Readiness</option>
                <option value="Medium">Medium Readiness</option>
                <option value="Low">Low Readiness</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <span>
              {currentSection === 'reports' && (
                <>Showing <strong className="text-zinc-900">{filteredReports.length}</strong> of {reports.length} user reports</>
              )}
              {currentSection === 'bills' && (
                <>Showing <strong className="text-zinc-900">{filteredBills.length}</strong> of {bills.length} utility bills</>
              )}
              {currentSection === 'companies' && (
                <>Showing <strong className="text-zinc-900">{filteredCompanies.length}</strong> of {companies.length} enterprise records</>
              )}
              {currentSection === 'users' && (
                <>Showing <strong className="text-zinc-900">{allUsersList.length}</strong> exporters and company representatives</>
              )}
              {currentSection === 'analytics' && (
                <>Aggregated across {companies.length} MSMEs in 6 industrial states</>
              )}
            </span>
            {(searchQuery || sectorFilter !== 'ALL' || statusFilter !== 'ALL' || readinessFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSectorFilter('ALL');
                  setStatusFilter('ALL');
                  setReadinessFilter('ALL');
                }}
                className="text-teal-800 hover:underline font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: ALL USER REPORTS TABLE */}
        {/* ------------------------------------------------------------------ */}
        {currentSection === 'reports' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Report Ref &amp; Date</th>
                    <th className="py-3 px-4">Enterprise &amp; Sector</th>
                    <th className="py-3 px-4">Submitting User</th>
                    <th className="py-3 px-4">Consignment &amp; Volume</th>
                    <th className="py-3 px-4">Scope 1 &amp; 2 (kg/t)</th>
                    <th className="py-3 px-4">Readiness &amp; Bill Status</th>
                    <th className="py-3 px-4">Est. EU Tax (€)</th>
                    <th className="py-3 px-4">Audit Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-zinc-500">
                        <FileText className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="font-semibold text-zinc-700 text-sm">No user reports match your filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-teal-50/40 transition-colors group">
                        {/* Report Ref */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-teal-950 text-xs block">
                            {rep.reportNumber}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {rep.submittedDate}
                          </span>
                        </td>

                        {/* Enterprise & Sector */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sm text-zinc-900 group-hover:text-teal-950">
                            {rep.companyName}
                          </div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                            <span className="font-semibold text-zinc-700">{rep.sector}</span>
                            <span>•</span>
                            <span>{rep.city}, {rep.state}</span>
                          </div>
                        </td>

                        {/* Submitting User */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-zinc-900">{rep.submittedBy}</div>
                          <div className="text-[11px] text-zinc-500">{rep.userRole}</div>
                          <div className="text-[10px] text-teal-800 font-mono mt-0.5">{rep.submittedByEmail}</div>
                        </td>

                        {/* Consignment & Volume */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-zinc-800 truncate max-w-[200px]" title={rep.consignmentName}>
                            {rep.consignmentName}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            Batch: <strong>{rep.productionVolume.toLocaleString()}</strong> {rep.productionUnit}
                          </div>
                        </td>

                        {/* Scope 1 & 2 */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-sm font-bold text-zinc-900">
                            {rep.totalEmissionsKgPerTonne}{' '}
                            <span className="text-[10px] font-normal text-zinc-500 font-sans">kg/t</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            S1: {rep.scope1EmissionsKgPerTonne} | S2: {rep.scope2EmissionsKgPerTonne}
                          </div>
                        </td>

                        {/* Readiness & Bill */}
                        <td className="py-3.5 px-4">
                          <ReadinessBadge level={rep.readiness} />
                          {rep.billVerified ? (
                            <button
                              onClick={() => handleOpenBillFromReport(rep.associatedBillId)}
                              className="mt-1 text-[10px] text-emerald-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                              title="Inspect attached primary DISCOM electricity bill"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Bill Verified (Inspect)</span>
                            </button>
                          ) : (
                            <span className="mt-1 block text-[10px] text-amber-600">
                              Estimated Utility
                            </span>
                          )}
                        </td>

                        {/* Estimated EU Tax */}
                        <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                          €{rep.estimatedCbTaxEuros.toLocaleString()}
                        </td>

                        {/* Audit Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              rep.auditStatus === 'Bureau Certified'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : rep.auditStatus === 'AI Validated'
                                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                : rep.auditStatus === 'Pending Review'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {rep.auditStatus}
                          </span>
                          {rep.verifiedByAdmin && (
                            <span className="text-[9px] text-zinc-400 block mt-1">
                              By {rep.verifiedByAdmin.split(' ')[0]}
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedReport(rep);
                                setIsReportModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-300 hover:border-teal-700 bg-white hover:bg-teal-50 text-teal-900 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Inspect Full Form 4 Audit Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>

                            <button
                              onClick={() => {
                                downloadUserReportCertificate(rep);
                                triggerToast(`Official Certificate downloaded for ${rep.companyName}!`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Download Official Bureau Certificate"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Cert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-zinc-50 px-4 py-3 border-t border-zinc-200 flex flex-wrap items-center justify-between text-xs text-zinc-500">
              <span>
                Administrative Audit Oversight by Admin:{' '}
                <strong className="text-teal-950 font-mono">{admin.name}</strong> ({admin.badge})
              </span>
              <button
                onClick={() => {
                  downloadAllReportsCSV(reports);
                  triggerToast('Master User Reports CSV exported successfully!');
                }}
                className="text-teal-800 hover:underline font-semibold cursor-pointer"
              >
                Export All {reports.length} User Reports (CSV) →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: ELECTRICITY & UTILITY BILLS REPOSITORY */}
        {/* ------------------------------------------------------------------ */}
        {currentSection === 'bills' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Bill No. &amp; Period</th>
                      <th className="py-3 px-4">Enterprise &amp; Facility</th>
                      <th className="py-3 px-4">Provided By User</th>
                      <th className="py-3 px-4">DISCOM &amp; CA Number</th>
                      <th className="py-3 px-4">Contract Demand</th>
                      <th className="py-3 px-4">Billed Units (kWh)</th>
                      <th className="py-3 px-4">Amount (₹)</th>
                      <th className="py-3 px-4">Scope 2 (t CO2e)</th>
                      <th className="py-3 px-4">Audit Status</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredBills.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-zinc-500">
                          <Zap className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                          <p className="font-semibold text-zinc-700 text-sm">No electricity bills match your search criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-teal-50/40 transition-colors group">
                          {/* Bill No. & Period */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-bold text-teal-950 text-xs block">
                              {bill.billingPeriod}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {bill.billNumber}
                            </span>
                          </td>

                          {/* Enterprise & Facility */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-sm text-zinc-900 group-hover:text-teal-950">
                              {bill.companyName}
                            </div>
                            <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                              <span>{bill.city}, {bill.state}</span>
                            </div>
                          </td>

                          {/* Provided By User */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-zinc-900">{bill.providedByUser.name}</div>
                            <div className="text-[11px] text-zinc-500">{bill.providedByUser.role}</div>
                            <div className="text-[10px] text-teal-800 font-mono mt-0.5">{bill.providedByUser.email}</div>
                          </td>

                          {/* DISCOM & CA */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-zinc-800">{bill.discomShort}</div>
                            <div className="text-[11px] font-mono text-teal-950">CA: {bill.consumerId}</div>
                            <div className="text-[10px] text-zinc-400 font-mono">Mtr: {bill.meterNumber}</div>
                          </td>

                          {/* Contract Demand */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-zinc-900">{bill.contractDemandKva} kVA</div>
                            <div className="text-[10px] text-zinc-500">{bill.connectedVoltage}</div>
                            <div className="text-[10px] text-emerald-700 font-medium">PF: {bill.powerFactor}</div>
                          </td>

                          {/* Billed Units */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-zinc-900 text-sm">
                              {bill.unitsBilledKwh.toLocaleString()}{' '}
                              <span className="text-[10px] font-normal text-zinc-500 font-sans">kWh</span>
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              MF: {bill.meterMultiplyingFactor}
                            </div>
                          </td>

                          {/* Invoiced Amount */}
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                            ₹{bill.totalInvoicedAmountInr.toLocaleString()}
                          </td>

                          {/* Calculated Scope 2 */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-black text-teal-950 text-sm">
                              {bill.calculatedScope2Tonnes}{' '}
                              <span className="text-[10px] font-normal text-zinc-500 font-sans">t CO2e</span>
                            </div>
                            <div className="text-[10px] text-teal-700">
                              CEA: {bill.ceaGridFactor}
                            </div>
                          </td>

                          {/* Verification Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                bill.verificationStatus === 'Bureau Certified'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : bill.verificationStatus === 'AI Validated'
                                  ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                  : bill.verificationStatus === 'Pending Review'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {bill.verificationStatus}
                            </span>
                            {bill.verifiedByAdmin && (
                              <span className="text-[9px] text-zinc-400 block mt-1">
                                {bill.verifiedByAdmin.split(' ')[0]}
                              </span>
                            )}
                          </td>

                          {/* Admin Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setIsBillModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-zinc-300 hover:border-teal-700 bg-white hover:bg-teal-50 text-teal-900 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="Inspect Digital Bill Facsimile & Telemetry"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect Bill</span>
                              </button>

                              <button
                                onClick={() => {
                                  downloadUtilityBillSummary(bill);
                                  triggerToast(`Bill summary downloaded for ${bill.companyName}!`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="Download Certified Bill Summary"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Record</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-zinc-50 px-4 py-3 border-t border-zinc-200 flex flex-wrap items-center justify-between text-xs text-zinc-500">
                <span>
                  All bills reconciled against regional state electricity distribution authority tariffs.
                </span>
                <button
                  onClick={() => {
                    downloadAllBillsCSV(bills);
                    triggerToast('Master Utility Bills CSV exported successfully!');
                  }}
                  className="text-teal-800 hover:underline font-semibold cursor-pointer"
                >
                  Export All {bills.length} Electricity Bills (CSV) →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: COMPANIES MASTER REGISTRY */}
        {/* ------------------------------------------------------------------ */}
        {currentSection === 'companies' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Enterprise &amp; Scale</th>
                    <th className="py-3 px-4">Sector &amp; Location</th>
                    <th className="py-3 px-4">Statutory IDs (URN / GSTIN)</th>
                    <th className="py-3 px-4">Authorized Contact</th>
                    <th className="py-3 px-4">Energy &amp; Production</th>
                    <th className="py-3 px-4">GHG Intensity (kg CO2e/t)</th>
                    <th className="py-3 px-4">CBAM Readiness</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-zinc-500">
                        <Building2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                        <p className="font-semibold text-zinc-700 text-sm">No enterprise records match your search filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((entry) => {
                      const { company, assessment, source } = entry;
                      return (
                        <tr key={company.id} className="hover:bg-teal-50/40 transition-colors group">
                          {/* Enterprise Name & Scale */}
                          <td className="py-3.5 px-4 font-medium text-zinc-900">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-zinc-900 group-hover:text-teal-950">
                                  {company.companyName}
                                </span>
                                {company.verifiedStatus && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Udyam Verified" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                                <span className="px-1.5 py-0.2 rounded bg-zinc-100 font-semibold text-zinc-700">
                                  {company.enterpriseCategory}
                                </span>
                                <span>•</span>
                                <span className="text-[10px] text-zinc-400">{source}</span>
                              </div>
                            </div>
                          </td>

                          {/* Sector & Location */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-zinc-800 block">
                              {company.sector}
                            </span>
                            <span className="text-zinc-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                              {company.city}, {company.state}
                            </span>
                          </td>

                          {/* Statutory IDs */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="text-[11px] font-bold text-teal-950">
                              {company.udyamNumber}
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">
                              GST: {company.gstin}
                            </div>
                          </td>

                          {/* Authorized Contact */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-zinc-900">
                              {company.authorizedPerson}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {company.designation}
                            </div>
                            <div className="text-[10px] text-teal-800 font-mono mt-0.5">
                              {company.email}
                            </div>
                          </td>

                          {/* Energy & Production */}
                          <td className="py-3.5 px-4">
                            <div className="text-zinc-800">
                              Prod: <strong>{assessment.productionVolume.toLocaleString()}</strong> {assessment.productionUnit}
                            </div>
                            <div className="text-[11px] text-teal-900 flex items-center gap-1 mt-0.5">
                              <Zap className="w-3 h-3 text-emerald-600" />
                              {assessment.electricityConsumed.toLocaleString()} kWh
                            </div>
                          </td>

                          {/* GHG Intensity */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="text-sm font-bold text-zinc-900">
                              {assessment.estimatedEmissions}{' '}
                              <span className="text-[10px] font-normal text-zinc-500 font-sans">kg/t</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">
                              CI: {assessment.uncertaintyMin}–{assessment.uncertaintyMax}
                            </div>
                          </td>

                          {/* Readiness */}
                          <td className="py-3.5 px-4">
                            <ReadinessBadge level={assessment.readiness} />
                            {assessment.billVerified ? (
                              <span className="mt-1 block text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Bill Audited
                              </span>
                            ) : (
                              <span className="mt-1 block text-[10px] text-amber-600">
                                Estimated Bill
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`btn-view-dossier-${company.id}`}
                                onClick={() => {
                                  setSelectedCompanyEntry(entry);
                                  setIsCompanyDossierOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-zinc-300 hover:border-teal-700 bg-white hover:bg-teal-50 text-teal-900 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="View Complete Company Dossier & Operational Logs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Info</span>
                              </button>

                              <button
                                id={`btn-download-report-${company.id}`}
                                onClick={() => {
                                  downloadCompanyReportFile(entry);
                                  triggerToast(`Report downloaded for ${company.companyName}!`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="Download Individual CBAM Compliance Audit Report"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Report</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-zinc-50 px-4 py-3 border-t border-zinc-200 flex flex-wrap items-center justify-between text-xs text-zinc-500">
              <span>
                Authorized Audit Oversight by Admin:{' '}
                <strong className="text-teal-950 font-mono">{admin.name}</strong> ({admin.badge})
              </span>
              <button
                onClick={() => {
                  downloadAllCompaniesCSV(companies);
                  triggerToast('Master Companies CSV downloaded successfully!');
                }}
                className="text-teal-800 hover:underline font-semibold cursor-pointer"
              >
                Export All {companies.length} Registered MSMEs (CSV) →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: USERS & EXPORTERS DIRECTORY */}
        {/* ------------------------------------------------------------------ */}
        {currentSection === 'users' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100/80 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Authorized User</th>
                    <th className="py-3 px-4">Official Designation</th>
                    <th className="py-3 px-4">Associated Enterprise</th>
                    <th className="py-3 px-4">Sector &amp; State</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Reports Filed</th>
                    <th className="py-3 px-4">Bills Uploaded</th>
                    <th className="py-3 px-4 text-right">Quick Filter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {allUsersList.map((u, i) => (
                    <tr key={i} className="hover:bg-teal-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-zinc-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block">{u.name}</span>
                            <span className="text-[10px] text-zinc-400">Active Exporter</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-700">{u.role}</td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-900">{u.companyName}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-zinc-800 block">{u.sector}</span>
                        <span className="text-[10px] text-zinc-500">{u.state}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-600">
                        <div className="text-teal-900">{u.email}</div>
                        <div className="text-[10px] text-zinc-400">{u.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-zinc-900">{u.reportsCount} Reports</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">{u.billsCount} Bills</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSearchQuery(u.name);
                            setCurrentSection('reports');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-zinc-300 hover:bg-teal-50 hover:border-teal-700 text-teal-900 text-xs font-semibold cursor-pointer"
                        >
                          View Reports
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: NATIONAL CBAM ANALYTICS */}
        {/* ------------------------------------------------------------------ */}
        {currentSection === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sector Comparison */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <Factory className="w-4 h-4 text-teal-800" />
                  <span>Sectoral Average Specific Carbon Intensity</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-zinc-800">Steel (Induction Furnace &amp; DRI)</span>
                      <span className="font-mono font-bold text-zinc-900">720 kg CO2e / tonne</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-800 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">EU ETS Benchmark: 840 kg/t (Indian MSME 14% below penalty threshold)</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-zinc-800">Aluminium (Extrusions &amp; Billets)</span>
                      <span className="font-mono font-bold text-zinc-900">605 kg CO2e / tonne</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">High power factor 0.99 with primary gas preheating</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-zinc-800">Fertiliser (Ammonium &amp; Urea)</span>
                      <span className="font-mono font-bold text-zinc-900">890 kg CO2e / tonne</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: '89%' }} />
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Steam methane reforming chemical reaction driver</span>
                  </div>
                </div>
              </div>

              {/* CEA Regional Factors */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>CEA Regional Grid Emission Baseline Factors</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div>
                      <span className="font-bold text-zinc-900 block">Western Region (Maharashtra, Gujarat)</span>
                      <span className="text-[11px] text-zinc-500">MSEDCL, Torrent Power, GUVNL</span>
                    </div>
                    <span className="font-mono font-black text-teal-900 text-sm">0.718–0.732 kg/kWh</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div>
                      <span className="font-bold text-zinc-900 block">Southern Region (Tamil Nadu, Telangana)</span>
                      <span className="text-[11px] text-zinc-500">TANGEDCO, TSSPDCL</span>
                    </div>
                    <span className="font-mono font-black text-teal-900 text-sm">0.742–0.745 kg/kWh</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div>
                      <span className="font-bold text-zinc-900 block">Eastern Region (Odisha, Kalunga)</span>
                      <span className="text-[11px] text-zinc-500">TPWODL, GRIDCO</span>
                    </div>
                    <span className="font-mono font-black text-teal-900 text-sm">0.814 kg/kWh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: COMPANY DOSSIER MODAL */}
      <CompanyDossierModal
        isOpen={isCompanyDossierOpen}
        onClose={() => {
          setIsCompanyDossierOpen(false);
          setSelectedCompanyEntry(null);
        }}
        entry={selectedCompanyEntry}
        adminName={admin.name}
      />

      {/* MODAL 2: USER REPORT DETAIL MODAL */}
      <ReportDetailModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        adminName={admin.name}
        onStatusUpdated={loadAllData}
        onViewAssociatedBill={handleOpenBillFromReport}
      />

      {/* MODAL 3: UTILITY BILL DETAIL MODAL */}
      <BillDetailModal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setSelectedBill(null);
        }}
        bill={selectedBill}
        adminName={admin.name}
        onStatusUpdated={loadAllData}
      />

      {/* Floating Download Success Toast */}
      {downloadToast && (
        <div
          id="admin-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-teal-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-teal-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-medium"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
};
