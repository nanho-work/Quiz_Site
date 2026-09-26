import type { Metadata } from "next";
import { PoliciesPage } from "../../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "개인정보 및 약관 | Koofy Lab",
  description: "쿠피 서비스별 개인정보처리방침과 이용약관을 확인하세요.",
  alternates: { canonical: "/policies" },
};
export default function Page() {
  return <PoliciesPage />;
}
