export type ExpenseMode = "simple" | "manual";

export type IncomeTaxBracket = {
  max: number;
  rate: number;
  deduction: number;
};

export type ComprehensiveIncomeTaxInput = {
  annualIncome: number;
  expenseMode: ExpenseMode;
  expenseRate?: number;
  manualExpense?: number;
  withheldTax?: number;
  basicDeduction?: number;
  localTaxIncluded?: boolean;
};

export type ComprehensiveIncomeTaxResult = {
  annualIncome: number;
  expense: number;
  grossIncome: number;
  deduction: number;
  taxBase: number;
  nationalTax: number;
  localTax: number;
  withheldTax: number;
  payableTax: number;
  refundExpected: number;
};
