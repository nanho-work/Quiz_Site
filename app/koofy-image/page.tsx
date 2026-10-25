import DiscoveryLinks from "../../components/discovery/DiscoveryLinks";
import type { Metadata } from "next";
import ImageTool from "../../components/image-tools/ImageTool";
const title = "쿠피 이미지 — 무료 HEIC·JPG 변환, 사진 용량 줄이기";
const description =
  "가입 없이 사진 최대 10장을 JPG·PNG·WebP로 변환하고 용량을 줄이세요. 아이폰 HEIC/HEIF 지원. 사진은 서버 업로드 없이 기기에서 처리됩니다.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/koofy-image" },
  openGraph: {
    title,
    description,
    url: "/koofy-image",
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary", title, description },
};
export default function Page() {
  return <><ImageTool /><DiscoveryLinks /></>;
}
