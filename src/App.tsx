/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ScreenName,
  Assessment,
  AssessmentFormData,
  Sector,
  ReadinessLevel,
  MSMECompany,
} from './types';
import { INITIAL_ASSESSMENTS } from './data/mockAssessments';
import { DEFAULT_MSME_COMPANY } from './data/mockCompanies';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProgressStepper } from './components/ProgressStepper';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AuthModal } from './components/auth/AuthModal';
import { CompanyProfileModal } from './components/auth/CompanyProfileModal';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ProjectDefinitionScreen } from './components/screens/ProjectDefinitionScreen';
import { OperationalDataScreen } from './components/screens/OperationalDataScreen';
import { ReviewValidationScreen } from './components/screens/ReviewValidationScreen';
import { ProcessingScreen } from './components/screens/ProcessingScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { DriversScreen } from './components/screens/DriversScreen';
import { ReportScreen } from './components/screens/ReportScreen';
import { BillAnalyzerScreen } from './components/screens/BillAnalyzerScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { AdminPortalScreen } from './components/screens/AdminPortalScreen';
import { logoutCompanyFirebase, subscribeToFirebaseAuthState } from './lib/firebase';
import {
  AdminSession,
  getActiveAdminSession,
  clearAdminSession,
} from './data/adminUsers';
import { CheckCircle2, X } from 'lucide-react';

const DEFAULT_FORM_DATA: AssessmentFormData = {
  name: 'Steel Export',
  sector: 'Steel',
  region: 'Maharashtra',
  productProcess: 'Reinforcement Steel Bars via Induction Furnace',
  description: 'Operational review for EU export delivery consignment.',
  productionVolume: '1000',
  productionUnit: 'tonnes',
  electricityConsumed: '50000',
  electricityUnit: 'kWh',
  fuelConsumed: '5000',
  fuelUnit: 'litres',
  fuelType: 'Diesel',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment>(INITIAL_ASSESSMENTS[0]);
  const [formData, setFormData] = useState<AssessmentFormData>(DEFAULT_FORM_DATA);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEmptyDashboardView, setIsEmptyDashboardView] = useState(false);

  // MSME Company Authentication & Profile states
  const [msmeCompany, setMsmeCompany] = useState<MSMECompany | null>(() => {
    try {
      const saved = localStorage.getItem('carbonbridge_msme_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null; // Guest mode by default so user can test login and create account
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authToast, setAuthToast] = useState<string | null>(null);

  // Central Regulatory Admin session state (Vasu, Harry, ZAZU, Atharva)
  const [activeAdmin, setActiveAdmin] = useState<AdminSession | null>(() => getActiveAdminSession());

  const handleAdminAuthSuccess = (session: AdminSession) => {
    setActiveAdmin(session);
    setIsAuthModalOpen(false);
    setCurrentScreen('admin');
    setAuthToast(`Identity Confirmed: Admin ${session.admin.name} (${session.admin.badge}). Regulatory Portal unlocked.`);
    setTimeout(() => setAuthToast(null), 5000);
  };

  const handleLogoutAdmin = () => {
    clearAdminSession();
    setActiveAdmin(null);
    if (currentScreen === 'admin') {
      setCurrentScreen('dashboard');
    }
    setAuthToast('Admin session cleared successfully.');
    setTimeout(() => setAuthToast(null), 3500);
  };

  // Subscribe to Firebase Auth state for automatic session sync
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseAuthState((user, companyProfile) => {
      if (user && companyProfile) {
        setMsmeCompany(companyProfile);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save MSME profile to localStorage whenever it changes
  useEffect(() => {
    try {
      if (msmeCompany) {
        localStorage.setItem('carbonbridge_msme_user', JSON.stringify(msmeCompany));
      } else {
        localStorage.removeItem('carbonbridge_msme_user');
      }
    } catch {
      // ignore
    }
  }, [msmeCompany]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (company: MSMECompany) => {
    setMsmeCompany(company);
    setIsAuthModalOpen(false);
    setAuthToast(`Signed in as ${company.companyName} (${company.enterpriseCategory} MSME • Udyam Verified)`);
    setTimeout(() => setAuthToast(null), 4500);

    if (currentScreen === 'auth') {
      setCurrentScreen('dashboard');
    }

    // Auto-populate default company context if form is empty
    if (!formData.name || formData.name === 'Steel Export') {
      setFormData((prev) => ({
        ...prev,
        name: `${company.companyName} Consignment`,
        sector: company.sector,
        region: company.state,
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await logoutCompanyFirebase();
    } catch {
      // fallback
    }
    setMsmeCompany(null);
    setAuthToast('Signed out of MSME enterprise session. Switched to guest mode.');
    setTimeout(() => setAuthToast(null), 3500);
  };

  // Helper to start brand new assessment
  const handleStartNewAssessment = () => {
    setFormData({
      name: msmeCompany ? `${msmeCompany.companyName} Export Lot` : '',
      sector: msmeCompany ? msmeCompany.sector : '',
      region: msmeCompany ? msmeCompany.state : '',
      productProcess: '',
      description: '',
      productionVolume: '1000',
      productionUnit: 'tonnes',
      electricityConsumed: '50000',
      electricityUnit: 'kWh',
      fuelConsumed: '5000',
      fuelUnit: 'litres',
      fuelType: 'Diesel',
    });
    setCurrentScreen('project_definition');
  };

  // Helper to load and view an existing card from dashboard
  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      name: assessment.name,
      sector: assessment.sector,
      region: assessment.region,
      productProcess: assessment.productProcess,
      description: assessment.description || '',
      productionVolume: assessment.productionVolume.toString(),
      productionUnit: assessment.productionUnit,
      electricityConsumed: assessment.electricityConsumed.toString(),
      electricityUnit: assessment.electricityUnit,
      fuelConsumed: assessment.fuelConsumed.toString(),
      fuelUnit: assessment.fuelUnit,
      fuelType: assessment.fuelType,
      billVerified: assessment.billVerified,
      billDiscom: assessment.billDiscom,
      billDocName: assessment.billDocName,
    });
    setCurrentScreen('result');
  };

  // When AI Bill analyzer extracts and applies data
  const handleApplyBillData = (
    kwh: number,
    discom: string,
    docName: string,
    state?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      electricityConsumed: kwh.toString(),
      electricityUnit: 'kWh',
      billVerified: true,
      billDiscom: discom,
      billDocName: docName,
      region: state || prev.region || 'Maharashtra',
    }));
    // Take user to operational data screen to review other inputs
    setCurrentScreen('operational_data');
  };

  // Stepper helper
  const getStepNumber = (screen: ScreenName): number => {
    switch (screen) {
      case 'project_definition':
        return 1;
      case 'operational_data':
        return 2;
      case 'review_validation':
        return 3;
      case 'processing':
        return 4;
      default:
        return 1;
    }
  };

  const isWizardScreen = [
    'project_definition',
    'operational_data',
    'review_validation',
    'processing',
  ].includes(currentScreen);

  // Handle calculation completion: construct fresh calculated assessment
  const handleCalculationComplete = () => {
    const prod = Number(formData.productionVolume) || 1000;
    const elec = Number(formData.electricityConsumed) || 50000;
    const fuel = Number(formData.fuelConsumed) || 5000;

    // Base intensity ~700-750 kg CO2e / tonne for steel
    let baseIntensity = 720;
    if (formData.sector === 'Aluminium') baseIntensity = 610;
    if (formData.sector === 'Cement') baseIntensity = 830;
    if (formData.sector === 'Fertiliser') baseIntensity = 890;

    // Heuristic adjustment based on electricity & fuel ratio
    const adjusted = Math.round(baseIntensity + ((elec / prod) * 0.4 + (fuel / prod) * 1.5 - 27.5));
    const finalVal = Math.max(300, Math.min(1800, adjusted));

    // If electricity bill was audited and verified, the uncertainty is significantly tighter!
    const isBillVerified = Boolean(formData.billVerified);
    const minVal = isBillVerified ? Math.round(finalVal * 0.97) : Math.round(finalVal * 0.94);
    const maxVal = isBillVerified ? Math.round(finalVal * 1.03) : Math.round(finalVal * 1.06);
    const readiness: ReadinessLevel = isBillVerified ? 'High' : 'Medium';

    const newAssessment: Assessment = {
      id: `cb-${Date.now().toString().slice(-4)}`,
      name: formData.name || 'New MSME Assessment',
      sector: (formData.sector as Sector) || 'Steel',
      region: formData.region || 'Maharashtra',
      productProcess: formData.productProcess || 'Electric Induction Furnace Rebars',
      description: formData.description,
      productionVolume: prod,
      productionUnit: formData.productionUnit,
      electricityConsumed: elec,
      electricityUnit: formData.electricityUnit,
      fuelConsumed: fuel,
      fuelUnit: formData.fuelUnit,
      fuelType: formData.fuelType || 'Diesel',
      createdAt: new Date().toISOString().split('T')[0],
      estimatedEmissions: finalVal,
      uncertaintyMin: minVal,
      uncertaintyMax: maxVal,
      readiness: readiness,
      billVerified: isBillVerified,
      billDiscom: formData.billDiscom,
      billDocName: formData.billDocName,
      drivers: [
        { name: 'Electricity', percentage: 42, category: 'electricity' },
        { name: 'Fuel', percentage: 21, category: 'fuel' },
        { name: 'Process', percentage: 12, category: 'process' },
        { name: 'Grid Factor', percentage: 9, category: 'grid' },
        { name: 'Other', percentage: 16, category: 'other' },
      ],
      dataQuality: [
        {
          label: 'Production data available',
          status: 'valid',
          detail: `${prod.toLocaleString()} ${formData.productionUnit} verified from dispatch records`,
        },
        {
          label: isBillVerified ? 'Electricity verified by DISCOM bill' : 'Electricity data logged',
          status: 'valid',
          detail: isBillVerified
            ? `Audited from ${formData.billDiscom || 'DISCOM'} utility bill (${formData.billDocName || 'PDF'}). Zero metering variance.`
            : `${elec.toLocaleString()} ${formData.electricityUnit} entered from factory log sheet.`,
        },
        {
          label: 'Fuel details recorded',
          status: 'valid',
          detail: `${fuel.toLocaleString()} ${formData.fuelUnit} of ${formData.fuelType}; sub-metering recommended`,
        },
      ],
      recommendedSteps: [
        isBillVerified
          ? 'Retain the signed DISCOM bill & AI audit receipt for EU CBAM verifier audit.'
          : 'Upload your state utility bill to verify Scope 2 grid emissions and raise Data Readiness.',
        'Collect detailed fuel consumption breakdown (furnace vs standby diesel generators).',
        'Record process-level electricity data with dedicated sub-meters.',
      ],
    };

    setAssessments((prev) => [newAssessment, ...prev]);
    setSelectedAssessment(newAssessment);
    setCurrentScreen('result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 antialiased font-sans">
      {/* Global Top Navigation */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onStartNewAssessment={handleStartNewAssessment}
        msmeCompany={msmeCompany}
        activeAdmin={activeAdmin}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenAuthModal={handleOpenAuth}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Progress Stepper for Steps 1 through 4 */}
      {isWizardScreen && (
        <ProgressStepper
          currentStep={getStepNumber(currentScreen)}
          totalSteps={4}
          onStepClick={(step) => {
            if (step === 1) setCurrentScreen('project_definition');
            if (step === 2) setCurrentScreen('operational_data');
            if (step === 3) setCurrentScreen('review_validation');
          }}
          allowStepClick={currentScreen !== 'processing'}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Screen: Dedicated MSME Login & Registration */}
        {currentScreen === 'auth' && (
          <AuthScreen
            initialMode={authModalMode}
            onSuccess={handleAuthSuccess}
            onAdminSuccess={handleAdminAuthSuccess}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* Screen: AI Electricity Bill Analyzer & Proof Guidelines */}
        {currentScreen === 'bill_analyzer' && (
          <BillAnalyzerScreen
            onBack={() => setCurrentScreen('dashboard')}
            onApplyBillData={handleApplyBillData}
          />
        )}

        {/* Screen 1: Dashboard / Welcome */}
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            assessments={assessments}
            onStartNew={handleStartNewAssessment}
            onViewAssessment={handleViewAssessment}
            onOpenHelp={() => setIsHelpOpen(true)}
            isEmptyView={isEmptyDashboardView}
            onToggleEmptyState={() => setIsEmptyDashboardView(!isEmptyDashboardView)}
            msmeCompany={msmeCompany}
            onOpenAuthModal={handleOpenAuth}
            onOpenBillAnalyzer={() => setCurrentScreen('bill_analyzer')}
          />
        )}

        {/* Screen 2: Project Definition (Step 1 of 4) */}
        {currentScreen === 'project_definition' && (
          <ProjectDefinitionScreen
            initialData={formData}
            onBack={() => setCurrentScreen('dashboard')}
            onContinue={(updatedData) => {
              setFormData(updatedData);
              setCurrentScreen('operational_data');
            }}
          />
        )}

        {/* Screen 3: Operational Data (Step 2 of 4) */}
        {currentScreen === 'operational_data' && (
          <OperationalDataScreen
            initialData={formData}
            onBack={() => setCurrentScreen('project_definition')}
            onContinue={(updatedData) => {
              setFormData(updatedData);
              setCurrentScreen('review_validation');
            }}
            onOpenBillAnalyzer={() => setCurrentScreen('bill_analyzer')}
          />
        )}

        {/* Screen 4: Data Review & Validation (Step 3 of 4) */}
        {currentScreen === 'review_validation' && (
          <ReviewValidationScreen
            formData={formData}
            onEditData={() => setCurrentScreen('operational_data')}
            onCalculateEstimate={() => setCurrentScreen('processing')}
          />
        )}

        {/* Screen 5: Estimation / Processing (Step 4 of 4) */}
        {currentScreen === 'processing' && (
          <ProcessingScreen
            onSuccess={handleCalculationComplete}
            onEditData={() => setCurrentScreen('operational_data')}
          />
        )}

        {/* Screen 6: Carbon Result Dashboard */}
        {currentScreen === 'result' && (
          <ResultScreen
            assessment={selectedAssessment}
            onViewDrivers={() => setCurrentScreen('drivers')}
            onViewDataQuality={() => setCurrentScreen('drivers')}
            onGenerateReport={() => setCurrentScreen('report')}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* Screen 7: Main Drivers + Data Quality */}
        {currentScreen === 'drivers' && (
          <DriversScreen
            assessment={selectedAssessment}
            onBackToResult={() => setCurrentScreen('result')}
            onGoToReport={() => setCurrentScreen('report')}
          />
        )}

        {/* Screen 8: Readiness Report */}
        {currentScreen === 'report' && (
          <ReportScreen
            assessment={selectedAssessment}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
            onBackToResult={() => setCurrentScreen('result')}
          />
        )}

        {/* Screen 9: Central Admin Portal (Restricted to Authorized Admins) */}
        {currentScreen === 'admin' && (
          <AdminPortalScreen
            onBackToDashboard={() => setCurrentScreen('dashboard')}
            onNavigateHome={() => setCurrentScreen('dashboard')}
            activeAdminSession={activeAdmin}
            onLogoutAdmin={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onStartAssessment={() => {
          setIsHelpOpen(false);
          handleStartNewAssessment();
        }}
      />

      {/* MSME Auth Modal (Login / Register / Admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authModalMode}
        onSuccess={handleAuthSuccess}
        onAdminSuccess={handleAdminAuthSuccess}
      />

      {/* MSME Company Profile Modal */}
      <CompanyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        company={msmeCompany}
        onUpdateCompany={(updated) => setMsmeCompany(updated)}
        onLogout={handleLogout}
        onSwitchAccount={() => {
          setIsProfileModalOpen(false);
          handleOpenAuth('login');
        }}
      />

      {/* Floating Auth Notification Toast */}
      {authToast && (
        <div
          id="auth-notification-toast"
          className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-teal-950 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-teal-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs text-teal-100 font-medium flex-1 leading-relaxed">{authToast}</p>
          <button
            onClick={() => setAuthToast(null)}
            className="text-teal-400 hover:text-white p-1 rounded-lg hover:bg-teal-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

