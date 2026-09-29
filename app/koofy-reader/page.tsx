import type { Metadata } from "next";
import { ReaderPage } from "../../components/marketing/Marketing";
import { readerAppStoreUrl } from "../../lib/marketing";

const title = "쿠피리더 — 아이폰 TXT·EPUB 뷰어, TTS 책 읽기 | Koofy Lab";
const description = "iPhone·iPad에서 TXT·EPUB 파일을 가져와 읽는 쿠피리더. 책 묶음, 이어 읽기, 글꼴 설정과 기기 음성 TTS를 지원합니다. App Store 다운로드와 사용 방법을 확인하세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/koofy-reader" },
  openGraph: {
    title, description, url: "/koofy-reader", siteName: "Koofy Lab",
    locale: "ko_KR", type: "website",
    images: [{ url: "/products/reader-wide.webp", width: 1032, height: 1376,
      alt: "쿠피리더의 넓은 화면 두 페이지 독서" }],
  },
  twitter: {
    card: "summary_large_image", title, description,
    images: ["/products/reader-wide.webp"],
  },
  appLinks: { ios: { url: readerAppStoreUrl, app_store_id: "6814514729", app_name: "쿠피리더" } },
  other: { "apple-itunes-app": "app-id=6814514729" },
};

export default function Page() {
  return <ReaderPage />;
}
