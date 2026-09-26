import type { Metadata } from "next";
import { ReaderPage } from "../../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "쿠피리더 — TXT·EPUB 뷰어와 TTS | Koofy Lab",
  description:
    "나만의 서재, 글꼴과 배경 설정, 넓은 화면 독서와 기기 음성 듣기를 지원하는 쿠피리더.",
  alternates: { canonical: "/koofy-reader" },
};
export default function Page() {
  return <ReaderPage />;
}
