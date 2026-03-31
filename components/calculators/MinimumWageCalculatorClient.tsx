"use client";

import { useMemo, useState } from "react";
import { calculateMinimumWage } from "../../lib/calculators/minimum-wage/calculateMinimumWage";
import { MINIMUM_WAGE_2026 } from "../../lib/calculators/minimum-wage/constants2026";

function formatKrw(value: number): string {
  return `${Math.floor(value).toLocaleString("ko-KR")}원`;
}

function parsePositiveNumber(value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

export default function MinimumWageCalculatorClient() {
  const [hourlyWageInput, setHourlyWageInput] = useState(String(MINIMUM_WAGE_2026));
  const [dailyHoursInput, setDailyHoursInput] = useState("8");
  const [weeklyDaysInput, setWeeklyDaysInput] = useState("5");

  const result = useMemo(() => {
    return calculateMinimumWage({
      hourlyWage: parsePositiveNumber(hourlyWageInput),
      dailyHours: parsePositiveNumber(dailyHoursInput),
      weeklyDays: parsePositiveNumber(weeklyDaysInput),
    });
  }, [hourlyWageInput, dailyHoursInput, weeklyDaysInput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-stretch">
      <section className="rounded-lg border border-border/30 bg-card p-5 space-y-4 h-full">
        <p className="text-sm font-bold">입력</p>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="hourlyWage" className="block text-sm font-semibold mb-2">
              시급 (원)
            </label>
            <input
              id="hourlyWage"
              type="number"
              inputMode="numeric"
              min={0}
              value={hourlyWageInput}
              onChange={(event) => setHourlyWageInput(event.target.value)}
              className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
            />
          </div>

          <div>
            <label htmlFor="dailyHours" className="block text-sm font-semibold mb-2">
              하루 근무시간
            </label>
            <input
              id="dailyHours"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              value={dailyHoursInput}
              onChange={(event) => setDailyHoursInput(event.target.value)}
              className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
            />
          </div>

          <div>
            <label htmlFor="weeklyDays" className="block text-sm font-semibold mb-2">
              주 근무일수
            </label>
            <input
              id="weeklyDays"
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={weeklyDaysInput}
              onChange={(event) => setWeeklyDaysInput(event.target.value)}
              className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border/30 bg-card p-5 h-full">
        <p className="text-sm font-bold mb-4">계산 결과</p>
        <div className="rounded-lg border border-border/30 divide-y divide-border/30">
          <div className="flex items-center justify-between px-4 py-3">
            <span>주 근무시간</span>
            <strong>{result.weeklyHours.toLocaleString("ko-KR")}시간</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>주급 (기본)</span>
            <strong>{formatKrw(result.weeklyPay)}</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>주휴수당</span>
            <strong>{formatKrw(result.weeklyHolidayPay)}</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>주휴수당 적용</span>
            <strong>{result.hasWeeklyHolidayPay ? "포함" : "미포함"}</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span>총 주급</span>
            <strong>{formatKrw(result.totalWeeklyPay)}</strong>
          </div>
        </div>

        <div className="rounded-md bg-primary/10 border border-primary/20 p-4 mt-4 flex items-center justify-between">
          <span className="font-semibold">총 월급 (예상)</span>
          <strong className="text-xl text-primary">{formatKrw(result.monthlyPay)}</strong>
        </div>
      </section>
    </div>
  );
}
