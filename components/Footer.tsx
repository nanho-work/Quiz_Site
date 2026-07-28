"use client";

import Link from "next/link";

import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { text } = useLanguage();
  const footerLinks = [
    { href: "/privacy", label: text.common.footer.privacy },
    { href: "/terms", label: text.common.footer.terms },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div>
          <p className="font-bold text-foreground">
            {text.common.footer.tagline}
          </p>
          <p className="mt-2">
            {text.common.footer.contact}:{" "}
            <a
              href="mailto:koofylab@gmail.com"
              className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
            koofylab@gmail.com
          </a>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Koofy Lab.{" "}
            {text.common.footer.rights}
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 md:justify-end">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-semibold transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
