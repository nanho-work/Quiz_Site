import type { Metadata } from "next";
import { AboutPage } from "../../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "쿠피 소개 | Koofy Lab",
  description: "작은 디테일로 더 나은 일상을 만드는 쿠피를 소개합니다.",
  alternates: { canonical: "/about" },
};
export default function Page() {
  return <AboutPage />;
}
