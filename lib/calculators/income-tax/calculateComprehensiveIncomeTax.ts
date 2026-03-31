import {
  BASIC_DEDUCTION_DEFAULT,
  INCOME_TAX_BRACKETS,
} from "./incomeTaxBrackets";
import type {
  ComprehensiveIncomeTaxInput,
  ComprehensiveIncomeTaxResult,
} from "./types";

function floorWon(value: number): number {
  return Math.floor(Math.max(0, value));
}

function calculateNationalTax(taxBase: number): number {
  const matched = INCOME_TAX_BRACKETS.find((bracket) => taxBase <= bracket.max);
  if (!matched) {
    return 0;
  }
  return floorWon(taxBase * matched.rate - matched.deduction);
}

export function calculateComprehensiveIncomeTax(
  input: ComprehensiveIncomeTaxInput
): ComprehensiveIncomeTaxResult {
  const annualIncome = floorWon(input.annualIncome || 0);
  const withheldTax = floorWon(input.withheldTax || 0);
  const deduction = floorWon(
    input.basicDeduction == null ? BASIC_DEDUCTION_DEFAULT : input.basicDeduction
  );

  let expense = 0;
  if (input.expenseMode === "simple") {
    const expenseRate = Math.max(0, input.expenseRate || 0);
    expense = floorWon(annualIncome * expenseRate);
  } else {
    expense = floorWon(input.manualExpense || 0);
  }

  expense = Math.min(expense, annualIncome);

  const grossIncome = floorWon(annualIncome - expense);
  const taxBase = floorWon(grossIncome - deduction);

  const nationalTax = calculateNationalTax(taxBase);
  const localTax = input.localTaxIncluded === false ? 0 : floorWon(nationalTax * 0.1);

  const finalTax = nationalTax + localTax - withheldTax;
  const payableTax = Math.max(0, finalTax);
  const refundExpected = Math.max(0, -finalTax);

  return {
    annualIncome,
    expense,
    grossIncome,
    deduction,
    taxBase,
    nationalTax,
    localTax,
    withheldTax,
    payableTax,
    refundExpected,
  };
}
