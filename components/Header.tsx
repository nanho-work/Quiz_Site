"use client"

import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <Image
                src="/koofy.png"
                alt="koofy logo"
                width={32}
                height={32}
                className="mr-2"
                style={{ height: "32px", width: "auto" }}
                priority
              />
              <span className="text-xl font-extrabold tracking-tight">koofy 간편계산기</span>
            </Link>
          </div>

          <nav className="flex items-center gap-4 text-xs md:text-sm font-semibold">
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              소개
            </Link>
            <Link href="/privacy" className="text-foreground hover:text-primary transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-foreground hover:text-primary transition-colors">
              이용약관
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
