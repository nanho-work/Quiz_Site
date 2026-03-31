export const INSURANCE_RATES_2026 = {
  nationalPensionEmployeeRate: 0.0475,
  healthInsuranceEmployeeRate: 0.03595,
  longTermCareByHealthInsuranceRate: 0.9448 / 7.19,
  employmentInsuranceEmployeeRate: 0.009,
} as const;

export const WITHHOLDING_CONTEXT_2026 = {
  year: 2026,
  familyCountMin: 1,
  familyCountMax: 11,
  hasNonTaxableIncome: false,
} as const;

export const CHILD_TAX_CREDIT_2026 = {
  oneChild: 12_500,
  twoChildren: 29_160,
  perAdditionalChild: 25_000,
} as const;
