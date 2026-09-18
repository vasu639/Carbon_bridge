import React, { useState } from 'react';
import { MSMECompany, Sector } from '../../types';
import { INDIAN_REGIONS, SECTORS } from '../../data/mockAssessments';
import { DEMO_MSME_PROFILES } from '../../data/mockCompanies';
import {
  loginCompanyWithFirebase,
  registerCompanyWithFirebase,
  loginWithGoogleFirebase,
  sendPasswordResetFirebase,
  getFriendlyAuthErrorMessage,
} from '../../lib/firebase';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  MapPin,
  FileCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Check,
  HelpCircle,
  Zap,
  Globe2,
  Loader2,
  ShieldAlert,
  Key,
} from 'lucide-react';
import {
  authenticateAdmin,
  checkIsAdminCredentials,
  AUTHORIZED_ADMINS,
  AdminSession,
  getActiveAdminSession,
  AdminUser,
} from '../../data/adminUsers';

interface AuthScreenProps {
  initialMode?: 'login' | 'register' | 'admin';
  onSuccess: (company: MSMECompany) => void;
  onAdminSuccess?: (adminSession: AdminSession) => void;
  onBackToDashboard: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onSuccess,
  onAdminSuccess,
  onBackToDashboard,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Admin section state
  const [adminUsername, setAdminUsername] = useState('Vasu');
  const [adminEmail, setAdminEmail] = useState('vasu.auditor@carbonbridge.gov.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthSuccess, setAdminAuthSuccess] = useState('');
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('r.kulkarni@balajiforgings.co.in');
  const [loginPassword, setLoginPassword] = useState('Balaji@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [companyName, setCompanyName] = useState('');
  const [udyamNumber, setUdyamNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [enterpriseCategory, setEnterpriseCategory] = useState<'Micro' | 'Small' | 'Medium'>('Small');
  const [sector, setSector] = useState<Sector>('Steel');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  const [designation, setDesignation] = useState('Managing Director / Partner');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(true);
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const handleDemoSelect = (profile: MSMECompany) => {
    onSuccess(profile);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setLoginError('');
    try {
      const company = await loginWithGoogleFirebase();
      onSuccess(company);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoginError(getFriendlyAuthErrorMessage(msg));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleFillSampleRegister = () => {
    setCompanyName('Coimbatore Precision Die-Castings Pvt Ltd');
    setUdyamNumber('UDYAM-TN-03-0071429');
    setGstin('33AABCC7142J1Z8');
    setEnterpriseCategory('Small');
    setSector('Aluminium');
    setState('Tamil Nadu');
    setCity('SIDCO Industrial Estate, Coimbatore');
    setAuthorizedPerson('K. Venkataraman');
    setDesignation('Partner & Works Manager');
    setEmail('k.venkat@coimbatorediecast.com');
    setPhone('+91 94432 18920');
    setRegisterPassword('Coimbatore@2026');
    setConfirmPassword('Coimbatore@2026');
    setRegisterErrors({});
  };

  // Dedicated Admin Authentication Submission
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    setAdminAuthSuccess('');
    setIsAdminSubmitting(true);

    if (!adminUsername.trim()) {
      setAdminAuthError('Please enter or select an Admin Username (Vasu, Harry, ZAZU, Atharva).');
      setIsAdminSubmitting(false);
      return;
    }
    if (!adminEmail.trim()) {
      setAdminAuthError('Please enter your Admin Email ID.');
      setIsAdminSubmitting(false);
      return;
    }
    if (!adminPassword.trim()) {
      setAdminAuthError('Please enter your 6-digit Admin Security Password.');
      setIsAdminSubmitting(false);
      return;
    }

    const res = authenticateAdmin(adminUsername, adminPassword, adminEmail);
    if (res.success && res.admin) {
      setAdminAuthSuccess(
        `Identity verified: Admin ${res.admin.name} (${res.admin.badge}). Accessing Central Regulatory Portal...`
      );
      setTimeout(() => {
        const session = getActiveAdminSession();
        if (session && onAdminSuccess) {
          onAdminSuccess(session);
        }
      }, 400);
    } else {
      setAdminAuthError(res.error || 'Authentication failed. Please verify username, email, and password.');
    }
    setIsAdminSubmitting(false);
  };

  const handleSelectAdminChip = (adm: AdminUser) => {
    setAdminUsername(adm.name);
    setAdminEmail(adm.email);
    setAdminPassword(adm.password);
    setAdminAuthError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmed = loginIdentifier.trim();
    if (!trimmed) {
      setLoginError('Please enter your corporate email, username, or Udyam Registration Number.');
      return;
    }

    // 1. Check if an authorized Admin is signing in via username or email + password!
    // Decides automatically whether it is an admin from username and password along with email
    const adminMatch = checkIsAdminCredentials(trimmed, loginPassword);
    if (adminMatch) {
      const emailUsed = trimmed.includes('@') ? trimmed : adminMatch.email;
      const res = authenticateAdmin(adminMatch.name, loginPassword, emailUsed);
      if (res.success && res.admin) {
        const session = getActiveAdminSession();
        if (session && onAdminSuccess) {
          onAdminSuccess(session);
          return;
        }
      }
    }

    const matched = DEMO_MSME_PROFILES.find(
      (p) =>
        ((p.email || '').toLowerCase() === trimmed.toLowerCase() ||
          (p.udyamNumber || '').toUpperCase() === trimmed.toUpperCase()) &&
        loginPassword === 'Balaji@2026'
    );

    if (matched) {
      onSuccess(matched);
      return;
    }

    setIsSubmitting(true);
    try {
      const company = await loginCompanyWithFirebase(trimmed, loginPassword);
      onSuccess(company);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoginError(getFriendlyAuthErrorMessage(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Check if an authorized Admin entered credentials during registration
    const adminMatch = checkIsAdminCredentials(authorizedPerson || email, registerPassword, email);
    if (adminMatch) {
      const res = authenticateAdmin(adminMatch.name, registerPassword, email.trim() || adminMatch.email);
      if (res.success && res.admin) {
        const session = getActiveAdminSession();
        if (session && onAdminSuccess) {
          onAdminSuccess(session);
          return;
        }
      }
    }

    if (!companyName.trim()) {
      errors.companyName = 'Company / Enterprise name is required';
    }
    if (!udyamNumber.trim()) {
      errors.udyamNumber = 'Udyam Registration Number (URN) is required';
    } else if (!udyamNumber.toUpperCase().startsWith('UDYAM-')) {
      errors.udyamNumber = 'Must start with "UDYAM-" (e.g. UDYAM-MH-12-0045892)';
    }
    if (!authorizedPerson.trim()) {
      errors.authorizedPerson = 'Signatory contact name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Valid corporate email address is required';
    }
    if (!registerPassword) {
      errors.registerPassword = 'Password is required';
    } else if (registerPassword.length < 6) {
      errors.registerPassword = 'Password must be at least 6 characters';
    }
    if (registerPassword && confirmPassword && registerPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeConsent) {
      errors.agreeConsent = 'Please agree to the data verification terms';
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newCompany = await registerCompanyWithFirebase(
        {
          companyName: companyName.trim(),
          udyamNumber: udyamNumber.trim().toUpperCase(),
          gstin: gstin.trim().toUpperCase() || '27AABCU9603R1ZM',
          enterpriseCategory,
          sector,
          state,
          city: city.trim() || 'Industrial Corridor',
          authorizedPerson: authorizedPerson.trim(),
          designation: designation.trim() || 'Managing Director',
          email: email.trim(),
          phone: phone.trim() || '+91 98220 12345',
          verifiedStatus: true,
          createdAt: new Date().toISOString().split('T')[0],
        },
        registerPassword
      );

      onSuccess(newCompany);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRegisterErrors({ general: getFriendlyAuthErrorMessage(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUdyamValidFormat = udyamNumber.toUpperCase().startsWith('UDYAM-') && udyamNumber.length >= 16;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top back button */}
      <div className="mb-6">
        <button
          id="btn-auth-back-dash"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: MSME Exporter Benefits & Statutory Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-900 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-800" />
              Government of India MSME Portal Linked
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {mode === 'login' ? 'Sign In to Your MSME Account' : 'Register Your MSME for EU CBAM Compliance'}
            </h1>
            <p className="text-sm text-zinc-600 leading-relaxed">
              CarbonBridge equips Indian industrial exporters with statistical first estimates and audit-ready data verification under EU CBAM rules.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-teal-800" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900">Udyam Registration Linked</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Your URN binds your factory location to state CEA electricity grid emission factors and sector benchmarks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900">Electricity DISCOM Proof Audit</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Upload audited industrial utility bills to automatically narrow statistical uncertainty from ±6% to ±3%.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5 text-blue-700" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900">CBAM Verifier-Ready Reports</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Download official PDF readiness certificates, sensitivity charts, and mitigation roadmaps for European buyers.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Profiles for quick evaluation */}
          <div className="p-5 rounded-2xl bg-teal-950 text-white space-y-3 shadow-sm border border-teal-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Quick Demo Accounts
              </span>
              <span className="text-[11px] text-teal-300">Fast sign in</span>
            </div>
            <p className="text-xs text-teal-200">
              Select a pre-configured Indian industrial exporter to test without filling credentials:
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {DEMO_MSME_PROFILES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  id={`screen-demo-${p.id}`}
                  onClick={() => handleDemoSelect(p)}
                  className="p-3 rounded-xl bg-teal-900/80 hover:bg-teal-800 border border-teal-800 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      {p.companyName}
                    </p>
                    <p className="text-[11px] text-teal-300">
                      {p.enterpriseCategory} • {p.sector} • {p.state}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Register Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-md overflow-hidden">
            {/* Tab switch header */}
            <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="screen-tab-login"
                  onClick={() => {
                    setMode('login');
                    setShowForgotPassword(false);
                    setLoginError('');
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-teal-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="screen-tab-register"
                  onClick={() => {
                    setMode('register');
                    setShowForgotPassword(false);
                    setRegisterErrors({});
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-teal-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  Create MSME Account
                </button>
                <button
                  type="button"
                  id="screen-tab-admin"
                  onClick={() => {
                    setMode('admin');
                    setShowForgotPassword(false);
                    setAdminAuthError('');
                    setAdminAuthSuccess('');
                  }}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mode === 'admin'
                      ? 'bg-amber-950 text-amber-100 shadow-xs border border-amber-800'
                      : 'text-amber-900/90 hover:text-amber-950 hover:bg-amber-100/60'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Access</span>
                </button>
              </div>

              {mode === 'register' && (
                <button
                  type="button"
                  onClick={handleFillSampleRegister}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sample Data</span>
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8">
              {showForgotPassword ? (
                /* Forgot password */
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                    <h3 className="text-sm font-semibold text-teal-950 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-teal-800" />
                      Reset Your Password
                    </h3>
                    <p className="text-xs text-teal-800 leading-relaxed">
                      Enter your registered corporate email to receive a password reset link via Firebase Auth.
                    </p>
                  </div>

                  {forgotSuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span>Reset Instructions Sent</span>
                      </div>
                      <p className="text-xs">
                        A secure password reset link was dispatched to{' '}
                        <span className="font-mono font-bold">{forgotEmail || 'your authorized email'}</span> via Firebase.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotSuccess(false);
                        }}
                        className="w-full py-2.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold"
                      >
                        Return to Sign In
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!forgotEmail.trim()) return;
                        setResetError('');
                        setIsSubmitting(true);
                        try {
                          await sendPasswordResetFirebase(forgotEmail.trim());
                          setForgotSuccess(true);
                        } catch (err: unknown) {
                          const msg = err instanceof Error ? err.message : String(err);
                          setResetError(getFriendlyAuthErrorMessage(msg));
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-700">
                          Corporate Email
                        </label>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="e.g. director@balajiforgings.co.in"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      {resetError && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-200">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {resetError}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(false)}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-60"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <span>Send Recovery Link</span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : mode === 'login' ? (
                /* LOGIN FORM */
                <div className="space-y-5 max-w-md mx-auto">
                  {/* Google SSO Button */}
                  <button
                    id="screen-btn-google-login"
                    type="button"
                    disabled={isGoogleSubmitting || isSubmitting}
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-60 cursor-pointer"
                  >
                    {isGoogleSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-teal-800" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                    )}
                    <span>{isGoogleSubmitting ? 'Authenticating with Google...' : 'Continue with Google (Firebase SSO)'}</span>
                  </button>

                  <div className="relative flex items-center justify-center my-1">
                    <div className="w-full border-t border-zinc-200" />
                    <span className="bg-white px-2.5 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold absolute">
                      Or sign in with email
                    </span>
                  </div>

                  {/* 1-Click Demo Profiles */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-teal-50/70 to-emerald-50/50 border border-teal-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-teal-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                        Instant Demo Accounts
                      </span>
                      <span className="text-[10px] text-teal-700 font-medium">Click to Load</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {DEMO_MSME_PROFILES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          id={`screen-demo-login-${p.id}`}
                          onClick={() => handleDemoSelect(p)}
                          className="p-2 rounded-lg border border-zinc-200 bg-white hover:border-teal-700 hover:bg-teal-50 text-left transition-all group shadow-2xs"
                        >
                          <p className="text-xs font-semibold text-zinc-900 line-clamp-1 group-hover:text-teal-900">
                            {p.companyName.split(' ')[0]} {p.sector}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            {p.enterpriseCategory} • {p.state}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Bureau Admin Quick Access Notice */}
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                        <div>
                          <p className="font-semibold text-amber-950">Bureau Admin? (Vasu, Harry, ZAZU, Atharva)</p>
                          <p className="text-[11px] text-amber-800">You can also sign in directly using your username &amp; password below</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMode('admin')}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs shrink-0 transition-colors"
                      >
                        Admin Section &rarr;
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-zinc-700">
                        Corporate Email or Udyam Reg Number (URN)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                        <input
                          id="screen-input-login-id"
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. r.kulkarni@balajiforgings.co.in"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-zinc-700">Password</label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-[11px] text-teal-700 hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                        <input
                          id="screen-input-login-pass"
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-zinc-300 text-teal-800 focus:ring-teal-700"
                        />
                        <span>Keep me signed in</span>
                      </label>
                    </div>

                    {loginError && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {loginError}
                      </p>
                    )}

                    <button
                      id="screen-btn-login-submit"
                      type="submit"
                      disabled={isSubmitting || isGoogleSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                          <span>Authenticating with Firebase...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-3 text-center text-xs text-zinc-500 border-t border-zinc-100">
                      New exporter or manufacturer?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setRegisterErrors({});
                        }}
                        className="text-teal-800 font-bold hover:underline"
                      >
                        Create an MSME account
                      </button>
                    </div>
                  </form>
                </div>
              ) : mode === 'admin' ? (
                /* DEDICATED ADMIN SECTION */
                <div className="space-y-6 max-w-lg mx-auto">
                  {/* Admin Banner */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-950 flex items-center justify-center font-bold">
                        <ShieldAlert className="w-4 h-4 text-amber-900" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-amber-950">
                          Central Regulatory Admin Portal
                        </h3>
                        <p className="text-xs text-amber-800">
                          Authorized Government Bureau Access • EU CBAM &amp; BEE Compliance
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      This section is reserved exclusively for authorized regulatory administrators: <strong>Vasu</strong>, <strong>Harry</strong>, <strong>ZAZU</strong>, and <strong>Atharva</strong>. Provide your assigned admin username, email ID, and 6-digit access code to view all company records and download complete dossiers.
                    </p>
                  </div>

                  {/* 1-Click Quick Admin Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        Select Authorized Admin Profile
                      </label>
                      <span className="text-[11px] text-zinc-500">Click to autofill credentials</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {AUTHORIZED_ADMINS.map((adm) => (
                        <button
                          key={adm.id}
                          type="button"
                          id={`btn-select-admin-${adm.name.toLowerCase()}`}
                          onClick={() => handleSelectAdminChip(adm)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            (adminUsername || '').toLowerCase() === (adm.name || '').toLowerCase()
                              ? 'border-amber-600 bg-amber-50/90 ring-1 ring-amber-500 shadow-2xs'
                              : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/70 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-900 font-mono">
                              {adm.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                              Admin
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                            {adm.badge}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Form */}
                  <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
                    {/* Admin Username */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-zinc-700">
                        Admin Username <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                        <input
                          id="admin-auth-username"
                          type="text"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="e.g. Vasu / Harry / ZAZU / Atharva"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Valid usernames: Vasu, Harry, ZAZU, Atharva (case-insensitive)
                      </p>
                    </div>

                    {/* Admin Email ID */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-zinc-700">
                        Admin Email ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                        <input
                          id="admin-auth-email"
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="e.g. vasu.auditor@carbonbridge.gov.in"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                    </div>

                    {/* Admin Security Password */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-zinc-700">
                          Security Access Password <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-zinc-400">6-digit assigned PIN</span>
                      </div>
                      <div className="relative">
                        <Key className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                        <input
                          id="admin-auth-password"
                          type={showAdminPassword ? 'text' : 'password'}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter your designated 6-digit password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm font-mono tracking-wider focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600"
                        >
                          {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Error and Success Alerts */}
                    {adminAuthError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{adminAuthError}</span>
                      </div>
                    )}

                    {adminAuthSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{adminAuthSuccess}</span>
                      </div>
                    )}

                    {/* Authorize Button */}
                    <button
                      id="btn-admin-auth-submit"
                      type="submit"
                      disabled={isAdminSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {isAdminSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-4 h-4 text-amber-200" />
                          <span>Authorize &amp; Access Admin Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-3 text-center text-xs text-zinc-500 border-t border-zinc-100">
                      Standard exporter or business user?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setAdminAuthError('');
                        }}
                        className="text-teal-800 font-bold hover:underline"
                      >
                        Return to MSME Sign In
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  {/* Step 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-teal-800" />
                        1. Company &amp; Statutory Registration
                      </span>
                      {isUdyamValidFormat && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Valid Udyam Format
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">
                          Enterprise / Company Legal Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="screen-reg-name"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Shree Balaji Precision Forgings Pvt Ltd"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                        {registerErrors.companyName && (
                          <p className="text-xs text-red-600">{registerErrors.companyName}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">
                          Udyam Reg. Number (URN) <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="screen-reg-udyam"
                          type="text"
                          value={udyamNumber}
                          onChange={(e) => setUdyamNumber(e.target.value.toUpperCase())}
                          placeholder="UDYAM-MH-12-0045892"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm font-mono uppercase focus:outline-none focus:border-teal-700"
                        />
                        {registerErrors.udyamNumber && (
                          <p className="text-xs text-red-600">{registerErrors.udyamNumber}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">GSTIN Tax ID</label>
                        <input
                          id="screen-reg-gstin"
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          placeholder="27AABCU9603R1ZM"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm font-mono uppercase focus:outline-none focus:border-teal-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">
                          Enterprise Category
                        </label>
                        <select
                          value={enterpriseCategory}
                          onChange={(e) => setEnterpriseCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm bg-white focus:outline-none focus:border-teal-700"
                        >
                          <option value="Micro">Micro (&lt; ₹1 Cr Inv / &lt; ₹5 Cr Turnover)</option>
                          <option value="Small">Small (&lt; ₹10 Cr Inv / &lt; ₹50 Cr Turnover)</option>
                          <option value="Medium">Medium (&lt; ₹50 Cr Inv / &lt; ₹250 Cr Turnover)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">Primary Sector</label>
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value as Sector)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm bg-white focus:outline-none focus:border-teal-700"
                        >
                          {SECTORS.map((s) => (
                            <option key={s.label} value={s.label}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">Manufacturing State</label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm bg-white focus:outline-none focus:border-teal-700"
                        >
                          {INDIAN_REGIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">City / Industrial Zone</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Chakan MIDC, Pune"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-teal-800" />
                        2. Authorized Signatory &amp; Credentials
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">
                          Signatory Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={authorizedPerson}
                          onChange={(e) => setAuthorizedPerson(e.target.value)}
                          placeholder="e.g. Rajesh S. Kulkarni"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                        {registerErrors.authorizedPerson && (
                          <p className="text-xs text-red-600">{registerErrors.authorizedPerson}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">Signatory Designation</label>
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Managing Director / Partner"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">
                          Corporate Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="director@balajiforgings.co.in"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                        {registerErrors.email && (
                          <p className="text-xs text-red-600">{registerErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">WhatsApp / Mobile</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98220 00000"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3.5 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerErrors.registerPassword && (
                          <p className="text-xs text-red-600">{registerErrors.registerPassword}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-zinc-700">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full px-3.5 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerErrors.confirmPassword && (
                          <p className="text-xs text-red-600">{registerErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeConsent}
                        onChange={(e) => setAgreeConsent(e.target.checked)}
                        className="mt-0.5 rounded border-zinc-300 text-teal-800 focus:ring-teal-700 shrink-0"
                      />
                      <span className="text-xs leading-relaxed text-teal-900">
                        I certify that I am an authorized signatory of this manufacturing enterprise. Our electricity utility DISCOM bills and factory records will be utilized for EU CBAM audit calculations and benchmark estimations.
                      </span>
                    </label>
                    {registerErrors.agreeConsent && (
                      <p className="text-xs text-red-600 font-semibold">{registerErrors.agreeConsent}</p>
                    )}
                  </div>

                  {registerErrors.general && (
                    <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {registerErrors.general}
                    </p>
                  )}

                  <button
                    id="screen-btn-register-submit"
                    type="submit"
                    disabled={isSubmitting || isGoogleSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                        <span>Creating Enterprise Account on Firebase...</span>
                      </>
                    ) : (
                      <>
                        <span>Create MSME Account &amp; Access Dashboard</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-100">
                    Already have an enterprise account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setLoginError('');
                      }}
                      className="text-teal-800 font-bold hover:underline"
                    >
                      Sign In here
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Firebase Connection Status Footer */}
            <div className="bg-zinc-50/80 px-6 py-3.5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <div className="flex items-center gap-2 text-teal-900 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected to Firebase Project:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded text-[11px] text-teal-950 border border-teal-200 font-semibold shadow-2xs">
                  carbonbridge-dcb48
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Firebase Auth &amp; Firestore Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
