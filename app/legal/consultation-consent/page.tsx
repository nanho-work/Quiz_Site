import type { Metadata } from "next";
import Link from "next/link";
import {
  CONSULTATION_COLLECTION_CONSENT,
  CONSULTATION_CONSENT_EFFECTIVE_DATE,
  CONSULTATION_CONSENT_VERSION,
  CONSULTATION_MARKETING_CONSENT,
  CONSULTATION_THIRD_PARTY_CONSENT,
} from "../../../lib/legal/consultationConsent";

export const metadata: Metadata = {
  title: "상담 신청 동의서 | Koofy",
  description:
    "Koofy 상담 신청 시 필요한 개인정보 수집·이용 동의, 제3자 제공 동의, 마케팅 정보 수신 동의 내용을 확인할 수 있습니다.",
  alternates: {
    canonical: "/legal/consultation-consent",
  },
};

export default function ConsultationConsentPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">상담 신청 동의서</h1>
        <p className="text-sm text-muted-foreground">
          시행일: {CONSULTATION_CONSENT_EFFECTIVE_DATE} | 동의 버전:{" "}
          {CONSULTATION_CONSENT_VERSION}
        </p>
      </header>

      <section className="panel-card space-y-3" id="collection">
        <h2 className="text-lg font-semibold">1. 개인정보 수집 및 이용 동의 (필수)</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">수집·이용 목적</p>
          <ul className="list-disc pl-5 space-y-1">
            {CONSULTATION_COLLECTION_CONSENT.purpose.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground pt-1">수집 항목</p>
          <ul className="list-disc pl-5 space-y-1">
            {CONSULTATION_COLLECTION_CONSENT.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground pt-1">보유·이용 기간</p>
          <p>{CONSULTATION_COLLECTION_CONSENT.retention}</p>
          <p className="font-medium text-foreground pt-1">동의 거부 권리 및 불이익</p>
          <p>{CONSULTATION_COLLECTION_CONSENT.refusal}</p>
        </div>
      </section>

      <section className="panel-card space-y-3" id="third-party">
        <h2 className="text-lg font-semibold">2. 개인정보 제3자 제공 동의 (필수)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="text-left px-3 py-2 border-b border-border">제공받는 자</th>
                <th className="text-left px-3 py-2 border-b border-border">제공 목적</th>
                <th className="text-left px-3 py-2 border-b border-border">제공 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">보유·이용 기간</th>
              </tr>
            </thead>
            <tbody>
              {CONSULTATION_THIRD_PARTY_CONSENT.recipients.map((recipient) => (
                <tr key={recipient.name} className="align-top">
                  <td className="px-3 py-2 border-b border-border">{recipient.name}</td>
                  <td className="px-3 py-2 border-b border-border">{recipient.purpose}</td>
                  <td className="px-3 py-2 border-b border-border">{recipient.items}</td>
                  <td className="px-3 py-2 border-b border-border">{recipient.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">동의 거부 권리 및 불이익:</span>{" "}
          {CONSULTATION_THIRD_PARTY_CONSENT.refusal}
        </p>
      </section>

      <section className="panel-card space-y-3" id="marketing">
        <h2 className="text-lg font-semibold">3. 마케팅 정보 수신 동의 (선택)</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">이용 목적</p>
          <ul className="list-disc pl-5 space-y-1">
            {CONSULTATION_MARKETING_CONSENT.purpose.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground pt-1">수신 채널</p>
          <ul className="list-disc pl-5 space-y-1">
            {CONSULTATION_MARKETING_CONSENT.channels.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground pt-1">이용 항목</p>
          <ul className="list-disc pl-5 space-y-1">
            {CONSULTATION_MARKETING_CONSENT.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground pt-1">보유·이용 기간</p>
          <p>{CONSULTATION_MARKETING_CONSENT.retention}</p>
          <p className="font-medium text-foreground pt-1">동의 거부 및 철회</p>
          <p>{CONSULTATION_MARKETING_CONSENT.refusal}</p>
          <p>{CONSULTATION_MARKETING_CONSENT.withdrawal}</p>
        </div>
      </section>

      <section className="text-xs text-muted-foreground">
        <p>
          관련 정책은{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            개인정보처리방침
          </Link>
          에서 확인할 수 있습니다.
        </p>
      </section>
    </section>
  );
}

