import type { Metadata } from "next";
import { HomePage } from "../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "Koofy Lab | 일상에 쓸모를, 순간에 즐거움을",
  description:
    "읽고, 즐기고, 일하는 시간을 위한 쿠피의 앱과 웹서비스를 만나보세요.",
  alternates: { canonical: "/" },
};
export default function Page() {
  return <HomePage />;
}
