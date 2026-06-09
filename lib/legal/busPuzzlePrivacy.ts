export type BusPuzzlePrivacyLanguageCode = "ko" | "en";

type PrivacySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PrivacyContent = {
  languageCode: BusPuzzlePrivacyLanguageCode;
  title: string;
  updatedLabel: string;
  updatedAt: string;
  intro: string;
  sections: PrivacySection[];
  contactLabel: string;
  contactEmail: string;
};

export const defaultBusPuzzlePrivacyLanguage: BusPuzzlePrivacyLanguageCode = "ko";

export const busPuzzlePrivacyLanguages: Array<{
  code: BusPuzzlePrivacyLanguageCode;
  label: string;
}> = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
];

export const busPuzzlePrivacyContent: Record<BusPuzzlePrivacyLanguageCode, PrivacyContent> = {
  ko: {
    languageCode: "ko",
    title: "Bus Puzzle 개인정보 처리방침",
    updatedLabel: "최종 업데이트",
    updatedAt: "2026-06-09",
    intro:
      "Koofy Lab은 Bus Puzzle 모바일 게임을 제공하며, 이용자의 개인정보를 중요하게 생각합니다. 본 문서는 Bus Puzzle 앱의 데이터 처리 방식과 광고 SDK 사용에 대해 설명합니다.",
    contactLabel: "개인정보 및 피드백 문의",
    contactEmail: "koofylab@gmail.com",
    sections: [
      {
        heading: "1. 앱에서 직접 수집하는 정보",
        paragraphs: [
          "Bus Puzzle은 회원가입, 로그인, 자체 서버 저장 기능을 제공하지 않습니다.",
          "게임 진행 상태, 골드, 언어, 사운드, 진동 설정 등은 이용자의 기기 로컬 저장소에 저장될 수 있습니다.",
        ],
        bullets: [
          "로컬 저장 데이터는 앱 기능 제공과 이용자 설정 유지에 사용됩니다.",
          "로컬 저장 데이터는 앱 삭제 또는 기기 설정 초기화 시 삭제될 수 있습니다.",
        ],
      },
      {
        heading: "2. 광고 및 제3자 SDK",
        paragraphs: [
          "Bus Puzzle은 보상형 광고 제공을 위해 Google AdMob 및 Google Mobile Ads SDK를 사용할 수 있습니다.",
          "광고 SDK는 광고 제공, 광고 성과 측정, 부정 이용 방지, 서비스 보안을 위해 광고 ID, IP 주소, 기기 정보, 앱 상호작용 정보, 진단 정보 등을 처리할 수 있습니다.",
          "유럽 경제 지역, 영국, 스위스 등 일부 지역에서는 Google User Messaging Platform을 통해 광고 관련 동의 화면이 표시될 수 있습니다.",
        ],
      },
      {
        heading: "3. 피드백 메일",
        paragraphs: [
          "이용자가 앱 내 피드백 기능을 통해 이메일을 보내는 경우, 이메일 주소와 문의 내용은 문의 응대와 서비스 개선 목적으로 사용됩니다.",
          "피드백 메일은 문의 처리에 필요한 기간 동안 보관될 수 있으며, 이용자는 삭제를 요청할 수 있습니다.",
        ],
      },
      {
        heading: "4. 개인정보의 이용 목적",
        bullets: [
          "앱 기능 제공 및 게임 진행 상태 유지",
          "사운드, 진동, 언어 등 이용자 설정 유지",
          "보상형 광고 제공 및 광고 보상 처리",
          "부정 이용 방지 및 앱 안정성 개선",
          "이용자 문의 응대",
        ],
      },
      {
        heading: "5. 개인정보의 보유 기간",
        paragraphs: [
          "앱이 로컬에 저장하는 데이터는 이용자의 기기에 보관되며, 앱 삭제 또는 기기 설정 초기화 시 삭제될 수 있습니다.",
          "피드백 메일로 전달된 정보는 문의 응대 목적 달성 후 합리적인 기간 내 삭제됩니다. 단, 관련 법령상 보관 의무가 있는 경우 해당 기간 동안 보관될 수 있습니다.",
          "Google AdMob 등 제3자 SDK가 처리하는 정보의 보유 기간은 해당 제공자의 정책을 따릅니다.",
        ],
      },
      {
        heading: "6. 제3자 제공",
        paragraphs: [
          "Koofy Lab은 이용자의 개인정보를 판매하지 않습니다.",
          "광고 제공 및 성과 측정을 위해 Google 등 제3자 서비스 제공자가 데이터를 처리할 수 있으며, 이 경우 해당 제공자의 개인정보 처리방침이 적용됩니다.",
        ],
      },
      {
        heading: "7. 아동의 개인정보",
        paragraphs: [
          "Bus Puzzle은 만 14세 미만 아동 또는 적용 법령상 보호 대상 아동으로부터 고의로 개인정보를 수집하지 않습니다.",
          "아동의 개인정보가 피드백 메일 등을 통해 전달된 사실을 알게 된 경우, 합리적인 절차에 따라 삭제 조치를 취합니다.",
        ],
      },
      {
        heading: "8. 이용자의 권리",
        paragraphs: [
          "이용자는 개인정보 열람, 정정, 삭제, 처리 정지 등을 요청할 수 있습니다.",
          "로컬 저장 데이터는 앱 삭제 또는 기기 설정을 통해 직접 삭제할 수 있으며, 피드백 메일 관련 요청은 아래 이메일로 접수할 수 있습니다.",
        ],
      },
      {
        heading: "9. 정책 변경",
        paragraphs: [
          "본 개인정보 처리방침은 앱 기능, 광고 SDK, 관련 법령 또는 스토어 정책 변경에 따라 개정될 수 있습니다.",
          "중요한 변경이 있을 경우 본 페이지 또는 앱 내 적절한 방법을 통해 고지할 수 있습니다.",
        ],
      },
    ],
  },
  en: {
    languageCode: "en",
    title: "Bus Puzzle Privacy Policy",
    updatedLabel: "Last updated",
    updatedAt: "2026-06-09",
    intro:
      "Koofy Lab provides the Bus Puzzle mobile game and respects user privacy. This policy explains how the Bus Puzzle app handles data and uses advertising SDKs.",
    contactLabel: "Privacy and feedback contact",
    contactEmail: "koofylab@gmail.com",
    sections: [
      {
        heading: "1. Information Collected Directly by the App",
        paragraphs: [
          "Bus Puzzle does not provide account registration, login, or its own server-side gameplay storage.",
          "Game progress, gold balance, language, sound, and vibration settings may be stored locally on the user's device.",
        ],
        bullets: [
          "Local data is used to provide app features and preserve user preferences.",
          "Local data may be deleted when the app is uninstalled or device settings are reset.",
        ],
      },
      {
        heading: "2. Advertising and Third-Party SDKs",
        paragraphs: [
          "Bus Puzzle may use Google AdMob and the Google Mobile Ads SDK to provide rewarded advertisements.",
          "The advertising SDK may process data such as advertising identifiers, IP address, device information, app interaction information, and diagnostic information for ad delivery, measurement, fraud prevention, and security.",
          "In certain regions, including the European Economic Area, the United Kingdom, and Switzerland, a consent screen may be shown through Google's User Messaging Platform.",
        ],
      },
      {
        heading: "3. Feedback Email",
        paragraphs: [
          "If a user sends an email through the in-app feedback feature, the email address and message content are used to respond to the inquiry and improve the service.",
          "Feedback emails may be retained for as long as reasonably necessary to handle the inquiry, and users may request deletion.",
        ],
      },
      {
        heading: "4. Purposes of Use",
        bullets: [
          "Providing app features and preserving game progress",
          "Maintaining user preferences such as sound, vibration, and language",
          "Providing rewarded advertisements and processing ad rewards",
          "Preventing abuse and improving app stability",
          "Responding to user inquiries",
        ],
      },
      {
        heading: "5. Retention",
        paragraphs: [
          "Data stored locally by the app remains on the user's device and may be deleted when the app is uninstalled or device settings are reset.",
          "Information sent by feedback email is deleted within a reasonable period after the inquiry is handled, unless retention is required by applicable law.",
          "Data processed by third-party SDKs such as Google AdMob is retained according to the relevant provider's policies.",
        ],
      },
      {
        heading: "6. Sharing with Third Parties",
        paragraphs: [
          "Koofy Lab does not sell users' personal information.",
          "Third-party service providers such as Google may process data for ad delivery and measurement, and their own privacy policies apply to such processing.",
        ],
      },
      {
        heading: "7. Children's Privacy",
        paragraphs: [
          "Bus Puzzle does not knowingly collect personal information from children under 14 or the age defined by applicable law.",
          "If we become aware that a child's personal information has been sent to us, for example through feedback email, we will take reasonable steps to delete it.",
        ],
      },
      {
        heading: "8. User Rights",
        paragraphs: [
          "Users may request access, correction, deletion, or restriction of processing where applicable.",
          "Local app data can be removed by deleting the app or clearing device settings. Requests related to feedback emails can be sent to the contact email below.",
        ],
      },
      {
        heading: "9. Changes to This Policy",
        paragraphs: [
          "This policy may be updated when app features, advertising SDKs, applicable laws, or store policies change.",
          "Important changes may be announced on this page or through an appropriate in-app method.",
        ],
      },
    ],
  },
};

export function getBusPuzzlePrivacyContent(language?: string | string[]) {
  const requestedLanguage = Array.isArray(language) ? language[0] : language;
  const normalizedLanguage =
    requestedLanguage === "en" || requestedLanguage === "ko"
      ? requestedLanguage
      : defaultBusPuzzlePrivacyLanguage;

  return busPuzzlePrivacyContent[normalizedLanguage];
}
