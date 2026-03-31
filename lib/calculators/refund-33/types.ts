export type ExpenseMode = "simple" | "manual";
export type DeductionMode = "none" | "self";

export type Refund33TaxBracket = {
  max: number;
  rate: number;
  deduction: number;
};

export type Refund33Input = {
  annualIncome: number;
  expenseMode: ExpenseMode;
  expenseRate?: number;
  manualExpense?: number;
  deductionMode?: DeductionMode;
  withheldTax?: number;
};

export type Refund33Result = {
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
