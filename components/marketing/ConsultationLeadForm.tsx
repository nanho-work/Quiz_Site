"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  createConsultationLead,
  type MarketingCalculatorType,
} from "../../lib/marketing/createConsultationLead";
import {
  CONSULTATION_COLLECTION_CONSENT,
  CONSULTATION_CONSENT_VERSION,
  CONSULTATION_MARKETING_CONSENT,
  CONSULTATION_THIRD_PARTY_CONSENT,
} from "../../lib/legal/consultationConsent";

type ConsultationLeadFormProps = {
  calculatorType: MarketingCalculatorType;
  calculationInput?: Record<string, unknown> | null;
  calculationResult?: Record<string, unknown> | null;
  canSubmit?: boolean;
  submitBlockedReason?: string;
  title?: string;
  description?: string;
};

export default function ConsultationLeadForm({
  calculatorType,
  calculationInput = null,
  calculationResult = null,
  canSubmit = true,
  submitBlockedReason = "먼저 계산기 입력을 완료해주세요.",
  title = "전문가에게 맡기기",
  description = "이름과 연락처를 남기면 계산 결과를 함께 전달해 빠르게 상담을 도와드립니다.",
}: ConsultationLeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizedPhone = useMemo(() => phone.replace(/[^\d\-+]/g, ""), [phone]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!normalizedPhone.trim()) {
      setError("연락처를 입력해주세요.");
      return;
    }
    if (!consentPrivacy || !consentThirdParty) {
      setError("필수 동의 항목에 체크해주세요.");
      return;
    }
    if (!canSubmit) {
      setError(submitBlockedReason);
      return;
    }

    setLoading(true);
    try {
      const sourcePage =
        typeof window !== "undefined" ? window.location.pathname : "";
      const query = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

      await createConsultationLead({
        name: name.trim(),
        phone: normalizedPhone.trim(),
        calculatorType,
        calculationInput,
        calculationResult,
        message: message.trim(),
        sourcePage,
        utmSource: query.get("utm_source"),
        utmMedium: query.get("utm_medium"),
        utmCampaign: query.get("utm_campaign"),
        consentPrivacy,
        consentThirdParty,
        consentMarketing,
        consentVersion: CONSULTATION_CONSENT_VERSION,
      });

      setSuccess("상담 신청이 완료되었습니다. 담당자가 순차적으로 연락드립니다.");
      setName("");
      setPhone("");
      setMessage("");
      setConsentPrivacy(false);
      setConsentThirdParty(false);
      setConsentMarketing(false);
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "상담 신청 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-card mt-4">
      <h3 className="text-base font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor={`${calculatorType}-lead-name`}>
              이름
            </label>
            <input
              id={`${calculatorType}-lead-name`}
              className="field-input text-left"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${calculatorType}-lead-phone`}>
              연락처
            </label>
            <input
              id={`${calculatorType}-lead-phone`}
              className="field-input text-left"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="010-1234-5678"
              inputMode="tel"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor={`${calculatorType}-lead-message`}>
            추가 문의 (선택)
          </label>
          <textarea
            id={`${calculatorType}-lead-message`}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="상담 희망 시간 또는 문의 내용을 남겨주세요."
          />
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">
              개인정보 수집·이용 동의 요약 보기
            </summary>
            <div className="mt-2 space-y-1 leading-relaxed">
              <p>
                <span className="font-medium text-foreground">목적:</span>{" "}
                {CONSULTATION_COLLECTION_CONSENT.purpose.join(", ")}
              </p>
              <p>
                <span className="font-medium text-foreground">항목:</span>{" "}
                {CONSULTATION_COLLECTION_CONSENT.items.join(" / ")}
              </p>
              <p>
                <span className="font-medium text-foreground">보유기간:</span>{" "}
                {CONSULTATION_COLLECTION_CONSENT.retention}
              </p>
              <p>
                <span className="font-medium text-foreground">거부권:</span>{" "}
                {CONSULTATION_COLLECTION_CONSENT.refusal}
              </p>
            </div>
          </details>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">
              개인정보 제3자 제공 동의 요약 보기
            </summary>
            <div className="mt-2 space-y-2 leading-relaxed">
              {CONSULTATION_THIRD_PARTY_CONSENT.recipients.map((recipient) => (
                <div key={recipient.name} className="rounded-md border border-border bg-background px-2 py-1">
                  <p className="font-medium text-foreground">{recipient.name}</p>
                  <p>제공 목적: {recipient.purpose}</p>
                  <p>제공 항목: {recipient.items}</p>
                  <p>보유기간: {recipient.retention}</p>
                </div>
              ))}
              <p>
                <span className="font-medium text-foreground">거부권:</span>{" "}
                {CONSULTATION_THIRD_PARTY_CONSENT.refusal}
              </p>
            </div>
          </details>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">
              마케팅 정보 수신 동의 요약 보기
            </summary>
            <div className="mt-2 space-y-1 leading-relaxed">
              <p>
                <span className="font-medium text-foreground">목적:</span>{" "}
                {CONSULTATION_MARKETING_CONSENT.purpose.join(", ")}
              </p>
              <p>
                <span className="font-medium text-foreground">채널:</span>{" "}
                {CONSULTATION_MARKETING_CONSENT.channels.join(", ")}
              </p>
              <p>
                <span className="font-medium text-foreground">보유기간:</span>{" "}
                {CONSULTATION_MARKETING_CONSENT.retention}
              </p>
              <p>
                <span className="font-medium text-foreground">거부/철회:</span>{" "}
                {CONSULTATION_MARKETING_CONSENT.refusal}
              </p>
            </div>
          </details>
          <p className="text-xs text-muted-foreground">
            동의 전문:{" "}
            <Link
              href="/legal/consultation-consent"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              상담 신청 동의서 전체 보기
            </Link>
          </p>
        </div>

        <div className="space-y-1 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={consentPrivacy}
              onChange={(event) => setConsentPrivacy(event.target.checked)}
            />
            <span>[필수] 개인정보 수집 및 이용 동의</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={consentThirdParty}
              onChange={(event) => setConsentThirdParty(event.target.checked)}
            />
            <span>[필수] 개인정보 제3자 제공 동의</span>
          </label>
          <label className="inline-flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={consentMarketing}
              onChange={(event) => setConsentMarketing(event.target.checked)}
            />
            <span>[선택] 마케팅 정보 수신 동의</span>
          </label>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="inline-flex h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "신청 중..." : "상담 신청하기"}
        </button>
      </form>
    </section>
  );
}
