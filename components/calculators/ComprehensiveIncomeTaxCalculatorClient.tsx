"use client";

import { useMemo, useState } from "react";
import {
  calculateComprehensiveIncomeTax,
} from "../../lib/calculators/income-tax/calculateComprehensiveIncomeTax";
import { BASIC_DEDUCTION_DEFAULT } from "../../lib/calculators/income-tax/incomeTaxBrackets";
import type { ExpenseMode } from "../../lib/calculators/income-tax/types";

function parseNumber(value: string): number {
  const normalized = value.replaceAll(",", "").trim();
  if (!normalized) {
    return 0;
  }
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function formatKrw(value: number): string {
  return `${Math.floor(value).toLocaleString("ko-KR")}원`;
}

function formatPercentInput(raw: string): string {
  const numeric = raw.replace(/[^\d.]/g, "");
  return numeric;
}

function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }
  return Number(digits).toLocaleString("ko-KR");
}

export default function ComprehensiveIncomeTaxCalculatorClient() {
  const [annualIncomeInput, setAnnualIncomeInput] = useState("");
  const [expenseMode, setExpenseMode] = useState<ExpenseMode>("simple");
  const [expenseRateInput, setExpenseRateInput] = useState("");
  const [manualExpenseInput, setManualExpenseInput] = useState("");
  const [withheldTaxInput, setWithheldTaxInput] = useState("");
  const [localTaxIncluded, setLocalTaxIncluded] = useState(true);

  const errors = useMemo(() => {
    const nextErrors: string[] = [];

    if (!annualIncomeInput.trim()) {
      nextErrors.push("연간 총수입은 필수 입력입니다.");
    }

    if (expenseMode === "simple") {
      if (!expenseRateInput.trim()) {
        nextErrors.push("단순경비율을 입력해주세요.");
      }
    } else if (!manualExpenseInput.trim()) {
      nextErrors.push("직접 입력 필요경비를 입력해주세요.");
    }

    return nextErrors;
  }, [annualIncomeInput, expenseMode, expenseRateInput, manualExpenseInput]);

  const result = useMemo(() => {
    if (errors.length > 0) {
      return null;
    }

    const annualIncome = parseNumber(annualIncomeInput);
    const withheldTax = parseNumber(withheldTaxInput);

    const expenseRatePercent = Math.min(Math.max(parseNumber(expenseRateInput), 0), 100);
    const expenseRate = expenseRatePercent / 100;

    const manualExpense = parseNumber(manualExpenseInput);

    return calculateComprehensiveIncomeTax({
      annualIncome,
      expenseMode,
      expenseRate,
      manualExpense,
      withheldTax,
      basicDeduction: BASIC_DEDUCTION_DEFAULT,
      localTaxIncluded,
    });
  }, [
    errors.length,
    annualIncomeInput,
    expenseMode,
    expenseRateInput,
    manualExpenseInput,
    withheldTaxInput,
    localTaxIncluded,
  ]);

  const highlightLabel = result
    ? result.refundExpected > 0
      ? "환급예상액"
      : "최종 납부예상세액"
    : "최종 납부/환급";

  const highlightValue = result
    ? result.refundExpected > 0
      ? result.refundExpected
      : result.payableTax
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-stretch">
      <section className="rounded-lg border border-border/30 bg-card p-5 space-y-4 h-full">
        <p className="text-sm font-bold">입력</p>

        <div>
          <label htmlFor="annualIncome" className="block text-sm font-semibold mb-2">
            연간 총수입 (필수)
          </label>
          <input
            id="annualIncome"
            type="text"
            inputMode="numeric"
            value={annualIncomeInput}
            onChange={(event) =>
              setAnnualIncomeInput(formatCurrencyInput(event.target.value))
            }
            placeholder="예: 50,000,000"
            className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">필요경비 방식 (필수)</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExpenseMode("simple")}
              className={`h-11 rounded-md border text-sm font-semibold transition ${
                expenseMode === "simple"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/30 bg-background"
              }`}
            >
              단순경비율
            </button>
            <button
              type="button"
              onClick={() => setExpenseMode("manual")}
              className={`h-11 rounded-md border text-sm font-semibold transition ${
                expenseMode === "manual"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/30 bg-background"
              }`}
            >
              직접 입력
            </button>
          </div>
        </div>

        {expenseMode === "simple" ? (
          <div>
            <label htmlFor="expenseRate" className="block text-sm font-semibold mb-2">
              단순경비율 % (필수)
            </label>
            <input
              id="expenseRate"
              type="text"
              inputMode="decimal"
              value={expenseRateInput}
              onChange={(event) =>
                setExpenseRateInput(formatPercentInput(event.target.value))
              }
              placeholder="예: 60"
              className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="manualExpense" className="block text-sm font-semibold mb-2">
              직접 입력 필요경비 (필수)
            </label>
            <input
              id="manualExpense"
              type="text"
              inputMode="numeric"
              value={manualExpenseInput}
              onChange={(event) =>
                setManualExpenseInput(formatCurrencyInput(event.target.value))
              }
              placeholder="예: 12,000,000"
              className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
            />
          </div>
        )}

        <div className="rounded-md border border-border/30 bg-background px-3 py-2 text-sm flex items-center justify-between">
          <span>기본공제 (본인 1명 기준)</span>
          <strong>{formatKrw(BASIC_DEDUCTION_DEFAULT)}</strong>
        </div>

        <details className="rounded-md border border-border/30 bg-background px-3 py-2">
          <summary className="cursor-pointer text-sm font-semibold">선택 입력 펼치기</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="withheldTax" className="block text-sm font-semibold mb-2">
                기납부세액 (선택)
              </label>
              <input
                id="withheldTax"
                type="text"
                inputMode="numeric"
                value={withheldTaxInput}
                onChange={(event) =>
                  setWithheldTaxInput(formatCurrencyInput(event.target.value))
                }
                placeholder="예: 1,000,000"
                className="w-full h-11 rounded-md border border-border/30 bg-background px-3 text-right"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={localTaxIncluded}
                onChange={(event) => setLocalTaxIncluded(event.target.checked)}
                className="h-4 w-4"
              />
              지방소득세(10%) 포함
            </label>
          </div>
        </details>

        {errors.length > 0 && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive space-y-1">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border/30 bg-card p-5 h-full">
        <p className="text-sm font-bold mb-4">예상 계산 결과</p>

        <div className="rounded-lg border border-border/30 divide-y divide-border/30 mb-4">
          {[
            { label: "총수입", value: result ? formatKrw(result.annualIncome) : "-" },
            { label: "필요경비", value: result ? formatKrw(result.expense) : "-" },
            { label: "종합소득금액", value: result ? formatKrw(result.grossIncome) : "-" },
            { label: "소득공제", value: result ? formatKrw(result.deduction) : "-" },
            { label: "과세표준", value: result ? formatKrw(result.taxBase) : "-" },
            { label: "예상 종합소득세(국세)", value: result ? formatKrw(result.nationalTax) : "-" },
            { label: "예상 지방소득세", value: result ? formatKrw(result.localTax) : "-" },
            { label: "기납부세액", value: result ? formatKrw(result.withheldTax) : "-" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
          <span className="font-semibold">{highlightLabel}</span>
          <strong className="text-xl text-primary">{formatKrw(highlightValue)}</strong>
        </div>
      </section>
    </div>
  );
}
