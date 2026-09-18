import React, { useState } from 'react';
import { ScreenName, MSMECompany } from '../types';
import {
  Leaf,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  HelpCircle,
  User,
  ShieldCheck,
  Zap,
  LogIn,
  Building2,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { getActiveAdminSession, AdminSession } from '../data/adminUsers';

interface HeaderProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onOpenHelp: () => void;
  onStartNewAssessment: () => void;
  msmeCompany: MSMECompany | null;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenProfileModal: () => void;
  activeAdmin?: AdminSession | null;
  onLogoutAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenHelp,
  onStartNewAssessment,
  msmeCompany,
  onOpenAuthModal,
  onOpenProfileModal,
  activeAdmin: propActiveAdmin,
  onLogoutAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeAdmin = propActiveAdmin !== undefined ? propActiveAdmin : getActiveAdminSession();

  const handleNavClick = (screen: ScreenName) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="header-brand-logo-btn"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-900 flex items-center justify-center text-teal-100 shadow-sm group-hover:bg-teal-800 transition-colors">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-lg tracking-tight text-zinc-900 leading-none">
                  Carbon<span className="text-teal-800">Bridge</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-normal leading-tight mt-0.5">
                  MSME Product Carbon Support
                </span>
              </div>
            </button>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
              India MSME • CBAM Ready
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-dashboard-btn"
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentScreen === 'dashboard'
                  ? 'bg-teal-50 text-teal-900 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              id="nav-bill-analyzer-btn"
              onClick={() => handleNavClick('bill_analyzer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentScreen === 'bill_analyzer'
                  ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Bill AI Audit</span>
            </button>

            <button
              id="nav-new-assessment-btn"
              onClick={onStartNewAssessment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium bg-teal-900 text-white hover:bg-teal-800 transition-colors shadow-xs ml-1"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              + New Assessment
            </button>

            <button
              id="nav-help-btn"
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors ml-1"
            >
              <HelpCircle className="w-4 h-4 text-zinc-500" />
              Help & Guide
            </button>

            {/* Admin Portal Gateway - Only visible when an authorized admin is authenticated */}
            {activeAdmin && (
              <div className="flex items-center gap-1 ml-1 bg-amber-50/80 p-0.5 rounded-lg border border-amber-200/80">
                <button
                  id="nav-admin-portal-btn"
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    currentScreen === 'admin'
                      ? 'bg-amber-200/90 text-amber-950 font-bold shadow-2xs'
                      : 'text-amber-900 hover:bg-amber-100'
                  }`}
                  title="Central Regulatory Admin Portal - Authorized Personnel Only"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>Admin: <strong className="font-mono uppercase">{activeAdmin.admin.name}</strong></span>
                </button>
                {onLogoutAdmin && (
                  <button
                    onClick={onLogoutAdmin}
                    className="p-1.5 rounded text-amber-800 hover:text-red-700 hover:bg-amber-200/70 transition-colors"
                    title="Sign Out of Admin Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* MSME Company Account Status */}
            <div className="pl-3 ml-2 border-l border-zinc-200">
              {msmeCompany ? (
                <button
                  id="btn-header-profile"
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 text-teal-950 flex items-center justify-center font-bold text-xs">
                    {msmeCompany.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-zinc-900 text-xs line-clamp-1 max-w-[140px]">
                        {msmeCompany.companyName}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {msmeCompany.udyamNumber.slice(0, 16)}...
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-header-login"
                    type="button"
                    onClick={() => onOpenAuthModal('login')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Log In</span>
                  </button>
                  <button
                    id="btn-header-register"
                    type="button"
                    onClick={() => onOpenAuthModal('register')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-900 hover:bg-teal-800 text-white transition-colors shadow-xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Create Account</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-bill-shortcut-btn"
              onClick={() => handleNavClick('bill_analyzer')}
              className="p-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bill AI</span>
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {/* MSME Status in Mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-2">
            {msmeCompany ? (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfileModal();
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center text-xs font-bold">
                  {msmeCompany.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-zinc-900 line-clamp-1">{msmeCompany.companyName}</p>
                  <p className="text-emerald-700 font-mono text-[10px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Udyam Verified MSME
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-xs text-zinc-600 font-medium">Enterprise Access</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal('login');
                    }}
                    className="text-xs font-semibold text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal('register');
                    }}
                    className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-teal-900"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            id="mobile-nav-dashboard-btn"
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentScreen === 'dashboard'
                ? 'bg-teal-50 text-teal-900 font-semibold'
                : 'text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-zinc-500" />
            Dashboard
          </button>

          <button
            id="mobile-nav-bill-btn"
            onClick={() => handleNavClick('bill_analyzer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentScreen === 'bill_analyzer'
                ? 'bg-emerald-50 text-emerald-950 font-semibold'
                : 'text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            Electricity Bill AI Audit
          </button>

          <button
            id="mobile-nav-new-btn"
            onClick={() => {
              onStartNewAssessment();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-teal-900 text-white"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            + Start New Assessment
          </button>

          <button
            id="mobile-nav-help-btn"
            onClick={() => {
              onOpenHelp();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <HelpCircle className="w-4 h-4 text-zinc-500" />
            How It Works &amp; FAQs
          </button>

          {activeAdmin && (
            <div className="space-y-1">
              <button
                id="mobile-nav-admin-btn"
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border ${
                  currentScreen === 'admin'
                    ? 'bg-amber-100 text-amber-950 font-bold border-amber-300'
                    : 'text-amber-900 bg-amber-50/60 border-amber-200/80 hover:bg-amber-100/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Admin Portal</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-200 text-amber-950 font-bold font-mono">
                  {activeAdmin.admin.name}
                </span>
              </button>
              {onLogoutAdmin && (
                <button
                  onClick={() => {
                    onLogoutAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Admin Session</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

