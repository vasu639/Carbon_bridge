import { MSMECompany } from '../types';

export const DEFAULT_MSME_COMPANY: MSMECompany = {
  id: 'msme-001',
  companyName: 'Shree Balaji Precision Forgings Pvt Ltd',
  udyamNumber: 'UDYAM-MH-12-0045892',
  gstin: '27AABCU9603R1ZM',
  enterpriseCategory: 'Medium',
  sector: 'Steel',
  state: 'Maharashtra',
  city: 'Chakan Industrial Area, Pune',
  authorizedPerson: 'Rajesh S. Kulkarni',
  designation: 'Managing Director & Plant Head',
  email: 'r.kulkarni@balajiforgings.co.in',
  phone: '+91 98220 44192',
  verifiedStatus: true,
  createdAt: '2024-11-10',
};

export const DEMO_MSME_PROFILES: MSMECompany[] = [
  DEFAULT_MSME_COMPANY,
  {
    id: 'msme-002',
    companyName: 'Gujarat Alloy Extrusions Ltd',
    udyamNumber: 'UDYAM-GJ-01-0089124',
    gstin: '24AAACG8812K1ZQ',
    enterpriseCategory: 'Small',
    sector: 'Aluminium',
    state: 'Gujarat',
    city: 'Makarpura GIDC, Vadodara',
    authorizedPerson: 'Hitesh N. Patel',
    designation: 'Technical Director',
    email: 'hitesh@gujaratextrusions.com',
    phone: '+91 98791 22804',
    verifiedStatus: true,
    createdAt: '2024-12-02',
  },
  {
    id: 'msme-003',
    companyName: 'Kalinga Green Sponge & Rebars',
    udyamNumber: 'UDYAM-OD-14-0019238',
    gstin: '21AABCK4490M1ZF',
    enterpriseCategory: 'Medium',
    sector: 'Steel',
    state: 'Odisha',
    city: 'Kalunga Industrial Estate, Rourkela',
    authorizedPerson: 'Amitabh Mohanty',
    designation: 'Operations & ESG Lead',
    email: 'esg@kalingarebars.in',
    phone: '+91 94370 81205',
    verifiedStatus: true,
    createdAt: '2025-01-15',
  },
];

export interface SampleDiscomBill {
  id: string;
  name: string;
  discom: string;
  state: string;
  tariff: string;
  kwh: number;
  pf: number;
  period: string;
  consumerId: string;
  sanctionedLoad: string;
  fileSnippet: string;
}

export const SAMPLE_DISCOM_BILLS: SampleDiscomBill[] = [
  {
    id: 'sample-msedcl',
    name: 'MSEDCL HT-Industrial Bill (Pune, MH)',
    discom: 'Maharashtra State Electricity Distribution Co. Ltd.',
    state: 'Maharashtra',
    tariff: 'HT-I (A) Industrial Continuous',
    kwh: 54200,
    pf: 0.98,
    period: 'August 2026',
    consumerId: '049120038491',
    sanctionedLoad: '250 kVA',
    fileSnippet: 'MSEDCL_HT_Industrial_Pune_Aug2026.pdf',
  },
  {
    id: 'gujarat-torrent',
    name: 'Torrent Power Industrial HT Bill (Ahmedabad, GJ)',
    discom: 'Torrent Power Ltd. (Vatva Zone)',
    state: 'Gujarat',
    tariff: 'HT-1 11 kV Industrial',
    kwh: 78450,
    pf: 0.99,
    period: 'July 2026',
    consumerId: 'TP-AHM-902148',
    sanctionedLoad: '350 kVA',
    fileSnippet: 'TorrentPower_Vatva_HT1_Bill.pdf',
  },
  {
    id: 'tamilnadu-tangedco',
    name: 'TANGEDCO High Tension Bill (Coimbatore, TN)',
    discom: 'Tamil Nadu Generation and Distribution Corp',
    state: 'Tamil Nadu',
    tariff: 'HT Tariff I-A (Industrial)',
    kwh: 42800,
    pf: 0.97,
    period: 'August 2026',
    consumerId: '03-089-112-984',
    sanctionedLoad: '200 kVA',
    fileSnippet: 'TANGEDCO_HT_Bill_Coimbatore.pdf',
  },
  {
    id: 'odisha-tata',
    name: 'TPWODL Large Industry HT Bill (Rourkela, OD)',
    discom: 'Tata Power Western Odisha Distribution Ltd',
    state: 'Odisha',
    tariff: 'Large Industry HT (Steel Induction)',
    kwh: 112000,
    pf: 0.96,
    period: 'August 2026',
    consumerId: 'OD-W-665201',
    sanctionedLoad: '600 kVA',
    fileSnippet: 'TPWODL_Rourkela_HT_Steel.pdf',
  },
];

export const REQUIRED_PROOF_GUIDELINES = [
  {
    title: '1. Official State DISCOM Monthly Bill',
    badge: 'Primary Mandate',
    description:
      'A complete, legible bill from your licensed distribution utility (e.g. MSEDCL, Torrent Power, TANGEDCO, DGVCL, BESCOM, Tata Power, etc.) for the specific manufacturing facility.',
    items: [
      'Document must cover the full monthly or bi-monthly manufacturing billing cycle.',
      'Must clearly display the state utility letterhead/watermark and consumer registration barcode.',
    ],
  },
  {
    title: '2. Required Data Points on the Bill',
    badge: 'Essential Verification',
    description:
      'EU CBAM auditors and greenhouse gas verifiers require primary metering data to prevent estimation penalties:',
    items: [
      'Consumer Account / CA Number & Serial Meter Number matching your plant address.',
      'Sanctioned Contract Demand / Connected Load (in kVA or kW).',
      'Industrial Tariff Category (e.g. HT-I Continuous, LT-Industrial). Domestic/Commercial tariffs will be flagged.',
      'Net Active Energy Units Billed (kWh / kVAh) including meter multiplier ratio (CT/PT factor).',
      'Average Power Factor (PF) & Maximum Demand Indicator (MDI).',
    ],
  },
  {
    title: '3. Acceptable File Formats & Quality',
    badge: 'Format Support',
    description:
      'Digital e-bills downloaded from the DISCOM self-service portal (PDF) are preferred for 100% OCR accuracy. Clean photographic scans (JPG/PNG) of physical paper bills are also accepted if all numerical tables are unblurred.',
    items: [
      'PDF (Portal e-bill directly exported from utility portal)',
      'Scanned copy or clear high-resolution camera photo (JPG, PNG)',
      'Max file size: 25 MB per document upload',
    ],
  },
  {
    title: '4. Backup DG & Solar Net-Metering (Optional)',
    badge: 'Supplementary',
    description:
      'If your facility uses rooftop solar net-metering or wheeling open-access, upload the settlement annexure showing gross import vs. export units so AI calculates net grid carbon intensity accurately.',
    items: [
      'Solar generation credit / gross solar generation ledger if available.',
      'DG generator log sheet if diesel backup was utilized during grid outages.',
    ],
  },
];
