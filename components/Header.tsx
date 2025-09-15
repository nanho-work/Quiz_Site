"use client"

import { ThemeToggle } from "./button/themetoggle"
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
    <header className="bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              koofy 모두의 즐거움!
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex font-bold text-lg space-x-8">
            <Link
              href="/testhub"
              className="text-foreground hover:text-primary transition-colors"
            >
              심리테스트
            </Link>
            {/* 게임 드롭다운 */}
            <div className="relative group">
              <Link href="/games" className="text-foreground hover:text-primary transition-colors cursor-pointer">
                게임
              </Link>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-card shadow-lg mt-0 rounded-md w-40 z-50">
                <Link
                  href="/games/sudoku"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-md w-full"
                >
                  스도쿠
                </Link>
                <Link
                  href="/games/speed"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-md w-full"
                >
                  순발력 테스트
                </Link>
                <Link
                  href="/games/whack"
                  className="flex items-center justify-start px-4 py-2 text-sm hover:bg-muted rounded-md w-full"
                >
                  두더지 잡기
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
          {/* Dark Mode Toggle & More Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="relative" ref={menuRef}>
              <span onClick={() => setOpen(!open)} className="cursor-pointer text-foreground font-bold hover:text-primary transition-colors">더보기</span>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-card shadow-lg ring-1 ring-black/5 z-50">
                  <div className="py-2">
                    <Link href="/games" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted">게임</Link>
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