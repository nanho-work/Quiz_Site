export type LanguageCode = "en" | "ko" | "ja" | "zh";

export const defaultLanguage: LanguageCode = "en";

export const languages: Array<{
  code: LanguageCode;
  htmlLang: string;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  flagIcon: string;
}> = [
  {
    code: "en",
    htmlLang: "en",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
    flagIcon: "🇺🇸",
  },
  {
    code: "ko",
    htmlLang: "ko",
    label: "Korean",
    nativeLabel: "한국어",
    shortLabel: "KO",
    flagIcon: "🇰🇷",
  },
  {
    code: "ja",
    htmlLang: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    shortLabel: "JA",
    flagIcon: "🇯🇵",
  },
  {
    code: "zh",
    htmlLang: "zh-Hans",
    label: "Chinese",
    nativeLabel: "中文",
    shortLabel: "ZH",
    flagIcon: "🇨🇳",
  },
];

type ProductText = {
  name: string;
  category: string;
  description: string;
  status: string;
  href?: string;
};

type TextSection = {
  title: string;
  description: string;
};

type LegalSection =
  | {
      heading: string;
      body: string;
      bullets?: never;
    }
  | {
      heading: string;
      body?: never;
      bullets: string[];
    };

export type Translation = {
  common: {
    brand: string;
    languageLabel: string;
    open: string;
    nav: {
      products: string;
      about: string;
      contact: string;
    };
    footer: {
      tagline: string;
      contact: string;
      rights: string;
      privacy: string;
      terms: string;
      busPopPolicy: string;
    };
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      productsCta: string;
      contactCta: string;
    };
    products: {
      eyebrow: string;
      title: string;
      description: string;
      sitesLabel: string;
      appsLabel: string;
      appsTitle: string;
      sitesTitle: string;
      apps: ProductText[];
      sites: ProductText[];
    };
    capabilities: {
      eyebrow: string;
      title: string;
      description: string;
      items: TextSection[];
    };
    process: {
      title: string;
      principles: string[];
    };
    refinement: {
      title: string;
      description: string;
      tags: string[];
    };
    operations: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    values: TextSection[];
    fitTitle: string;
    fitDescription: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    emailTitle: string;
    emailNote: string;
    policyPrompt: string;
    policyCta: string;
  };
  privacy: {
    title: string;
    updatedLabel: string;
    updatedAt: string;
    sections: LegalSection[];
  };
  terms: {
    title: string;
    sections: LegalSection[];
  };
};

export const translations: Record<LanguageCode, Translation> = {
  en: {
    common: {
      brand: "Koofy Lab",
      languageLabel: "Select language",
      open: "Open",
      nav: {
        products: "Products",
        about: "About",
        contact: "Contact",
      },
      footer: {
        tagline:
          "Koofy Lab creates simple, fun, and memorable digital products.",
        contact: "Contact",
        rights: "All rights reserved.",
        privacy: "Privacy",
        terms: "Terms",
        busPopPolicy: "Bus Pop Policy",
      },
    },
    home: {
      hero: {
        eyebrow: "Games, apps, AI tools",
        title: "Koofy Lab builds simple digital products with a playful edge.",
        description:
          "We create small, useful, and memorable experiences across games, mobile apps, AI-powered tools, and web experiments.",
        productsCta: "Explore products",
        contactCta: "Contact",
      },
      products: {
        eyebrow: "Current shape",
        title: "Seven product surfaces, one clear home.",
        description:
          "Koofy Lab now has multiple sites and apps. This page gives them a single frame so the portfolio feels intentional instead of scattered.",
        sitesLabel: "Sites",
        appsLabel: "Apps",
        appsTitle: "Apps",
        sitesTitle: "Sites",
        apps: [
          {
            name: "Bus Pop",
            category: "Mobile Game",
            description:
              "A cheerful puzzle game about buses, passengers, timing, and satisfying movement.",
            status: "Live",
            href: "/bus-pop/privacy",
          },
          {
            name: "Koofy Sudoku",
            category: "Puzzle App",
            description:
              "A clean number puzzle experience shaped for quick focus and daily play.",
            status: "In progress",
          },
          {
            name: "Koofy Mini Apps",
            category: "Mobile App",
            description:
              "Small, useful mobile experiments that turn simple ideas into polished tools.",
            status: "Prototype",
          },
        ],
        sites: [
          {
            name: "Koofy Lab",
            category: "Brand Hub",
            description:
              "The home base for Koofy products, experiments, policies, and launch updates.",
            status: "Live",
            href: "/",
          },
          {
            name: "Koofy Web Tools",
            category: "Utility Site",
            description:
              "Fast browser-based tools for everyday tasks, calculations, and lightweight workflows.",
            status: "Reviewing",
          },
          {
            name: "Test Experiences",
            category: "Web Experience",
            description:
              "Light, shareable quizzes and playful web formats from the early Koofy archive.",
            status: "Archive",
          },
          {
            name: "AI Micro Tools",
            category: "AI Site",
            description:
              "Focused AI-powered helpers designed around one clear job at a time.",
            status: "Planned",
          },
        ],
      },
      capabilities: {
        eyebrow: "What we make",
        title: "Useful ideas, made light.",
        description:
          "Koofy Lab is not a single category. It is a way of turning small ideas into shipped products with character.",
        items: [
          {
            title: "Games",
            description:
              "Bright mechanics, readable rules, and small loops that feel good to repeat.",
          },
          {
            title: "Apps",
            description:
              "Mobile-first products with simple flows, clear feedback, and useful defaults.",
          },
          {
            title: "AI-powered tools",
            description:
              "Practical assistants that compress a repetitive job into a calmer workflow.",
          },
          {
            title: "Web utilities",
            description:
              "Fast sites and tools that are easy to ship, measure, improve, and reuse.",
          },
        ],
      },
      process: {
        title: "How Koofy Lab works",
        principles: [
          "Start small enough to ship.",
          "Make the first interaction obvious.",
          "Keep the experience light, fast, and memorable.",
        ],
      },
      refinement: {
        title: "A first landing, ready to refine.",
        description:
          "This version creates the main frame: brand, portfolio, product categories, and contact. The next pass can replace temporary product names, add store links, and decide which older web tools stay public.",
        tags: ["Portfolio", "Store-ready", "Search-friendly"],
      },
      operations: {
        eyebrow: "Operational pages stay intact",
        title: "Policies, app ads, and product pages remain available.",
        description:
          "Bus Pop privacy, ads.txt, and app-ads.txt are preserved for store review, ads, and existing app requirements.",
        cta: "Bus Pop policy",
      },
    },
    about: {
      eyebrow: "About",
      title: "Koofy Lab is a small product lab for games, apps, and AI tools.",
      description:
        "We like products that are easy to enter, quick to understand, and fun to revisit. Koofy Lab exists to turn compact ideas into shipped experiences with a clear shape.",
      values: [
        {
          title: "Simple",
          description:
            "Every product starts with one clear promise and one obvious first action.",
        },
        {
          title: "Playful",
          description:
            "Even useful tools should have rhythm, feedback, and a small sense of delight.",
        },
        {
          title: "Flexible",
          description:
            "We build in small passes, learn from the result, and improve what earns attention.",
        },
      ],
      fitTitle: "What belongs under Koofy Lab",
      fitDescription:
        "Koofy Lab can hold several different surfaces without feeling scattered: mobile games, puzzle apps, AI helpers, web utilities, experiments, and policy pages for released apps. The important part is that the brand home explains why they belong together.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Talk to Koofy Lab.",
      description:
        "For product questions, app privacy requests, store review issues, collaboration, or feedback, send a note to the Koofy Lab inbox.",
      emailTitle: "Email",
      emailNote:
        "Please include the product name when the message is about a specific app or site.",
      policyPrompt: "Looking for the Bus Pop privacy policy?",
      policyCta: "Open the policy page",
    },
    privacy: {
      title: "Privacy Policy",
      updatedLabel: "Last updated",
      updatedAt: "2026-06-26",
      sections: [
        {
          heading: "1. Overview",
          body: "Koofy Lab values user privacy and complies with applicable privacy laws. This policy explains what information may be processed when users visit the website, view product information, contact us, or access app-related policy pages.",
        },
        {
          heading: "2. Information We May Collect",
          bullets: [
            "Email address, name, and message content provided directly through inquiries.",
            "Access logs, browser information, and device information for service improvement and security.",
            "Cookies or similar identifiers that may be processed by advertising or analytics tools.",
          ],
        },
        {
          heading: "3. Purposes of Processing",
          bullets: [
            "Reviewing and responding to inquiries.",
            "Operating the site, improving quality, checking errors, and maintaining security.",
            "Handling product updates, policy notices, app review, and advertising operations.",
            "Complying with applicable laws and platform policies.",
          ],
        },
        {
          heading: "4. Cookies and Advertising",
          body: "The site may use cookies or similar technologies for convenience, service improvement, and advertising operations. Users can refuse or delete cookies in browser settings. If third-party advertising services such as Google AdSense or Google AdMob are used, their policies may also apply.",
        },
        {
          heading: "5. Retention",
          body: "Personal information is deleted without delay once the purpose of collection and use has been fulfilled. However, inquiry records, security logs, dispute-related records, or information required by law may be retained for the necessary period.",
        },
        {
          heading: "6. Third Parties and Service Providers",
          body: "Koofy Lab does not sell users' personal information. Cloud services, ad networks, analytics tools, or other third-party providers may process data as needed for site operation, email response, advertising, analytics, or app features. In such cases, the provider's privacy policy may apply.",
        },
        {
          heading: "7. User Rights",
          body: "Users may request access, correction, deletion, or restriction of processing. Requests can be sent to the email below, and Koofy Lab will respond within a reasonable period in accordance with applicable laws.",
        },
        {
          heading: "8. Contact",
          bullets: [
            "Privacy contact: Koofy Lab privacy team",
            "Email: koofylab@gmail.com",
          ],
        },
        {
          heading: "9. Changes",
          body: "This privacy policy may be updated due to changes in services, products, laws, or platform policies. Updates will be posted on this page.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      sections: [
        {
          heading: "Article 1. Purpose",
          body: "These terms define the conditions and procedures for using services provided by Koofy Lab through koofy.co.kr, including product information, web content, app policy pages, and inquiry responses.",
        },
        {
          heading: "Article 2. Services and Changes",
          body: "Koofy Lab may provide digital services such as games, apps, AI tools, web utilities, product pages, and app privacy policies. Service content and delivery methods may be changed, added, or discontinued depending on operational needs.",
        },
        {
          heading: "Article 3. User Responsibilities",
          bullets: [
            "Users must comply with applicable laws and these terms.",
            "Users must not interfere with the normal operation of the site or apps.",
            "Users must not infringe on the rights, privacy, or intellectual property of others.",
          ],
        },
        {
          heading: "Article 4. Intellectual Property",
          body: "Rights to logos, images, copy, UI, content, apps, and service materials on the site belong to Koofy Lab or the respective rights holders. Unauthorized copying, distribution, modification, or commercial use is prohibited.",
        },
        {
          heading: "Article 5. Disclaimer",
          body: "Koofy Lab does not guarantee that free information or services will be suitable for a specific purpose or continuously available. Users should treat provided information as reference material, and third-party links or services are governed by the relevant provider's policies.",
        },
        {
          heading: "Article 6. Changes to Terms",
          body: "These terms may be updated due to service changes, operational needs, or changes in applicable laws. Updates will be posted on this page, and important changes may be announced through reasonable means.",
        },
      ],
    },
  },
  ko: {
    common: {
      brand: "Koofy Lab",
      languageLabel: "언어 선택",
      open: "열기",
      nav: {
        products: "제품",
        about: "소개",
        contact: "문의",
      },
      footer: {
        tagline:
          "Koofy Lab은 단순하고 재미있고 기억에 남는 디지털 제품을 만듭니다.",
        contact: "문의",
        rights: "All rights reserved.",
        privacy: "개인정보",
        terms: "약관",
        busPopPolicy: "Bus Pop 정책",
      },
    },
    home: {
      hero: {
        eyebrow: "게임, 앱, AI 도구",
        title:
          "Koofy Lab은\n즐거운 감각을 담은 간결한\n디지털 제품을 만듭니다.",
        description:
          "게임, 모바일 앱, AI 기반 도구, 웹 실험을 통해 작지만 유용하고 기억에 남는 경험을 만듭니다.",
        productsCta: "제품 보기",
        contactCta: "문의하기",
      },
      products: {
        eyebrow: "현재 구성",
        title: "7개의 제품 표면을 하나의 본진으로 정리합니다.",
        description:
          "Koofy Lab에는 여러 사이트와 앱이 있습니다. 이 페이지는 포트폴리오가 흩어진 느낌이 아니라 의도된 묶음처럼 보이도록 기준점을 만듭니다.",
        sitesLabel: "사이트",
        appsLabel: "앱",
        appsTitle: "앱",
        sitesTitle: "사이트",
        apps: [
          {
            name: "Bus Pop",
            category: "모바일 게임",
            description:
              "버스, 승객, 타이밍, 시원한 이동감이 어우러진 밝은 퍼즐 게임입니다.",
            status: "운영 중",
            href: "/bus-pop/privacy",
          },
          {
            name: "Koofy Sudoku",
            category: "퍼즐 앱",
            description:
              "짧은 집중과 데일리 플레이에 맞춘 깔끔한 숫자 퍼즐 경험입니다.",
            status: "진행 중",
          },
          {
            name: "Koofy Mini Apps",
            category: "모바일 앱",
            description:
              "작고 유용한 아이디어를 완성도 있는 도구로 바꾸는 모바일 실험입니다.",
            status: "프로토타입",
          },
        ],
        sites: [
          {
            name: "Koofy Lab",
            category: "브랜드 허브",
            description:
              "Koofy 제품, 실험, 정책, 출시 소식을 모으는 본진입니다.",
            status: "운영 중",
            href: "/",
          },
          {
            name: "Koofy Web Tools",
            category: "유틸리티 사이트",
            description:
              "일상 업무, 계산, 가벼운 워크플로우를 빠르게 처리하는 브라우저 도구입니다.",
            status: "검토 중",
          },
          {
            name: "Test Experiences",
            category: "웹 경험",
            description:
              "초기 Koofy 아카이브에 있는 가볍고 공유하기 좋은 테스트와 퀴즈 형식입니다.",
            status: "아카이브",
          },
          {
            name: "AI Micro Tools",
            category: "AI 사이트",
            description:
              "한 번에 하나의 분명한 일을 돕는 집중형 AI 도구입니다.",
            status: "예정",
          },
        ],
      },
      capabilities: {
        eyebrow: "우리가 만드는 것",
        title: "유용한 아이디어를 가볍게 만듭니다.",
        description:
          "Koofy Lab은 하나의 카테고리가 아니라, 작은 아이디어를 개성 있는 제품으로 출시하는 방식입니다.",
        items: [
          {
            title: "게임",
            description:
              "읽기 쉬운 규칙, 반복하고 싶은 작은 루프, 밝은 조작감을 만듭니다.",
          },
          {
            title: "앱",
            description:
              "명확한 흐름, 즉각적인 피드백, 좋은 기본값을 가진 모바일 제품을 만듭니다.",
          },
          {
            title: "AI 기반 도구",
            description:
              "반복되는 일을 더 차분한 흐름으로 줄여주는 실용적인 도우미를 만듭니다.",
          },
          {
            title: "웹 유틸리티",
            description:
              "빠르게 만들고, 측정하고, 개선하고, 재사용하기 쉬운 사이트와 도구를 만듭니다.",
          },
        ],
      },
      process: {
        title: "Koofy Lab의 작업 방식",
        principles: [
          "출시할 수 있을 만큼 작게 시작합니다.",
          "첫 상호작용을 분명하게 만듭니다.",
          "경험을 가볍고 빠르고 기억에 남게 유지합니다.",
        ],
      },
      refinement: {
        title: "확인하며 다듬기 위한 첫 랜딩입니다.",
        description:
          "이번 버전은 브랜드, 포트폴리오, 제품 카테고리, 문의의 큰 틀을 만듭니다. 다음 단계에서는 임시 제품명 교체, 스토어 링크 추가, 오래된 웹 도구의 공개 여부를 결정할 수 있습니다.",
        tags: ["포트폴리오", "스토어 준비", "검색 친화"],
      },
      operations: {
        eyebrow: "운영 페이지는 유지됩니다",
        title: "정책, 앱 광고, 제품 페이지는 계속 접근할 수 있습니다.",
        description:
          "Bus Pop 개인정보처리방침, ads.txt, app-ads.txt는 스토어 심사, 광고, 기존 앱 요구사항을 위해 유지됩니다.",
        cta: "Bus Pop 정책",
      },
    },
    about: {
      eyebrow: "소개",
      title: "Koofy Lab은 게임, 앱, AI 도구를 만드는 작은 제품 랩입니다.",
      description:
        "우리는 들어가기 쉽고, 빠르게 이해되고, 다시 찾고 싶은 제품을 좋아합니다. Koofy Lab은 작고 선명한 아이디어를 출시 가능한 경험으로 바꾸기 위해 존재합니다.",
      values: [
        {
          title: "간결함",
          description:
            "모든 제품은 하나의 분명한 약속과 가장 쉬운 첫 행동에서 시작합니다.",
        },
        {
          title: "즐거움",
          description:
            "유용한 도구에도 리듬, 피드백, 작은 즐거움이 있어야 한다고 생각합니다.",
        },
        {
          title: "유연함",
          description:
            "작은 단위로 만들고, 결과에서 배우고, 관심을 얻은 부분을 개선합니다.",
        },
      ],
      fitTitle: "Koofy Lab 아래에 묶이는 것들",
      fitDescription:
        "Koofy Lab은 모바일 게임, 퍼즐 앱, AI 도우미, 웹 유틸리티, 실험, 출시 앱의 정책 페이지처럼 여러 표면을 담을 수 있습니다. 중요한 것은 브랜드 본진이 이들이 왜 함께 있는지 설명하는 것입니다.",
    },
    contact: {
      eyebrow: "문의",
      title: "Koofy Lab에 연락하기",
      description:
        "제품 문의, 앱 개인정보 요청, 스토어 심사 이슈, 협업, 피드백은 Koofy Lab 메일로 보내주세요.",
      emailTitle: "이메일",
      emailNote:
        "특정 앱이나 사이트에 대한 내용이라면 제품명을 함께 적어주세요.",
      policyPrompt: "Bus Pop 개인정보처리방침을 찾고 있나요?",
      policyCta: "정책 페이지 열기",
    },
    privacy: {
      title: "개인정보 처리방침",
      updatedLabel: "최종 업데이트",
      updatedAt: "2026-06-26",
      sections: [
        {
          heading: "1. 총칙",
          body: "Koofy Lab은 이용자의 개인정보를 중요하게 생각하며 개인정보 보호 관련 법령을 준수합니다. 본 개인정보 처리방침은 사이트 방문, 제품 정보 확인, 문의, 앱 관련 정책 페이지 이용과 관련하여 처리될 수 있는 개인정보의 항목과 목적을 설명합니다.",
        },
        {
          heading: "2. 수집하는 개인정보 항목",
          bullets: [
            "문의 시 이용자가 직접 제공하는 이메일 주소, 이름, 문의 내용",
            "서비스 개선과 보안을 위한 접속 기록, 브라우저 및 기기 정보",
            "광고 또는 분석 도구가 처리할 수 있는 쿠키 및 유사 식별자",
          ],
        },
        {
          heading: "3. 개인정보의 처리 목적",
          bullets: [
            "문의 확인 및 답변",
            "사이트 운영, 품질 개선, 오류 확인 및 보안 유지",
            "제품 업데이트, 정책 고지, 앱 심사 및 광고 관련 운영 대응",
            "관련 법령 또는 플랫폼 정책 준수",
          ],
        },
        {
          heading: "4. 쿠키 및 광고",
          body: "사이트는 이용자 편의, 서비스 개선, 광고 운영을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. Google AdSense, Google AdMob 등 제3자 광고 서비스가 적용되는 경우 해당 제공자의 정책이 함께 적용될 수 있습니다.",
        },
        {
          heading: "5. 보유 및 이용 기간",
          body: "개인정보는 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 다만 문의 응대, 분쟁 대비, 보안 기록, 법령상 보관 의무가 있는 정보는 필요한 기간 동안 보관될 수 있습니다.",
        },
        {
          heading: "6. 제3자 제공 및 처리위탁",
          body: "Koofy Lab은 이용자의 개인정보를 판매하지 않습니다. 사이트 운영, 메일 응대, 광고, 분석, 앱 기능 제공을 위해 필요한 범위에서 클라우드, 광고 네트워크, 분석 도구 등 제3자 서비스가 데이터를 처리할 수 있으며, 이 경우 각 제공자의 개인정보 처리방침이 적용될 수 있습니다.",
        },
        {
          heading: "7. 이용자의 권리",
          body: "이용자는 개인정보 열람, 정정, 삭제, 처리 정지 등을 요청할 수 있습니다. 요청은 아래 이메일로 접수할 수 있으며, Koofy Lab은 관련 법령에 따라 합리적인 기간 내에 처리합니다.",
        },
        {
          heading: "8. 문의처",
          bullets: [
            "담당: Koofy Lab 개인정보보호 담당",
            "이메일: koofylab@gmail.com",
          ],
        },
        {
          heading: "9. 정책의 변경",
          body: "본 개인정보 처리방침은 서비스, 제품, 법령, 플랫폼 정책 변경에 따라 개정될 수 있으며, 변경 사항은 본 페이지에 게시합니다.",
        },
      ],
    },
    terms: {
      title: "서비스 이용약관",
      sections: [
        {
          heading: "제1조 목적",
          body: "본 약관은 Koofy Lab이 koofy.co.kr을 통해 제공하는 제품 소개, 웹 콘텐츠, 앱 관련 정책 페이지, 문의 응대 등 서비스의 이용 조건과 절차를 정하는 것을 목적으로 합니다.",
        },
        {
          heading: "제2조 서비스의 제공 및 변경",
          body: "Koofy Lab은 게임, 앱, AI 도구, 웹 유틸리티, 제품 소개 페이지, 앱 개인정보 처리방침 등 다양한 디지털 서비스를 제공할 수 있습니다. 서비스의 내용과 제공 방식은 운영 상황에 따라 변경, 추가, 중단될 수 있습니다.",
        },
        {
          heading: "제3조 이용자의 의무",
          bullets: [
            "이용자는 관련 법령과 본 약관을 준수해야 합니다.",
            "사이트 또는 앱의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.",
            "타인의 권리, 개인정보, 지식재산권을 침해해서는 안 됩니다.",
          ],
        },
        {
          heading: "제4조 지식재산권",
          body: "사이트에 포함된 로고, 이미지, 문구, UI, 콘텐츠, 앱 및 서비스 관련 자료의 권리는 Koofy Lab 또는 정당한 권리자에게 있습니다. 사전 허가 없이 무단 복제, 배포, 수정, 상업적 이용을 할 수 없습니다.",
        },
        {
          heading: "제5조 면책",
          body: "Koofy Lab은 무료로 제공되는 정보와 서비스에 대해 특정 목적에의 적합성이나 지속적인 제공을 보증하지 않습니다. 이용자는 제공되는 정보를 참고 목적으로 사용해야 하며, 외부 링크나 제3자 서비스의 정책은 해당 제공자의 기준을 따릅니다.",
        },
        {
          heading: "제6조 약관의 변경",
          body: "본 약관은 서비스 변경, 운영상 필요, 관련 법령 변경에 따라 개정될 수 있습니다. 변경 사항은 본 페이지에 게시하며, 중요한 변경은 합리적인 방법으로 안내할 수 있습니다.",
        },
      ],
    },
  },
  ja: {
    common: {
      brand: "Koofy Lab",
      languageLabel: "言語を選択",
      open: "開く",
      nav: {
        products: "プロダクト",
        about: "紹介",
        contact: "お問い合わせ",
      },
      footer: {
        tagline:
          "Koofy Labは、シンプルで楽しく記憶に残るデジタルプロダクトを作ります。",
        contact: "お問い合わせ",
        rights: "All rights reserved.",
        privacy: "プライバシー",
        terms: "利用規約",
        busPopPolicy: "Bus Popポリシー",
      },
    },
    home: {
      hero: {
        eyebrow: "ゲーム、アプリ、AIツール",
        title:
          "Koofy Labは、遊び心のあるシンプルなデジタルプロダクトを作ります。",
        description:
          "ゲーム、モバイルアプリ、AIツール、Web実験を通じて、小さくても便利で記憶に残る体験を作ります。",
        productsCta: "プロダクトを見る",
        contactCta: "お問い合わせ",
      },
      products: {
        eyebrow: "現在の構成",
        title: "7つのプロダクト面を、ひとつの明確な拠点へ。",
        description:
          "Koofy Labには複数のサイトとアプリがあります。このページは、それらが散らばって見えないように、意図のあるポートフォリオとして整理します。",
        sitesLabel: "サイト",
        appsLabel: "アプリ",
        appsTitle: "アプリ",
        sitesTitle: "サイト",
        apps: [
          {
            name: "Bus Pop",
            category: "モバイルゲーム",
            description:
              "バス、乗客、タイミング、気持ちよい動きが合わさった明るいパズルゲームです。",
            status: "公開中",
            href: "/bus-pop/privacy",
          },
          {
            name: "Koofy Sudoku",
            category: "パズルアプリ",
            description:
              "短い集中と毎日のプレイに合わせた、クリーンな数字パズル体験です。",
            status: "進行中",
          },
          {
            name: "Koofy Mini Apps",
            category: "モバイルアプリ",
            description:
              "小さく便利なアイデアを、磨かれたツールへ変えるモバイル実験です。",
            status: "プロトタイプ",
          },
        ],
        sites: [
          {
            name: "Koofy Lab",
            category: "ブランド拠点",
            description:
              "Koofyのプロダクト、実験、ポリシー、リリース情報を集めるホームです。",
            status: "公開中",
            href: "/",
          },
          {
            name: "Koofy Web Tools",
            category: "ユーティリティサイト",
            description:
              "日常のタスク、計算、軽いワークフローを素早く扱うブラウザツールです。",
            status: "検討中",
          },
          {
            name: "Test Experiences",
            category: "Web体験",
            description:
              "初期Koofyアーカイブにある、軽く共有しやすいテストやクイズ形式です。",
            status: "アーカイブ",
          },
          {
            name: "AI Micro Tools",
            category: "AIサイト",
            description:
              "一度にひとつの明確な仕事を助ける、集中型AIツールです。",
            status: "予定",
          },
        ],
      },
      capabilities: {
        eyebrow: "作っているもの",
        title: "便利なアイデアを軽やかに。",
        description:
          "Koofy Labは単一カテゴリではありません。小さなアイデアを個性あるプロダクトとして届けるための作り方です。",
        items: [
          {
            title: "ゲーム",
            description:
              "読みやすいルール、繰り返したくなる小さなループ、明るい操作感を作ります。",
          },
          {
            title: "アプリ",
            description:
              "わかりやすい流れ、明確なフィードバック、使いやすい初期設定を備えたモバイル製品を作ります。",
          },
          {
            title: "AIツール",
            description:
              "繰り返し作業をより落ち着いた流れへ圧縮する、実用的なアシスタントを作ります。",
          },
          {
            title: "Webユーティリティ",
            description:
              "素早く作り、測定し、改善し、再利用しやすいサイトとツールを作ります。",
          },
        ],
      },
      process: {
        title: "Koofy Labの作り方",
        principles: [
          "リリースできる小ささから始めます。",
          "最初の操作をわかりやすくします。",
          "体験を軽く、速く、記憶に残るものに保ちます。",
        ],
      },
      refinement: {
        title: "確認しながら磨くための最初のランディングです。",
        description:
          "このバージョンでは、ブランド、ポートフォリオ、プロダクトカテゴリ、お問い合わせの大枠を作ります。次の段階では仮のプロダクト名の置き換え、ストアリンク追加、古いWebツールの公開方針を決められます。",
        tags: ["ポートフォリオ", "ストア対応", "検索対応"],
      },
      operations: {
        eyebrow: "運用ページは維持されます",
        title: "ポリシー、アプリ広告、プロダクトページは引き続き利用できます。",
        description:
          "Bus Popのプライバシーポリシー、ads.txt、app-ads.txtは、ストア審査、広告、既存アプリ要件のために維持されます。",
        cta: "Bus Popポリシー",
      },
    },
    about: {
      eyebrow: "紹介",
      title:
        "Koofy Labは、ゲーム、アプリ、AIツールを作る小さなプロダクトラボです。",
      description:
        "私たちは、入りやすく、すぐ理解でき、また戻りたくなるプロダクトが好きです。Koofy Labは、小さく明確なアイデアをリリースできる体験へ変えるためにあります。",
      values: [
        {
          title: "シンプル",
          description:
            "すべてのプロダクトは、ひとつの明確な約束とわかりやすい最初の行動から始まります。",
        },
        {
          title: "遊び心",
          description:
            "便利なツールにも、リズム、フィードバック、小さな楽しさが必要だと考えます。",
        },
        {
          title: "柔軟",
          description:
            "小さな単位で作り、結果から学び、関心を得た部分を改善します。",
        },
      ],
      fitTitle: "Koofy Labに含まれるもの",
      fitDescription:
        "Koofy Labは、モバイルゲーム、パズルアプリ、AIアシスタント、Webユーティリティ、実験、リリース済みアプリのポリシーページなど、複数の面をまとめられます。重要なのは、ブランドの拠点がそれらが一緒にある理由を説明することです。",
    },
    contact: {
      eyebrow: "お問い合わせ",
      title: "Koofy Labに連絡する",
      description:
        "プロダクトに関する質問、アプリのプライバシー依頼、ストア審査の問題、協業、フィードバックはKoofy Labのメールまでお送りください。",
      emailTitle: "メール",
      emailNote:
        "特定のアプリやサイトに関する内容の場合は、プロダクト名も記載してください。",
      policyPrompt: "Bus Popのプライバシーポリシーをお探しですか？",
      policyCta: "ポリシーページを開く",
    },
    privacy: {
      title: "プライバシーポリシー",
      updatedLabel: "最終更新日",
      updatedAt: "2026-06-26",
      sections: [
        {
          heading: "1. 概要",
          body: "Koofy Labはユーザーのプライバシーを重視し、適用されるプライバシー関連法令を遵守します。本ポリシーは、サイト訪問、プロダクト情報の閲覧、お問い合わせ、アプリ関連ポリシーページの利用に関連して処理される可能性のある情報と目的を説明します。",
        },
        {
          heading: "2. 収集する可能性のある情報",
          bullets: [
            "お問い合わせ時にユーザーが直接提供するメールアドレス、氏名、メッセージ内容",
            "サービス改善とセキュリティのためのアクセス記録、ブラウザ情報、端末情報",
            "広告または分析ツールが処理する可能性のあるCookieおよび類似識別子",
          ],
        },
        {
          heading: "3. 処理目的",
          bullets: [
            "お問い合わせの確認と回答",
            "サイト運営、品質改善、エラー確認、セキュリティ維持",
            "プロダクト更新、ポリシー告知、アプリ審査、広告運用への対応",
            "関連法令またはプラットフォームポリシーの遵守",
          ],
        },
        {
          heading: "4. Cookieと広告",
          body: "サイトは利便性、サービス改善、広告運用のためにCookieまたは類似技術を使用する場合があります。ユーザーはブラウザ設定でCookieの保存を拒否または削除できます。Google AdSense、Google AdMobなど第三者広告サービスが適用される場合、その提供者のポリシーも適用されることがあります。",
        },
        {
          heading: "5. 保持期間",
          body: "個人情報は収集・利用目的が達成され次第、遅滞なく削除されます。ただし、お問い合わせ対応、紛争対応、セキュリティ記録、法令上保存義務がある情報は、必要な期間保持される場合があります。",
        },
        {
          heading: "6. 第三者および委託先",
          body: "Koofy Labはユーザーの個人情報を販売しません。サイト運営、メール対応、広告、分析、アプリ機能提供のために必要な範囲で、クラウドサービス、広告ネットワーク、分析ツールなど第三者サービスがデータを処理する場合があります。その場合、各提供者のプライバシーポリシーが適用されることがあります。",
        },
        {
          heading: "7. ユーザーの権利",
          body: "ユーザーは個人情報の開示、訂正、削除、処理停止などを請求できます。請求は下記メールアドレスで受け付け、Koofy Labは適用法令に従い合理的な期間内に対応します。",
        },
        {
          heading: "8. お問い合わせ先",
          bullets: [
            "担当: Koofy Labプライバシーチーム",
            "メール: koofylab@gmail.com",
          ],
        },
        {
          heading: "9. 変更",
          body: "本プライバシーポリシーは、サービス、プロダクト、法令、プラットフォームポリシーの変更により更新される場合があります。変更内容は本ページに掲載します。",
        },
      ],
    },
    terms: {
      title: "利用規約",
      sections: [
        {
          heading: "第1条 目的",
          body: "本規約は、Koofy Labがkoofy.co.krを通じて提供するプロダクト情報、Webコンテンツ、アプリ関連ポリシーページ、お問い合わせ対応などのサービス利用条件と手続きを定めることを目的とします。",
        },
        {
          heading: "第2条 サービスの提供および変更",
          body: "Koofy Labは、ゲーム、アプリ、AIツール、Webユーティリティ、プロダクト紹介ページ、アプリプライバシーポリシーなど、さまざまなデジタルサービスを提供する場合があります。サービス内容と提供方法は運営状況により変更、追加、中止されることがあります。",
        },
        {
          heading: "第3条 ユーザーの義務",
          bullets: [
            "ユーザーは関連法令および本規約を遵守しなければなりません。",
            "サイトまたはアプリの正常な運営を妨害してはなりません。",
            "他者の権利、プライバシー、知的財産権を侵害してはなりません。",
          ],
        },
        {
          heading: "第4条 知的財産権",
          body: "サイトに含まれるロゴ、画像、文言、UI、コンテンツ、アプリおよびサービス関連資料の権利は、Koofy Labまたは正当な権利者に帰属します。事前の許可なく複製、配布、改変、商用利用を行うことはできません。",
        },
        {
          heading: "第5条 免責",
          body: "Koofy Labは無料で提供される情報やサービスについて、特定目的への適合性や継続的な提供を保証しません。ユーザーは提供情報を参考目的で利用し、外部リンクや第三者サービスについては当該提供者のポリシーに従うものとします。",
        },
        {
          heading: "第6条 規約の変更",
          body: "本規約は、サービス変更、運営上の必要、関連法令の変更により更新される場合があります。変更内容は本ページに掲載し、重要な変更は合理的な方法で案内することがあります。",
        },
      ],
    },
  },
  zh: {
    common: {
      brand: "Koofy Lab",
      languageLabel: "选择语言",
      open: "打开",
      nav: {
        products: "产品",
        about: "关于",
        contact: "联系",
      },
      footer: {
        tagline: "Koofy Lab 打造简单、有趣、令人记住的数字产品。",
        contact: "联系",
        rights: "All rights reserved.",
        privacy: "隐私",
        terms: "条款",
        busPopPolicy: "Bus Pop 政策",
      },
    },
    home: {
      hero: {
        eyebrow: "游戏、应用、AI工具",
        title: "Koofy Lab 打造带有玩味感的简洁数字产品。",
        description:
          "我们通过游戏、移动应用、AI 工具和 Web 实验，创造小而实用、令人记住的体验。",
        productsCta: "查看产品",
        contactCta: "联系",
      },
      products: {
        eyebrow: "当前结构",
        title: "7 个产品触点，一个清晰的主页。",
        description:
          "Koofy Lab 现在拥有多个网站和应用。这个页面把它们放进同一个框架中，让作品集看起来有意图，而不是分散。",
        sitesLabel: "网站",
        appsLabel: "应用",
        appsTitle: "应用",
        sitesTitle: "网站",
        apps: [
          {
            name: "Bus Pop",
            category: "手机游戏",
            description:
              "一款围绕公交、乘客、时机和爽快移动感设计的明亮解谜游戏。",
            status: "已上线",
            href: "/bus-pop/privacy",
          },
          {
            name: "Koofy Sudoku",
            category: "解谜应用",
            description: "为短时间专注和每日游玩设计的清爽数字谜题体验。",
            status: "开发中",
          },
          {
            name: "Koofy Mini Apps",
            category: "移动应用",
            description: "把小而实用的想法打磨成完整工具的移动实验。",
            status: "原型",
          },
        ],
        sites: [
          {
            name: "Koofy Lab",
            category: "品牌主页",
            description: "汇集 Koofy 产品、实验、政策和发布更新的主站。",
            status: "已上线",
            href: "/",
          },
          {
            name: "Koofy Web Tools",
            category: "工具网站",
            description:
              "用于日常任务、计算和轻量工作流的快速浏览器工具。",
            status: "评估中",
          },
          {
            name: "Test Experiences",
            category: "Web体验",
            description:
              "来自早期 Koofy 档案的轻量、易分享测试和趣味问答形式。",
            status: "归档",
          },
          {
            name: "AI Micro Tools",
            category: "AI网站",
            description: "一次专注解决一个明确任务的 AI 小工具。",
            status: "计划中",
          },
        ],
      },
      capabilities: {
        eyebrow: "我们做什么",
        title: "把有用的想法做得更轻。",
        description:
          "Koofy Lab 不是单一类别，而是一种把小想法变成有个性产品的方式。",
        items: [
          {
            title: "游戏",
            description:
              "制作清晰的规则、值得重复的小循环，以及明亮的互动手感。",
          },
          {
            title: "应用",
            description:
              "打造流程清楚、反馈明确、默认设置好用的移动产品。",
          },
          {
            title: "AI工具",
            description:
              "把重复工作压缩成更平静流程的实用型助手。",
          },
          {
            title: "Web工具",
            description:
              "制作容易发布、衡量、改进和复用的网站与工具。",
          },
        ],
      },
      process: {
        title: "Koofy Lab 的工作方式",
        principles: [
          "从足够小、可以发布的版本开始。",
          "让第一次互动一眼就懂。",
          "让体验保持轻快、快速、令人记住。",
        ],
      },
      refinement: {
        title: "这是一个方便继续打磨的第一版主页。",
        description:
          "这个版本先建立品牌、作品集、产品类别和联系方式的主框架。下一步可以替换临时产品名、添加商店链接，并决定旧 Web 工具是否继续公开。",
        tags: ["作品集", "商店准备", "搜索友好"],
      },
      operations: {
        eyebrow: "运营页面保持可用",
        title: "政策、应用广告和产品页面仍然可以访问。",
        description:
          "Bus Pop 隐私政策、ads.txt 和 app-ads.txt 会继续保留，用于商店审核、广告和现有应用要求。",
        cta: "Bus Pop 政策",
      },
    },
    about: {
      eyebrow: "关于",
      title: "Koofy Lab 是一个制作游戏、应用和 AI 工具的小型产品实验室。",
      description:
        "我们喜欢容易进入、快速理解、值得再次打开的产品。Koofy Lab 的存在，是为了把紧凑清晰的想法变成可以发布的体验。",
      values: [
        {
          title: "简单",
          description:
            "每个产品都从一个清楚的承诺和一个显而易见的第一步开始。",
        },
        {
          title: "有趣",
          description:
            "即使是实用工具，也应该有节奏、反馈和一点点愉悦感。",
        },
        {
          title: "灵活",
          description:
            "我们用小步快跑的方式构建，从结果中学习，并改进真正获得关注的部分。",
        },
      ],
      fitTitle: "Koofy Lab 可以承载什么",
      fitDescription:
        "Koofy Lab 可以承载多个不同触点：手机游戏、解谜应用、AI 助手、Web 工具、实验项目，以及已发布应用的政策页面。关键是品牌主页要说明它们为什么属于同一个整体。",
    },
    contact: {
      eyebrow: "联系",
      title: "联系 Koofy Lab",
      description:
        "产品问题、应用隐私请求、商店审核问题、合作或反馈，都可以发送到 Koofy Lab 邮箱。",
      emailTitle: "邮箱",
      emailNote: "如果内容与某个应用或网站有关，请同时写明产品名称。",
      policyPrompt: "在寻找 Bus Pop 隐私政策吗？",
      policyCta: "打开政策页面",
    },
    privacy: {
      title: "隐私政策",
      updatedLabel: "最后更新",
      updatedAt: "2026-06-26",
      sections: [
        {
          heading: "1. 概述",
          body: "Koofy Lab 重视用户隐私，并遵守适用的隐私相关法律。本政策说明用户访问网站、查看产品信息、联系我们或访问应用相关政策页面时，可能被处理的信息类型和目的。",
        },
        {
          heading: "2. 我们可能收集的信息",
          bullets: [
            "用户在咨询时直接提供的邮箱地址、姓名和消息内容",
            "用于服务改进和安全维护的访问记录、浏览器信息和设备信息",
            "广告或分析工具可能处理的 Cookie 或类似标识符",
          ],
        },
        {
          heading: "3. 处理目的",
          bullets: [
            "确认并回复咨询",
            "运营网站、改进质量、检查错误并维护安全",
            "处理产品更新、政策通知、应用审核和广告运营",
            "遵守相关法律或平台政策",
          ],
        },
        {
          heading: "4. Cookie 与广告",
          body: "网站可能为了便利性、服务改进和广告运营使用 Cookie 或类似技术。用户可以在浏览器设置中拒绝或删除 Cookie。如果使用 Google AdSense、Google AdMob 等第三方广告服务，也可能适用相关提供方的政策。",
        },
        {
          heading: "5. 保存期限",
          body: "个人信息会在收集和使用目的达成后及时删除。但咨询记录、安全日志、争议相关记录或法律要求保存的信息，可能会在必要期间内保留。",
        },
        {
          heading: "6. 第三方与服务提供商",
          body: "Koofy Lab 不出售用户个人信息。为了网站运营、邮件回复、广告、分析或应用功能，云服务、广告网络、分析工具等第三方服务可能在必要范围内处理数据。在这种情况下，相关提供方的隐私政策可能适用。",
        },
        {
          heading: "7. 用户权利",
          body: "用户可以请求访问、更正、删除或限制处理个人信息。请求可以发送至下方邮箱，Koofy Lab 将根据适用法律在合理期间内处理。",
        },
        {
          heading: "8. 联系方式",
          bullets: [
            "隐私联系人：Koofy Lab 隐私团队",
            "邮箱：koofylab@gmail.com",
          ],
        },
        {
          heading: "9. 变更",
          body: "本隐私政策可能因服务、产品、法律或平台政策变化而更新。更新内容会发布在本页面。",
        },
      ],
    },
    terms: {
      title: "服务条款",
      sections: [
        {
          heading: "第1条 目的",
          body: "本条款旨在规定 Koofy Lab 通过 koofy.co.kr 提供的产品介绍、Web 内容、应用相关政策页面和咨询回复等服务的使用条件和流程。",
        },
        {
          heading: "第2条 服务提供与变更",
          body: "Koofy Lab 可能提供游戏、应用、AI 工具、Web 工具、产品介绍页面和应用隐私政策等多种数字服务。服务内容和提供方式可能根据运营情况进行变更、增加或中止。",
        },
        {
          heading: "第3条 用户义务",
          bullets: [
            "用户必须遵守相关法律和本条款。",
            "用户不得妨碍网站或应用的正常运营。",
            "用户不得侵犯他人的权利、隐私或知识产权。",
          ],
        },
        {
          heading: "第4条 知识产权",
          body: "网站中包含的标志、图片、文案、UI、内容、应用和服务相关资料的权利归 Koofy Lab 或相应权利人所有。未经事先许可，不得复制、分发、修改或用于商业用途。",
        },
        {
          heading: "第5条 免责声明",
          body: "Koofy Lab 不保证免费提供的信息或服务适用于特定目的，也不保证持续可用。用户应将提供的信息作为参考使用，外部链接或第三方服务适用相关提供方的政策。",
        },
        {
          heading: "第6条 条款变更",
          body: "本条款可能因服务变化、运营需要或相关法律变化而更新。更新内容会发布在本页面，重要变更可能通过合理方式告知。",
        },
      ],
    },
  },
};

export function isLanguageCode(value: string | null): value is LanguageCode {
  return Boolean(value && value in translations);
}

export function getHtmlLang(language: LanguageCode) {
  return languages.find((item) => item.code === language)?.htmlLang ?? "en";
}
