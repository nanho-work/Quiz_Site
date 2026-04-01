export const CONSULTATION_CONSENT_VERSION = "koofy-v2-2026-04-01";
export const CONSULTATION_CONSENT_EFFECTIVE_DATE = "2026-04-01";

export const CONSULTATION_COLLECTION_CONSENT = {
  purpose: [
    "세무 상담 신청 접수 및 본인 확인",
    "상담 일정 조율 및 유선/문자 연락",
    "계산기 입력값·결과값 기반 맞춤 상담 제공",
    "민원 처리, 분쟁 대응, 서비스 품질 개선",
  ],
  items: [
    "필수: 이름, 연락처, 동의 이력(동의 항목, 동의 시각, 버전)",
    "선택: 추가 문의 내용, 계산기 입력값 및 계산 결과, UTM 유입정보",
  ],
  retention:
    "상담 신청일로부터 3년 보관 후 지체 없이 파기합니다. 단, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.",
  refusal:
    "귀하는 동의를 거부할 권리가 있습니다. 다만 필수 항목 동의를 거부하면 상담 신청 및 전문가 연결 서비스 이용이 제한됩니다.",
};

export const CONSULTATION_THIRD_PARTY_CONSENT = {
  recipients: [
    {
      name: "KevinTax 상담 운영팀",
      purpose: "상담 접수, 배정, 유선 상담 진행",
      items: "이름, 연락처, 계산기 입력값/결과, 문의 내용",
      retention:
        "상담 신청일로부터 3년 또는 관련 법령상 보존기간 종료 시점까지",
    },
    {
      name: "제휴 세무사/세무법인(상담 배정 대상)",
      purpose: "세무 상담 및 신고 대행 안내",
      items: "이름, 연락처, 계산기 입력값/결과, 문의 내용",
      retention:
        "상담 종료일로부터 1년 또는 관련 법령상 보존기간 종료 시점까지",
    },
  ],
  refusal:
    "귀하는 제3자 제공 동의를 거부할 권리가 있습니다. 다만 동의를 거부하면 전문가 연결 상담 진행이 제한됩니다.",
};

export const CONSULTATION_MARKETING_CONSENT = {
  purpose: ["세무 서비스 안내", "이벤트/프로모션 정보 제공", "신규 계산기 및 콘텐츠 안내"],
  channels: ["전화", "문자(SMS/LMS)", "이메일(제공 시)"],
  items: ["이름, 연락처, (제공 시) 이메일"],
  retention:
    "동의일로부터 2년 또는 동의 철회 시까지 보관·이용합니다. 단, 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.",
  refusal:
    "마케팅 동의는 선택사항이며, 동의하지 않아도 상담 신청 및 기본 서비스 이용에는 영향이 없습니다.",
  withdrawal:
    "수신 거부 또는 동의 철회는 상담 연락처를 통해 언제든지 요청할 수 있습니다.",
};

