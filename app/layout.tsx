import "../styles/globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LanguageProvider } from "../components/LanguageProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.koofy.co.kr"),
  title: "Koofy Lab - Games, Apps, and AI-Powered Tools",
  description:
    "Koofy Lab creates simple, fun, and memorable digital products across games, mobile apps, AI-powered tools, and web utilities.",
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
    title: "Koofy Lab - Simple, Fun, Memorable Experiences",
    description:
      "Games, apps, AI-powered tools, and web utilities by Koofy Lab.",
    url: "https://www.koofy.co.kr",
    siteName: "Koofy Lab",
    images: [
      {
        url: "/KoofyLab_Banner.png",
        width: 1536,
        height: 1024,
        alt: "Koofy Lab banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koofy Lab - Games, Apps, and AI-Powered Tools",
    description:
      "Simple, fun, and memorable digital products from Koofy Lab.",
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
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5773331970563455" />
        <meta
          name="naver-site-verification"
          content="1f50027c394809c61b707329ad32b6ba9df23c8b"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <LanguageProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
