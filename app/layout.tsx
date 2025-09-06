import "../styles/globals.css"
import type { Metadata } from "next"
import Header from "../components/Header"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "심리테스트",
  description: "재미있는 심리테스트 모음",
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