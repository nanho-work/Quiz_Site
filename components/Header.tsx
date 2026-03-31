"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"


export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center font-semibold text-sm space-x-8">
            <div className="relative group">
              <Link href="/calculators" className="text-foreground hover:text-primary transition-colors cursor-pointer">
                간편계산기
              </Link>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-card border border-border shadow-lg mt-2 rounded-lg w-56 z-50">
                <Link
                  href="/income-tax-calculator"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-t-lg w-full"
                >
                  종합소득세 간편계산기
                </Link>
                <Link
                  href="/tax-refund-calculator"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-md w-full"
                >
                  3.3% 환급 계산기
                </Link>
                <Link
                  href="/salary-calculator"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-md w-full"
                >
                  연봉 실수령 계산기
                </Link>
                <Link
                  href="/minimum-wage-calculator"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-b-lg w-full"
                >
                  최저임금 계산기 (2026)
                </Link>
              </div>
            </div>
            {/*
            <Link
              href="/popular"
              className="text-foreground hover:text-primary transition-colors"
            >
              인기테스트
            </Link>
            <Link
              href="/new"
              className="text-foreground hover:text-primary transition-colors"
            >
              새로운테스트
            </Link>*/}
          </nav>
          {/* More Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={menuRef}>
              <span onClick={() => setOpen(!open)} className="cursor-pointer text-foreground text-sm font-semibold hover:text-primary transition-colors">더보기</span>
              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg z-50">
                  <div className="py-2">
                    <Link href="/calculators" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">간편계산기</Link>
                    <Link href="/income-tax-calculator" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">종합소득세 간편계산기</Link>
                    <Link href="/tax-refund-calculator" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">3.3% 환급 계산기</Link>
                    <Link href="/salary-calculator" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">연봉 실수령 계산기</Link>
                    <Link href="/minimum-wage-calculator" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">최저임금 계산기 (2026)</Link>
                    <Link href="/about" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">소개</Link>
                    <Link href="/contact" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">문의하기</Link>
                    <Link href="/privacy" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">개인정보처리방침</Link>
                    <Link href="/terms" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">이용약관</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
