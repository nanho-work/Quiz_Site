"use client";

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import {
  calculateNetSalary2026,
  type NetSalaryCalculatorInput2026,
} from "../../lib/calculators/net-salary/calculateNetSalary2026";

function formatKrw(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

type SalaryType = "annual" | "monthly";
type RetirementPayType = "included" | "separate";

function selectCardClass(isActive: boolean): string {
  return `w-full rounded-lg border p-4 text-left transition ${
    isActive
      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
      : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
  }`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function NetSalaryCalculatorClient() {
  const [salaryType, setSalaryType] = useState<SalaryType>("annual");
  const [retirementPayType, setRetirementPayType] =
    useState<RetirementPayType>("separate");
  const [salaryAmountInput, setSalaryAmountInput] = useState("");
  const [familyCountInput, setFamilyCountInput] = useState("1");
  const [childrenCountInput, setChildrenCountInput] = useState("0");
  const [nonTaxableInput, setNonTaxableInput] = useState("200,000");
  const retirementDisabled = salaryType === "monthly";

  const numericInput = useMemo<NetSalaryCalculatorInput2026>(() => {
    const salaryAmount = Number(salaryAmountInput.replaceAll(",", "")) || 0;
    const familyCount = Number(familyCountInput) || 1;
    const childrenCount = Number(childrenCountInput) || 0;
    const nonTaxableAmount = Number(nonTaxableInput.replaceAll(",", "")) || 0;

    return {
      salaryType,
      retirementPayType,
      salaryAmount: Math.max(0, Math.floor(salaryAmount)),
      familyCount: Math.max(1, Math.floor(familyCount)),
      childrenCount: Math.max(0, Math.floor(childrenCount)),
      nonTaxableAmount: Math.max(0, Math.floor(nonTaxableAmount)),
    };
  }, [
    salaryType,
    retirementPayType,
    salaryAmountInput,
    familyCountInput,
    childrenCountInput,
    nonTaxableInput,
  ]);

  const result = useMemo(() => {
    if (numericInput.salaryAmount <= 0) {
      return null;
    }
    return calculateNetSalary2026(numericInput);
  }, [numericInput]);

  const formatNumberInput = (
    value: string,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    const digitsOnly = value.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      setter("");
      return;
    }
    setter(Number(digitsOnly).toLocaleString("ko-KR"));
  };

  const updateFamilyCountByStep = (delta: number) => {
    const current = Number(familyCountInput) || 1;
    const next = clamp(current + delta, 1, 11);
    setFamilyCountInput(String(next));
  };

  const updateChildrenCountByStep = (delta: number) => {
    const current = Number(childrenCountInput) || 0;
    const next = Math.max(0, current + delta);
    setChildrenCountInput(String(next));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-stretch">
      <section className="rounded-lg border bg-card p-5 space-y-4 h-full">
        <p className="text-sm font-bold">필수 입력</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">급여 기준</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSalaryType("annual")}
                aria-pressed={salaryType === "annual"}
                className={selectCardClass(salaryType === "annual")}
              >
                <p className="font-semibold">연봉</p>
                <p className="text-xs text-muted-foreground mt-1">
                  입력 금액을 연간 급여로 계산
                </p>
              </button>
              <button
                type="button"
                onClick={() => setSalaryType("monthly")}
                aria-pressed={salaryType === "monthly"}
                className={selectCardClass(salaryType === "monthly")}
              >
                <p className="font-semibold">월급</p>
                <p className="text-xs text-muted-foreground mt-1">
                  입력 금액을 월 급여로 계산
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">퇴직금 처리</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRetirementPayType("separate")}
                disabled={retirementDisabled}
                aria-pressed={retirementPayType === "separate"}
                className={`${selectCardClass(
                  retirementPayType === "separate"
                )} ${retirementDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className="font-semibold">퇴직금 별도</p>
                <p className="text-xs text-muted-foreground mt-1">
                  월급 기준 12개월로 계산
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRetirementPayType("included")}
                disabled={retirementDisabled}
                aria-pressed={retirementPayType === "included"}
                className={`${selectCardClass(
                  retirementPayType === "included"
                )} ${retirementDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className="font-semibold">퇴직금 포함</p>
                <p className="text-xs text-muted-foreground mt-1">
                  월급 기준 13개월로 계산
                </p>
              </button>
            </div>
            {retirementDisabled && (
              <p className="text-xs text-muted-foreground mt-2">
                월급 기준에서는 퇴직금 포함/별도 선택이 적용되지 않습니다.
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="salaryAmount" className="block text-sm font-semibold mb-2">
            {salaryType === "annual" ? "연봉 (원)" : "월급 (원)"}
          </label>
          <input
            id="salaryAmount"
            inputMode="numeric"
            type="text"
            value={salaryAmountInput}
            onChange={(event) =>
              formatNumberInput(event.target.value, setSalaryAmountInput)
            }
            placeholder={salaryType === "annual" ? "예: 50,000,000" : "예: 4,000,000"}
            className="w-full rounded-md border bg-background px-3 py-2 text-right"
          />
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700" />
        <p className="text-sm font-bold">선택 입력</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="familyCount"
              className="block text-sm font-semibold mb-2 text-center"
            >
              부양가족수 (본인 포함)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  updateFamilyCountByStep(-1);
                }}
                className="h-10 w-10 rounded-md border bg-background text-lg font-semibold hover:bg-muted"
              >
                -
              </button>
              <input
                id="familyCount"
                inputMode="numeric"
                type="text"
                value={familyCountInput}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/[^\d]/g, "");
                  if (!digitsOnly) {
                    setFamilyCountInput("");
                    return;
                  }
                  setFamilyCountInput(String(clamp(Number(digitsOnly), 1, 11)));
                }}
                onBlur={() => {
                  const fallback = clamp(Number(familyCountInput) || 1, 1, 11);
                  setFamilyCountInput(String(fallback));
                }}
                className="h-10 flex-1 rounded-md border bg-background px-3 text-center"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  updateFamilyCountByStep(1);
                }}
                className="h-10 w-10 rounded-md border bg-background text-lg font-semibold hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="childrenCount"
              className="block text-sm font-semibold mb-2 text-center"
            >
              20세 이하 자녀수
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  updateChildrenCountByStep(-1);
                }}
                className="h-10 w-10 rounded-md border bg-background text-lg font-semibold hover:bg-muted"
              >
                -
              </button>
              <input
                id="childrenCount"
                inputMode="numeric"
                type="text"
                value={childrenCountInput}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/[^\d]/g, "");
                  if (!digitsOnly) {
                    setChildrenCountInput("");
                    return;
                  }
                  setChildrenCountInput(String(Math.max(0, Number(digitsOnly))));
                }}
                onBlur={() => {
                  const fallback = Math.max(0, Number(childrenCountInput) || 0);
                  setChildrenCountInput(String(fallback));
                }}
                className="h-10 flex-1 rounded-md border bg-background px-3 text-center"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  updateChildrenCountByStep(1);
                }}
                className="h-10 w-10 rounded-md border bg-background text-lg font-semibold hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="nonTaxable" className="block text-sm font-semibold mb-2">
              비과세액 (월, 원)
            </label>
            <input
              id="nonTaxable"
              inputMode="numeric"
              type="text"
              value={nonTaxableInput}
              onChange={(event) =>
                formatNumberInput(event.target.value, setNonTaxableInput)
              }
              placeholder="예: 200,000"
              className="w-full rounded-md border bg-background px-3 py-2 text-right"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 h-full lg:sticky lg:top-24">
        <h3 className="text-xl font-bold mb-4">계산 결과</h3>

        <ul className="text-base mb-5 divide-y divide-gray-300 dark:divide-gray-700">
          {[
            { label: "국민연금", value: result ? formatKrw(result.nationalPension) : null },
            { label: "건강보험", value: result ? formatKrw(result.healthInsurance) : null },
            { label: "장기요양보험", value: result ? formatKrw(result.longTermCare) : null },
            { label: "고용보험", value: result ? formatKrw(result.employmentInsurance) : null },
            { label: "소득세", value: result ? formatKrw(result.incomeTax) : null },
            { label: "지방소득세", value: result ? formatKrw(result.localIncomeTax) : null },
            { label: "세금/공제 합계", value: result ? formatKrw(result.totalDeduction) : null },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between px-4 py-3 bg-card"
            >
              <span>{item.label}</span>
              <strong>{item.value ?? formatKrw(0)}</strong>
            </li>
          ))}
        </ul>

        <div className="rounded-md bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
          <span className="font-semibold">실수령 금액 (월)</span>
          {result ? (
            <strong className="text-xl text-primary">{formatKrw(result.netSalary)}</strong>
          ) : (
            <strong className="text-xl text-primary">{formatKrw(0)}</strong>
          )}
        </div>
      </section>
    </div>
  );
}
