import "../styles/globals.css";
import "../styles/marketing.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LanguageProvider } from "../components/LanguageProvider";
import { RootChrome } from "../components/RootChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koofy.co.kr"),
  title: "쿠피랩(Koofy Lab) | 앱과 웹 도구",
  description:
    "쿠피랩의 독서 앱 쿠피리더, 사진 변환 도구 쿠피 이미지와 일상에 유용한 앱·웹서비스를 만나보세요.",
  keywords: [
    "Koofy Lab",
    "Koofy",
    "쿠피",
    "쿠피랩",
    "Bus Pop",
    "Koofy Sudoku",
    "mobile games",
    "AI tools",
    "web utilities",
  ],
  authors: [{ name: "Koofy Lab" }],
  openGraph: {
    title: "쿠피랩(Koofy Lab) | 앱과 웹 도구",
    description:
      "쿠피리더, 쿠피 이미지와 일상에 유용한 앱·웹서비스.",
    url: "https://www.koofy.co.kr",
    siteName: "쿠피랩 · Koofy Lab",
    images: [
      {
        url: "/KoofyLab_Banner.png",
        width: 1536,
        height: 1024,
        alt: "Koofy Lab banner",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "쿠피랩(Koofy Lab) | 앱과 웹 도구",
    description:
      "쿠피리더, 쿠피 이미지와 일상에 유용한 앱·웹서비스.",
    images: ["/KoofyLab_Banner.png"],
  },
  icons: {
    icon: "/KoofyLab2.png",
    shortcut: "/KoofyLab2.png",
    apple: "/KoofyLab2.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5773331970563455" />
        <meta
          name="naver-site-verification"
          content="1f50027c394809c61b707329ad32b6ba9df23c8b"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <LanguageProvider>
          <RootChrome header={<Header />} footer={<Footer />}>
            {children}
          </RootChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
