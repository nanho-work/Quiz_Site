import DiscoveryLinks from '../components/discovery/DiscoveryLinks';
import { brandSchema, jsonLd } from '../lib/discovery';
import type { Metadata } from "next";
import { HomePage } from "../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "쿠피랩(Koofy Lab) | 쿠피리더·쿠피 이미지 공식 홈페이지",
  description:
    "쿠피(Koofy) 공식 홈페이지. 쿠피리더 TXT·EPUB 독서 앱과 쿠피 이미지 사진 변환·용량 줄이기 도구, 한국어·영어·일본어 사용 가이드를 만나보세요.",
  alternates: { canonical: "/" },
};
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(brandSchema) }} /><HomePage /><DiscoveryLinks /></>;
}
