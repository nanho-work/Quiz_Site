export type SlimeStrikeForceLegalLanguageCode = "ko" | "en" | "ja" | "zh";

type LegalLink = {
  label: string;
  href: string;
};

type LegalSection = {
  id?: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: LegalLink[];
};

type LegalDocument = {
  title: string;
  updatedLabel: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
  contactLabel: string;
  contactEmail: string;
};

type SlimeStrikeForceLegalContent = {
  languageCode: SlimeStrikeForceLegalLanguageCode;
  productName: string;
  privacyTab: string;
  termsTab: string;
  privacy: LegalDocument;
  terms: LegalDocument;
};

export const slimeStrikeForceLegalLanguages: Array<{
  code: SlimeStrikeForceLegalLanguageCode;
  label: string;
}> = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
];

const updatedAt = "2026-08-27";
const contactEmail = "koofylab@gmail.com";

export const slimeStrikeForceLegalContent: Record<
  SlimeStrikeForceLegalLanguageCode,
  SlimeStrikeForceLegalContent
> = {
  ko: {
    languageCode: "ko",
    productName: "슬라임특공대",
    privacyTab: "개인정보 처리방침",
    termsTab: "이용약관",
    privacy: {
      title: "슬라임특공대 개인정보 처리방침",
      updatedLabel: "시행 및 최종 업데이트",
      updatedAt,
      intro:
        "Koofy Lab은 모바일 게임 슬라임특공대(Slime Strike Force, 패키지명 com.koofylab.slimestrikeforce)를 제공하며 이용자의 개인정보를 중요하게 생각합니다. 본 방침은 앱에서 처리될 수 있는 정보와 그 목적, 보관 및 이용자의 권리를 설명합니다.",
      contactLabel: "개인정보 문의",
      contactEmail,
      sections: [
        {
          heading: "1. 적용 범위 및 이용 연령",
          paragraphs: [
            "본 방침은 Koofy Lab이 제공하는 슬라임특공대 Android 앱에 적용됩니다.",
            "슬라임특공대는 만 13세 이상 이용자를 대상으로 합니다. 만 13세 미만인 경우 앱을 이용하지 않아야 하며, 지역 법령상 미성년자에게 보호자 동의가 필요한 경우 해당 동의를 받아야 합니다.",
          ],
        },
        {
          heading: "2. 기기에 저장되는 게임 정보",
          paragraphs: [
            "현재 슬라임특공대는 회원가입 또는 로그인 기능을 제공하지 않습니다. 다음 정보는 게임 기능 제공을 위해 이용자의 기기 로컬 저장소에 저장될 수 있습니다.",
          ],
          bullets: [
            "튜토리얼 진행 및 완료 여부",
            "스테이지 진행, 난이도, 전투 기록 및 보상 수령 상태",
            "캐릭터·스킬의 해금, 장착, 레벨, 강화 및 선택 옵션",
            "에너지, 골드, 잼, 조각, 열쇠, 광고 스킵권 등 게임 내 재화와 아이템",
            "일일·월간 퀘스트와 출석 보상 진행 상태",
            "언어, 사운드, 진동 등 앱 설정과 광고 동의 선택 상태",
          ],
        },
        {
          heading: "3. 광고 서비스에서 처리할 수 있는 정보",
          paragraphs: [
            "앱은 선택형 보상 광고 제공을 위해 Unity LevelPlay와 Unity Ads를 사용합니다. 광고 서비스 제공자는 광고 제공, 보상 확인, 빈도 관리, 성과 측정, 부정 이용 방지 및 보안을 위해 다음 정보를 처리할 수 있습니다.",
          ],
          bullets: [
            "광고 식별자 등 기기 식별 정보",
            "IP 주소, 기기 모델, 운영체제, 언어, 국가 또는 대략적 위치",
            "앱 버전, 광고 요청·노출·클릭·완료 및 보상 이벤트",
            "오류, 충돌, 네트워크 상태와 같은 진단 정보",
            "개인 맞춤형 광고 동의, 거부 또는 연령 제한 신호",
          ],
        },
        {
          heading: "4. 원격 리소스 제공",
          paragraphs: [
            "앱은 Unity Addressables와 Unity Cloud Content Delivery(CCD)를 통해 이미지, 사운드 등 일부 게임 리소스를 내려받을 수 있습니다.",
            "이 과정에서 Unity는 콘텐츠 전송, 보안, 장애 진단 및 서비스 운영을 위해 IP 주소, 요청 시각, 앱·기기·네트워크 정보와 다운로드 기록을 처리할 수 있습니다.",
          ],
        },
        {
          heading: "5. 이용자가 직접 제공하는 정보",
          paragraphs: [
            "이용자가 이메일로 문의하는 경우 이메일 주소, 문의 내용 및 이용자가 첨부한 정보가 문의 응대, 오류 확인 및 서비스 개선을 위해 처리될 수 있습니다.",
          ],
        },
        {
          heading: "6. 정보 처리 목적",
          bullets: [
            "게임 진행 저장과 앱 기능 제공",
            "보상형 광고 제공 및 광고 보상 확인",
            "원격 게임 리소스 다운로드와 업데이트",
            "부정 이용 방지, 보안, 오류 해결 및 서비스 안정성 개선",
            "이용자 문의 처리와 법적 의무 준수",
          ],
        },
        {
          heading: "7. 제3자 처리 및 국외 이전",
          paragraphs: [
            "Koofy Lab은 개인정보를 판매하지 않습니다. 앱 운영에 필요한 범위에서 Unity Technologies 및 그 광고·인프라 파트너가 정보를 처리할 수 있습니다.",
            "Unity LevelPlay, Unity Ads 및 CCD 이용 과정에서 정보가 네트워크를 통해 미국을 포함한 Unity 또는 파트너의 서버 운영 국가로 전송·처리될 수 있습니다. 처리 항목, 목적과 기간은 본 방침 및 해당 제공자의 정책과 법령에 따릅니다.",
          ],
          links: [
            {
              label: "Unity 개인정보 처리방침",
              href: "https://unity.com/legal/privacy-policy",
            },
            {
              label: "Unity LevelPlay 법률 자료",
              href: "https://docs.unity.com/grow/levelplay/platform/legal-resources",
            },
          ],
        },
        {
          heading: "8. 보유 및 삭제",
          paragraphs: [
            "로컬 게임 데이터는 이용자의 기기에 보관되며 앱 데이터 삭제, 앱 제거 또는 기기 초기화 시 삭제될 수 있습니다. 앱 삭제 전에는 복구하거나 다른 기기로 이전하지 못할 수 있습니다.",
            "문의 이메일은 문의 처리와 분쟁 대응에 필요한 합리적인 기간 동안 보관한 후 삭제합니다. 법령상 보관 의무가 있는 경우에는 해당 기간 동안 보관할 수 있습니다.",
            "제3자 서비스가 처리하는 정보의 보유 기간과 삭제 절차는 각 제공자의 정책을 따릅니다.",
          ],
        },
        {
          id: "user-rights",
          heading: "9. 이용자의 권리 및 동의 변경",
          paragraphs: [
            "이용자는 적용 법령에 따라 개인정보의 열람, 정정, 삭제, 처리 제한 또는 동의 철회를 요청할 수 있습니다.",
            "로컬 게임 데이터는 기기의 앱 데이터 삭제 기능으로 직접 제거할 수 있습니다. 광고 동의 설정은 앱에서 제공되는 개인정보 또는 광고 설정 화면을 통해 변경할 수 있으며, 관련 요청은 아래 이메일로 접수할 수 있습니다.",
          ],
        },
        {
          heading: "10. 아동 및 미성년자 보호",
          paragraphs: [
            "Koofy Lab은 만 13세 미만 이용자로부터 고의로 개인정보를 수집하지 않습니다. 만 13세 미만 이용자의 정보가 처리된 사실을 알게 되면 확인 후 합리적인 절차에 따라 삭제합니다.",
            "만 13세 이상이더라도 지역 법령에서 아동 또는 미성년자로 분류되는 경우, 연령 제한 광고와 보호자 동의 등 해당 지역의 요구사항을 적용할 수 있습니다.",
          ],
        },
        {
          heading: "11. 정보 보호",
          paragraphs: [
            "Koofy Lab은 처리되는 정보를 분실, 오용, 무단 접근 또는 변경으로부터 보호하기 위해 합리적인 기술적·관리적 조치를 적용합니다. 다만 인터넷 또는 전자 저장 방식의 완전한 보안을 보장할 수는 없습니다.",
          ],
        },
        {
          heading: "12. 방침 변경 및 문의",
          paragraphs: [
            "앱 기능, 사용 SDK, 법령 또는 스토어 정책이 변경되면 본 방침을 개정할 수 있습니다. 중요한 변경은 본 페이지 또는 앱 내 적절한 방법으로 안내합니다.",
            "개인정보 관련 문의와 권리 행사는 아래 이메일로 보내주세요.",
          ],
        },
      ],
    },
    terms: {
      title: "슬라임특공대 이용약관",
      updatedLabel: "시행 및 최종 업데이트",
      updatedAt,
      intro:
        "본 약관은 Koofy Lab이 제공하는 모바일 게임 슬라임특공대의 이용 조건과 이용자 및 Koofy Lab의 권리·의무를 정합니다. 앱을 이용하기 전에 내용을 확인해 주세요.",
      contactLabel: "서비스 문의",
      contactEmail,
      sections: [
        {
          heading: "1. 약관의 적용과 동의",
          paragraphs: [
            "본 약관은 슬라임특공대 앱, 게임 콘텐츠, 보상형 광고 및 이에 부수되는 서비스에 적용됩니다.",
            "이용자는 앱에서 약관에 동의하고 서비스를 이용함으로써 본 약관의 적용을 받습니다. 동의하지 않는 경우 서비스를 이용하지 않아야 합니다.",
          ],
        },
        {
          heading: "2. 이용 자격",
          paragraphs: [
            "서비스는 만 13세 이상 이용자를 대상으로 합니다. 지역 법령상 미성년자가 서비스 이용에 보호자 동의를 받아야 하는 경우 이용자는 필요한 동의를 받아야 합니다.",
          ],
        },
        {
          heading: "3. 서비스 내용",
          paragraphs: [
            "Koofy Lab은 스테이지 전투, 캐릭터와 스킬 성장, 퀘스트, 출석 보상, 게임 내 재화 및 선택형 보상 광고 등의 기능을 제공할 수 있습니다.",
            "서비스의 세부 내용, 난이도, 보상, 밸런스, 이용 가능 기능은 운영 및 기술상 필요에 따라 변경될 수 있습니다.",
          ],
        },
        {
          heading: "4. 게임 데이터와 기기 변경",
          paragraphs: [
            "현재 게임 진행 정보는 주로 이용자의 기기에 저장되며 회원 계정 또는 클라우드 동기화를 제공하지 않습니다.",
            "앱 삭제, 앱 데이터 초기화, 기기 고장 또는 기기 변경 시 게임 기록과 재화가 삭제되거나 이전되지 않을 수 있습니다. Koofy Lab의 고의 또는 중대한 과실이 없는 한 로컬 데이터 손실을 복구하지 못할 수 있습니다.",
          ],
        },
        {
          heading: "5. 게임 내 재화와 아이템",
          paragraphs: [
            "골드, 잼, 조각, 열쇠, 광고 스킵권 등 게임 내 재화와 아이템은 게임 안에서만 사용할 수 있으며 현금, 예금 또는 전자화폐가 아닙니다.",
            "현재 앱은 현금 결제 기능을 제공하지 않습니다. 향후 인앱결제가 추가되는 경우 관련 조건과 환불 정책을 적용 전에 고지하고 본 약관을 개정합니다.",
          ],
        },
        {
          heading: "6. 보상형 광고",
          paragraphs: [
            "보상형 광고 시청은 이용자가 선택할 수 있습니다. 광고를 끝까지 시청하고 광고 제공자의 완료 확인이 정상적으로 전달된 경우에만 안내된 게임 보상이 지급될 수 있습니다.",
            "네트워크 장애, 광고 재고 부족, 앱 종료, 광고 제공자의 오류 또는 완료 조건 미충족으로 광고나 보상을 이용하지 못할 수 있습니다.",
          ],
        },
        {
          heading: "7. 금지 행위",
          bullets: [
            "앱, 저장 데이터, 광고 또는 통신을 변조하거나 비정상적인 보상을 얻는 행위",
            "버그, 자동화 도구, 비인가 프로그램 또는 취약점을 악용하는 행위",
            "서비스 운영을 방해하거나 다른 이용자·제3자의 권리를 침해하는 행위",
            "앱 또는 콘텐츠를 허가 없이 복제, 배포, 판매, 역설계하는 행위",
            "관련 법령과 스토어 정책을 위반하는 행위",
          ],
        },
        {
          heading: "8. 서비스 변경과 중단",
          paragraphs: [
            "Koofy Lab은 업데이트, 점검, 장애, 정책 변경 또는 운영상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 일시 중단할 수 있습니다.",
            "중요한 변경 또는 서비스 종료가 예정된 경우 합리적으로 가능한 범위에서 앱 또는 웹사이트를 통해 안내합니다.",
          ],
        },
        {
          heading: "9. 지식재산권",
          paragraphs: [
            "슬라임특공대의 프로그램, 캐릭터, 이미지, 사운드, 문구, UI 및 기타 콘텐츠에 관한 권리는 Koofy Lab 또는 정당한 권리자에게 있습니다. 본 약관은 이용자에게 개인적이고 비상업적인 이용 권한만 부여합니다.",
          ],
        },
        {
          heading: "10. 책임의 범위",
          paragraphs: [
            "Koofy Lab은 안정적인 서비스 제공을 위해 노력하지만 서비스가 항상 중단 없이 제공되거나 모든 오류가 즉시 수정된다고 보장하지 않습니다.",
            "관련 법령에서 허용되는 범위에서, 이용자의 기기 환경, 네트워크, 제3자 광고·플랫폼 서비스 또는 이용자의 귀책사유로 발생한 손해에 대해 Koofy Lab은 책임을 지지 않습니다. 소비자에게 보장되는 강행 법규상의 권리는 제한되지 않습니다.",
          ],
        },
        {
          heading: "11. 준거법과 분쟁",
          paragraphs: [
            "본 약관은 대한민국 법령을 따릅니다. 분쟁이 발생한 경우 당사자는 우선 성실하게 협의하며, 해결되지 않을 경우 관련 법령이 정한 관할 법원에서 처리합니다. 이용자 거주 지역의 강행적 소비자 보호 규정이 있는 경우 해당 규정이 우선할 수 있습니다.",
          ],
        },
        {
          heading: "12. 약관 변경 및 문의",
          paragraphs: [
            "서비스 또는 관련 법령이 변경되면 본 약관을 개정할 수 있습니다. 중요한 변경은 시행 전에 본 페이지 또는 앱 내 적절한 방법으로 안내합니다.",
            "서비스 관련 문의는 아래 이메일로 보내주세요.",
          ],
        },
      ],
    },
  },
  en: {
    languageCode: "en",
    productName: "Slime Strike Force",
    privacyTab: "Privacy Policy",
    termsTab: "Terms of Service",
    privacy: {
      title: "Slime Strike Force Privacy Policy",
      updatedLabel: "Effective and last updated",
      updatedAt,
      intro:
        "Koofy Lab provides the mobile game Slime Strike Force (package name: com.koofylab.slimestrikeforce) and values user privacy. This policy explains the information that may be processed by the app, why it is processed, how it is retained, and user rights.",
      contactLabel: "Privacy contact",
      contactEmail,
      sections: [
        {
          heading: "1. Scope and Age Requirement",
          paragraphs: [
            "This policy applies to the Slime Strike Force Android app provided by Koofy Lab.",
            "Slime Strike Force is intended for users aged 13 and older. Users under 13 must not use the app. Where local law requires parental or guardian consent for a minor, the user must obtain that consent.",
          ],
        },
        {
          heading: "2. Game Information Stored on the Device",
          paragraphs: [
            "Slime Strike Force currently does not provide account registration or login. The following information may be stored locally on the user's device to provide game features.",
          ],
          bullets: [
            "Tutorial progress and completion",
            "Stage progress, difficulty, battle records, and reward status",
            "Character and skill unlocks, equipment, levels, upgrades, and selected options",
            "Energy, gold, gems, fragments, keys, ad-skip tickets, and other in-game items",
            "Daily and monthly quest and attendance reward progress",
            "Language, sound, vibration, and advertising consent preferences",
          ],
        },
        {
          heading: "3. Information Processed by Advertising Services",
          paragraphs: [
            "The app uses Unity LevelPlay and Unity Ads to provide optional rewarded advertisements. Advertising providers may process the following information for ad delivery, reward verification, frequency management, measurement, fraud prevention, and security.",
          ],
          bullets: [
            "Device identifiers such as advertising identifiers",
            "IP address, device model, operating system, language, country, or approximate location",
            "App version and ad request, impression, click, completion, and reward events",
            "Diagnostic information such as errors, crashes, and network status",
            "Personalized advertising consent, opt-out, or age-restriction signals",
          ],
        },
        {
          heading: "4. Remote Content Delivery",
          paragraphs: [
            "The app may download certain game resources, such as images and audio, through Unity Addressables and Unity Cloud Content Delivery (CCD).",
            "During this process, Unity may process IP address, request time, app, device, network, and download information for delivery, security, diagnostics, and service operations.",
          ],
        },
        {
          heading: "5. Information You Provide",
          paragraphs: [
            "If you contact us by email, your email address, message, and any information you attach may be processed to respond, investigate errors, and improve the service.",
          ],
        },
        {
          heading: "6. Purposes of Processing",
          bullets: [
            "Saving progress and providing app features",
            "Providing rewarded ads and verifying rewards",
            "Downloading and updating remote game content",
            "Preventing abuse, maintaining security, resolving errors, and improving stability",
            "Responding to inquiries and meeting legal obligations",
          ],
        },
        {
          heading: "7. Service Providers and International Transfers",
          paragraphs: [
            "Koofy Lab does not sell personal information. Unity Technologies and its advertising or infrastructure partners may process information as necessary to operate the app.",
            "When LevelPlay, Unity Ads, or CCD is used, information may be transmitted over networks to and processed in the United States and other countries where Unity or its partners operate servers. Processing is governed by this policy, provider policies, and applicable law.",
          ],
          links: [
            { label: "Unity Privacy Policy", href: "https://unity.com/legal/privacy-policy" },
            {
              label: "Unity LevelPlay Legal Resources",
              href: "https://docs.unity.com/grow/levelplay/platform/legal-resources",
            },
          ],
        },
        {
          heading: "8. Retention and Deletion",
          paragraphs: [
            "Local game data remains on the user's device and may be deleted by clearing app data, uninstalling the app, or resetting the device. It may not be recoverable or transferable after deletion.",
            "Inquiry emails are retained for a reasonable period needed to handle the inquiry or disputes and are then deleted, unless retention is required by law.",
            "Information processed by third-party services is retained and deleted according to each provider's policy.",
          ],
        },
        {
          id: "user-rights",
          heading: "9. User Rights and Consent Changes",
          paragraphs: [
            "Where applicable, users may request access, correction, deletion, restriction of processing, or withdrawal of consent.",
            "Local game data can be removed through the device's app-data controls. Advertising choices can be changed through the privacy or advertising settings provided in the app. Requests may also be sent to the email below.",
          ],
        },
        {
          heading: "10. Children and Minors",
          paragraphs: [
            "Koofy Lab does not knowingly collect personal information from users under 13. If we learn that such information has been processed, we will take reasonable steps to verify and delete it.",
            "Users aged 13 or older may still be treated as children or minors under local law. Where required, age-restricted advertising, parental consent, or other local protections may apply.",
          ],
        },
        {
          heading: "11. Security",
          paragraphs: [
            "Koofy Lab applies reasonable technical and administrative safeguards against loss, misuse, unauthorized access, or alteration. No internet transmission or electronic storage method can be guaranteed to be completely secure.",
          ],
        },
        {
          heading: "12. Changes and Contact",
          paragraphs: [
            "We may update this policy when app features, SDKs, laws, or store policies change. Material changes will be announced on this page or through an appropriate in-app method.",
            "Send privacy questions or rights requests to the email below.",
          ],
        },
      ],
    },
    terms: {
      title: "Slime Strike Force Terms of Service",
      updatedLabel: "Effective and last updated",
      updatedAt,
      intro:
        "These Terms govern the use of the Slime Strike Force mobile game provided by Koofy Lab and describe the rights and responsibilities of users and Koofy Lab. Please review them before using the app.",
      contactLabel: "Service contact",
      contactEmail,
      sections: [
        {
          heading: "1. Application and Acceptance",
          paragraphs: [
            "These Terms apply to the Slime Strike Force app, game content, rewarded advertising, and related services.",
            "By accepting these Terms in the app and using the service, you agree to be bound by them. If you do not agree, do not use the service.",
          ],
        },
        {
          heading: "2. Eligibility",
          paragraphs: [
            "The service is intended for users aged 13 and older. Where local law requires a minor to obtain parental or guardian consent, the user must obtain the required consent.",
          ],
        },
        {
          heading: "3. Service Features",
          paragraphs: [
            "Koofy Lab may provide stage battles, character and skill progression, quests, attendance rewards, in-game resources, and optional rewarded advertising.",
            "Features, difficulty, rewards, balance, and availability may change for operational or technical reasons.",
          ],
        },
        {
          heading: "4. Game Data and Device Changes",
          paragraphs: [
            "Game progress is currently stored primarily on the user's device, without an account or cloud synchronization feature.",
            "Records and resources may be lost or may not transfer if the app is uninstalled, app data is cleared, the device fails, or the device is changed. Except in cases of intent or gross negligence by Koofy Lab, local data may not be recoverable.",
          ],
        },
        {
          heading: "5. In-Game Resources and Items",
          paragraphs: [
            "Gold, gems, fragments, keys, ad-skip tickets, and other game resources are usable only within the game and are not cash, deposits, or electronic money.",
            "The app currently does not offer purchases with real money. If in-app purchases are added later, the relevant terms and refund policy will be disclosed and these Terms will be updated before launch.",
          ],
        },
        {
          heading: "6. Rewarded Advertising",
          paragraphs: [
            "Watching rewarded advertisements is optional. A stated reward may be granted only when the advertisement is completed and the provider successfully reports completion.",
            "Advertisements or rewards may be unavailable because of network errors, lack of ad inventory, app termination, provider errors, or failure to meet completion requirements.",
          ],
        },
        {
          heading: "7. Prohibited Conduct",
          bullets: [
            "Modifying the app, save data, advertisements, or communications to obtain unauthorized rewards",
            "Exploiting bugs, automation tools, unauthorized programs, or vulnerabilities",
            "Disrupting the service or infringing the rights of other users or third parties",
            "Copying, distributing, selling, or reverse engineering the app or content without permission",
            "Violating applicable laws or store policies",
          ],
        },
        {
          heading: "8. Changes and Suspension",
          paragraphs: [
            "Koofy Lab may change or temporarily suspend all or part of the service for updates, maintenance, failures, policy changes, or operational needs.",
            "Where reasonably possible, material changes or planned termination will be announced through the app or website.",
          ],
        },
        {
          heading: "9. Intellectual Property",
          paragraphs: [
            "Rights in the software, characters, images, audio, text, UI, and other Slime Strike Force content belong to Koofy Lab or their lawful owners. These Terms grant only a personal, non-commercial right to use the service.",
          ],
        },
        {
          heading: "10. Limitation of Responsibility",
          paragraphs: [
            "Koofy Lab works to provide a stable service but does not guarantee uninterrupted availability or immediate correction of every error.",
            "To the extent permitted by law, Koofy Lab is not responsible for loss caused by the user's device, network, third-party advertising or platform services, or the user's own acts. Mandatory consumer rights are not limited.",
          ],
        },
        {
          heading: "11. Governing Law and Disputes",
          paragraphs: [
            "These Terms are governed by the laws of the Republic of Korea. The parties will first attempt to resolve disputes in good faith, and unresolved disputes will be handled by a court with jurisdiction under applicable law. Mandatory consumer law in the user's region may prevail.",
          ],
        },
        {
          heading: "12. Changes and Contact",
          paragraphs: [
            "We may update these Terms when the service or applicable laws change. Material changes will be announced on this page or through an appropriate in-app method before taking effect.",
            "Send service questions to the email below.",
          ],
        },
      ],
    },
  },
  ja: {
    languageCode: "ja",
    productName: "スライム特攻隊",
    privacyTab: "プライバシーポリシー",
    termsTab: "利用規約",
    privacy: {
      title: "スライム特攻隊 プライバシーポリシー",
      updatedLabel: "施行日・最終更新日",
      updatedAt,
      intro:
        "Koofy Labはモバイルゲーム「スライム特攻隊」（Slime Strike Force、パッケージ名：com.koofylab.slimestrikeforce）を提供し、ユーザーのプライバシーを重視しています。本ポリシーは、アプリで処理される可能性のある情報、その目的、保管方法およびユーザーの権利について説明します。",
      contactLabel: "プライバシーに関するお問い合わせ",
      contactEmail,
      sections: [
        {
          heading: "1. 適用範囲と年齢要件",
          paragraphs: [
            "本ポリシーは、Koofy Labが提供するスライム特攻隊Androidアプリに適用されます。",
            "本アプリは13歳以上のユーザーを対象としています。13歳未満の方は利用できません。地域の法令により未成年者に保護者の同意が必要な場合は、必要な同意を得てください。",
          ],
        },
        {
          heading: "2. 端末に保存されるゲーム情報",
          paragraphs: [
            "現在、本アプリには会員登録またはログイン機能がありません。ゲーム機能の提供のため、次の情報がユーザーの端末内に保存される場合があります。",
          ],
          bullets: [
            "チュートリアルの進行・完了状況",
            "ステージ進行、難易度、戦闘記録、報酬受領状況",
            "キャラクター・スキルの解放、装着、レベル、強化、選択オプション",
            "エネルギー、ゴールド、ジェム、欠片、鍵、広告スキップ券などのゲーム内アイテム",
            "デイリー・マンスリークエストおよびログイン報酬の進行状況",
            "言語、サウンド、振動、広告同意の設定",
          ],
        },
        {
          heading: "3. 広告サービスが処理する可能性のある情報",
          paragraphs: [
            "本アプリは任意のリワード広告を提供するためUnity LevelPlayおよびUnity Adsを利用します。広告配信、報酬確認、頻度管理、効果測定、不正防止およびセキュリティのため、次の情報が処理される場合があります。",
          ],
          bullets: [
            "広告識別子などの端末識別情報",
            "IPアドレス、端末モデル、OS、言語、国またはおおよその位置",
            "アプリバージョン、広告のリクエスト・表示・クリック・完了・報酬イベント",
            "エラー、クラッシュ、ネットワーク状態などの診断情報",
            "パーソナライズ広告への同意・拒否または年齢制限シグナル",
          ],
        },
        {
          heading: "4. リモートコンテンツ配信",
          paragraphs: [
            "本アプリはUnity AddressablesおよびUnity Cloud Content Delivery（CCD）を通じて画像や音声など一部のゲームリソースをダウンロードする場合があります。",
            "その際、Unityは配信、セキュリティ、障害診断およびサービス運営のため、IPアドレス、リクエスト時刻、アプリ・端末・ネットワーク情報、ダウンロード記録を処理する場合があります。",
          ],
        },
        {
          heading: "5. ユーザーが提供する情報",
          paragraphs: [
            "メールでお問い合わせいただいた場合、メールアドレス、問い合わせ内容および添付情報を、回答、エラー調査、サービス改善のために処理する場合があります。",
          ],
        },
        {
          heading: "6. 処理目的",
          bullets: [
            "ゲーム進行の保存とアプリ機能の提供",
            "リワード広告の提供と報酬確認",
            "リモートゲームリソースのダウンロードと更新",
            "不正防止、セキュリティ、エラー解決、安定性向上",
            "お問い合わせ対応と法的義務の履行",
          ],
        },
        {
          heading: "7. 第三者処理と国外移転",
          paragraphs: [
            "Koofy Labは個人情報を販売しません。アプリ運営に必要な範囲でUnity Technologiesおよびその広告・インフラパートナーが情報を処理する場合があります。",
            "LevelPlay、Unity Ads、CCDの利用により、情報がネットワークを通じて米国その他Unityまたはパートナーがサーバーを運営する国に送信・処理される場合があります。処理は本ポリシー、提供者のポリシーおよび適用法令に従います。",
          ],
          links: [
            { label: "Unityプライバシーポリシー", href: "https://unity.com/legal/privacy-policy" },
            {
              label: "Unity LevelPlay法務資料",
              href: "https://docs.unity.com/grow/levelplay/platform/legal-resources",
            },
          ],
        },
        {
          heading: "8. 保管と削除",
          paragraphs: [
            "ローカルゲームデータは端末に保管され、アプリデータの消去、アプリ削除または端末初期化により削除される場合があります。削除後の復旧や移行ができないことがあります。",
            "問い合わせメールは対応または紛争処理に必要な合理的期間保管した後に削除します。法令上の保存義務がある場合を除きます。",
            "第三者サービスが処理する情報の保管・削除は各提供者のポリシーに従います。",
          ],
        },
        {
          id: "user-rights",
          heading: "9. ユーザーの権利と同意変更",
          paragraphs: [
            "適用法令に従い、ユーザーは開示、訂正、削除、処理制限または同意撤回を求めることができます。",
            "ローカルデータは端末のアプリデータ機能から削除できます。広告設定はアプリ内のプライバシーまたは広告設定から変更でき、下記メールでもお問い合わせいただけます。",
          ],
        },
        {
          heading: "10. 子ども・未成年者",
          paragraphs: [
            "Koofy Labは13歳未満のユーザーから故意に個人情報を収集しません。そのような情報の処理を知った場合、合理的な確認後に削除します。",
            "13歳以上でも地域法により子どもまたは未成年者とされる場合、年齢制限広告、保護者同意その他の保護措置が適用されることがあります。",
          ],
        },
        {
          heading: "11. セキュリティ",
          paragraphs: [
            "Koofy Labは情報の紛失、悪用、不正アクセス、改変を防ぐため合理的な技術的・管理的措置を講じます。ただし、インターネット通信または電子保存の完全な安全性は保証できません。",
          ],
        },
        {
          heading: "12. 変更とお問い合わせ",
          paragraphs: [
            "アプリ機能、SDK、法令またはストアポリシーの変更に伴い本ポリシーを更新する場合があります。重要な変更は本ページまたはアプリ内で適切に案内します。",
            "プライバシーに関する質問・権利行使は下記メールまでご連絡ください。",
          ],
        },
      ],
    },
    terms: {
      title: "スライム特攻隊 利用規約",
      updatedLabel: "施行日・最終更新日",
      updatedAt,
      intro:
        "本規約は、Koofy Labが提供するモバイルゲーム「スライム特攻隊」の利用条件、およびユーザーとKoofy Labの権利・義務を定めます。アプリを利用する前にご確認ください。",
      contactLabel: "サービスに関するお問い合わせ",
      contactEmail,
      sections: [
        {
          heading: "1. 適用と同意",
          paragraphs: [
            "本規約はアプリ、ゲームコンテンツ、リワード広告および関連サービスに適用されます。",
            "アプリ内で本規約に同意してサービスを利用することにより、本規約が適用されます。同意しない場合は利用しないでください。",
          ],
        },
        {
          heading: "2. 利用資格",
          paragraphs: [
            "本サービスは13歳以上を対象とします。地域法により未成年者に保護者同意が必要な場合、必要な同意を得てください。",
          ],
        },
        {
          heading: "3. サービス内容",
          paragraphs: [
            "ステージ戦闘、キャラクター・スキル育成、クエスト、ログイン報酬、ゲーム内資源、任意のリワード広告などを提供する場合があります。",
            "機能、難易度、報酬、バランス、利用可否は運営・技術上の理由で変更されることがあります。",
          ],
        },
        {
          heading: "4. ゲームデータと端末変更",
          paragraphs: [
            "現在、ゲーム進行は主に端末内に保存され、アカウントやクラウド同期はありません。",
            "アプリ削除、データ消去、端末故障・変更により記録や資源が失われ、移行できない場合があります。Koofy Labの故意または重大な過失がない限り、ローカルデータを復旧できない場合があります。",
          ],
        },
        {
          heading: "5. ゲーム内資源とアイテム",
          paragraphs: [
            "ゴールド、ジェム、欠片、鍵、広告スキップ券などはゲーム内でのみ使用でき、現金、預金または電子マネーではありません。",
            "現在、現金による購入機能はありません。将来アプリ内購入を追加する場合、事前に関連条件と返金方針を示し、本規約を更新します。",
          ],
        },
        {
          heading: "6. リワード広告",
          paragraphs: [
            "リワード広告の視聴は任意です。広告を完了し、提供者から完了通知が正常に届いた場合に限り、案内された報酬が付与される場合があります。",
            "通信障害、広告在庫不足、アプリ終了、提供者エラー、完了条件未達により広告または報酬を利用できない場合があります。",
          ],
        },
        {
          heading: "7. 禁止行為",
          bullets: [
            "アプリ、保存データ、広告または通信を改変し不正な報酬を得る行為",
            "バグ、自動化ツール、無許可プログラム、脆弱性の悪用",
            "サービス運営の妨害または他者の権利侵害",
            "許可のない複製、配布、販売、リバースエンジニアリング",
            "法令またはストアポリシーへの違反",
          ],
        },
        {
          heading: "8. サービスの変更・中断",
          paragraphs: [
            "更新、保守、障害、ポリシー変更、運営上の必要によりサービスの全部または一部を変更・一時中断する場合があります。",
            "重要な変更または終了予定は、合理的に可能な範囲でアプリまたはウェブサイトから案内します。",
          ],
        },
        {
          heading: "9. 知的財産権",
          paragraphs: [
            "プログラム、キャラクター、画像、音声、文章、UIその他のコンテンツの権利はKoofy Labまたは正当な権利者に帰属します。本規約は個人的・非商用の利用権のみを付与します。",
          ],
        },
        {
          heading: "10. 責任の範囲",
          paragraphs: [
            "Koofy Labは安定した提供に努めますが、常時中断なく利用できること、またはすべての不具合が直ちに修正されることを保証しません。",
            "法令で認められる範囲で、端末、通信、第三者広告・プラットフォームまたはユーザーの行為による損害について責任を負いません。強行的な消費者の権利は制限されません。",
          ],
        },
        {
          heading: "11. 準拠法と紛争",
          paragraphs: [
            "本規約は大韓民国法に準拠します。紛争は誠実に協議し、解決しない場合は適用法令上の管轄裁判所で処理します。ユーザー地域の強行的な消費者保護法が優先される場合があります。",
          ],
        },
        {
          heading: "12. 変更とお問い合わせ",
          paragraphs: [
            "サービスまたは法令の変更により本規約を更新する場合があります。重要な変更は施行前に本ページまたはアプリ内で案内します。",
            "サービスに関する質問は下記メールまでご連絡ください。",
          ],
        },
      ],
    },
  },
  zh: {
    languageCode: "zh",
    productName: "史莱姆特攻队",
    privacyTab: "隐私政策",
    termsTab: "服务条款",
    privacy: {
      title: "史莱姆特攻队隐私政策",
      updatedLabel: "生效及最后更新日期",
      updatedAt,
      intro:
        "Koofy Lab 提供手机游戏《史莱姆特攻队》（Slime Strike Force，软件包名称：com.koofylab.slimestrikeforce），并重视用户隐私。本政策说明应用可能处理的信息、处理目的、保存方式及用户权利。",
      contactLabel: "隐私联系邮箱",
      contactEmail,
      sections: [
        {
          heading: "1. 适用范围与年龄要求",
          paragraphs: [
            "本政策适用于 Koofy Lab 提供的《史莱姆特攻队》Android 应用。",
            "本应用面向年满 13 周岁的用户。未满 13 周岁的用户不得使用。当地法律要求未成年人获得父母或监护人同意时，用户必须取得相应同意。",
          ],
        },
        {
          heading: "2. 保存在设备上的游戏信息",
          paragraphs: [
            "本应用目前不提供注册或登录功能。为提供游戏功能，以下信息可能保存在用户设备本地。",
          ],
          bullets: [
            "教程进度及完成状态",
            "关卡进度、难度、战斗记录及奖励领取状态",
            "角色和技能的解锁、装备、等级、强化及已选选项",
            "能量、金币、宝石、碎片、钥匙、广告跳过券等游戏内物品",
            "每日和每月任务及签到奖励进度",
            "语言、声音、振动及广告同意设置",
          ],
        },
        {
          heading: "3. 广告服务可能处理的信息",
          paragraphs: [
            "本应用使用 Unity LevelPlay 和 Unity Ads 提供可选的激励广告。广告提供商可能为广告投放、奖励验证、频次管理、效果衡量、防欺诈及安全处理以下信息。",
          ],
          bullets: [
            "广告标识符等设备识别信息",
            "IP 地址、设备型号、操作系统、语言、国家或大致位置",
            "应用版本及广告请求、展示、点击、完成和奖励事件",
            "错误、崩溃和网络状态等诊断信息",
            "个性化广告同意、拒绝或年龄限制信号",
          ],
        },
        {
          heading: "4. 远程内容分发",
          paragraphs: [
            "本应用可能通过 Unity Addressables 和 Unity Cloud Content Delivery（CCD）下载图片、音频等部分游戏资源。",
            "在此过程中，Unity 可能为内容分发、安全、故障诊断和服务运营处理 IP 地址、请求时间、应用、设备、网络和下载信息。",
          ],
        },
        {
          heading: "5. 用户主动提供的信息",
          paragraphs: [
            "用户通过电子邮件联系我们时，电子邮件地址、咨询内容及附件信息可能用于回复、排查错误和改进服务。",
          ],
        },
        {
          heading: "6. 信息处理目的",
          bullets: [
            "保存游戏进度并提供应用功能",
            "提供激励广告并验证奖励",
            "下载和更新远程游戏资源",
            "防止滥用、维护安全、解决错误并提高稳定性",
            "回复咨询并履行法律义务",
          ],
        },
        {
          heading: "7. 第三方处理与跨境传输",
          paragraphs: [
            "Koofy Lab 不出售个人信息。Unity Technologies 及其广告或基础设施合作伙伴可能在运营应用所需范围内处理信息。",
            "使用 LevelPlay、Unity Ads 或 CCD 时，信息可能经网络传输至美国及 Unity 或其合作伙伴运营服务器的其他国家并在那里处理。处理活动受本政策、提供商政策和适用法律约束。",
          ],
          links: [
            { label: "Unity 隐私政策", href: "https://unity.com/legal/privacy-policy" },
            {
              label: "Unity LevelPlay 法律资料",
              href: "https://docs.unity.com/grow/levelplay/platform/legal-resources",
            },
          ],
        },
        {
          heading: "8. 保存与删除",
          paragraphs: [
            "本地游戏数据保存在用户设备上，可通过清除应用数据、卸载应用或重置设备删除。删除后可能无法恢复或转移。",
            "咨询邮件将在处理咨询或争议所需的合理期限内保存，之后删除；法律要求保存的除外。",
            "第三方服务处理的信息按相应提供商的政策保存和删除。",
          ],
        },
        {
          id: "user-rights",
          heading: "9. 用户权利与同意变更",
          paragraphs: [
            "在适用法律规定的情况下，用户可以请求访问、更正、删除、限制处理或撤回同意。",
            "本地游戏数据可通过设备的应用数据设置删除。广告选择可通过应用提供的隐私或广告设置进行修改，也可通过下方邮箱提出请求。",
          ],
        },
        {
          heading: "10. 儿童与未成年人",
          paragraphs: [
            "Koofy Lab 不会故意收集未满 13 周岁用户的个人信息。如发现处理了此类信息，我们将在合理核实后予以删除。",
            "即使年满 13 周岁，用户仍可能根据当地法律被视为儿童或未成年人；必要时将适用年龄限制广告、监护人同意或其他当地保护措施。",
          ],
        },
        {
          heading: "11. 安全措施",
          paragraphs: [
            "Koofy Lab 采取合理的技术和管理措施，防止信息丢失、滥用、未经授权的访问或修改。但任何互联网传输或电子存储方式都无法保证绝对安全。",
          ],
        },
        {
          heading: "12. 政策变更与联系",
          paragraphs: [
            "应用功能、SDK、法律或应用商店政策变化时，我们可能更新本政策。重大变更会通过本页面或适当的应用内方式告知。",
            "隐私问题或权利请求请发送至下方邮箱。",
          ],
        },
      ],
    },
    terms: {
      title: "史莱姆特攻队服务条款",
      updatedLabel: "生效及最后更新日期",
      updatedAt,
      intro:
        "本条款规定 Koofy Lab 提供的手机游戏《史莱姆特攻队》的使用条件，以及用户与 Koofy Lab 的权利和义务。请在使用应用前阅读。",
      contactLabel: "服务联系邮箱",
      contactEmail,
      sections: [
        {
          heading: "1. 适用与同意",
          paragraphs: [
            "本条款适用于应用、游戏内容、激励广告及相关服务。",
            "用户在应用内同意本条款并使用服务，即表示接受本条款约束。不同意时请勿使用服务。",
          ],
        },
        {
          heading: "2. 使用资格",
          paragraphs: [
            "本服务面向年满 13 周岁的用户。当地法律要求未成年人获得父母或监护人同意时，用户必须取得所需同意。",
          ],
        },
        {
          heading: "3. 服务内容",
          paragraphs: [
            "Koofy Lab 可能提供关卡战斗、角色和技能成长、任务、签到奖励、游戏内资源及可选激励广告等功能。",
            "功能、难度、奖励、平衡性和可用性可能因运营或技术需要而变更。",
          ],
        },
        {
          heading: "4. 游戏数据与设备变更",
          paragraphs: [
            "游戏进度目前主要保存在用户设备上，不提供账号或云同步功能。",
            "卸载应用、清除数据、设备故障或更换设备时，记录和资源可能丢失或无法转移。除 Koofy Lab 故意或重大过失外，本地数据可能无法恢复。",
          ],
        },
        {
          heading: "5. 游戏内资源与物品",
          paragraphs: [
            "金币、宝石、碎片、钥匙、广告跳过券等只能在游戏内使用，并非现金、存款或电子货币。",
            "本应用目前不提供真实货币购买。如果将来加入应用内购买，我们会在推出前说明相关条件和退款政策，并更新本条款。",
          ],
        },
        {
          heading: "6. 激励广告",
          paragraphs: [
            "观看激励广告由用户自愿选择。只有完成广告且广告提供商成功报告完成时，才可能发放所示奖励。",
            "由于网络错误、广告库存不足、应用退出、提供商错误或未满足完成条件，广告或奖励可能无法使用。",
          ],
        },
        {
          heading: "7. 禁止行为",
          bullets: [
            "修改应用、存档、广告或通信以获得未经授权的奖励",
            "利用漏洞、自动化工具、未经授权的程序或安全缺陷",
            "干扰服务或侵犯其他用户、第三方权利",
            "未经许可复制、传播、销售、逆向工程应用或内容",
            "违反适用法律或应用商店政策",
          ],
        },
        {
          heading: "8. 服务变更与中止",
          paragraphs: [
            "Koofy Lab 可能因更新、维护、故障、政策变化或运营需要变更或暂时中止全部或部分服务。",
            "在合理可行的范围内，重大变更或计划终止会通过应用或网站告知。",
          ],
        },
        {
          heading: "9. 知识产权",
          paragraphs: [
            "软件、角色、图片、音频、文字、UI 及其他内容的权利属于 Koofy Lab 或合法权利人。本条款仅授予个人、非商业性的使用权。",
          ],
        },
        {
          heading: "10. 责任范围",
          paragraphs: [
            "Koofy Lab 会努力稳定提供服务，但不保证服务永不中断或所有错误都能立即修复。",
            "在法律允许的范围内，Koofy Lab 不对因用户设备、网络、第三方广告或平台服务、用户自身行为造成的损失负责。强制性消费者权利不受限制。",
          ],
        },
        {
          heading: "11. 适用法律与争议",
          paragraphs: [
            "本条款适用大韩民国法律。双方将首先诚信协商解决争议；协商未果时，由适用法律规定的有管辖权法院处理。用户所在地的强制性消费者保护规则可能优先适用。",
          ],
        },
        {
          heading: "12. 条款变更与联系",
          paragraphs: [
            "服务或相关法律变化时，我们可能更新本条款。重大变更会在生效前通过本页面或适当的应用内方式告知。",
            "服务问题请发送至下方邮箱。",
          ],
        },
      ],
    },
  },
};

export function getSlimeStrikeForceLegalContent(
  language: SlimeStrikeForceLegalLanguageCode,
) {
  return slimeStrikeForceLegalContent[language];
}
