import "../styles/globals.css"
import type { Metadata } from "next"
import Header from "../components/Header"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "심리테스트 - 재미있는 무료 성격 검사",
  description: "에겐남/테토남, MBTI 등 다양한 심리테스트를 무료로 즐겨보세요. 나의 성격 유형을 간단히 확인할 수 있습니다!",
  keywords: ["심리테스트", "무료테스트", "성격검사", "MBTI", "에겐남", "테토남"],
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
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}