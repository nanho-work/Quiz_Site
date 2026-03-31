"use client";

import { useMemo, useState } from "react";
import { calculateRefund33 } from "../../lib/calculators/refund-33/calculateRefund33";
import { SELF_DEDUCTION_DEFAULT, WITHHOLDING_RATE_33 } from "../../lib/calculators/refund-33/constants";
import type { DeductionMode, ExpenseMode } from "../../lib/calculators/refund-33/types";

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

function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }
  return Number(digits).toLocaleString("ko-KR");
}

function formatPercentInput(raw: string): string {
  return raw.replace(/[^\d.]/g, "");
}

export default function Refund33CalculatorClient() {
  const [annualIncomeInput, setAnnualIncomeInput] = useState("");
  const [expenseMode, setExpenseMode] = useState<ExpenseMode>("simple");
  const [expenseRateInput, setExpenseRateInput] = useState("");
  const [manualExpenseInput, setManualExpenseInput] = useState("");
  const [deductionMode, setDeductionMode] = useState<DeductionMode>("self");
  const [withheldTaxInput, setWithheldTaxInput] = useState("");

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
    const expenseRatePercent = Math.min(Math.max(parseNumber(expenseRateInput), 0), 100);
    const expenseRate = expenseRatePercent / 100;

    const manualExpense = parseNumber(manualExpenseInput);
    const withheldTax = withheldTaxInput.trim() ? parseNumber(withheldTaxInput) : undefined;

    return calculateRefund33({
      annualIncome,
      expenseMode,
      expenseRate,
      manualExpense,
      deductionMode,
      withheldTax,
    });
  }, [
    errors.length,
    annualIncomeInput,
    expenseMode,
    expenseRateInput,
    manualExpenseInput,
    deductionMode,
    withheldTaxInput,
  ]);

  const headlineLabel = result
    ? result.refundExpected > 0
      ? "환급예상액"
      : "추가 납부예상액"
    : "환급/추가납부";

  const headlineValue = result
    ? result.refundExpected > 0
      ? result.refundExpected
      : result.payableTax
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-stretch">
      <section className="panel-card space-y-4 h-full">
        <p className="text-sm font-bold">입력</p>

        <div>
          <label htmlFor="annualIncome" className="field-label">
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
            className="field-input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">필요경비 방식 (필수)</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExpenseMode("simple")}
              className={`h-11 rounded-lg border text-sm font-semibold transition ${
                expenseMode === "simple"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              단순경비율
            </button>
            <button
              type="button"
              onClick={() => setExpenseMode("manual")}
              className={`h-11 rounded-lg border text-sm font-semibold transition ${
                expenseMode === "manual"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              직접 입력
            </button>
          </div>
        </div>

        {expenseMode === "simple" ? (
          <div>
            <label htmlFor="expenseRate" className="field-label">
              단순경비율 % (필수)
            </label>
            <input
              id="expenseRate"
              type="text"
              inputMode="decimal"
              value={expenseRateInput}
              onChange={(event) => setExpenseRateInput(formatPercentInput(event.target.value))}
              placeholder="예: 60"
              className="field-input"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="manualExpense" className="field-label">
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
              placeholder="예: 15,000,000"
              className="field-input"
            />
          </div>
        )}

        <details className="rounded-lg border border-border bg-background px-3 py-2">
          <summary className="cursor-pointer text-sm font-semibold">선택 입력 펼치기</summary>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-sm font-semibold mb-2">소득공제 방식</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeductionMode("self")}
                  className={`h-10 rounded-lg border text-sm transition ${
                    deductionMode === "self"
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  본인 공제
                </button>
                <button
                  type="button"
                  onClick={() => setDeductionMode("none")}
                  className={`h-10 rounded-lg border text-sm transition ${
                    deductionMode === "none"
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  공제 없음
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="withheldTax" className="block text-sm font-semibold mb-2">
                이미 낸 세금 (3.3%) 직접입력 (선택)
              </label>
              <input
                id="withheldTax"
                type="text"
                inputMode="numeric"
                value={withheldTaxInput}
                onChange={(event) => setWithheldTaxInput(formatCurrencyInput(event.target.value))}
                placeholder="비우면 총수입 × 3.3% 자동계산"
                className="field-input"
              />
            </div>
          </div>
        </details>

        {errors.length > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive space-y-1">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </section>

      <section className="panel-card h-full">
        <p className="text-sm font-bold mb-4">예상 계산 결과</p>

        <div className="result-list mb-4">
          {[
            { label: "총수입", value: result ? formatKrw(result.annualIncome) : "-" },
            { label: "필요경비", value: result ? formatKrw(result.expense) : "-" },
            { label: "종합소득금액", value: result ? formatKrw(result.grossIncome) : "-" },
            {
              label: "소득공제",
              value: result ? formatKrw(result.deduction) : deductionMode === "self" ? formatKrw(SELF_DEDUCTION_DEFAULT) : formatKrw(0),
            },
            { label: "과세표준", value: result ? formatKrw(result.taxBase) : "-" },
            { label: "예상 종합소득세(국세)", value: result ? formatKrw(result.nationalTax) : "-" },
            { label: "예상 지방소득세", value: result ? formatKrw(result.localTax) : "-" },
            {
              label: "이미 낸 세금 (3.3%)",
              value: result
                ? formatKrw(result.withheldTax)
                : annualIncomeInput
                ? formatKrw(parseNumber(annualIncomeInput) * WITHHOLDING_RATE_33)
                : "-",
            },
          ].map((item) => (
            <div key={item.label} className="result-row">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div
          className={`rounded-xl border p-4 flex items-center justify-between ${
            result && result.refundExpected > 0
              ? "bg-emerald-50 border-emerald-200"
              : "bg-primary/10 border-primary/20"
          }`}
        >
          <span className="font-semibold">{headlineLabel}</span>
          <strong className={`text-xl ${result && result.refundExpected > 0 ? "text-emerald-700" : "text-primary"}`}>
            {formatKrw(headlineValue)}
          </strong>
        </div>
      </section>
    </div>
  );
}
