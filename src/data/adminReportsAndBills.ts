import { Sector, ReadinessLevel, Assessment, MSMECompany } from '../types';
import { DEMO_MSME_PROFILES, DEFAULT_MSME_COMPANY, SAMPLE_DISCOM_BILLS } from './mockCompanies';
import { INITIAL_ASSESSMENTS } from './mockAssessments';
import { getLocallyRegisteredCompanies } from './companyRegistryService';

export interface UserReport {
  id: string;
  reportNumber: string;
  companyId: string;
  companyName: string;
  udyamNumber: string;
  gstin: string;
  enterpriseCategory: 'Micro' | 'Small' | 'Medium';
  sector: Sector;
  state: string;
  city: string;
  submittedBy: string;
  submittedByEmail: string;
  userRole: string;
  userPhone: string;
  submittedDate: string;
  consignmentName: string;
  productProcess: string;
  productionVolume: number;
  productionUnit: string;
  electricityConsumedKwh: number;
  fuelConsumed: number;
  fuelUnit: string;
  fuelType: string;
  scope1EmissionsKgPerTonne: number;
  scope2EmissionsKgPerTonne: number;
  totalEmissionsKgPerTonne: number;
  uncertaintyMin: number;
  uncertaintyMax: number;
  readiness: ReadinessLevel;
  billVerified: boolean;
  associatedBillId: string;
  associatedBillDoc: string;
  associatedDiscom: string;
  estimatedCbTaxEuros: number;
  auditStatus: 'Bureau Certified' | 'AI Validated' | 'Pending Review' | 'Flagged Discrepancy';
  auditorNotes: string;
  verifiedByAdmin?: string;
  verifiedAt?: string;
  assessment: Assessment;
}

export interface UtilityBill {
  id: string;
  billNumber: string;
  companyId: string;
  companyName: string;
  udyamNumber: string;
  state: string;
  city: string;
  sector: Sector;
  providedByUser: {
    name: string;
    email: string;
    role: string;
    phone: string;
  };
  discomName: string;
  discomShort: string;
  consumerId: string;
  meterNumber: string;
  billingPeriod: string;
  billIssueDate: string;
  billDueDate: string;
  tariffCategory: string;
  sanctionedLoad: string;
  contractDemandKva: number;
  connectedVoltage: string;
  unitsBilledKwh: number;
  billedKvah: number;
  powerFactor: number;
  recordedMaxDemandKva: string;
  meterStartReading: number;
  meterEndReading: number;
  meterMultiplyingFactor: number;
  energyChargesInr: number;
  fixedDemandChargesInr: number;
  fuelAdjustmentChargesInr: number;
  electricityDutyInr: number;
  totalInvoicedAmountInr: number;
  paymentStatus: 'Paid' | 'Pending Payment' | 'Overdue';
  verificationStatus: 'Bureau Certified' | 'AI Validated' | 'Pending Review' | 'Flagged Discrepancy';
  ceaGridFactor: number;
  calculatedScope2Tonnes: number;
  documentFileName: string;
  documentFileSize: string;
  documentType: 'PDF E-Bill' | 'Scanned Paper Bill';
  auditorNotes: string;
  verifiedByAdmin?: string;
  verifiedAt?: string;
  flagReason?: string;
  associatedReportId?: string;
}

const LOCAL_STORAGE_REPORTS_STATUS_KEY = 'carbonbridge_admin_reports_status_v1';
const LOCAL_STORAGE_BILLS_STATUS_KEY = 'carbonbridge_admin_bills_status_v1';

/**
 * Seed master reports covering users across companies
 */
const SEED_USER_REPORTS: UserReport[] = [
  {
    id: 'rep-balaji-001',
    reportNumber: 'CB-REP-2025-0489',
    companyId: 'msme-001',
    companyName: 'Shree Balaji Precision Forgings Pvt Ltd',
    udyamNumber: 'UDYAM-MH-12-0045892',
    gstin: '27AABCU9603R1ZM',
    enterpriseCategory: 'Medium',
    sector: 'Steel',
    state: 'Maharashtra',
    city: 'Chakan Industrial Area, Pune',
    submittedBy: 'Rajesh S. Kulkarni',
    submittedByEmail: 'r.kulkarni@balajiforgings.co.in',
    userRole: 'Managing Director & Plant Head',
    userPhone: '+91 98220 44192',
    submittedDate: '2025-02-18',
    consignmentName: 'Forged Automotive Flanges & Structural Billets (EU Batch)',
    productProcess: 'Reinforcement Steel Bars via Induction Furnace & Drop Hammer',
    productionVolume: 1000,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 50000,
    fuelConsumed: 5000,
    fuelUnit: 'litres',
    fuelType: 'Diesel',
    scope1EmissionsKgPerTonne: 340,
    scope2EmissionsKgPerTonne: 380,
    totalEmissionsKgPerTonne: 720,
    uncertaintyMin: 680,
    uncertaintyMax: 760,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-msedcl-001',
    associatedBillDoc: 'MSEDCL_HT_Industrial_Pune_Aug2026.pdf',
    associatedDiscom: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
    estimatedCbTaxEuros: 61200, // 1000t * (0.720t/t) * €85
    auditStatus: 'Bureau Certified',
    auditorNotes: 'Primary DISCOM meter bill verified with 100% CT/PT alignment. Scope 2 CEA factor applied without default markup.',
    verifiedByAdmin: 'Vasu (Lead ESG Auditor)',
    verifiedAt: '2025-02-20',
    assessment: {
      ...INITIAL_ASSESSMENTS[0],
      billVerified: true,
      billDiscom: 'Maharashtra State Electricity Distribution Co. Ltd.',
      billDocName: 'MSEDCL_HT_Industrial_Pune_Aug2026.pdf',
    },
  },
  {
    id: 'rep-balaji-002',
    reportNumber: 'CB-REP-2025-0512',
    companyId: 'msme-001',
    companyName: 'Shree Balaji Precision Forgings Pvt Ltd',
    udyamNumber: 'UDYAM-MH-12-0045892',
    gstin: '27AABCU9603R1ZM',
    enterpriseCategory: 'Medium',
    sector: 'Steel',
    state: 'Maharashtra',
    city: 'Chakan Industrial Area, Pune',
    submittedBy: 'Priya Sharma',
    submittedByEmail: 'priya.esg@balajiforgings.co.in',
    userRole: 'Senior Energy & Carbon Auditor',
    userPhone: '+91 98220 44195',
    submittedDate: '2025-02-24',
    consignmentName: 'Low-Carbon Hot Rolled Connecting Rods (Germany Export)',
    productProcess: 'Electric Induction Melting & Controlled Nitrogen Quenching',
    productionVolume: 650,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 31000,
    fuelConsumed: 2800,
    fuelUnit: 'litres',
    fuelType: 'Diesel',
    scope1EmissionsKgPerTonne: 310,
    scope2EmissionsKgPerTonne: 348,
    totalEmissionsKgPerTonne: 658,
    uncertaintyMin: 635,
    uncertaintyMax: 681,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-msedcl-002',
    associatedBillDoc: 'MSEDCL_HT_Chakan_Unit2_Jan2026.pdf',
    associatedDiscom: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
    estimatedCbTaxEuros: 36354,
    auditStatus: 'AI Validated',
    auditorNotes: 'Sub-metered unit 2 induction logs reconciled with energy ledger.',
    verifiedByAdmin: 'Harry (Industrial Verification Officer)',
    verifiedAt: '2025-02-25',
    assessment: {
      ...INITIAL_ASSESSMENTS[0],
      id: 'rep-balaji-002-assm',
      name: 'Balaji Hot Rolled Connecting Rods',
      productionVolume: 650,
      electricityConsumed: 31000,
      fuelConsumed: 2800,
      estimatedEmissions: 658,
      readiness: 'High',
      billVerified: true,
    },
  },
  {
    id: 'rep-gujarat-001',
    reportNumber: 'CB-REP-2025-0604',
    companyId: 'msme-002',
    companyName: 'Gujarat Alloy Extrusions Ltd',
    udyamNumber: 'UDYAM-GJ-01-0089124',
    gstin: '24AAACG8812K1ZQ',
    enterpriseCategory: 'Small',
    sector: 'Aluminium',
    state: 'Gujarat',
    city: 'Makarpura GIDC, Vadodara',
    submittedBy: 'Hitesh N. Patel',
    submittedByEmail: 'hitesh@gujaratextrusions.com',
    userRole: 'Technical Director',
    userPhone: '+91 98791 22804',
    submittedDate: '2025-02-12',
    consignmentName: 'Aluminium Architectural Profiles & Heat Sink Extrusions',
    productProcess: 'Secondary Billet Preheating & 1800-Tonne Hydraulic Extrusion Press',
    productionVolume: 450,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 68000,
    fuelConsumed: 3200,
    fuelUnit: 'litres',
    fuelType: 'Natural Gas',
    scope1EmissionsKgPerTonne: 190,
    scope2EmissionsKgPerTonne: 420,
    totalEmissionsKgPerTonne: 610,
    uncertaintyMin: 580,
    uncertaintyMax: 640,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-torrent-001',
    associatedBillDoc: 'TorrentPower_Vatva_HT1_Bill.pdf',
    associatedDiscom: 'Torrent Power Ltd. (Vatva Zone)',
    estimatedCbTaxEuros: 23332,
    auditStatus: 'Bureau Certified',
    auditorNotes: 'High power factor 0.99 confirmed. Natural gas calorific certificates attached.',
    verifiedByAdmin: 'ZAZU (Metallurgy Specialist)',
    verifiedAt: '2025-02-15',
    assessment: {
      ...INITIAL_ASSESSMENTS[1],
      billVerified: true,
      billDiscom: 'Torrent Power Ltd.',
      billDocName: 'TorrentPower_Vatva_HT1_Bill.pdf',
    },
  },
  {
    id: 'rep-gujarat-002',
    reportNumber: 'CB-REP-2025-0688',
    companyId: 'msme-002',
    companyName: 'Gujarat Alloy Extrusions Ltd',
    udyamNumber: 'UDYAM-GJ-01-0089124',
    gstin: '24AAACG8812K1ZQ',
    enterpriseCategory: 'Small',
    sector: 'Aluminium',
    state: 'Gujarat',
    city: 'Makarpura GIDC, Vadodara',
    submittedBy: 'Bhavin Shah',
    submittedByEmail: 'bhavin.compliance@gujaratextrusions.com',
    userRole: 'Export Compliance Manager',
    userPhone: '+91 98791 22810',
    submittedDate: '2025-02-28',
    consignmentName: 'Automotive Radiator Tubes & Precision Hollow Billets',
    productProcess: 'Cold Drawing, Nitrogen Annealing, Precision Sizing',
    productionVolume: 320,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 48000,
    fuelConsumed: 2100,
    fuelUnit: 'litres',
    fuelType: 'Natural Gas',
    scope1EmissionsKgPerTonne: 175,
    scope2EmissionsKgPerTonne: 415,
    totalEmissionsKgPerTonne: 590,
    uncertaintyMin: 565,
    uncertaintyMax: 615,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-torrent-002',
    associatedBillDoc: 'TorrentPower_Makarpura_Feb2026.pdf',
    associatedDiscom: 'Torrent Power Ltd. (Vatva & Vadodara Circle)',
    estimatedCbTaxEuros: 16048,
    auditStatus: 'AI Validated',
    auditorNotes: 'Automated OCR extraction verified against Torrent Power HT meter index.',
    verifiedByAdmin: 'Vasu (Lead ESG Auditor)',
    verifiedAt: '2025-03-01',
    assessment: {
      ...INITIAL_ASSESSMENTS[1],
      id: 'rep-gujarat-002-assm',
      name: 'Radiator Tubes & Hollow Billets',
      productionVolume: 320,
      electricityConsumed: 48000,
      estimatedEmissions: 590,
      readiness: 'High',
    },
  },
  {
    id: 'rep-kalinga-001',
    reportNumber: 'CB-REP-2025-0720',
    companyId: 'msme-003',
    companyName: 'Kalinga Green Sponge & Rebars',
    udyamNumber: 'UDYAM-OD-14-0019238',
    gstin: '21AABCK4490M1ZF',
    enterpriseCategory: 'Medium',
    sector: 'Steel',
    state: 'Odisha',
    city: 'Kalunga Industrial Estate, Rourkela',
    submittedBy: 'Amitabh Mohanty',
    submittedByEmail: 'esg@kalingarebars.in',
    userRole: 'Operations & ESG Lead',
    userPhone: '+91 94370 81205',
    submittedDate: '2025-01-15',
    consignmentName: 'Direct Reduced Iron (DRI) Sponge Pellets & Billets',
    productProcess: 'Rotary Kiln Coal-based DRI Reduction & Continuous Billet Caster',
    productionVolume: 2200,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 112000,
    fuelConsumed: 18000,
    fuelUnit: 'litres',
    fuelType: 'Non-Coking Coal',
    scope1EmissionsKgPerTonne: 460,
    scope2EmissionsKgPerTonne: 385,
    totalEmissionsKgPerTonne: 845,
    uncertaintyMin: 810,
    uncertaintyMax: 880,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-tata-odisha-001',
    associatedBillDoc: 'TPWODL_Rourkela_HT_Steel.pdf',
    associatedDiscom: 'Tata Power Western Odisha Distribution Ltd (TPWODL)',
    estimatedCbTaxEuros: 157970,
    auditStatus: 'Bureau Certified',
    auditorNotes: 'High tension 600 kVA steel tariff verified with TPWODL distribution feeder.',
    verifiedByAdmin: 'Atharva (Executive Admin)',
    verifiedAt: '2025-01-20',
    assessment: {
      ...INITIAL_ASSESSMENTS[0],
      id: 'rep-kalinga-001-assm',
      name: 'Kalinga DRI Sponge & Billets Lot',
      productionVolume: 2200,
      productionUnit: 'tonnes',
      electricityConsumed: 112000,
      fuelConsumed: 18000,
      fuelType: 'Non-Coking Coal',
      estimatedEmissions: 845,
      readiness: 'High',
      billVerified: true,
      billDiscom: 'Tata Power Western Odisha Distribution Ltd',
    },
  },
  {
    id: 'rep-coromandel-001',
    reportNumber: 'CB-REP-2025-0801',
    companyId: 'msme-004',
    companyName: 'Coromandel Green Fertilizers & Chemicals',
    udyamNumber: 'UDYAM-TN-03-0091823',
    gstin: '33AABCC1120N1ZZ',
    enterpriseCategory: 'Medium',
    sector: 'Fertiliser',
    state: 'Tamil Nadu',
    city: 'Ennore Port Industrial Corridor, Chennai',
    submittedBy: 'Dr. R. Subramanian',
    submittedByEmail: 'subramanian.plant@coromandelgreen.com',
    userRole: 'Chief Chemical Engineer',
    userPhone: '+91 94440 98124',
    submittedDate: '2025-02-05',
    consignmentName: 'Low-Carbon Granular Urea & Liquid Ammonium Nitrate Consignment',
    productProcess: 'Steam Methane Reforming, Haber-Bosch Ammonia Synthesis & Prilling',
    productionVolume: 1200,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 85000,
    fuelConsumed: 9500,
    fuelUnit: 'litres',
    fuelType: 'Natural Gas',
    scope1EmissionsKgPerTonne: 550,
    scope2EmissionsKgPerTonne: 340,
    totalEmissionsKgPerTonne: 890,
    uncertaintyMin: 840,
    uncertaintyMax: 940,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-tangedco-001',
    associatedBillDoc: 'TANGEDCO_HT_Bill_Coimbatore.pdf',
    associatedDiscom: 'Tamil Nadu Generation and Distribution Corp (TANGEDCO)',
    estimatedCbTaxEuros: 90780,
    auditStatus: 'Bureau Certified',
    auditorNotes: 'Continuous gas chromatograph and TANGEDCO 33kV HT tariff bill verified by Bureau team.',
    verifiedByAdmin: 'Vasu (Lead ESG Auditor)',
    verifiedAt: '2025-02-08',
    assessment: {
      ...INITIAL_ASSESSMENTS[0],
      id: 'rep-coromandel-001-assm',
      name: 'Coromandel Granular Urea Export Lot',
      sector: 'Fertiliser',
      region: 'Tamil Nadu',
      productionVolume: 1200,
      electricityConsumed: 85000,
      fuelConsumed: 9500,
      fuelType: 'Natural Gas',
      estimatedEmissions: 890,
      readiness: 'High',
      billVerified: true,
      billDiscom: 'TANGEDCO High Tension Industrial',
    },
  },
  {
    id: 'rep-deccan-001',
    reportNumber: 'CB-REP-2025-0877',
    companyId: 'msme-005',
    companyName: 'Deccan Heavy Castings & Billets',
    udyamNumber: 'UDYAM-TS-09-0034182',
    gstin: '36AABCD4411P1ZK',
    enterpriseCategory: 'Small',
    sector: 'Steel',
    state: 'Telangana',
    city: 'Cherlapally Industrial Estate, Hyderabad',
    submittedBy: 'Vikramaditya Rao',
    submittedByEmail: 'vikram.rao@deccancastings.in',
    userRole: 'Plant Head & Operations VP',
    userPhone: '+91 98480 33418',
    submittedDate: '2025-02-14',
    consignmentName: 'Cast Steel Valve Bodies & Railway Bogie Castings (Spain Consignment)',
    productProcess: 'Medium Frequency Induction Furnace & Sand Moulding Cast Line',
    productionVolume: 780,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 58500,
    fuelConsumed: 4200,
    fuelUnit: 'litres',
    fuelType: 'Diesel',
    scope1EmissionsKgPerTonne: 320,
    scope2EmissionsKgPerTonne: 410,
    totalEmissionsKgPerTonne: 730,
    uncertaintyMin: 690,
    uncertaintyMax: 770,
    readiness: 'Medium',
    billVerified: false,
    associatedBillId: 'bill-tssouthern-001',
    associatedBillDoc: 'TSSPDCL_Cherlapally_HT_Jan2026.pdf',
    associatedDiscom: 'Southern Power Distribution Company of Telangana Ltd (TSSPDCL)',
    estimatedCbTaxEuros: 48399,
    auditStatus: 'Pending Review',
    auditorNotes: 'Bill uploaded awaiting secondary meter calibration certificate.',
    assessment: {
      ...INITIAL_ASSESSMENTS[0],
      id: 'rep-deccan-001-assm',
      name: 'Deccan Valve Bodies Spain Consignment',
      region: 'Telangana',
      productionVolume: 780,
      electricityConsumed: 58500,
      estimatedEmissions: 730,
      readiness: 'Medium',
      billVerified: false,
    },
  },
  {
    id: 'rep-punjab-001',
    reportNumber: 'CB-REP-2025-0922',
    companyId: 'msme-006',
    companyName: 'Bharat Special Steels & Tubes',
    udyamNumber: 'UDYAM-PB-10-0081290',
    gstin: '03AABCB5512R1ZR',
    enterpriseCategory: 'Micro',
    sector: 'Steel',
    state: 'Punjab',
    city: 'Focal Point Industrial Phase 5, Ludhiana',
    submittedBy: 'Gurpreet Singh',
    submittedByEmail: 'gurpreet@bharatsteels.co.in',
    userRole: 'Proprietor & Exporter',
    userPhone: '+91 98150 77129',
    submittedDate: '2025-02-19',
    consignmentName: 'Seamless Cold-Drawn Precision Steel Tubes (Italy Buyer)',
    productProcess: 'Piercing Mill, Cold Draw Bench, Bright Induction Annealing',
    productionVolume: 350,
    productionUnit: 'tonnes',
    electricityConsumedKwh: 34000,
    fuelConsumed: 2200,
    fuelUnit: 'litres',
    fuelType: 'LPG',
    scope1EmissionsKgPerTonne: 280,
    scope2EmissionsKgPerTonne: 430,
    totalEmissionsKgPerTonne: 710,
    uncertaintyMin: 670,
    uncertaintyMax: 750,
    readiness: 'High',
    billVerified: true,
    associatedBillId: 'bill-pspcl-001',
    associatedBillDoc: 'PSPCL_Ludhiana_HT_Feb2026.pdf',
    associatedDiscom: 'Punjab State Power Corporation Ltd (PSPCL)',
    estimatedCbTaxEuros: 21122,
    auditStatus: 'Bureau Certified',
    auditorNotes: 'Verified via PSPCL portal consumer register. Clear seamless tube audit trail.',
    verifiedByAdmin: 'Harry (Industrial Verification Officer)',
    verifiedAt: '2025-02-21',
    assessment: {
      ...INITIAL_ASSESSMENTS[0],
      id: 'rep-punjab-001-assm',
      name: 'Bharat Precision Steel Tubes Export Lot',
      region: 'Punjab',
      productionVolume: 350,
      electricityConsumed: 34000,
      estimatedEmissions: 710,
      readiness: 'High',
      billVerified: true,
      billDiscom: 'Punjab State Power Corporation Ltd',
    },
  },
];

/**
 * Seed master bills provided by users and companies
 */
const SEED_UTILITY_BILLS: UtilityBill[] = [
  {
    id: 'bill-msedcl-001',
    billNumber: 'MSEDCL/PUN/2026/08/9412',
    companyId: 'msme-001',
    companyName: 'Shree Balaji Precision Forgings Pvt Ltd',
    udyamNumber: 'UDYAM-MH-12-0045892',
    state: 'Maharashtra',
    city: 'Chakan Industrial Area, Pune',
    sector: 'Steel',
    providedByUser: {
      name: 'Rajesh S. Kulkarni',
      email: 'r.kulkarni@balajiforgings.co.in',
      role: 'Managing Director & Plant Head',
      phone: '+91 98220 44192',
    },
    discomName: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
    discomShort: 'MSEDCL',
    consumerId: '049120038491',
    meterNumber: 'MSEDCL-HT-CHAKAN-8841',
    billingPeriod: 'August 2026',
    billIssueDate: '04-Aug-2026',
    billDueDate: '21-Aug-2026',
    tariffCategory: 'HT-I (A) Industrial Continuous 22 kV',
    sanctionedLoad: '250 kVA',
    contractDemandKva: 250,
    connectedVoltage: '22 kV',
    unitsBilledKwh: 54200,
    billedKvah: 55306,
    powerFactor: 0.98,
    recordedMaxDemandKva: '218 kVA',
    meterStartReading: 124500,
    meterEndReading: 178700,
    meterMultiplyingFactor: 1,
    energyChargesInr: 449860,
    fixedDemandChargesInr: 98500,
    fuelAdjustmentChargesInr: 43360,
    electricityDutyInr: 54120,
    totalInvoicedAmountInr: 645840,
    paymentStatus: 'Paid',
    verificationStatus: 'Bureau Certified',
    ceaGridFactor: 0.732,
    calculatedScope2Tonnes: 39.67,
    documentFileName: 'MSEDCL_HT_Industrial_Pune_Aug2026.pdf',
    documentFileSize: '2.4 MB',
    documentType: 'PDF E-Bill',
    auditorNotes: 'Meter serial verified with MSEDCL Chakan substation telemetry. 0.98 PF confirmed.',
    verifiedByAdmin: 'Vasu (Lead ESG Auditor)',
    verifiedAt: '2026-08-10',
    associatedReportId: 'rep-balaji-001',
  },
  {
    id: 'bill-msedcl-002',
    billNumber: 'MSEDCL/PUN/2026/07/8119',
    companyId: 'msme-001',
    companyName: 'Shree Balaji Precision Forgings Pvt Ltd',
    udyamNumber: 'UDYAM-MH-12-0045892',
    state: 'Maharashtra',
    city: 'Chakan Industrial Area, Pune',
    sector: 'Steel',
    providedByUser: {
      name: 'Priya Sharma',
      email: 'priya.esg@balajiforgings.co.in',
      role: 'Senior Energy & Carbon Auditor',
      phone: '+91 98220 44195',
    },
    discomName: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)',
    discomShort: 'MSEDCL',
    consumerId: '049120038491',
    meterNumber: 'MSEDCL-HT-CHAKAN-8841',
    billingPeriod: 'July 2026',
    billIssueDate: '03-Jul-2026',
    billDueDate: '20-Jul-2026',
    tariffCategory: 'HT-I (A) Industrial Continuous 22 kV',
    sanctionedLoad: '250 kVA',
    contractDemandKva: 250,
    connectedVoltage: '22 kV',
    unitsBilledKwh: 51800,
    billedKvah: 52857,
    powerFactor: 0.98,
    recordedMaxDemandKva: '210 kVA',
    meterStartReading: 72700,
    meterEndReading: 124500,
    meterMultiplyingFactor: 1,
    energyChargesInr: 429940,
    fixedDemandChargesInr: 98500,
    fuelAdjustmentChargesInr: 41440,
    electricityDutyInr: 51800,
    totalInvoicedAmountInr: 621680,
    paymentStatus: 'Paid',
    verificationStatus: 'AI Validated',
    ceaGridFactor: 0.732,
    calculatedScope2Tonnes: 37.92,
    documentFileName: 'MSEDCL_HT_Chakan_Unit2_July2026.pdf',
    documentFileSize: '1.9 MB',
    documentType: 'PDF E-Bill',
    auditorNotes: 'Reconciled with unit 2 sub-meter logbook. Approved.',
    verifiedByAdmin: 'Harry (Industrial Verification Officer)',
    verifiedAt: '2026-07-15',
    associatedReportId: 'rep-balaji-002',
  },
  {
    id: 'bill-torrent-001',
    billNumber: 'TORRENT/VAT/2026/07/3491',
    companyId: 'msme-002',
    companyName: 'Gujarat Alloy Extrusions Ltd',
    udyamNumber: 'UDYAM-GJ-01-0089124',
    state: 'Gujarat',
    city: 'Makarpura GIDC, Vadodara',
    sector: 'Aluminium',
    providedByUser: {
      name: 'Hitesh N. Patel',
      email: 'hitesh@gujaratextrusions.com',
      role: 'Technical Director',
      phone: '+91 98791 22804',
    },
    discomName: 'Torrent Power Ltd. (Vatva Industrial Zone)',
    discomShort: 'Torrent Power',
    consumerId: 'TP-AHM-902148',
    meterNumber: 'TOR-VTV-992014',
    billingPeriod: 'July 2026',
    billIssueDate: '06-Jul-2026',
    billDueDate: '23-Jul-2026',
    tariffCategory: 'HT-1 11 kV Industrial Express Feeder',
    sanctionedLoad: '350 kVA',
    contractDemandKva: 350,
    connectedVoltage: '11 kV',
    unitsBilledKwh: 78450,
    billedKvah: 79242,
    powerFactor: 0.99,
    recordedMaxDemandKva: '298 kVA',
    meterStartReading: 341200,
    meterEndReading: 419650,
    meterMultiplyingFactor: 1,
    energyChargesInr: 588375,
    fixedDemandChargesInr: 135000,
    fuelAdjustmentChargesInr: 58837,
    electricityDutyInr: 78450,
    totalInvoicedAmountInr: 860662,
    paymentStatus: 'Paid',
    verificationStatus: 'Bureau Certified',
    ceaGridFactor: 0.718,
    calculatedScope2Tonnes: 56.33,
    documentFileName: 'TorrentPower_Vatva_HT1_Bill.pdf',
    documentFileSize: '3.1 MB',
    documentType: 'PDF E-Bill',
    auditorNotes: 'Excellent power factor 0.99 with GUVNL express feeder certificate attached.',
    verifiedByAdmin: 'ZAZU (Metallurgy Specialist)',
    verifiedAt: '2026-07-18',
    associatedReportId: 'rep-gujarat-001',
  },
  {
    id: 'bill-tata-odisha-001',
    billNumber: 'TPWODL/ROU/2026/08/1044',
    companyId: 'msme-003',
    companyName: 'Kalinga Green Sponge & Rebars',
    udyamNumber: 'UDYAM-OD-14-0019238',
    state: 'Odisha',
    city: 'Kalunga Industrial Estate, Rourkela',
    sector: 'Steel',
    providedByUser: {
      name: 'Amitabh Mohanty',
      email: 'esg@kalingarebars.in',
      role: 'Operations & ESG Lead',
      phone: '+91 94370 81205',
    },
    discomName: 'Tata Power Western Odisha Distribution Ltd (TPWODL)',
    discomShort: 'TPWODL',
    consumerId: 'OD-W-665201',
    meterNumber: 'TPW-ROU-441920',
    billingPeriod: 'August 2026',
    billIssueDate: '02-Aug-2026',
    billDueDate: '19-Aug-2026',
    tariffCategory: 'Large Industry HT (Steel Induction & Arc Furnace)',
    sanctionedLoad: '600 kVA',
    contractDemandKva: 600,
    connectedVoltage: '33 kV',
    unitsBilledKwh: 112000,
    billedKvah: 116666,
    powerFactor: 0.96,
    recordedMaxDemandKva: '540 kVA',
    meterStartReading: 890000,
    meterEndReading: 1002000,
    meterMultiplyingFactor: 1,
    energyChargesInr: 784000,
    fixedDemandChargesInr: 210000,
    fuelAdjustmentChargesInr: 89600,
    electricityDutyInr: 100800,
    totalInvoicedAmountInr: 1184400,
    paymentStatus: 'Paid',
    verificationStatus: 'Bureau Certified',
    ceaGridFactor: 0.814,
    calculatedScope2Tonnes: 91.17,
    documentFileName: 'TPWODL_Rourkela_HT_Steel.pdf',
    documentFileSize: '4.2 MB',
    documentType: 'PDF E-Bill',
    auditorNotes: 'High voltage 33kV continuous supply verified. Eastern grid baseline confirmed.',
    verifiedByAdmin: 'Atharva (Executive Admin)',
    verifiedAt: '2026-08-08',
    associatedReportId: 'rep-kalinga-001',
  },
  {
    id: 'bill-tangedco-001',
    billNumber: 'TANGEDCO/CBE/2026/08/7821',
    companyId: 'msme-004',
    companyName: 'Coromandel Green Fertilizers & Chemicals',
    udyamNumber: 'UDYAM-TN-03-0091823',
    state: 'Tamil Nadu',
    city: 'Ennore Port Industrial Corridor, Chennai',
    sector: 'Fertiliser',
    providedByUser: {
      name: 'Dr. R. Subramanian',
      email: 'subramanian.plant@coromandelgreen.com',
      role: 'Chief Chemical Engineer',
      phone: '+91 94440 98124',
    },
    discomName: 'Tamil Nadu Generation and Distribution Corp (TANGEDCO)',
    discomShort: 'TANGEDCO',
    consumerId: '03-089-112-984',
    meterNumber: 'TNEB-HT-448120',
    billingPeriod: 'August 2026',
    billIssueDate: '05-Aug-2026',
    billDueDate: '22-Aug-2026',
    tariffCategory: 'HT Tariff I-A (Chemical Synthesis Continuous)',
    sanctionedLoad: '200 kVA',
    contractDemandKva: 200,
    connectedVoltage: '11 kV',
    unitsBilledKwh: 42800,
    billedKvah: 44123,
    powerFactor: 0.97,
    recordedMaxDemandKva: '175 kVA',
    meterStartReading: 210000,
    meterEndReading: 252800,
    meterMultiplyingFactor: 1,
    energyChargesInr: 363800,
    fixedDemandChargesInr: 72000,
    fuelAdjustmentChargesInr: 34240,
    electricityDutyInr: 38520,
    totalInvoicedAmountInr: 508560,
    paymentStatus: 'Paid',
    verificationStatus: 'Bureau Certified',
    ceaGridFactor: 0.742,
    calculatedScope2Tonnes: 31.76,
    documentFileName: 'TANGEDCO_HT_Bill_Coimbatore.pdf',
    documentFileSize: '2.8 MB',
    documentType: 'PDF E-Bill',
    auditorNotes: 'TANGEDCO barcode scanner match. Power factor incentive of 0.5% applied.',
    verifiedByAdmin: 'Vasu (Lead ESG Auditor)',
    verifiedAt: '2026-08-11',
    associatedReportId: 'rep-coromandel-001',
  },
  {
    id: 'bill-tssouthern-001',
    billNumber: 'TSSPDCL/HYD/2026/01/5521',
    companyId: 'msme-005',
    companyName: 'Deccan Heavy Castings & Billets',
    udyamNumber: 'UDYAM-TS-09-0034182',
    state: 'Telangana',
    city: 'Cherlapally Industrial Estate, Hyderabad',
    sector: 'Steel',
    providedByUser: {
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@deccancastings.in',
      role: 'Plant Head & Operations VP',
      phone: '+91 98480 33418',
    },
    discomName: 'Southern Power Distribution Company of Telangana Ltd (TSSPDCL)',
    discomShort: 'TSSPDCL',
    consumerId: 'TS-SEC-992418',
    meterNumber: 'TSS-HYD-55102',
    billingPeriod: 'January 2026',
    billIssueDate: '07-Jan-2026',
    billDueDate: '24-Jan-2026',
    tariffCategory: 'HT-I Industrial General Category',
    sanctionedLoad: '280 kVA',
    contractDemandKva: 280,
    connectedVoltage: '11 kV',
    unitsBilledKwh: 58500,
    billedKvah: 61578,
    powerFactor: 0.95,
    recordedMaxDemandKva: '260 kVA',
    meterStartReading: 430100,
    meterEndReading: 488600,
    meterMultiplyingFactor: 1,
    energyChargesInr: 497250,
    fixedDemandChargesInr: 106400,
    fuelAdjustmentChargesInr: 46800,
    electricityDutyInr: 52650,
    totalInvoicedAmountInr: 703100,
    paymentStatus: 'Paid',
    verificationStatus: 'Pending Review',
    ceaGridFactor: 0.745,
    calculatedScope2Tonnes: 43.58,
    documentFileName: 'TSSPDCL_Cherlapally_HT_Jan2026.pdf',
    documentFileSize: '2.1 MB',
    documentType: 'Scanned Paper Bill',
    auditorNotes: 'Scanned document uploaded. Requires manual inspection of meter calibration stamp.',
    associatedReportId: 'rep-deccan-001',
  },
  {
    id: 'bill-pspcl-001',
    billNumber: 'PSPCL/LDH/2026/02/3309',
    companyId: 'msme-006',
    companyName: 'Bharat Special Steels & Tubes',
    udyamNumber: 'UDYAM-PB-10-0081290',
    state: 'Punjab',
    city: 'Focal Point Industrial Phase 5, Ludhiana',
    sector: 'Steel',
    providedByUser: {
      name: 'Gurpreet Singh',
      email: 'gurpreet@bharatsteels.co.in',
      role: 'Proprietor & Exporter',
      phone: '+91 98150 77129',
    },
    discomName: 'Punjab State Power Corporation Ltd (PSPCL)',
    discomShort: 'PSPCL',
    consumerId: 'PB-LDH-002391',
    meterNumber: 'PSP-FOCAL-9921',
    billingPeriod: 'February 2026',
    billIssueDate: '06-Feb-2026',
    billDueDate: '23-Feb-2026',
    tariffCategory: 'Large Supply Industrial (LS-1) 11 kV',
    sanctionedLoad: '180 kVA',
    contractDemandKva: 180,
    connectedVoltage: '11 kV',
    unitsBilledKwh: 34000,
    billedKvah: 34693,
    powerFactor: 0.98,
    recordedMaxDemandKva: '155 kVA',
    meterStartReading: 118000,
    meterEndReading: 152000,
    meterMultiplyingFactor: 1,
    energyChargesInr: 289000,
    fixedDemandChargesInr: 68400,
    fuelAdjustmentChargesInr: 27200,
    electricityDutyInr: 34000,
    totalInvoicedAmountInr: 418600,
    paymentStatus: 'Paid',
    verificationStatus: 'Bureau Certified',
    ceaGridFactor: 0.765,
    calculatedScope2Tonnes: 26.01,
    documentFileName: 'PSPCL_Ludhiana_HT_Feb2026.pdf',
    documentFileSize: '1.7 MB',
    documentType: 'PDF E-Bill',
    auditorNotes: 'Northern grid factor verified. Induction tube welding logs match consumption profile.',
    verifiedByAdmin: 'Harry (Industrial Verification Officer)',
    verifiedAt: '2026-02-12',
    associatedReportId: 'rep-punjab-001',
  },
];

/**
 * Get locally overridden status for reports
 */
function getReportStatusOverrides(): Record<string, Partial<UserReport>> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Get locally overridden status for bills
 */
function getBillStatusOverrides(): Record<string, Partial<UtilityBill>> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BILLS_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Retrieve ALL reports from every user of every company
 */
export function getAllUserReports(): UserReport[] {
  const overrides = getReportStatusOverrides();
  const reports: UserReport[] = [];

  // 1. Seed reports
  for (const r of SEED_USER_REPORTS) {
    const ov = overrides[r.id] || {};
    reports.push({ ...r, ...ov });
  }

  // 2. Incorporate any locally registered company reports
  const localCompanies = getLocallyRegisteredCompanies();
  for (const comp of localCompanies) {
    // Avoid duplicates if already seeded
    if (reports.some((r) => r.companyId === comp.id)) continue;

    const repId = `rep-dyn-${comp.id}`;
    const ov = overrides[repId] || {};
    const estEmissions = comp.sector === 'Steel' ? 720 : comp.sector === 'Aluminium' ? 610 : 830;

    reports.push({
      id: repId,
      reportNumber: `CB-REP-2025-${comp.id.slice(-4).toUpperCase()}`,
      companyId: comp.id,
      companyName: comp.companyName,
      udyamNumber: comp.udyamNumber,
      gstin: comp.gstin,
      enterpriseCategory: comp.enterpriseCategory,
      sector: comp.sector,
      state: comp.state,
      city: comp.city,
      submittedBy: comp.authorizedPerson,
      submittedByEmail: comp.email,
      userRole: comp.designation,
      userPhone: comp.phone,
      submittedDate: comp.createdAt || new Date().toISOString().split('T')[0],
      consignmentName: `${comp.companyName} Primary Export Batch`,
      productProcess: `Industrial ${comp.sector} Manufacturing & Fabrication`,
      productionVolume: 1000,
      productionUnit: 'tonnes',
      electricityConsumedKwh: 52000,
      fuelConsumed: 4800,
      fuelUnit: 'litres',
      fuelType: 'Diesel',
      scope1EmissionsKgPerTonne: Math.round(estEmissions * 0.45),
      scope2EmissionsKgPerTonne: Math.round(estEmissions * 0.55),
      totalEmissionsKgPerTonne: estEmissions,
      uncertaintyMin: Math.round(estEmissions * 0.95),
      uncertaintyMax: Math.round(estEmissions * 1.05),
      readiness: 'High',
      billVerified: true,
      associatedBillId: `bill-dyn-${comp.id}`,
      associatedBillDoc: `${comp.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_DISCOM_Bill.pdf`,
      associatedDiscom: `${comp.state} State Electricity Distribution Co.`,
      estimatedCbTaxEuros: Math.round(1000 * (estEmissions / 1000) * 85),
      auditStatus: 'AI Validated',
      auditorNotes: 'Onboarded via Udyam National Registry. Primary assessment ready.',
      assessment: {
        id: `assm-${comp.id}`,
        name: `${comp.companyName} Consignment Assessment`,
        sector: comp.sector,
        region: comp.state,
        productProcess: `Standard ${comp.sector} Line`,
        productionVolume: 1000,
        productionUnit: 'tonnes',
        electricityConsumed: 52000,
        electricityUnit: 'kWh',
        fuelConsumed: 4800,
        fuelUnit: 'litres',
        fuelType: 'Diesel',
        createdAt: comp.createdAt || '2025-02-18',
        estimatedEmissions: estEmissions,
        uncertaintyMin: Math.round(estEmissions * 0.95),
        uncertaintyMax: Math.round(estEmissions * 1.05),
        readiness: 'High',
        billVerified: true,
        drivers: [
          { name: 'Electricity Grid', percentage: 48, category: 'electricity' },
          { name: 'Fuel Combustion', percentage: 32, category: 'fuel' },
          { name: 'Process & Direct', percentage: 20, category: 'process' },
        ],
        dataQuality: [
          { label: 'Udyam validated', status: 'valid' },
          { label: 'Utility bill attached', status: 'valid' },
        ],
        recommendedSteps: [
          'Submit continuous meter logs for annual verification.',
        ],
      },
      ...ov,
    });
  }

  return reports.sort((a, b) => b.submittedDate.localeCompare(a.submittedDate));
}

/**
 * Retrieve ALL bills provided by every user of every company
 */
export function getAllUtilityBills(): UtilityBill[] {
  const overrides = getBillStatusOverrides();
  const bills: UtilityBill[] = [];

  // 1. Seed bills
  for (const b of SEED_UTILITY_BILLS) {
    const ov = overrides[b.id] || {};
    bills.push({ ...b, ...ov });
  }

  // 2. Incorporate any bills for locally registered companies
  const localCompanies = getLocallyRegisteredCompanies();
  for (const comp of localCompanies) {
    if (bills.some((b) => b.companyId === comp.id)) continue;

    const billId = `bill-dyn-${comp.id}`;
    const ov = overrides[billId] || {};
    const kwh = 52000;
    const gridFactor = comp.state === 'Gujarat' ? 0.718 : comp.state === 'Odisha' ? 0.814 : 0.732;

    bills.push({
      id: billId,
      billNumber: `UTIL/${comp.state.slice(0, 3).toUpperCase()}/2026/08/${comp.id.slice(-4)}`,
      companyId: comp.id,
      companyName: comp.companyName,
      udyamNumber: comp.udyamNumber,
      state: comp.state,
      city: comp.city,
      sector: comp.sector,
      providedByUser: {
        name: comp.authorizedPerson,
        email: comp.email,
        role: comp.designation,
        phone: comp.phone,
      },
      discomName: `${comp.state} State Electricity Distribution Company Ltd`,
      discomShort: `${comp.state.slice(0, 2).toUpperCase()}-DISCOM`,
      consumerId: `CA-${comp.udyamNumber.slice(-8)}`,
      meterNumber: `MTR-${comp.state.slice(0, 2).toUpperCase()}-90124`,
      billingPeriod: 'August 2026',
      billIssueDate: '05-Aug-2026',
      billDueDate: '22-Aug-2026',
      tariffCategory: 'HT Industrial Express Continuous',
      sanctionedLoad: '250 kVA',
      contractDemandKva: 250,
      connectedVoltage: '11/22 kV',
      unitsBilledKwh: kwh,
      billedKvah: Math.round(kwh / 0.98),
      powerFactor: 0.98,
      recordedMaxDemandKva: '210 kVA',
      meterStartReading: 240000,
      meterEndReading: 292000,
      meterMultiplyingFactor: 1,
      energyChargesInr: Math.round(kwh * 8.2),
      fixedDemandChargesInr: 95000,
      fuelAdjustmentChargesInr: Math.round(kwh * 0.8),
      electricityDutyInr: Math.round(kwh * 1.0),
      totalInvoicedAmountInr: Math.round(kwh * 10.0 + 95000),
      paymentStatus: 'Paid',
      verificationStatus: 'AI Validated',
      ceaGridFactor: gridFactor,
      calculatedScope2Tonnes: Number(((kwh * gridFactor) / 1000).toFixed(2)),
      documentFileName: `${comp.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Aug2026_Bill.pdf`,
      documentFileSize: '2.3 MB',
      documentType: 'PDF E-Bill',
      auditorNotes: 'Uploaded via enterprise registration. Meter telemetry reconciled.',
      associatedReportId: `rep-dyn-${comp.id}`,
      ...ov,
    });
  }

  return bills.sort((a, b) => b.billingPeriod.localeCompare(a.billingPeriod));
}

/**
 * Admin Action: Update verification status and notes of a report
 */
export function updateReportAuditStatus(
  reportId: string,
  newStatus: UserReport['auditStatus'],
  adminName: string,
  auditorNotes: string
): void {
  try {
    const overrides = getReportStatusOverrides();
    overrides[reportId] = {
      ...(overrides[reportId] || {}),
      auditStatus: newStatus,
      verifiedByAdmin: adminName,
      verifiedAt: new Date().toISOString().split('T')[0],
      auditorNotes,
    };
    localStorage.setItem(LOCAL_STORAGE_REPORTS_STATUS_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to update report audit status:', e);
  }
}

/**
 * Admin Action: Update verification status and notes of a utility bill
 */
export function updateBillAuditStatus(
  billId: string,
  newStatus: UtilityBill['verificationStatus'],
  adminName: string,
  auditorNotes: string
): void {
  try {
    const overrides = getBillStatusOverrides();
    overrides[billId] = {
      ...(overrides[billId] || {}),
      verificationStatus: newStatus,
      verifiedByAdmin: adminName,
      verifiedAt: new Date().toISOString().split('T')[0],
      auditorNotes,
    };
    localStorage.setItem(LOCAL_STORAGE_BILLS_STATUS_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error('Failed to update bill audit status:', e);
  }
}

/**
 * Download master reports in CSV
 */
export function downloadAllReportsCSV(reports: UserReport[]): void {
  const headers = [
    'Report Number',
    'Company Name',
    'Udyam Number',
    'Sector',
    'State',
    'Submitted By (User)',
    'User Role',
    'User Email',
    'Submission Date',
    'Consignment / Product',
    'Production Volume (Tonnes)',
    'Electricity (kWh)',
    'Fuel (Units)',
    'Fuel Type',
    'Scope 1 (kg CO2e/t)',
    'Scope 2 (kg CO2e/t)',
    'Total Emissions (kg CO2e/t)',
    'Readiness Tier',
    'Bill Verified',
    'Associated DISCOM',
    'Estimated EU CBAM Tax (€)',
    'Audit Status',
    'Verified By Admin',
  ];

  const escapeCSV = (str: string | number | boolean | undefined) => {
    if (str === undefined || str === null) return '""';
    const val = String(str).replace(/"/g, '""');
    return `"${val}"`;
  };

  const rows = reports.map((r) => [
    escapeCSV(r.reportNumber),
    escapeCSV(r.companyName),
    escapeCSV(r.udyamNumber),
    escapeCSV(r.sector),
    escapeCSV(r.state),
    escapeCSV(r.submittedBy),
    escapeCSV(r.userRole),
    escapeCSV(r.submittedByEmail),
    escapeCSV(r.submittedDate),
    escapeCSV(r.consignmentName),
    escapeCSV(r.productionVolume),
    escapeCSV(r.electricityConsumedKwh),
    escapeCSV(r.fuelConsumed),
    escapeCSV(r.fuelType),
    escapeCSV(r.scope1EmissionsKgPerTonne),
    escapeCSV(r.scope2EmissionsKgPerTonne),
    escapeCSV(r.totalEmissionsKgPerTonne),
    escapeCSV(r.readiness),
    escapeCSV(r.billVerified ? 'YES' : 'NO'),
    escapeCSV(r.associatedDiscom),
    escapeCSV(r.estimatedCbTaxEuros),
    escapeCSV(r.auditStatus),
    escapeCSV(r.verifiedByAdmin || 'None'),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CarbonBridge_Master_User_Reports_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download master utility bills in CSV
 */
export function downloadAllBillsCSV(bills: UtilityBill[]): void {
  const headers = [
    'Bill Number',
    'Company Name',
    'Udyam Number',
    'State',
    'Provided By (User)',
    'User Role',
    'User Email',
    'DISCOM Name',
    'Consumer CA Number',
    'Meter Number',
    'Billing Period',
    'Tariff Category',
    'Sanctioned Load',
    'Units Billed (kWh)',
    'Power Factor',
    'Max Demand',
    'Total Invoiced Amount (INR)',
    'CEA Grid Factor (kg CO2/kWh)',
    'Scope 2 GHG (Tonnes)',
    'Document File Name',
    'Verification Status',
    'Auditor Remarks',
    'Verified By Admin',
  ];

  const escapeCSV = (str: string | number | boolean | undefined) => {
    if (str === undefined || str === null) return '""';
    const val = String(str).replace(/"/g, '""');
    return `"${val}"`;
  };

  const rows = bills.map((b) => [
    escapeCSV(b.billNumber),
    escapeCSV(b.companyName),
    escapeCSV(b.udyamNumber),
    escapeCSV(b.state),
    escapeCSV(b.providedByUser.name),
    escapeCSV(b.providedByUser.role),
    escapeCSV(b.providedByUser.email),
    escapeCSV(b.discomName),
    escapeCSV(b.consumerId),
    escapeCSV(b.meterNumber),
    escapeCSV(b.billingPeriod),
    escapeCSV(b.tariffCategory),
    escapeCSV(b.sanctionedLoad),
    escapeCSV(b.unitsBilledKwh),
    escapeCSV(b.powerFactor),
    escapeCSV(b.recordedMaxDemandKva),
    escapeCSV(b.totalInvoicedAmountInr),
    escapeCSV(b.ceaGridFactor),
    escapeCSV(b.calculatedScope2Tonnes),
    escapeCSV(b.documentFileName),
    escapeCSV(b.verificationStatus),
    escapeCSV(b.auditorNotes),
    escapeCSV(b.verifiedByAdmin || 'None'),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CarbonBridge_Master_Utility_Bills_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download single user report certificate
 */
export function downloadUserReportCertificate(report: UserReport): void {
  const content = `================================================================================
          CENTRAL REGULATORY AUDIT & VERIFICATION DOSSIER
    EUROPEAN COMMISSION CBAM DECLARATION & FORM 4 COMPLIANCE DOSSIER
================================================================================
REPORT NUMBER:           ${report.reportNumber}
CERTIFICATE ID:          CERT-CBAM-${report.id.toUpperCase()}-${new Date().getFullYear()}
ISSUE DATE:              ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
AUDIT CLASSIFICATION:    OFFICIAL REGULATORY DISCLOSURE / CONFIDENTIAL

1. SUBMITTING USER & CORPORATE IDENTITY
--------------------------------------------------------------------------------
Enterprise Name:         ${report.companyName}
Udyam Reg. Number:       ${report.udyamNumber}
GSTIN:                   ${report.gstin}
Enterprise Scale:        ${report.enterpriseCategory} MSME
Sector / Industry:       ${report.sector}
Manufacturing Facility:  ${report.city}, ${report.state}, India
Submitted By (User):     ${report.submittedBy}
Official Designation:    ${report.userRole}
Corporate Email:         ${report.submittedByEmail}
Official Phone:          ${report.userPhone}
Submission Date:         ${report.submittedDate}

2. PRODUCT CONSIGNMENT & MANUFACTURING SPECIFICATIONS
--------------------------------------------------------------------------------
Consignment Title:       ${report.consignmentName}
Industrial Process:      ${report.productProcess}
Batch Production Volume: ${report.productionVolume.toLocaleString()} ${report.productionUnit}
Electricity Consumed:    ${report.electricityConsumedKwh.toLocaleString()} kWh
Primary Fuel Utilized:   ${report.fuelType} (${report.fuelConsumed.toLocaleString()} ${report.fuelUnit})
DISCOM Power Utility:    ${report.associatedDiscom}
Attached DISCOM Bill:    ${report.associatedBillDoc}
Utility Verification:    ${report.billVerified ? 'VERIFIED PRIMARY METERING' : 'PENDING AUDIT'}

3. GREENHOUSE GAS (GHG) EMISSIONS PROFILE (EU CBAM METHODOLOGY)
--------------------------------------------------------------------------------
Direct Emissions (Scope 1):    ${report.scope1EmissionsKgPerTonne} kg CO2e / tonne of product
Indirect Emissions (Scope 2):  ${report.scope2EmissionsKgPerTonne} kg CO2e / tonne of product
Total Specific Emissions:      ${report.totalEmissionsKgPerTonne} kg CO2e / tonne of product
Uncertainty Band (95% CI):     ${report.uncertaintyMin} – ${report.uncertaintyMax} kg CO2e / tonne
CBAM Data Readiness Tier:      ${report.readiness.toUpperCase()} QUALITY TIER
EU ETS Carbon Tax Exposure:    €${report.estimatedCbTaxEuros.toLocaleString()} (Benchmark €85/t CO2e)

4. BUREAU AUDIT STATUS & VERIFICATION SIGN-OFF
--------------------------------------------------------------------------------
Regulatory Status:       ${report.auditStatus.toUpperCase()}
Auditor Sign-off:        ${report.verifiedByAdmin || 'BEE & Central CBAM Regulatory Cell'}
Verification Date:       ${report.verifiedAt || 'Certified Active'}
Auditor Remarks:         ${report.auditorNotes}

Authorized Regulatory Registry Stamp:
Bureau of Energy Efficiency (BEE) • Central Carbon Accounting Wing
Government of India & EU CBAM Transboundary Importer Registry
================================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CBAM_Report_${report.reportNumber}_${report.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download single utility bill summary
 */
export function downloadUtilityBillSummary(bill: UtilityBill): void {
  const content = `================================================================================
                 CARBONBRIDGE OFFICIAL ELECTRICITY BILL AUDIT RECORD
             PRIMARY UTILITY METERING VERIFICATION FOR EU CBAM SCOPE 2
================================================================================
BILL INVOICE NUMBER:     ${bill.billNumber}
RECORD ID:               ${bill.id.toUpperCase()}
DATE OF AUDIT:           ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}

1. CONSUMER & FACILITY DETAILS
--------------------------------------------------------------------------------
Enterprise Name:         ${bill.companyName}
Udyam Reg. Number:       ${bill.udyamNumber}
Manufacturing Location:  ${bill.city}, ${bill.state}
Industrial Sector:       ${bill.sector}
Provided By (User):      ${bill.providedByUser.name} (${bill.providedByUser.role})
User Email:              ${bill.providedByUser.email}
User Contact:            ${bill.providedByUser.phone}

2. DISCOM & TARIFF CLASSIFICATION
--------------------------------------------------------------------------------
Distribution Company:    ${bill.discomName} (${bill.discomShort})
Consumer CA Account No:  ${bill.consumerId}
Meter Serial Number:     ${bill.meterNumber}
Billing Cycle:           ${bill.billingPeriod}
Bill Issue Date:         ${bill.billIssueDate}
Bill Due Date:           ${bill.billDueDate}
Sanctioned Load:         ${bill.sanctionedLoad} (Contract Demand: ${bill.contractDemandKva} kVA)
Supply Voltage:          ${bill.connectedVoltage}
Tariff Schedule:         ${bill.tariffCategory}

3. METERING & ENERGY CONSUMPTION AUDIT
--------------------------------------------------------------------------------
Start Meter Reading:     ${bill.meterStartReading.toLocaleString()}
End Meter Reading:       ${bill.meterEndReading.toLocaleString()}
Multiplying Factor (MF): ${bill.meterMultiplyingFactor}
Billed Active Energy:    ${bill.unitsBilledKwh.toLocaleString()} kWh
Apparent Energy:         ${bill.billedKvah.toLocaleString()} kVAh
Average Power Factor:    ${bill.powerFactor}
Recorded Maximum Demand: ${bill.recordedMaxDemandKva}

4. COMMERCIAL INVOICE AUDIT (INR)
--------------------------------------------------------------------------------
Energy Charges:          ₹${bill.energyChargesInr.toLocaleString()}
Fixed Demand Charges:    ₹${bill.fixedDemandChargesInr.toLocaleString()}
Fuel Adjustment Charges: ₹${bill.fuelAdjustmentChargesInr.toLocaleString()}
State Electricity Duty:  ₹${bill.electricityDutyInr.toLocaleString()}
Total Invoiced Amount:   ₹${bill.totalInvoicedAmountInr.toLocaleString()}
Payment Status:          ${bill.paymentStatus}

5. CARBON ACCOUNTING & EU CBAM EMISSIONS
--------------------------------------------------------------------------------
CEA Regional Grid Factor: ${bill.ceaGridFactor} kg CO2/kWh
Calculated Scope 2 GHG:  ${bill.calculatedScope2Tonnes} Tonnes CO2e
Uploaded File Name:      ${bill.documentFileName} (${bill.documentFileSize}, ${bill.documentType})
Audit & Compliance Status:${bill.verificationStatus.toUpperCase()}
Certified by Admin:      ${bill.verifiedByAdmin || 'Pending Certification'}
Auditor Remarks:         ${bill.auditorNotes}
================================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bill_Audit_${bill.billNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
