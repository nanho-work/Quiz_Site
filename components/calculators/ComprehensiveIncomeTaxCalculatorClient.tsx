"use client";

import { useMemo, useState } from "react";
import {
  calculateComprehensiveIncomeTax,
} from "../../lib/calculators/income-tax/calculateComprehensiveIncomeTax";
import { BASIC_DEDUCTION_DEFAULT } from "../../lib/calculators/income-tax/incomeTaxBrackets";
import type { ExpenseMode } from "../../lib/calculators/income-tax/types";
import expenseRateGroupsJson from "../../lib/calculators/common/expenseRateGroups.json";
import ConsultationLeadForm from "../marketing/ConsultationLeadForm";

type ExpenseRateGroup = {
  group: string;
  expenseRate: number;
  jobs: string[];
};

const expenseRateGroups = expenseRateGroupsJson as ExpenseRateGroup[];
const defaultExpenseRatePercent = expenseRateGroups[0]
  ? String(Math.round(expenseRateGroups[0].expenseRate * 100))
  : "";

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

export default function ComprehensiveIncomeTaxCalculatorClient() {
  const [annualIncomeInput, setAnnualIncomeInput] = useState("");
  const [expenseMode, setExpenseMode] = useState<ExpenseMode>("simple");
  const [expenseRateInput, setExpenseRateInput] = useState(defaultExpenseRatePercent);
  const [manualExpenseInput, setManualExpenseInput] = useState("");
  const [withheldTaxInput, setWithheldTaxInput] = useState("");
  const [localTaxIncluded, setLocalTaxIncluded] = useState(true);

  const selectedExpenseRateGroup = useMemo(() => {
    const selectedPercent = parseNumber(expenseRateInput);
    return expenseRateGroups.find(
      (item) => Math.round(item.expenseRate * 100) === selectedPercent,
    );
  }, [expenseRateInput]);

  const errors = useMemo(() => {
    const nextErrors: string[] = [];

    if (!annualIncomeInput.trim()) {
      nextErrors.push("연간 총수입은 필수 입력입니다.");
    }

    if (expenseMode === "simple") {
      if (!expenseRateInput.trim()) {
        nextErrors.push("간편 경비율 직업군을 선택해주세요.");
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

  const annualIncomeMissing = !annualIncomeInput.trim();
  const manualExpenseMissing = expenseMode === "manual" && !manualExpenseInput.trim();

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
            aria-invalid={annualIncomeMissing}
            aria-describedby={annualIncomeMissing ? "income-tax-errors" : undefined}
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
              간편 경비율 선택
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
              직접 필요경비 입력
            </button>
          </div>
        </div>

        {expenseMode === "simple" ? (
          <div className="space-y-2">
            <p className="field-label">직업군 선택 (필수)</p>
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              role="radiogroup"
              aria-label="간편 경비율 직업군"
            >
              {expenseRateGroups.map((item) => {
                const percent = Math.round(item.expenseRate * 100);
                const isActive = parseNumber(expenseRateInput) === percent;
                return (
                  <button
                    key={item.group}
                    type="button"
                    onClick={() => setExpenseRateInput(String(percent))}
                    role="radio"
                    aria-checked={isActive}
                    aria-label={`${item.group} 간편 경비율 ${percent}%`}
                    className={`min-w-[180px] rounded-lg border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.group}</p>
                    <p className="text-xs text-muted-foreground mt-1">간편 경비율 {percent}%</p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedExpenseRateGroup
                ? `예시 직군: ${selectedExpenseRateGroup.jobs.slice(0, 3).join(", ")}`
                : "직업군을 선택해주세요."}
            </p>
            <p className="text-xs text-amber-700">
              카드 경비율은 업종 일반 사례 기반 간편 추정치입니다. 실제 단순경비율은 업종코드/귀속연도에 따라 달라질 수 있습니다.
            </p>
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
              placeholder="예: 12,000,000"
              className="field-input"
              aria-invalid={manualExpenseMissing}
              aria-describedby={manualExpenseMissing ? "income-tax-errors" : undefined}
            />
          </div>
        )}

        <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm flex items-center justify-between">
          <span>기본공제 (본인 1명 기준)</span>
          <strong>{formatKrw(BASIC_DEDUCTION_DEFAULT)}</strong>
        </div>

        <details className="rounded-lg border border-border bg-background px-3 py-2">
          <summary className="cursor-pointer text-sm font-semibold">선택 입력 펼치기</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="withheldTax" className="field-label">
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
                className="field-input"
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
          <div
            id="income-tax-errors"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive space-y-1"
            aria-live="polite"
          >
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
            { label: "소득공제", value: result ? formatKrw(result.deduction) : "-" },
            { label: "과세표준", value: result ? formatKrw(result.taxBase) : "-" },
            { label: "예상 종합소득세(국세)", value: result ? formatKrw(result.nationalTax) : "-" },
            { label: "예상 지방소득세", value: result ? formatKrw(result.localTax) : "-" },
            { label: "기납부세액", value: result ? formatKrw(result.withheldTax) : "-" },
          ].map((item) => (
            <div key={item.label} className="result-row">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="result-highlight flex items-center justify-between">
          <span className="font-semibold">{highlightLabel}</span>
          <strong className="text-xl text-primary">{formatKrw(highlightValue)}</strong>
        </div>

        {result ? (
          <div className="mt-4 fade-in">
            <ConsultationLeadForm
              calculatorType="income_tax"
              canSubmit
              calculationInput={{
                annualIncome: parseNumber(annualIncomeInput),
                expenseMode,
                expenseRatePercent: parseNumber(expenseRateInput),
                manualExpense: parseNumber(manualExpenseInput),
                withheldTax: parseNumber(withheldTaxInput),
                basicDeduction: BASIC_DEDUCTION_DEFAULT,
                localTaxIncluded,
              }}
              calculationResult={result}
              title="전문가에게 맡기기"
              description="종합소득세 추정 결과를 함께 전달해 신고 방향을 빠르게 안내받을 수 있습니다."
            />
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            계산을 완료하면 아래에 상담 신청 입력창이 자동으로 나타납니다.
          </p>
        )}
      </section>
    </div>
  );
}
