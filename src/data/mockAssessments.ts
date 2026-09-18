import { Assessment, Sector } from '../types';

export const INDIAN_REGIONS = [
  'Maharashtra',
  'Gujarat',
  'Tamil Nadu',
  'Odisha',
  'Chhattisgarh',
  'Jharkhand',
  'Karnataka',
  'Andhra Pradesh',
  'Punjab',
  'Rajasthan',
  'West Bengal',
  'Haryana',
  'Uttar Pradesh',
  'Madhya Pradesh',
];

export const SECTORS: { label: Sector; desc: string; sampleProduct: string }[] = [
  { label: 'Steel', desc: 'Sponge iron, rebar, billets, hot rolled coils', sampleProduct: 'Structural Steel Rebars (EAF / Induction furnace)' },
  { label: 'Aluminium', desc: 'Extrusions, ingots, wire rods, sheets', sampleProduct: 'Aluminium Extrusion Profiles' },
  { label: 'Cement', desc: 'Clinker, Portland Pozzolana Cement (PPC), OPC', sampleProduct: 'Ordinary Portland Cement (Grinding unit)' },
  { label: 'Fertiliser', desc: 'Urea, DAP, complex fertilisers', sampleProduct: 'Granular Urea & Ammonium' },
];

export const FUEL_TYPES = [
  'Diesel',
  'Furnace Oil',
  'Natural Gas',
  'Non-Coking Coal',
  'LPG',
  'Petcoke',
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'cb-steel-001',
    name: 'Steel Export',
    sector: 'Steel',
    region: 'Maharashtra',
    productProcess: 'Reinforcement Steel Bars via Induction Furnace',
    description: 'Initial operational review for consignment targeting European buyers.',
    productionVolume: 1000,
    productionUnit: 'tonnes',
    electricityConsumed: 50000,
    electricityUnit: 'kWh',
    fuelConsumed: 5000,
    fuelUnit: 'litres',
    fuelType: 'Diesel',
    createdAt: '2025-02-18',
    estimatedEmissions: 720,
    uncertaintyMin: 680,
    uncertaintyMax: 760,
    readiness: 'Medium',
    drivers: [
      { name: 'Electricity', percentage: 42, category: 'electricity' },
      { name: 'Fuel', percentage: 21, category: 'fuel' },
      { name: 'Process', percentage: 12, category: 'process' },
      { name: 'Grid Factor', percentage: 9, category: 'grid' },
      { name: 'Other', percentage: 16, category: 'other' },
    ],
    dataQuality: [
      { label: 'Production data available', status: 'valid', detail: '1,000 tonnes logged from monthly dispatch logs' },
      { label: 'Electricity data available', status: 'valid', detail: '50,000 kWh from main utility DISCOM bill' },
      { label: 'Fuel details incomplete', status: 'warning', detail: 'Fuel logged at aggregate plant level, generator sub-meter missing' },
    ],
    recommendedSteps: [
      'Collect detailed fuel consumption breakdown (furnace vs standby diesel generators).',
      'Record process-level electricity data with sub-meters.',
    ],
  },
  {
    id: 'cb-alu-002',
    name: 'Aluminium Manufacturing',
    sector: 'Aluminium',
    region: 'Gujarat',
    productProcess: 'Secondary Ingot Melting & Continuous Casting',
    description: 'Quarterly operational log review for automotive supplier tier-2 audit.',
    productionVolume: 450,
    productionUnit: 'tonnes',
    electricityConsumed: 32000,
    electricityUnit: 'kWh',
    fuelConsumed: 4200,
    fuelUnit: 'litres',
    fuelType: 'Furnace Oil',
    createdAt: '2025-02-12',
    estimatedEmissions: 610,
    uncertaintyMin: 540,
    uncertaintyMax: 690,
    readiness: 'Low',
    drivers: [
      { name: 'Electricity', percentage: 48, category: 'electricity' },
      { name: 'Fuel', percentage: 26, category: 'fuel' },
      { name: 'Process', percentage: 10, category: 'process' },
      { name: 'Grid Factor', percentage: 8, category: 'grid' },
      { name: 'Other', percentage: 8, category: 'other' },
    ],
    dataQuality: [
      { label: 'Production volume provided', status: 'valid', detail: '450 tonnes monthly production' },
      { label: 'Estimated electricity without sub-metering', status: 'warning', detail: 'Sub-facility electricity allocation is estimated' },
      { label: 'Furnace oil density not verified', status: 'missing', detail: 'Standard conversion factor applied in place of lab density test' },
    ],
    recommendedSteps: [
      'Install dedicated energy meters on secondary remelting induction loops.',
      'Obtain fuel delivery batch quality certificates to verify calorific values.',
    ],
  },
];
