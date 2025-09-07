"use client"

import { ThemeToggle } from "./button/themetoggle"
import Link from "next/link"


export default function Header() {
  return (
    <header className="bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <i className="fas fa-brain mr-2"></i>심리테스트
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex font-bold text-lg space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              홈
            </Link>
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
          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}