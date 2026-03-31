import {
  LOCAL_TAX_RATE,
  REFUND_33_BRACKETS,
  SELF_DEDUCTION_DEFAULT,
  WITHHOLDING_RATE_33,
} from "./constants";
import type { Refund33Input, Refund33Result } from "./types";

function floorWon(value: number): number {
  return Math.floor(Math.max(0, value));
}

function calculateNationalTax(taxBase: number): number {
  const bracket = REFUND_33_BRACKETS.find((item) => taxBase <= item.max);
  if (!bracket) {
    return 0;
  }
  return floorWon(taxBase * bracket.rate - bracket.deduction);
}

export function calculateRefund33(input: Refund33Input): Refund33Result {
  const annualIncome = floorWon(input.annualIncome || 0);

  let expense = 0;
  if (input.expenseMode === "simple") {
    const expenseRate = Math.min(Math.max(input.expenseRate || 0, 0), 1);
    expense = floorWon(annualIncome * expenseRate);
  } else {
    expense = floorWon(input.manualExpense || 0);
  }

  expense = Math.min(expense, annualIncome);

  const grossIncome = floorWon(annualIncome - expense);
  const deduction = input.deductionMode === "none" ? 0 : SELF_DEDUCTION_DEFAULT;
  const taxBase = floorWon(grossIncome - deduction);

  const nationalTax = calculateNationalTax(taxBase);
  const localTax = floorWon(nationalTax * LOCAL_TAX_RATE);

  const withheldTax =
    input.withheldTax == null
      ? floorWon(annualIncome * WITHHOLDING_RATE_33)
      : floorWon(input.withheldTax);

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
