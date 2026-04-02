export type MarketingCalculatorType =
  | "salary"
  | "minimum_wage"
  | "income_tax"
  | "refund_33"
  | "none";

export type CreateConsultationLeadPayload = {
  name: string;
  phone: string;
  calculatorType: MarketingCalculatorType;
  calculationInput?: Record<string, unknown> | null;
  calculationResult?: Record<string, unknown> | null;
  message?: string;
  sourcePage?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  consentPrivacy: boolean;
  consentThirdParty: boolean;
  consentMarketing: boolean;
  consentVersion: string;
};

const FIXED_CLIENT_ID = 2;

type ConsultationLeadResponse = {
  id: number;
  name: string;
  phone: string;
  status: string;
};

export async function createConsultationLead(
  payload: CreateConsultationLeadPayload
): Promise<ConsultationLeadResponse> {
  const response = await fetch("/api/consultation-leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      calculator_type: payload.calculatorType,
      calculation_input: payload.calculationInput ?? null,
      calculation_result: payload.calculationResult ?? null,
      message: payload.message ?? "",
      source_page: payload.sourcePage ?? "",
      utm_source: payload.utmSource ?? null,
      utm_medium: payload.utmMedium ?? null,
      utm_campaign: payload.utmCampaign ?? null,
      consent_privacy: payload.consentPrivacy,
      consent_third_party: payload.consentThirdParty,
      consent_marketing: payload.consentMarketing,
      consent_version: payload.consentVersion,
      client_id: FIXED_CLIENT_ID,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "상담 신청에 실패했습니다.");
  }

  return response.json();
}
