export type ScreenName =
  | 'dashboard'
  | 'project_definition'
  | 'operational_data'
  | 'review_validation'
  | 'processing'
  | 'result'
  | 'drivers'
  | 'report'
  | 'bill_analyzer'
  | 'auth'
  | 'admin';

export type Sector = 'Steel' | 'Aluminium' | 'Cement' | 'Fertiliser';

export type ReadinessLevel = 'High' | 'Medium' | 'Low';

export interface MSMECompany {
  id: string;
  companyName: string;
  udyamNumber: string; // e.g. UDYAM-MH-12-0045892
  gstin: string; // e.g. 27AABCU9603R1ZM
  enterpriseCategory: 'Micro' | 'Small' | 'Medium';
  sector: Sector;
  state: string;
  city: string;
  authorizedPerson: string;
  designation: string;
  email: string;
  phone: string;
  verifiedStatus: boolean;
  createdAt: string;
}

export interface BillVerificationCheck {
  label: string;
  status: 'valid' | 'warning';
  detail: string;
}

export interface BillAnalysisResult {
  discomName: string;
  consumerId: string;
  meterNumber: string;
  billingPeriod: string;
  tariffCategory: string;
  sanctionedLoad: string;
  electricityConsumedKwh: number;
  powerFactor: number;
  recordedMaxDemandKva: string;
  state: string;
  gridEmissionFactor: number;
  scope2EmissionsTonnes: number;
  confidenceScore: number;
  auditFindings: string[];
  verificationChecks: BillVerificationCheck[];
  fileName?: string;
}

export interface EmissionDriver {
  name: string;
  percentage: number;
  category: 'electricity' | 'fuel' | 'process' | 'grid' | 'other';
}

export interface DataQualityCheck {
  label: string;
  status: 'valid' | 'warning' | 'missing';
  detail?: string;
}

export interface Assessment {
  id: string;
  name: string;
  sector: Sector;
  region: string;
  productProcess: string;
  description?: string;
  productionVolume: number;
  productionUnit: string;
  electricityConsumed: number;
  electricityUnit: string;
  fuelConsumed: number;
  fuelUnit: string;
  fuelType: string;
  createdAt: string;
  estimatedEmissions: number; // in kg CO2e / tonne
  uncertaintyMin: number;
  uncertaintyMax: number;
  readiness: ReadinessLevel;
  drivers: EmissionDriver[];
  dataQuality: DataQualityCheck[];
  recommendedSteps: string[];
  billVerified?: boolean;
  billDiscom?: string;
  billDocName?: string;
}

export interface AssessmentFormData {
  name: string;
  sector: Sector | '';
  region: string;
  productProcess: string;
  description: string;
  productionVolume: string;
  productionUnit: string;
  electricityConsumed: string;
  electricityUnit: string;
  fuelConsumed: string;
  fuelUnit: string;
  fuelType: string;
  billVerified?: boolean;
  billDiscom?: string;
  billDocName?: string;
}
