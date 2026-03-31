import "../styles/globals.css"
import type { Metadata } from "next"
import Header from "../components/Header"
import Footer from "../components/Footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koofy.co.kr"),
  title: "쿠피 - 간편계산기 모음",
  description: "쿠피(Koofy)에서 연봉 실수령, 최저임금, 종합소득세, 3.3% 환급 계산기를 빠르게 이용해보세요.",
  keywords: [
    "쿠피",
    "Koofy",
    "간편계산기",
    "연봉 실수령 계산기",
    "최저임금 계산기",
    "종합소득세 계산기",
    "3.3% 환급 계산기",
    "급여 계산기",
    "세금 계산기"
  ],
  authors: [{ name: "쿠피 (Koofy)" }],
  openGraph: {
    title: "쿠피 - 간편계산기 모음",
    description: "쿠피에서 급여·세금 계산기를 빠르게 확인해보세요.",
    url: "https://www.koofy.co.kr",
    siteName: "쿠피 Koofy",
    images: [
      {
        url: "/mainlogo.png",
        width: 1200,
        height: 500,
        alt: "쿠피 메인 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "쿠피 - 간편계산기 모음",
    description: "쿠피(Koofy)에서 급여·세금 계산기를 빠르게 이용해보세요.",
    images: ["/mainlogo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5773331970563455" />
        <meta name="naver-site-verification" content="1f50027c394809c61b707329ad32b6ba9df23c8b" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
