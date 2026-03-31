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
      <section className="panel-card space-y-4 h-full">
        <p className="text-sm font-bold">입력</p>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="hourlyWage" className="field-label">
              시급 (원)
            </label>
            <input
              id="hourlyWage"
              type="number"
              inputMode="numeric"
              min={0}
              value={hourlyWageInput}
              onChange={(event) => setHourlyWageInput(event.target.value)}
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="dailyHours" className="field-label">
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
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="weeklyDays" className="field-label">
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
              className="field-input"
            />
          </div>
        </div>
      </section>

      <section className="panel-card h-full">
        <p className="text-sm font-bold mb-4">계산 결과</p>
        <div className="result-list">
          <div className="result-row">
            <span>주 근무시간</span>
            <strong>{result.weeklyHours.toLocaleString("ko-KR")}시간</strong>
          </div>
          <div className="result-row">
            <span>주급 (기본)</span>
            <strong>{formatKrw(result.weeklyPay)}</strong>
          </div>
          <div className="result-row">
            <span>주휴수당</span>
            <strong>{formatKrw(result.weeklyHolidayPay)}</strong>
          </div>
          <div className="result-row">
            <span>주휴수당 적용</span>
            <strong>{result.hasWeeklyHolidayPay ? "포함" : "미포함"}</strong>
          </div>
          <div className="result-row">
            <span>총 주급</span>
            <strong>{formatKrw(result.totalWeeklyPay)}</strong>
          </div>
        </div>

        <div className="result-highlight mt-4 flex items-center justify-between">
          <span className="font-semibold">총 월급 (예상)</span>
          <strong className="text-xl text-primary">{formatKrw(result.monthlyPay)}</strong>
        </div>
      </section>
    </div>
  );
}
