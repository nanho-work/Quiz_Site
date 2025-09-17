import "../styles/globals.css"
import type { Metadata } from "next"
import Header from "../components/Header"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "모두의 즐거움",
  description: "에겐남/테토남, MBTI 등 다양한 심리테스트를 무료로 즐겨보세요. 나의 성격 유형을 간단히 확인할 수 있습니다!",
  keywords: [
    "MBTI",
    "MBTI 성격 유형",
    "성격 유형 테스트",
    "MBTI 무료 검사",
    "MBTI 검사",
    "MBTI 테스트",
    "무료 MBTI",
    "성격 유형 검사",
    "성격 심리 테스트",
    "MBTI 성격 유형 무료",
    "MBTI 유형별 특징",
    "16가지 성격 유형",
    "MBTI 무료 테스트",
    "MBTI 온라인 검사",
    "MBTI 결과 해석",
    "성격 유형 MBTI",
    "나의 MBTI",
    "MBTI 유형 알아보기",
    "에겐남 테스트",
    "테토남 테스트",
    "에겐녀 테스트",
    "테토녀 테스트",
    "에겐 테스트",
    "에겐남 심리테스트",
    "테토남 심리테스트",
    "에겐녀 심리테스트",
    "테토녀 심리테스트",
    "에겐 유형 검사",
    "쿠피 심리테스트",
    "구피 심리테스트",
    "쿠피 테스트",
    "구피 테스트",
    "간단 심리테스트",
    "무료 간단테스트",
    "재미있는 테스트",
    "유머 테스트",
    "쿠피 유머",
    "구피 유머",
    "MBTI test",
    "free MBTI test",
    "personality test",
    "psychological test",
    "fun personality quiz",
    "online MBTI test",
    "free personality quiz",
    "16 personalities",
    "MBTI types",
    "personality quiz",
    "Koofy test",
    "Koofy quiz",
    "Koofy personality test",
    "Koofy MBTI",
    "Goofy test",
    "Goofy quiz",
    "Goofy personality test",
    "Goofy MBTI",
    "Koofy fun test",
    "Goofy fun quiz"
  ],
  authors: [{ name: "Koofy" }],
  openGraph: {
    title: "심리테스트 - 재미있는 무료 성격 검사",
    description: "다양한 심리테스트로 나의 성격을 재미있게 알아보세요!",
    url: "koofy.co.kr",
    siteName: "Koofy 심리테스트",
    images: [
      {
        url: "/image_fun.png",
        width: 1200,
        height: 630,
        alt: "심리테스트 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "심리테스트 - 무료 성격 검사",
    description: "에겐남/테토남, MBTI 등 다양한 심리테스트를 무료로 즐겨보세요.",
    images: ["/image_fun.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5773331970563455" />
        <meta name="naver-site-verification" content="1f50027c394809c61b707329ad32b6ba9df23c8b" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}