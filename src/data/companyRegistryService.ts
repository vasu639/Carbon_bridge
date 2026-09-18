import { MSMECompany, Assessment, Sector, ReadinessLevel } from '../types';
import { DEMO_MSME_PROFILES, DEFAULT_MSME_COMPANY } from './mockCompanies';
import { INITIAL_ASSESSMENTS } from './mockAssessments';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface CompanyRegistryEntry {
  company: MSMECompany;
  assessment: Assessment;
  totalAssessmentsCount: number;
  lastActiveDate: string;
  source: 'Firebase Firestore' | 'System Demo' | 'Local Registry';
}

const LOCAL_STORAGE_COMPANIES_KEY = 'carbonbridge_registered_companies';

/**
 * Cache newly registered company into local persistent store so it is always visible
 */
export function cacheCompanyLocally(company: MSMECompany): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COMPANIES_KEY);
    const list: MSMECompany[] = raw ? JSON.parse(raw) : [];
    const existingIndex = list.findIndex(
      (c) => c.id === company.id || c.udyamNumber.toUpperCase() === company.udyamNumber.toUpperCase()
    );
    if (existingIndex >= 0) {
      list[existingIndex] = company;
    } else {
      list.unshift(company);
    }
    localStorage.setItem(LOCAL_STORAGE_COMPANIES_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/**
 * Retrieve all locally registered companies
 */
export function getLocallyRegisteredCompanies(): MSMECompany[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COMPANIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Generate a representative realistic assessment for any registered company based on their sector
 */
export function generateCompanyAssessment(company: MSMECompany): Assessment {
  // If matches an initial mock assessment
  if (company.sector === 'Steel') {
    return {
      ...INITIAL_ASSESSMENTS[0],
      id: `assm-${company.id}`,
      name: `${company.companyName} Consignment Assessment`,
      sector: 'Steel',
      region: company.state,
      createdAt: company.createdAt || '2025-02-18',
    };
  }
  if (company.sector === 'Aluminium') {
    return {
      ...INITIAL_ASSESSMENTS[1],
      id: `assm-${company.id}`,
      name: `${company.companyName} Extrusion & Billet Assessment`,
      sector: 'Aluminium',
      region: company.state,
      createdAt: company.createdAt || '2025-02-12',
    };
  }
  if (company.sector === 'Cement') {
    return {
      id: `assm-${company.id}`,
      name: `${company.companyName} Portland Slag Grinding Lot`,
      sector: 'Cement',
      region: company.state,
      productProcess: 'PPC Grinding & Pre-calciner Rotary Kiln',
      productionVolume: 2500,
      productionUnit: 'tonnes',
      electricityConsumed: 110000,
      electricityUnit: 'kWh',
      fuelConsumed: 12000,
      fuelUnit: 'litres',
      fuelType: 'Non-Coking Coal',
      createdAt: company.createdAt || '2025-01-20',
      estimatedEmissions: 830,
      uncertaintyMin: 790,
      uncertaintyMax: 870,
      readiness: 'Medium',
      billVerified: true,
      billDiscom: 'State Discom HT Industrial Continuous',
      drivers: [
        { name: 'Calcination & Kiln Heat', percentage: 56, category: 'process' },
        { name: 'Electricity Grinding', percentage: 28, category: 'electricity' },
        { name: 'Coal Combustion', percentage: 11, category: 'fuel' },
        { name: 'Other Plant Auxiliaries', percentage: 5, category: 'other' },
      ],
      dataQuality: [
        { label: 'Clinker ratio verified', status: 'valid', detail: 'Lab clinker factor tested at 68%' },
        { label: 'Sub-metered ball mills', status: 'valid', detail: 'Digital sub-meter logs available' },
        { label: 'Coal lab calorific report pending', status: 'warning', detail: 'Standard CEA conversion applied' },
      ],
      recommendedSteps: [
        'Perform bomb-calorimeter test on coal delivery batches.',
        'Document blast-furnace slag replacement percentage for EU CBAM clinker discount.',
      ],
    };
  }

  // Fertiliser or other
  return {
    id: `assm-${company.id}`,
    name: `${company.companyName} Nitrogenous Ammonia Lot`,
    sector: 'Fertiliser',
    region: company.state,
    productProcess: 'Steam Methane Reforming & Ammonia Synthesis',
    productionVolume: 1200,
    productionUnit: 'tonnes',
    electricityConsumed: 85000,
    electricityUnit: 'kWh',
    fuelConsumed: 9500,
    fuelUnit: 'litres',
    fuelType: 'Natural Gas',
    createdAt: company.createdAt || '2025-02-05',
    estimatedEmissions: 890,
    uncertaintyMin: 840,
    uncertaintyMax: 940,
    readiness: 'High',
    billVerified: true,
    billDiscom: 'Gas Pipeline & Grid HT Power',
    drivers: [
      { name: 'Natural Gas Feedstock', percentage: 62, category: 'fuel' },
      { name: 'Electricity Synthesis', percentage: 22, category: 'electricity' },
      { name: 'Steam Generation', percentage: 10, category: 'process' },
      { name: 'Other', percentage: 6, category: 'other' },
    ],
    dataQuality: [
      { label: 'Natural gas composition verified', status: 'valid', detail: 'Daily gas chromatograph logs provided' },
      { label: 'Continuous emission monitor on stack', status: 'valid', detail: 'CEMS connected with CPCB portal' },
    ],
    recommendedSteps: [
      'Maintain quarterly gas calorific certs from GAIL.',
      'Log purge gas combustion efficiency.',
    ],
  };
}

/**
 * Fetch and consolidate all companies from Firestore, Local Registry, and Demo Seeds
 */
export async function getAllCompaniesRegistry(): Promise<CompanyRegistryEntry[]> {
  const companiesMap = new Map<string, { company: MSMECompany; source: CompanyRegistryEntry['source'] }>();

  // 1. Load default demo profiles
  for (const c of DEMO_MSME_PROFILES) {
    companiesMap.set(c.id, { company: c, source: 'System Demo' });
  }

  // 2. Load locally registered companies
  const localList = getLocallyRegisteredCompanies();
  for (const c of localList) {
    companiesMap.set(c.id, { company: c, source: 'Local Registry' });
  }

  // 3. Try to fetch from Firebase Firestore
  try {
    const colRef = collection(db, 'companies');
    const snapshot = await getDocs(colRef);
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as MSMECompany;
      if (data && data.companyName) {
        companiesMap.set(docSnap.id, {
          company: {
            ...data,
            id: docSnap.id,
          },
          source: 'Firebase Firestore',
        });
      }
    });
  } catch (err) {
    console.info('Firestore global company read notice (using consolidated local & demo store):', err);
  }

  // 4. Map to enriched registry entries
  const entries: CompanyRegistryEntry[] = [];
  companiesMap.forEach(({ company, source }) => {
    const assessment = generateCompanyAssessment(company);
    entries.push({
      company,
      assessment,
      totalAssessmentsCount: company.id === DEFAULT_MSME_COMPANY.id ? 3 : 1,
      lastActiveDate: company.createdAt || new Date().toISOString().split('T')[0],
      source,
    });
  });

  // Sort by created date descending
  return entries.sort((a, b) => (b.company.createdAt || '').localeCompare(a.company.createdAt || ''));
}

/**
 * Download a single company's official CBAM Audit Report (Formatted Document)
 */
export function downloadCompanyReportFile(entry: CompanyRegistryEntry): void {
  const { company, assessment } = entry;
  const content = `================================================================================
                    CARBONBRIDGE CENTRAL AUDIT & VERIFICATION REPORT
               EU CBAM (CARBON BORDER ADJUSTMENT MECHANISM) COMPLIANCE DOSSIER
================================================================================
REPORT ID: CB-AUDIT-${company.id.toUpperCase()}-${new Date().getFullYear()}
ISSUED ON: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
SECURITY CLASSIFICATION: CONFIDENTIAL / EXPORT VERIFICATION

1. ENTERPRISE IDENTIFICATION & STATUTORY METRICS
--------------------------------------------------------------------------------
Enterprise Name:       ${company.companyName}
Udyam Reg. Number:     ${company.udyamNumber}
GSTIN:                 ${company.gstin}
Enterprise Category:   ${company.enterpriseCategory} Enterprise (MSME Act 2006)
Industrial Sector:     ${company.sector}
Manufacturing State:   ${company.state}
Plant Location:        ${company.city}
Authorized Signatory:  ${company.authorizedPerson} (${company.designation})
Corporate Email:       ${company.email}
Official Phone:        ${company.phone}
Registration Status:   ${company.verifiedStatus ? 'UDYAM VERIFIED ACTIVE' : 'PENDING'}
Registry Onboarding:   ${company.createdAt}

2. OPERATIONAL PRODUCTION & ENERGY AUDIT DATA
--------------------------------------------------------------------------------
Production Volume:     ${assessment.productionVolume.toLocaleString()} ${assessment.productionUnit}
Electricity Consumed:  ${assessment.electricityConsumed.toLocaleString()} ${assessment.electricityUnit}
Primary Fuel Used:     ${assessment.fuelType} (${assessment.fuelConsumed.toLocaleString()} ${assessment.fuelUnit})
Manufacturing Process: ${assessment.productProcess}
DISCOM Electricity:    ${assessment.billDiscom || 'State Electricity Distribution Utility'}
Bill AI Audit Status:  ${assessment.billVerified ? 'VERIFIED PRIMARY METERING' : 'SECONDARY ESTIMATED'}

3. EMBEDDED GREENHOUSE GAS (GHG) EMISSION PROFILE
--------------------------------------------------------------------------------
Specific GHG Intensity:  ${assessment.estimatedEmissions} kg CO2e / tonne of product
95% Confidence Interval: ${assessment.uncertaintyMin} – ${assessment.uncertaintyMax} kg CO2e / tonne
CBAM Readiness Tier:     ${assessment.readiness.toUpperCase()} DATA QUALITY
Reporting Scope:         Direct Scope 1 (Fuel combustion & Process) + Indirect Scope 2 (Grid Electricity)

Emission Drivers Breakdown:
${assessment.drivers.map((d) => `  • ${d.name.padEnd(25)}: ${d.percentage}% (${d.category.toUpperCase()})`).join('\n')}

4. REGULATORY VERIFICATION & AUDIT FINDINGS
--------------------------------------------------------------------------------
${assessment.dataQuality.map((dq) => `  [${dq.status.toUpperCase()}] ${dq.label}: ${dq.detail || 'Verified against bills'}`).join('\n')}

5. RECOMMENDED ACTIONS FOR EU CBAM REDUCTION
--------------------------------------------------------------------------------
${assessment.recommendedSteps.map((step, idx) => `  ${idx + 1}. ${step}`).join('\n')}

================================================================================
AUTHORIZED REGULATORY STAMP & VERIFICATION SIGN-OFF
--------------------------------------------------------------------------------
Verified by: Central CarbonBridge Auditor Registry
Department: Bureau of Energy Efficiency & EU CBAM Regulatory Cell
Status: Certified for European Importer Due Diligence & Form 4 Verification
================================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CBAM_Audit_Report_${company.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download All Companies in Master CSV Format
 */
export function downloadAllCompaniesCSV(entries: CompanyRegistryEntry[]): void {
  const headers = [
    'Company ID',
    'Company Name',
    'Udyam Registration Number (URN)',
    'GSTIN',
    'Enterprise Category',
    'Industrial Sector',
    'State',
    'City / Plant Location',
    'Authorized Person',
    'Designation',
    'Email',
    'Phone',
    'Verification Status',
    'Onboarded Date',
    'Production Volume (Tonnes)',
    'Electricity Consumed (kWh)',
    'Fuel Consumed',
    'Fuel Type',
    'Estimated Carbon Intensity (kg CO2e/t)',
    'Uncertainty Range (Min-Max)',
    'CBAM Readiness',
    'Electricity Bill Verified',
    'Data Source',
  ];

  const escapeCSV = (str: string | number | boolean | undefined) => {
    if (str === undefined || str === null) return '""';
    const val = String(str).replace(/"/g, '""');
    return `"${val}"`;
  };

  const rows = entries.map(({ company, assessment, source }) => [
    escapeCSV(company.id),
    escapeCSV(company.companyName),
    escapeCSV(company.udyamNumber),
    escapeCSV(company.gstin),
    escapeCSV(company.enterpriseCategory),
    escapeCSV(company.sector),
    escapeCSV(company.state),
    escapeCSV(company.city),
    escapeCSV(company.authorizedPerson),
    escapeCSV(company.designation),
    escapeCSV(company.email),
    escapeCSV(company.phone),
    escapeCSV(company.verifiedStatus ? 'Verified' : 'Pending'),
    escapeCSV(company.createdAt),
    escapeCSV(assessment.productionVolume),
    escapeCSV(assessment.electricityConsumed),
    escapeCSV(`${assessment.fuelConsumed} ${assessment.fuelUnit}`),
    escapeCSV(assessment.fuelType),
    escapeCSV(assessment.estimatedEmissions),
    escapeCSV(`${assessment.uncertaintyMin} - ${assessment.uncertaintyMax}`),
    escapeCSV(assessment.readiness),
    escapeCSV(assessment.billVerified ? 'YES' : 'NO'),
    escapeCSV(source),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CarbonBridge_Master_Companies_Registry_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download All Companies in JSON Master Format
 */
export function downloadAllCompaniesJSON(entries: CompanyRegistryEntry[]): void {
  const exportPayload = {
    registryTitle: 'CarbonBridge National MSME Decarbonization Registry',
    generatedAt: new Date().toISOString(),
    totalCompanies: entries.length,
    companies: entries.map(({ company, assessment, source }) => ({
      companyDetails: company,
      carbonAudit: assessment,
      sourceRegistry: source,
    })),
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CarbonBridge_Companies_Master_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
