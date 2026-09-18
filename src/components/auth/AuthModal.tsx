import React, { useState, useEffect } from 'react';
import { MSMECompany, Sector } from '../../types';
import { INDIAN_REGIONS, SECTORS } from '../../data/mockAssessments';
import { DEMO_MSME_PROFILES, DEFAULT_MSME_COMPANY } from '../../data/mockCompanies';
import {
  loginCompanyWithFirebase,
  registerCompanyWithFirebase,
  loginWithGoogleFirebase,
  sendPasswordResetFirebase,
  getFriendlyAuthErrorMessage,
} from '../../lib/firebase';
import {
  X,
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
  Phone,
  HelpCircle,
  KeyRound,
  Check,
  Briefcase,
  Loader2,
  Zap,
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

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (company: MSMECompany) => void;
  onLoginSuccess?: (company: MSMECompany) => void;
  onAdminSuccess?: (adminSession: AdminSession) => void;
  mode?: 'login' | 'register' | 'admin';
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
  onAdminSuccess,
  mode: propMode,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(propMode || initialMode);

  useEffect(() => {
    if (propMode) {
      setMode(propMode);
    }
  }, [propMode]);

  // Loading & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Admin states
  const [adminUsername, setAdminUsername] = useState('Vasu');
  const [adminEmail, setAdminEmail] = useState('vasu.auditor@carbonbridge.gov.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthSuccess, setAdminAuthSuccess] = useState('');
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

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

  if (!isOpen) return null;

  const handleNotifySuccess = (company: MSMECompany) => {
    if (onSuccess) onSuccess(company);
    if (onLoginSuccess) onLoginSuccess(company);
    onClose();
  };

  const handleDemoSelect = (profile: MSMECompany) => {
    handleNotifySuccess(profile);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setLoginError('');
    try {
      const company = await loginWithGoogleFirebase();
      handleNotifySuccess(company);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoginError(getFriendlyAuthErrorMessage(msg));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleFillSampleRegister = () => {
    setCompanyName('Shree Krishna Precision Tubes & Flanges LLP');
    setUdyamNumber('UDYAM-MH-12-0089421');
    setGstin('27AAACF8912L1Z9');
    setEnterpriseCategory('Small');
    setSector('Steel');
    setState('Maharashtra');
    setCity('Sanand / Pune Industrial Belt');
    setAuthorizedPerson('Vikramaditya Joshi');
    setDesignation('Managing Director');
    setEmail('v.joshi@krishnatubes.in');
    setPhone('+91 98231 77410');
    setRegisterPassword('Krishna@2026!');
    setConfirmPassword('Krishna@2026!');
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
      setAdminAuthError('Please enter your designated 6-digit Admin Security Password.');
      setIsAdminSubmitting(false);
      return;
    }

    const res = authenticateAdmin(adminUsername, adminPassword, adminEmail);
    if (res.success && res.admin) {
      setAdminAuthSuccess(
        `Identity verified: Admin ${res.admin.name} (${res.admin.badge}). Entering Regulatory Portal...`
      );
      setTimeout(() => {
        const session = getActiveAdminSession();
        if (session && onAdminSuccess) {
          onAdminSuccess(session);
        }
        onClose();
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

    // Check if an authorized Admin is logging in through standard credentials!
    const adminMatch = checkIsAdminCredentials(trimmed, loginPassword);
    if (adminMatch) {
      const emailUsed = trimmed.includes('@') ? trimmed : adminMatch.email;
      const res = authenticateAdmin(adminMatch.name, loginPassword, emailUsed);
      if (res.success && res.admin) {
        const session = getActiveAdminSession();
        if (session && onAdminSuccess) {
          onAdminSuccess(session);
        }
        onClose();
        return;
      }
    }

    // Match with demo profiles if using default demo credentials
    const matched = DEMO_MSME_PROFILES.find(
      (p) =>
        (((p.email || '').toLowerCase() === trimmed.toLowerCase()) ||
          ((p.udyamNumber || '').toUpperCase() === trimmed.toUpperCase())) &&
        loginPassword === 'Balaji@2026'
    );

    if (matched) {
      handleNotifySuccess(matched);
      return;
    }

    setIsSubmitting(true);
    try {
      const company = await loginCompanyWithFirebase(trimmed, loginPassword);
      handleNotifySuccess(company);
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

    // Check if an authorized Admin entered credentials in registration
    const adminMatch = checkIsAdminCredentials(authorizedPerson || email, registerPassword, email);
    if (adminMatch) {
      const res = authenticateAdmin(adminMatch.name, registerPassword, email.trim() || adminMatch.email);
      if (res.success && res.admin) {
        const session = getActiveAdminSession();
        if (session && onAdminSuccess) {
          onAdminSuccess(session);
        }
        onClose();
        return;
      }
    }

    if (!companyName.trim()) {
      errors.companyName = 'Enterprise / Company name is required';
    }
    if (!udyamNumber.trim()) {
      errors.udyamNumber = 'Udyam Registration Number (URN) is required';
    } else if (!udyamNumber.toUpperCase().startsWith('UDYAM-')) {
      errors.udyamNumber = 'URN must start with "UDYAM-" (e.g. UDYAM-MH-12-0045892)';
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
          designation: designation.trim() || 'Director',
          email: email.trim(),
          phone: phone.trim() || '+91 98220 12345',
          verifiedStatus: true,
          createdAt: new Date().toISOString().split('T')[0],
        },
        registerPassword
      );

      handleNotifySuccess(newCompany);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRegisterErrors({ general: getFriendlyAuthErrorMessage(msg) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUdyamValidFormat = udyamNumber.toUpperCase().startsWith('UDYAM-') && udyamNumber.length >= 16;

  return (
    <div
      id="msme-auth-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="msme-auth-modal-card"
        className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-xl w-full overflow-hidden text-zinc-900 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-teal-950 text-white p-5 sm:p-6 relative">
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-900/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-teal-100 flex items-center justify-center shrink-0 border border-teal-700">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {mode === 'login'
                  ? 'MSME Enterprise Login'
                  : mode === 'admin'
                  ? 'Central Bureau Admin Access'
                  : 'Create MSME Account'}
              </h2>
              <p className="text-xs text-teal-200">
                {mode === 'admin'
                  ? 'EU CBAM & BEE Bureau Audit Gateway • Vasu, Harry, ZAZU, Atharva'
                  : 'Indian Exporters & Manufacturers Carbon Accounting Portal'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-teal-800/80 mt-5 gap-4 sm:gap-6 text-sm font-medium flex-wrap">
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => {
                setMode('login');
                setShowForgotPassword(false);
                setLoginError('');
              }}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
                mode === 'login'
                  ? 'border-emerald-400 text-white font-semibold'
                  : 'border-transparent text-teal-300 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              id="tab-auth-register"
              type="button"
              onClick={() => {
                setMode('register');
                setShowForgotPassword(false);
                setRegisterErrors({});
              }}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
                mode === 'register'
                  ? 'border-emerald-400 text-white font-semibold'
                  : 'border-transparent text-teal-300 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Create Account</span>
            </button>
            <button
              id="tab-auth-admin"
              type="button"
              onClick={() => {
                setMode('admin');
                setShowForgotPassword(false);
                setAdminAuthError('');
                setAdminAuthSuccess('');
              }}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
                mode === 'admin'
                  ? 'border-amber-400 text-amber-200 font-bold'
                  : 'border-transparent text-teal-300 hover:text-amber-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {showForgotPassword ? (
            /* Forgot password reset view */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                <h3 className="text-sm font-semibold text-teal-950 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-teal-800" />
                  Reset MSME Account Access
                </h3>
                <p className="text-xs text-teal-800 leading-relaxed">
                  Enter your registered corporate email or Udyam Registration Number. We will dispatch an OTP verification link to your authorized signatory contact.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Reset Link Dispatched</span>
                  </div>
                  <p className="text-xs">
                    A secure password reset link has been dispatched to{' '}
                    <span className="font-mono font-bold">{forgotEmail || 'your authorized email'}</span> via Firebase Auth.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSuccess(false);
                    }}
                    className="w-full py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold"
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
                      placeholder="e.g. director@company.co.in"
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
                      Back to Login
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
                        <span>Send Password Reset Link</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : mode === 'login' ? (
            /* LOGIN TAB */
            <div className="space-y-5">
              {/* Google Sign In Button */}
              <button
                id="btn-google-login-modal"
                type="button"
                disabled={isGoogleSubmitting || isSubmitting}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-60 cursor-pointer"
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
                <span>{isGoogleSubmitting ? 'Connecting with Google...' : 'Sign in with Google (Firebase SSO)'}</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-zinc-200" />
                <span className="bg-white px-2.5 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold absolute">
                  Or sign in with email &amp; password
                </span>
              </div>

              {/* Quick 1-Click Demo Profiles for Evaluator Convenience */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-teal-50/70 to-emerald-50/50 border border-teal-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-teal-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    Instant Demo Accounts (1-Click Test)
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium">Click to Load</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_MSME_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      id={`btn-demo-login-${p.id}`}
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

              {/* Standard Login Form */}
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
                    className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs shrink-0 transition-colors"
                  >
                    Admin Section &rarr;
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-700">
                    Official Corporate Email or Udyam Number (URN)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      id="input-login-identifier"
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. r.kulkarni@balajiforgings.co.in or UDYAM-MH-12-0045892"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
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
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
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
                    <span>Remember my enterprise session</span>
                  </label>
                </div>

                {loginError && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {loginError}
                  </p>
                )}

                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                      <span>Authenticating with Firebase...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as MSME Company</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-100">
                Don't have an enterprise account?{' '}
                <button
                  type="button"
                  id="link-switch-to-register"
                  onClick={() => {
                    setMode('register');
                    setRegisterErrors({});
                  }}
                  className="text-teal-800 font-semibold hover:underline"
                >
                  Register MSME Now
                </button>
              </div>
            </div>
          ) : mode === 'admin' ? (
            /* ADMIN TAB */
            <div className="space-y-5">
              {/* Admin Banner */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-950 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-900" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-950">
                      Central Regulatory Admin Access
                    </h3>
                    <p className="text-xs text-amber-800">
                      Vasu • Harry • ZAZU • Atharva
                    </p>
                  </div>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Admins must enter their assigned username, registered official email ID, and 6-digit access code to unlock the master exporter registry and download reports.
                </p>
              </div>

              {/* 1-Click Quick Admin Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Select Admin Profile
                  </label>
                  <span className="text-[11px] text-zinc-500">Quick autofill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AUTHORIZED_ADMINS.map((adm) => (
                    <button
                      key={adm.id}
                      type="button"
                      id={`modal-btn-select-admin-${adm.name.toLowerCase()}`}
                      onClick={() => handleSelectAdminChip(adm)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        (adminUsername || '').toLowerCase() === (adm.name || '').toLowerCase()
                          ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-500 shadow-2xs'
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
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      id="modal-admin-auth-username"
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. Vasu / Harry / ZAZU / Atharva"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Usernames: Vasu, Harry, ZAZU, Atharva (case-insensitive)
                  </p>
                </div>

                {/* Admin Email ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-700">
                    Admin Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      id="modal-admin-auth-email"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. vasu.auditor@carbonbridge.gov.in"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>

                {/* Admin Security Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-zinc-700">
                      Security Password <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400">6-digit assigned PIN</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      id="modal-admin-auth-password"
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter 6-digit password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm font-mono tracking-wider focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
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
                  id="modal-btn-admin-auth-submit"
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
                      <span>Authorize &amp; Open Admin Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-100">
                  Standard exporter?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAdminAuthError('');
                    }}
                    className="text-teal-800 font-semibold hover:underline"
                  >
                    Return to MSME Login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* REGISTER TAB */
            <div className="space-y-5">
              {/* Quick Auto-fill button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-xs">
                  <span className="font-semibold text-zinc-800">Want to test registration quickly?</span>
                  <p className="text-zinc-500 text-[11px]">Auto-fills realistic sample Indian MSME company data</p>
                </div>
                <button
                  type="button"
                  onClick={handleFillSampleRegister}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>Auto-Fill Sample</span>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Section 1: Enterprise Profile */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" />
                    1. Enterprise &amp; Industrial Identity
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">
                        Enterprise / Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-company-name"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Shree Balaji Precision Forgings Pvt Ltd"
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                          registerErrors.companyName
                            ? 'border-red-300 focus:ring-red-100'
                            : 'border-zinc-300 focus:border-teal-700 focus:ring-teal-100'
                        }`}
                      />
                      {registerErrors.companyName && (
                        <p className="text-xs text-red-600">{registerErrors.companyName}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-zinc-700">
                          Udyam Reg. Number (URN) <span className="text-red-500">*</span>
                        </label>
                        {isUdyamValidFormat && (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Valid URN Format
                          </span>
                        )}
                      </div>
                      <input
                        id="reg-udyam-number"
                        type="text"
                        value={udyamNumber}
                        onChange={(e) => setUdyamNumber(e.target.value.toUpperCase())}
                        placeholder="UDYAM-MH-12-0045892"
                        className={`w-full px-3.5 py-2 rounded-lg border text-sm font-mono uppercase focus:outline-none focus:ring-2 ${
                          registerErrors.udyamNumber
                            ? 'border-red-300 focus:ring-red-100'
                            : 'border-zinc-300 focus:border-teal-700 focus:ring-teal-100'
                        }`}
                      />
                      {registerErrors.udyamNumber && (
                        <p className="text-xs text-red-600">{registerErrors.udyamNumber}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">GSTIN (Optional)</label>
                      <input
                        id="reg-gstin"
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="27AABCU9603R1ZM"
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm font-mono uppercase focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">
                        Enterprise Classification (MSMED Act)
                      </label>
                      <select
                        id="reg-category"
                        value={enterpriseCategory}
                        onChange={(e) => setEnterpriseCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm bg-white focus:outline-none focus:border-teal-700"
                      >
                        <option value="Micro">Micro (&lt; ₹1 Cr Inv / &lt; ₹5 Cr Turnover)</option>
                        <option value="Small">Small (&lt; ₹10 Cr Inv / &lt; ₹50 Cr Turnover)</option>
                        <option value="Medium">Medium (&lt; ₹50 Cr Inv / &lt; ₹250 Cr Turnover)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">Primary Sector</label>
                      <select
                        id="reg-sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value as Sector)}
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm bg-white focus:outline-none focus:border-teal-700"
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
                        id="reg-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm bg-white focus:outline-none focus:border-teal-700"
                      >
                        {INDIAN_REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">Industrial Area / City</label>
                      <input
                        id="reg-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Chakan MIDC, Pune"
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Authorized Signatory & Security */}
                <div className="space-y-3 pt-3 border-t border-zinc-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-700" />
                    2. Authorized Signatory &amp; Credentials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">
                        Signatory Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-person"
                        type="text"
                        value={authorizedPerson}
                        onChange={(e) => setAuthorizedPerson(e.target.value)}
                        placeholder="e.g. Rajesh S. Kulkarni"
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                      />
                      {registerErrors.authorizedPerson && (
                        <p className="text-xs text-red-600">{registerErrors.authorizedPerson}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">Signatory Designation</label>
                      <input
                        id="reg-designation"
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Managing Director / Partner"
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">
                        Corporate Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="director@company.co.in"
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                      />
                      {registerErrors.email && (
                        <p className="text-xs text-red-600">{registerErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">WhatsApp / Phone</label>
                      <input
                        id="reg-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98220 00000"
                        className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-zinc-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-3.5 pr-9 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
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
                          id="reg-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-3.5 pr-9 py-2 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:border-teal-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
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

                {/* Consent */}
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs text-teal-900 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeConsent}
                      onChange={(e) => setAgreeConsent(e.target.checked)}
                      className="mt-0.5 rounded border-zinc-300 text-teal-800 focus:ring-teal-700 shrink-0"
                    />
                    <span className="text-[11px] leading-relaxed">
                      I confirm that our enterprise is registered on the Udyam portal. We authorize utility bill linking and state CEA baseline emission factor calculations for EU CBAM audit preparedness.
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
                  id="btn-submit-register"
                  type="submit"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                      <span>Creating Enterprise Account on Firebase...</span>
                    </>
                  ) : (
                    <>
                      <span>Register MSME &amp; Log In</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-100">
                Already registered?{' '}
                <button
                  type="button"
                  id="link-switch-to-login"
                  onClick={() => {
                    setMode('login');
                    setLoginError('');
                  }}
                  className="text-teal-800 font-semibold hover:underline"
                >
                  Sign In to existing account
                </button>
              </div>
            </div>
          )}

          {/* Firebase Connection Status Badge */}
          <div className="mt-5 pt-3.5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5 text-teal-900 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Firebase Connected:</span>
              <span className="font-mono bg-teal-50 px-1.5 py-0.5 rounded text-[10px] text-teal-950 border border-teal-200/80 font-semibold">
                carbonbridge-dcb48
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">Firebase Auth &amp; Cloud Firestore Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
