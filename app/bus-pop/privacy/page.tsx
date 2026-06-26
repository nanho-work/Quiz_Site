import type { Metadata } from "next";

import BusPopPrivacyClient from "../../../components/legal/BusPopPrivacyClient";

export const metadata: Metadata = {
  title: "Bus Pop 개인정보 처리방침 | Koofy",
  description: "Koofy Lab Bus Pop 앱의 개인정보 처리방침입니다.",
  alternates: {
    canonical: "/bus-pop/privacy",
    languages: {
      ko: "/bus-pop/privacy?lang=ko",
      en: "/bus-pop/privacy?lang=en",
    },
  },
};

export default function BusPuzzlePrivacyPage() {
  return <BusPopPrivacyClient />;
}
