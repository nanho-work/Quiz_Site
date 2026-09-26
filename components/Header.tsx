"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowUpRight, Menu, X } from "lucide-react";
import LanguageSelect from "./LanguageSelect";
import { useLanguage } from "./LanguageProvider";
import { copy, getProducts } from "../lib/marketing";

export default function Header() {
  const { language } = useLanguage();
  const t = copy[language];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setMobile(false);
  }, [pathname]);
  useEffect(() => {
    function outside(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
        setMobile(false);
      }
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (open) {
          setOpen(false);
          trigger.current?.focus();
        } else if (mobile) {
          setMobile(false);
          mobileTrigger.current?.focus();
        }
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, mobile]);
  const close = () => {
    setOpen(false);
    setMobile(false);
  };
  return (
    <header ref={root} className="brand-header">
      <div className="brand-header-inner">
        <Link href="/" className="brand-logo" onClick={close}>
          <Image src="/KoofyLab2.png" alt="" width={36} height={36} />
          <span>
            Koofy Lab<span className="logo-period">.</span>
          </span>
        </Link>
        <div className="header-actions">
          <nav
            id="mobile-navigation"
            className={`brand-nav ${mobile ? "is-open" : ""}`}
            aria-label={t.menu}
          >
            <div className="products-nav">
              <button
                ref={trigger}
                type="button"
                aria-expanded={open}
                aria-controls="products-panel"
                onClick={() => setOpen(!open)}
                className={
                  pathname.startsWith("/products") ||
                  pathname === "/koofy-reader"
                    ? "active"
                    : ""
                }
              >
                {t.products}
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {open && (
                <div id="products-panel" className="products-panel">
                  <Link
                    href="/products"
                    className="products-all"
                    onClick={close}
                  >
                    {t.all}
                    <ArrowUpRight size={18} />
                  </Link>
                  <p>{t.apps}</p>
                  {getProducts(language)
                    .filter((p) => p.kind === "app")
                    .map((p) => (
                      <Link
                        key={p.slug}
                        href={p.href}
                        onClick={close}
                        aria-current={pathname === p.href ? "page" : undefined}
                      >
                        {p.name}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    ))}
                  <Link
                    href="/products#projects"
                    className="products-all"
                    onClick={close}
                  >
                    {t.cases}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/about"
              onClick={close}
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              {t.about}
            </Link>
            <Link
              href="/support"
              onClick={close}
              aria-current={pathname === "/support" ? "page" : undefined}
            >
              {t.support}
            </Link>
          </nav>
          <LanguageSelect />
          <button
            ref={mobileTrigger}
            className="mobile-nav-toggle"
            type="button"
            aria-label={mobile ? t.close : t.menu}
            aria-expanded={mobile}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMobile(!mobile);
              setOpen(false);
            }}
          >
            {mobile ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}
