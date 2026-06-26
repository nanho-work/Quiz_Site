export type BusPuzzlePrivacyLanguageCode = "ko" | "en" | "ja" | "zh";

type PrivacySection = {
  id?: string;
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
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
];

export const busPuzzlePrivacyContent: Record<BusPuzzlePrivacyLanguageCode, PrivacyContent> = {
  ko: {
    languageCode: "ko",
    title: "Bus Pop 개인정보 처리방침",
    updatedLabel: "최종 업데이트",
    updatedAt: "2026-06-19",
    intro:
      "Koofy Lab은 Bus Pop 모바일 게임을 제공하며, 이용자의 개인정보를 중요하게 생각합니다. 본 문서는 Bus Pop 앱의 데이터 처리 방식, 랭킹 기능, 광고 SDK 사용에 대해 설명합니다.",
    contactLabel: "개인정보 및 피드백 문의",
    contactEmail: "koofylab@gmail.com",
    sections: [
      {
        heading: "1. 앱에서 수집 및 저장하는 정보",
        paragraphs: [
          "Bus Pop은 회원가입 또는 로그인 기능을 제공하지 않습니다.",
          "앱 기능 제공을 위해 게임 진행 상태, 골드, 언어, 사운드, 진동 설정 등은 이용자의 기기 로컬 저장소에 저장될 수 있습니다.",
          "랭킹 기능을 위해 Firebase Anonymous Authentication을 통해 생성되는 익명 사용자 ID, 닉네임, 최고 클리어 스테이지, 기록 갱신 시간, 플랫폼, 앱 버전이 Firebase 및 Google Cloud에 저장될 수 있습니다.",
        ],
        bullets: [
          "로컬 저장 데이터는 앱 기능 제공과 이용자 설정 유지에 사용됩니다.",
          "로컬 저장 데이터는 앱 삭제 또는 기기 설정 초기화 시 삭제될 수 있습니다.",
          "닉네임과 최고 클리어 스테이지는 랭킹 화면에 표시될 수 있습니다.",
          "앱 삭제, 재설치 또는 기기 변경 시 기존 익명 사용자 ID 및 랭킹 기록과 연결되지 않을 수 있습니다.",
        ],
      },
      {
        heading: "2. 광고 및 제3자 SDK",
        paragraphs: [
          "Bus Pop은 보상형 광고 및 배너 광고 제공을 위해 Google AdMob 및 Google Mobile Ads SDK를 사용할 수 있습니다.",
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
          "랭킹 기능 제공 및 최고 클리어 스테이지 표시",
          "광고 제공 및 광고 보상 처리",
          "부정 이용 방지 및 앱 안정성 개선",
          "이용자 문의 응대",
        ],
      },
      {
        heading: "5. 개인정보의 보유 기간",
        paragraphs: [
          "앱이 로컬에 저장하는 데이터는 이용자의 기기에 보관되며, 앱 삭제 또는 기기 설정 초기화 시 삭제될 수 있습니다.",
          "랭킹 데이터는 랭킹 기능 제공에 필요한 기간 동안 보관되며, 이용자 요청 또는 서비스 운영상 필요한 경우 삭제되거나 비식별 처리될 수 있습니다.",
          "피드백 메일로 전달된 정보는 문의 응대 목적 달성 후 합리적인 기간 내 삭제됩니다. 단, 관련 법령상 보관 의무가 있는 경우 해당 기간 동안 보관될 수 있습니다.",
          "Google AdMob 등 제3자 SDK가 처리하는 정보의 보유 기간은 해당 제공자의 정책을 따릅니다.",
        ],
      },
      {
        heading: "6. 제3자 제공 및 처리 위탁",
        paragraphs: [
          "Koofy Lab은 이용자의 개인정보를 판매하지 않습니다.",
          "랭킹, 인증, 데이터 저장 등 앱 기능 제공을 위해 Firebase 및 Google Cloud가 관련 데이터를 처리할 수 있습니다.",
          "광고 제공 및 성과 측정을 위해 Google 등 제3자 서비스 제공자가 데이터를 처리할 수 있으며, 이 경우 해당 제공자의 개인정보 처리방침이 적용됩니다.",
        ],
      },
      {
        heading: "7. 아동의 개인정보",
        paragraphs: [
          "Bus Pop은 만 14세 미만 아동 또는 적용 법령상 보호 대상 아동으로부터 고의로 개인정보를 수집하지 않습니다.",
          "아동의 개인정보가 피드백 메일 등을 통해 전달된 사실을 알게 된 경우, 합리적인 절차에 따라 삭제 조치를 취합니다.",
        ],
      },
      {
        heading: "8. 이용자의 권리",
        paragraphs: [
          "이용자는 개인정보 열람, 정정, 삭제, 처리 정지 등을 요청할 수 있습니다.",
          "로컬 저장 데이터는 앱 삭제 또는 기기 설정을 통해 직접 삭제할 수 있으며, 랭킹 데이터 및 피드백 메일 관련 요청은 앱 내 문의 또는 아래 이메일로 접수할 수 있습니다.",
        ],
      },
      {
        id: "data-deletion",
        heading: "9. 데이터 삭제 요청",
        paragraphs: [
          "랭킹 데이터 삭제를 원하는 경우 앱 내 설정 > 문의를 통해 요청하거나 아래 이메일로 연락할 수 있습니다.",
          "요청 시 앱 이름, 닉네임, 랭킹 정보, 가능하다면 사용자 ID를 함께 보내주시면 확인에 도움이 됩니다.",
          "요청자 확인 후 합리적인 기간 내 관련 랭킹 데이터 및 문의 메일 관련 정보를 삭제하거나 비식별 처리합니다. 단, 법령상 보관 의무가 있는 정보는 해당 기간 동안 보관될 수 있습니다.",
        ],
      },
      {
        heading: "10. 정책 변경",
        paragraphs: [
          "본 개인정보 처리방침은 앱 기능, 광고 SDK, 관련 법령 또는 스토어 정책 변경에 따라 개정될 수 있습니다.",
          "중요한 변경이 있을 경우 본 페이지 또는 앱 내 적절한 방법을 통해 고지할 수 있습니다.",
        ],
      },
    ],
  },
  en: {
    languageCode: "en",
    title: "Bus Pop Privacy Policy",
    updatedLabel: "Last updated",
    updatedAt: "2026-06-19",
    intro:
      "Koofy Lab provides the Bus Pop mobile game and respects user privacy. This policy explains how the Bus Pop app handles data, the ranking feature, and advertising SDKs.",
    contactLabel: "Privacy and feedback contact",
    contactEmail: "koofylab@gmail.com",
    sections: [
      {
        heading: "1. Information Collected and Stored by the App",
        paragraphs: [
          "Bus Pop does not provide account registration or login features.",
          "To provide app features, game progress, gold balance, language, sound, and vibration settings may be stored locally on the user's device.",
          "For the ranking feature, an anonymous user ID generated through Firebase Anonymous Authentication, nickname, highest cleared stage, record update time, platform, and app version may be stored in Firebase and Google Cloud.",
        ],
        bullets: [
          "Local data is used to provide app features and preserve user preferences.",
          "Local data may be deleted when the app is uninstalled or device settings are reset.",
          "Nickname and highest cleared stage may be shown on the ranking screen.",
          "If the app is uninstalled, reinstalled, or used on another device, the previous anonymous user ID and ranking record may no longer be connected.",
        ],
      },
      {
        heading: "2. Advertising and Third-Party SDKs",
        paragraphs: [
          "Bus Pop may use Google AdMob and the Google Mobile Ads SDK to provide rewarded and banner advertisements.",
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
          "Providing the ranking feature and displaying the highest cleared stage",
          "Providing advertisements and processing ad rewards",
          "Preventing abuse and improving app stability",
          "Responding to user inquiries",
        ],
      },
      {
        heading: "5. Retention",
        paragraphs: [
          "Data stored locally by the app remains on the user's device and may be deleted when the app is uninstalled or device settings are reset.",
          "Ranking data is retained for as long as reasonably necessary to provide the ranking feature, and may be deleted or de-identified upon user request or as needed for service operation.",
          "Information sent by feedback email is deleted within a reasonable period after the inquiry is handled, unless retention is required by applicable law.",
          "Data processed by third-party SDKs such as Google AdMob is retained according to the relevant provider's policies.",
        ],
      },
      {
        heading: "6. Sharing and Service Providers",
        paragraphs: [
          "Koofy Lab does not sell users' personal information.",
          "Firebase and Google Cloud may process relevant data to provide app features such as ranking, authentication, and data storage.",
          "Third-party service providers such as Google may process data for ad delivery and measurement, and their own privacy policies apply to such processing.",
        ],
      },
      {
        heading: "7. Children's Privacy",
        paragraphs: [
          "Bus Pop does not knowingly collect personal information from children under 14 or the age defined by applicable law.",
          "If we become aware that a child's personal information has been sent to us, for example through feedback email, we will take reasonable steps to delete it.",
        ],
      },
      {
        heading: "8. User Rights",
        paragraphs: [
          "Users may request access, correction, deletion, or restriction of processing where applicable.",
          "Local app data can be removed by deleting the app or clearing device settings. Requests related to ranking data or feedback emails can be sent through the in-app contact feature or to the contact email below.",
        ],
      },
      {
        id: "data-deletion",
        heading: "9. Data Deletion Requests",
        paragraphs: [
          "Users who want to delete ranking data can request deletion through Settings > Contact in the app or by emailing the contact address below.",
          "To help us identify the relevant data, please include the app name, nickname, ranking information, and, if available, the user ID.",
          "After verifying the request, we will delete or de-identify the relevant ranking data and information related to feedback emails within a reasonable period, unless retention is required by applicable law.",
        ],
      },
      {
        heading: "10. Changes to This Policy",
        paragraphs: [
          "This policy may be updated when app features, advertising SDKs, applicable laws, or store policies change.",
          "Important changes may be announced on this page or through an appropriate in-app method.",
        ],
      },
    ],
  },
  ja: {
    languageCode: "ja",
    title: "Bus Pop プライバシーポリシー",
    updatedLabel: "最終更新日",
    updatedAt: "2026-06-19",
    intro:
      "Koofy LabはモバイルゲームBus Popを提供し、ユーザーのプライバシーを尊重します。本ポリシーは、Bus Popアプリにおけるデータ処理、ランキング機能、広告SDKの利用について説明します。",
    contactLabel: "プライバシーおよびフィードバック窓口",
    contactEmail: "koofylab@gmail.com",
    sections: [
      {
        heading: "1. アプリで収集および保存される情報",
        paragraphs: [
          "Bus Popは会員登録またはログイン機能を提供していません。",
          "アプリ機能の提供のため、ゲーム進行状況、ゴールド、言語、サウンド、振動設定などがユーザーの端末内に保存される場合があります。",
          "ランキング機能のため、Firebase Anonymous Authenticationにより生成される匿名ユーザーID、ニックネーム、最高クリアステージ、記録更新時刻、プラットフォーム、アプリバージョンがFirebaseおよびGoogle Cloudに保存される場合があります。",
        ],
        bullets: [
          "ローカル保存データは、アプリ機能の提供とユーザー設定の維持に使用されます。",
          "ローカル保存データは、アプリ削除または端末設定の初期化により削除される場合があります。",
          "ニックネームと最高クリアステージはランキング画面に表示される場合があります。",
          "アプリの削除、再インストール、端末変更により、以前の匿名ユーザーIDやランキング記録と接続されなくなる場合があります。",
        ],
      },
      {
        heading: "2. 広告および第三者SDK",
        paragraphs: [
          "Bus Popは、リワード広告およびバナー広告の提供のため、Google AdMobおよびGoogle Mobile Ads SDKを使用する場合があります。",
          "広告SDKは、広告配信、成果測定、不正利用防止、サービス保護のため、広告ID、IPアドレス、端末情報、アプリ操作情報、診断情報などを処理する場合があります。",
          "欧州経済領域、英国、スイスなど一部地域では、Google User Messaging Platformを通じて広告関連の同意画面が表示される場合があります。",
        ],
      },
      {
        heading: "3. フィードバックメール",
        paragraphs: [
          "ユーザーがアプリ内のフィードバック機能からメールを送信する場合、メールアドレスと問い合わせ内容は、回答およびサービス改善のために使用されます。",
          "フィードバックメールは対応に必要な期間保管される場合があり、ユーザーは削除を要請できます。",
        ],
      },
      {
        heading: "4. 利用目的",
        bullets: [
          "アプリ機能の提供とゲーム進行状況の維持",
          "サウンド、振動、言語などのユーザー設定の維持",
          "ランキング機能の提供と最高クリアステージの表示",
          "広告配信および広告報酬の処理",
          "不正利用防止およびアプリ安定性の改善",
          "ユーザー問い合わせへの対応",
        ],
      },
      {
        heading: "5. 保有期間",
        paragraphs: [
          "アプリがローカルに保存するデータはユーザー端末に保存され、アプリ削除または端末設定の初期化により削除される場合があります。",
          "ランキングデータはランキング機能の提供に必要な期間保管され、ユーザーの要請またはサービス運営上必要な場合に削除または非識別化される場合があります。",
          "フィードバックメールで送信された情報は、問い合わせ対応後、合理的な期間内に削除されます。ただし、法令上の保存義務がある場合は当該期間保存されることがあります。",
          "Google AdMobなど第三者SDKが処理する情報の保有期間は、各提供者のポリシーに従います。",
        ],
      },
      {
        heading: "6. 共有およびサービス提供者",
        paragraphs: [
          "Koofy Labはユーザーの個人情報を販売しません。",
          "ランキング、認証、データ保存などアプリ機能の提供のため、FirebaseおよびGoogle Cloudが関連データを処理する場合があります。",
          "広告配信および成果測定のため、Googleなどの第三者サービス提供者がデータを処理する場合があり、その場合は各提供者のプライバシーポリシーが適用されます。",
        ],
      },
      {
        heading: "7. 子どものプライバシー",
        paragraphs: [
          "Bus Popは14歳未満の子ども、または適用法令上保護対象となる子どもから故意に個人情報を収集しません。",
          "フィードバックメールなどを通じて子どもの個人情報が送信されたことを認識した場合、合理的な手続きにより削除します。",
        ],
      },
      {
        heading: "8. ユーザーの権利",
        paragraphs: [
          "ユーザーは、個人情報の開示、訂正、削除、処理停止などを要請できます。",
          "ローカル保存データはアプリ削除または端末設定により直接削除できます。ランキングデータおよびフィードバックメールに関する要請は、アプリ内問い合わせまたは下記メールで受け付けます。",
        ],
      },
      {
        id: "data-deletion",
        heading: "9. データ削除要請",
        paragraphs: [
          "ランキングデータの削除を希望する場合、アプリ内の設定 > お問い合わせ、または下記メールにて要請できます。",
          "確認のため、アプリ名、ニックネーム、ランキング情報、可能であればユーザーIDをお知らせください。",
          "要請者を確認した後、合理的な期間内に関連するランキングデータおよび問い合わせメール関連情報を削除または非識別化します。ただし、法令上の保存義務がある情報は当該期間保存されることがあります。",
        ],
      },
      {
        heading: "10. ポリシーの変更",
        paragraphs: [
          "本ポリシーは、アプリ機能、広告SDK、関連法令、ストアポリシーの変更により改定される場合があります。",
          "重要な変更がある場合、本ページまたはアプリ内の適切な方法で告知することがあります。",
        ],
      },
    ],
  },
  zh: {
    languageCode: "zh",
    title: "Bus Pop 隐私政策",
    updatedLabel: "最后更新",
    updatedAt: "2026-06-19",
    intro:
      "Koofy Lab 提供 Bus Pop 手机游戏，并重视用户隐私。本政策说明 Bus Pop 应用的数据处理方式、排行榜功能以及广告 SDK 的使用。",
    contactLabel: "隐私与反馈联系",
    contactEmail: "koofylab@gmail.com",
    sections: [
      {
        heading: "1. 应用收集和保存的信息",
        paragraphs: [
          "Bus Pop 不提供账号注册或登录功能。",
          "为了提供应用功能，游戏进度、金币、语言、音效、振动设置等可能会保存在用户设备的本地存储中。",
          "为了提供排行榜功能，通过 Firebase Anonymous Authentication 生成的匿名用户 ID、昵称、最高通关关卡、记录更新时间、平台和应用版本可能会保存在 Firebase 和 Google Cloud 中。",
        ],
        bullets: [
          "本地保存的数据用于提供应用功能并维持用户设置。",
          "本地保存的数据可能会在卸载应用或重置设备设置时删除。",
          "昵称和最高通关关卡可能会显示在排行榜页面。",
          "如果卸载、重新安装应用或更换设备，原匿名用户 ID 和排行榜记录可能无法继续关联。",
        ],
      },
      {
        heading: "2. 广告与第三方 SDK",
        paragraphs: [
          "Bus Pop 可能会使用 Google AdMob 和 Google Mobile Ads SDK 来提供激励广告和横幅广告。",
          "广告 SDK 可能会处理广告 ID、IP 地址、设备信息、应用互动信息、诊断信息等，用于广告投放、效果衡量、防止欺诈和服务安全。",
          "在欧洲经济区、英国、瑞士等部分地区，可能会通过 Google User Messaging Platform 显示广告相关同意界面。",
        ],
      },
      {
        heading: "3. 反馈邮件",
        paragraphs: [
          "如果用户通过应用内反馈功能发送邮件，邮箱地址和咨询内容会用于回复咨询和改善服务。",
          "反馈邮件可能会在处理咨询所需期间内保存，用户可以请求删除。",
        ],
      },
      {
        heading: "4. 使用目的",
        bullets: [
          "提供应用功能并维持游戏进度",
          "维持音效、振动、语言等用户设置",
          "提供排行榜功能并显示最高通关关卡",
          "提供广告并处理广告奖励",
          "防止滥用并改善应用稳定性",
          "回复用户咨询",
        ],
      },
      {
        heading: "5. 保存期限",
        paragraphs: [
          "应用本地保存的数据会保存在用户设备中，并可能在卸载应用或重置设备设置时删除。",
          "排行榜数据会在提供排行榜功能所需期间内保存，并可能根据用户请求或服务运营需要被删除或去标识化处理。",
          "通过反馈邮件发送的信息会在咨询处理完成后于合理期间内删除。但如果法律要求保存，则会在相应期间内保存。",
          "Google AdMob 等第三方 SDK 处理的信息保存期限遵循相关提供方的政策。",
        ],
      },
      {
        heading: "6. 共享与服务提供商",
        paragraphs: [
          "Koofy Lab 不出售用户的个人信息。",
          "为了提供排行榜、认证、数据保存等应用功能，Firebase 和 Google Cloud 可能会处理相关数据。",
          "为了广告投放和效果衡量，Google 等第三方服务提供商可能会处理数据，此时适用相关提供方的隐私政策。",
        ],
      },
      {
        heading: "7. 儿童隐私",
        paragraphs: [
          "Bus Pop 不会有意收集 14 岁以下儿童或适用法律定义的受保护儿童的个人信息。",
          "如果我们发现儿童个人信息通过反馈邮件等方式发送给我们，会采取合理步骤删除相关信息。",
        ],
      },
      {
        heading: "8. 用户权利",
        paragraphs: [
          "用户可以请求访问、更正、删除或停止处理个人信息。",
          "本地保存的数据可以通过卸载应用或设备设置直接删除。与排行榜数据或反馈邮件相关的请求，可以通过应用内联系功能或下方邮箱发送。",
        ],
      },
      {
        id: "data-deletion",
        heading: "9. 数据删除请求",
        paragraphs: [
          "如果希望删除排行榜数据，可以通过应用内设置 > 联系，或发送邮件到下方邮箱提出请求。",
          "为了帮助我们确认相关数据，请提供应用名称、昵称、排行榜信息，如有可能也请提供用户 ID。",
          "在确认请求者身份后，我们会在合理期间内删除或去标识化处理相关排行榜数据和反馈邮件相关信息。但法律要求保存的信息除外。",
        ],
      },
      {
        heading: "10. 政策变更",
        paragraphs: [
          "本政策可能会因应用功能、广告 SDK、相关法律或商店政策变化而更新。",
          "如有重要变更，可能会通过本页面或应用内适当方式通知。",
        ],
      },
    ],
  },
};

export function getBusPuzzlePrivacyContent(language?: string | string[]) {
  const requestedLanguage = Array.isArray(language) ? language[0] : language;
  const normalizedLanguage =
    requestedLanguage === "en" ||
    requestedLanguage === "ko" ||
    requestedLanguage === "ja" ||
    requestedLanguage === "zh"
      ? requestedLanguage
      : defaultBusPuzzlePrivacyLanguage;

  return busPuzzlePrivacyContent[normalizedLanguage];
}
