import type { Metadata } from "next";
import { SupportPage } from "../../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "고객 지원 | Koofy Lab",
  description: "쿠피 제품 문의, 오류 제보, 개인정보 관련 지원을 안내합니다.",
  alternates: { canonical: "/support" },
};
export default function Page() {
  return <SupportPage />;
}
