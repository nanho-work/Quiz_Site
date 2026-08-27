import type { Metadata } from "next";

import SlimeStrikeForceLegalClient from "../../../components/legal/SlimeStrikeForceLegalClient";

export const metadata: Metadata = {
  title: "슬라임특공대 개인정보 처리방침 | Koofy Lab",
  description: "Koofy Lab 슬라임특공대 앱의 개인정보 처리방침입니다.",
  alternates: {
    canonical: "/slime-strike-force/privacy",
    languages: {
      ko: "/slime-strike-force/privacy?lang=ko",
      en: "/slime-strike-force/privacy?lang=en",
      ja: "/slime-strike-force/privacy?lang=ja",
      zh: "/slime-strike-force/privacy?lang=zh",
    },
  },
};

export default function SlimeStrikeForcePrivacyPage() {
  return <SlimeStrikeForceLegalClient kind="privacy" />;
}
