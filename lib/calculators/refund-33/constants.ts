import type { Refund33TaxBracket } from "./types";

export const SELF_DEDUCTION_DEFAULT = 1_500_000;
export const WITHHOLDING_RATE_33 = 0.033;
export const LOCAL_TAX_RATE = 0.1;

export const REFUND_33_BRACKETS: Refund33TaxBracket[] = [
  { max: 14_000_000, rate: 0.06, deduction: 0 },
  { max: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { max: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { max: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { max: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { max: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { max: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 65_940_000 },
];
