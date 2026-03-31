import { MINIMUM_WAGE_2026, MONTHLY_WEEKS_FACTOR } from "./constants2026";

export type MinimumWageInput = {
  hourlyWage: number;
  dailyHours: number;
  weeklyDays: number;
};

export type MinimumWageResult = {
  hourlyWage: number;
  dailyHours: number;
  weeklyDays: number;
  weeklyHours: number;
  weeklyPay: number;
  weeklyHolidayPay: number;
  totalWeeklyPay: number;
  monthlyPay: number;
  hasWeeklyHolidayPay: boolean;
};

function floorToWon(value: number): number {
  return Math.floor(Math.max(0, value));
}

function normalizeInput(input: MinimumWageInput): MinimumWageInput {
  const hourlyWage = floorToWon(input.hourlyWage || MINIMUM_WAGE_2026);
  const dailyHours = Math.min(Math.max(input.dailyHours || 0, 0), 24);
  const weeklyDays = Math.min(Math.max(input.weeklyDays || 0, 0), 7);

  return {
    hourlyWage,
    dailyHours,
    weeklyDays,
  };
}

export function calculateMinimumWage(input: MinimumWageInput): MinimumWageResult {
  const normalized = normalizeInput(input);

  const weeklyHours = normalized.dailyHours * normalized.weeklyDays;
  const weeklyPay = floorToWon(normalized.hourlyWage * weeklyHours);
  const hasWeeklyHolidayPay = weeklyHours >= 15;
  const weeklyHolidayPay = hasWeeklyHolidayPay
    ? floorToWon(normalized.hourlyWage * normalized.dailyHours)
    : 0;

  const totalWeeklyPay = floorToWon(weeklyPay + weeklyHolidayPay);
  const monthlyPay = floorToWon(totalWeeklyPay * MONTHLY_WEEKS_FACTOR);

  return {
    hourlyWage: normalized.hourlyWage,
    dailyHours: normalized.dailyHours,
    weeklyDays: normalized.weeklyDays,
    weeklyHours,
    weeklyPay,
    weeklyHolidayPay,
    totalWeeklyPay,
    monthlyPay,
    hasWeeklyHolidayPay,
  };
}
