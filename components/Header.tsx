"use client";

import Image from "next/image";
import Link from "next/link";

import LanguageSelect from "./LanguageSelect";
import { useLanguage } from "./LanguageProvider";

export default function Header() {
  const { text } = useLanguage();
  const navItems = [
    { href: "/#products", label: text.common.nav.products },
    { href: "/about", label: text.common.nav.about },
    { href: "/contact", label: text.common.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            <Image
              src="/KoofyLab2.png"
              alt="Koofy Lab logo"
              width={34}
              height={34}
              className="h-8 w-8 shrink-0 rounded-md object-contain"
              priority
            />
            <span className="truncate text-base font-black tracking-normal text-foreground sm:text-lg">
              {text.common.brand}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-2 text-xs font-bold sm:gap-4 sm:text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <LanguageSelect />
          </div>
        </div>
      </div>
    </header>
  );
}
