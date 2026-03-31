import withholdingTaxTable from "./withholdingTaxTable.json";
import {
  CHILD_TAX_CREDIT_2026,
  INSURANCE_RATES_2026,
  WITHHOLDING_CONTEXT_2026,
} from "./insuranceRules2026";

type SalaryType = "annual" | "monthly";
type RetirementPayType = "included" | "separate";

type WithholdingTaxRow = {
  monthlyGrossFrom: number;
  monthlyGrossTo: number;
  incomeTaxByFamily: Record<string, number>;
};

export type NetSalaryCalculatorInput2026 = {
  salaryType: SalaryType;
  retirementPayType: RetirementPayType;
  salaryAmount: number;
  familyCount: number;
  childrenCount: number;
  nonTaxableAmount: number;
};

export type NetSalaryCalculation2026 = {
  annualSalary: number;
  monthlyGross: number;
  taxableMonthlyGross: number;
  familyCount: number;
  childrenCount: number;
  nonTaxableAmount: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeduction: number;
  netSalary: number;
};

const TAX_ROWS = withholdingTaxTable.rows as WithholdingTaxRow[];
const FIRST_TABLE_GROSS = TAX_ROWS[0].monthlyGrossFrom;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeFamilyCount(familyCount: number): number {
  return clamp(
    Math.floor(familyCount || 1),
    WITHHOLDING_CONTEXT_2026.familyCountMin,
    WITHHOLDING_CONTEXT_2026.familyCountMax
  );
}

function getTaxAtTenMillionByFamily(familyCount: number): number {
  const lastRow = TAX_ROWS[TAX_ROWS.length - 1];
  return lastRow.incomeTaxByFamily[String(familyCount)] ?? 0;
}

function getChildTaxCredit(childrenCount: number): number {
  const children = Math.max(0, Math.floor(childrenCount));
  if (children <= 0) {
    return 0;
  }
  if (children === 1) {
    return CHILD_TAX_CREDIT_2026.oneChild;
  }
  if (children === 2) {
    return CHILD_TAX_CREDIT_2026.twoChildren;
  }
  return (
    CHILD_TAX_CREDIT_2026.twoChildren +
    (children - 2) * CHILD_TAX_CREDIT_2026.perAdditionalChild
  );
}

function lookupIncomeTaxFromTable(
  monthlyGross: number,
  familyCount: number
): number {
  if (monthlyGross < FIRST_TABLE_GROSS) {
    return 0;
  }

  let left = 0;
  let right = TAX_ROWS.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const row = TAX_ROWS[mid];
    const rowUpperExclusive =
      row.monthlyGrossFrom === row.monthlyGrossTo
        ? row.monthlyGrossTo + 1
        : row.monthlyGrossTo;

    if (monthlyGross < row.monthlyGrossFrom) {
      right = mid - 1;
      continue;
    }
    if (monthlyGross >= rowUpperExclusive) {
      left = mid + 1;
      continue;
    }
    return row.incomeTaxByFamily[String(familyCount)] ?? 0;
  }

  return getTaxAtTenMillionByFamily(familyCount);
}

function lookupIncomeTaxAboveTenMillion(
  monthlyGross: number,
  familyCount: number
): number {
  const taxAtTenMillion = getTaxAtTenMillionByFamily(familyCount);

  if (monthlyGross <= 14_000_000) {
    return Math.floor(
      taxAtTenMillion + (monthlyGross - 10_000_000) * 0.98 * 0.35 + 25_000
    );
  }

  if (monthlyGross <= 28_000_000) {
    return Math.floor(
      taxAtTenMillion + 1_397_000 + (monthlyGross - 14_000_000) * 0.98 * 0.38
    );
  }

  if (monthlyGross <= 30_000_000) {
    return Math.floor(
      taxAtTenMillion + 6_610_600 + (monthlyGross - 28_000_000) * 0.98 * 0.4
    );
  }

  if (monthlyGross <= 45_000_000) {
    return Math.floor(
      taxAtTenMillion + 7_394_600 + (monthlyGross - 30_000_000) * 0.4
    );
  }

  if (monthlyGross <= 87_000_000) {
    return Math.floor(
      taxAtTenMillion + 13_394_600 + (monthlyGross - 45_000_000) * 0.42
    );
  }

  return Math.floor(
    taxAtTenMillion + 31_034_600 + (monthlyGross - 87_000_000) * 0.45
  );
}

function lookupIncomeTax2026(monthlyGross: number, familyCount: number): number {
  const gross = Math.max(0, Math.floor(monthlyGross));
  if (gross <= 1_060_000) {
    return 0;
  }
  if (gross <= 10_000_000) {
    return lookupIncomeTaxFromTable(gross, familyCount);
  }
  return lookupIncomeTaxAboveTenMillion(gross, familyCount);
}

function resolveMonthlyGross(
  salaryType: SalaryType,
  retirementPayType: RetirementPayType,
  salaryAmount: number
): { annualSalary: number; monthlyGross: number } {
  const normalizedSalary = Math.max(0, Math.floor(salaryAmount));

  if (salaryType === "monthly") {
    return {
      annualSalary: normalizedSalary * 12,
      monthlyGross: normalizedSalary,
    };
  }

  const annualSalary = normalizedSalary;
  const monthlyDivisor = retirementPayType === "included" ? 13 : 12;
  return {
    annualSalary,
    monthlyGross: Math.floor(annualSalary / monthlyDivisor),
  };
}

export function calculateNetSalary2026(
  input: NetSalaryCalculatorInput2026
): NetSalaryCalculation2026 {
  const { annualSalary, monthlyGross } = resolveMonthlyGross(
    input.salaryType,
    input.retirementPayType,
    input.salaryAmount
  );

  const familyCount = normalizeFamilyCount(input.familyCount);
  const childrenCount = Math.max(0, Math.floor(input.childrenCount || 0));
  const nonTaxableAmount = Math.max(0, Math.floor(input.nonTaxableAmount || 0));
  const taxableMonthlyGross = Math.max(0, monthlyGross - nonTaxableAmount);

  const nationalPension = Math.floor(
    taxableMonthlyGross * INSURANCE_RATES_2026.nationalPensionEmployeeRate
  );
  const healthInsurance = Math.floor(
    taxableMonthlyGross * INSURANCE_RATES_2026.healthInsuranceEmployeeRate
  );
  const longTermCare = Math.floor(
    healthInsurance * INSURANCE_RATES_2026.longTermCareByHealthInsuranceRate
  );
  const employmentInsurance = Math.floor(
    taxableMonthlyGross * INSURANCE_RATES_2026.employmentInsuranceEmployeeRate
  );

  const baseIncomeTax = lookupIncomeTax2026(taxableMonthlyGross, familyCount);
  const childTaxCredit = getChildTaxCredit(childrenCount);
  const incomeTax = Math.max(0, baseIncomeTax - childTaxCredit);
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  const netSalary = monthlyGross - totalDeduction;

  return {
    annualSalary,
    monthlyGross,
    taxableMonthlyGross,
    familyCount,
    childrenCount,
    nonTaxableAmount,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction,
    netSalary,
  };
}
