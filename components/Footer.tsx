"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { copy } from "../lib/marketing";
export default function Footer() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <footer className="brand-footer">
      <div className="footer-top">
        <div>
          <Link className="brand-logo" href="/">
            <Image src="/KoofyLab2.png" alt="" width={32} height={32} />
            <span>Koofy Lab.</span>
          </Link>
          <p>{t.intro}</p>
          <a href="mailto:koofylab@gmail.com">koofylab@gmail.com</a>
        </div>
        <nav aria-label={t.products}>
          <h2>{t.products}</h2>
          <Link href="/koofy-reader">{t.reader}</Link>
          <Link href="/products/bus-pop">Bus Pop</Link>
          <Link href="/products">{t.all}</Link>
        </nav>
        <nav aria-label={t.support}>
          <h2>{t.support}</h2>
          <Link href="/about">{t.about}</Link>
          <Link href="/support">{t.contact}</Link>
          <Link href="/policies">{t.policies}</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Koofy Lab.</span>
        <div>
          <Link href="/privacy">{t.privacy}</Link>
          <Link href="/terms">{t.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
