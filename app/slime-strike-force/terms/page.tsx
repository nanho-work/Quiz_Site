import type { Metadata } from "next";

import SlimeStrikeForceLegalClient from "../../../components/legal/SlimeStrikeForceLegalClient";

export const metadata: Metadata = {
  title: "슬라임특공대 이용약관 | Koofy Lab",
  description: "Koofy Lab 슬라임특공대 앱의 이용약관입니다.",
  alternates: {
    canonical: "/slime-strike-force/terms",
    languages: {
      ko: "/slime-strike-force/terms?lang=ko",
      en: "/slime-strike-force/terms?lang=en",
      ja: "/slime-strike-force/terms?lang=ja",
      zh: "/slime-strike-force/terms?lang=zh",
    },
  },
};

export default function SlimeStrikeForceTermsPage() {
  return <SlimeStrikeForceLegalClient kind="terms" />;
}
