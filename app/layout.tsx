import "../styles/globals.css"
import type { Metadata } from "next"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koofy.co.kr"),
  title: "쿠피 - 모두의 즐거움 | 심리테스트",
  description: "쿠피(Koofy)에서 다양한 심리테스트 콘텐츠를 즐겨보세요. 간단하고 재미있게 모두의 즐거움을 경험할 수 있습니다.",
  keywords: [
    "쿠피",
    "Koofy",
    "모두의 즐거움",
    "심리테스트",
    "재미있는 테스트",
    "퀴즈",
    "무료 심리테스트",
    "온라인 테스트",
    "재미있는 심리테스트",
    "성격유형 테스트",
    "간단 퀴즈",
    "테스트 모음",
    "무료 퀴즈 사이트"
  ],
  authors: [{ name: "쿠피 (Koofy)" }],
  openGraph: {
    title: "쿠피 - 모두의 즐거움 | 심리테스트",
    description: "쿠피에서 다양한 심리테스트 콘텐츠로 즐거움을 경험해보세요.",
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
    title: "쿠피 - 모두의 즐거움 | 심리테스트",
    description: "쿠피(Koofy)에서 다양한 심리테스트 콘텐츠를 즐겨보세요.",
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5773331970563455" />
        <meta name="naver-site-verification" content="1f50027c394809c61b707329ad32b6ba9df23c8b" />
      </head>
      <body className="min-h-screen bg-white text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
