"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Mail,
  Headphones,
  SlidersHorizontal,
  Library,
} from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { copy, getProducts, type Product } from "../../lib/marketing";

export function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  return (
    <Link
      href={product.href}
      className={`product-card product-${product.slug}`}
    >
      <div className="product-visual">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt || product.name}
            fill
            sizes="(max-width: 700px) 92vw, 540px"
            className={
              product.slug === "koofy-reader" ? "reader-thumb" : "product-cover"
            }
          />
        ) : (
          <div className="product-type-art">
            <Gamepad2 size={44} aria-hidden="true" />
            <span>{product.name}</span>
          </div>
        )}
        <span className="product-open" aria-hidden="true">
          <ArrowUpRight size={22} />
        </span>
      </div>
      <div className="product-caption">
        <div>
          <span className="eyebrow">{product.status}</span>
          <h3>{product.name}</h3>
        </div>
        <p>{product.description}</p>
        <span className="text-link">
          {copy[language].detail} <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
export function ContactBand() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <section className="contact-band">
      <div>
        <p className="eyebrow">SAY HELLO</p>
        <h2>{t.contactTitle}</h2>
        <p>{t.contactBody}</p>
      </div>
      <a className="brand-button light" href="mailto:koofylab@gmail.com">
        {t.contact}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </section>
  );
}
export function HomePage() {
  const { language } = useLanguage();
  const t = copy[language];
  const products = getProducts(language);
  return (
    <div className="marketing home-marketing">
      <section className="brand-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="brand-dot" /> MADE FOR YOUR EVERYDAY
          </p>
          <h1>{t.title}</h1>
          <p className="hero-description">{t.intro}</p>
          <Link className="brand-button" href="/products">
            {t.explore}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <div className="hero-signature">
            <span>READ.</span>
            <span>PLAY.</span>
            <span>MAKE.</span>
          </div>
        </div>
        <div className="hero-showcase">
          <div className="showcase-orbit" aria-hidden="true" />
          <span className="showcase-star" aria-hidden="true">
            ✳
          </span>
          <div className="showcase-reader">
            <Image
              src="/products/reader-library.webp"
              alt={t.readerFeatures[0]}
              width={585}
              height={1266}
              priority
              sizes="(max-width: 700px) 210px, 290px"
            />
          </div>
          <Link className="showcase-game" href="/products/bus-pop">
            <Image
              src="/products/buspop.png"
              alt="Bus Pop"
              width={480}
              height={300}
              sizes="(max-width: 700px) 150px, 230px"
            />
            <span>
              Bus Pop <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </Link>
          <span className="showcase-label">
            <BookOpen size={17} aria-hidden="true" /> {t.reader}
            <span>TXT · EPUB · TTS</span>
          </span>
        </div>
      </section>
      <section className="marketing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED PRODUCTS</p>
            <h2>{t.selected}</h2>
            <p>{t.selectedBody}</p>
          </div>
          <Link className="text-link" href="/products">
            {t.all}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <Link href="/koofy-reader" className="reader-feature">
          <div className="reader-feature-copy">
            <Image
              src="/products/reader-icon.webp"
              alt=""
              width={56}
              height={56}
            />
            <span className="eyebrow">KOOFY READER / {t.upcoming}</span>
            <h3>{t.readerTitle}</h3>
            <p>{t.readerBody}</p>
            <span className="text-link">
              {t.detail}
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </div>
          <div className="reader-feature-screen">
            <Image
              src="/products/reader-wide.webp"
              alt={t.readerFeatures[1]}
              width={1032}
              height={1376}
              sizes="(max-width: 700px) 85vw, 560px"
            />
          </div>
        </Link>
        <div className="product-grid featured-grid">
          {products
            .filter((p) => ["bus-pop", "koofy-sudoku"].includes(p.slug))
            .map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
        </div>
      </section>
      <section className="brand-values marketing-section">
        <div>
          <p className="eyebrow">THE KOOFY WAY</p>
          <h2>{t.valuesTitle}</h2>
          <Link className="text-link" href="/about">
            {t.about}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="value-list">
          {t.values.map((v, i) => (
            <div key={v}>
              <span className="value-number">0{i + 1}</span>
              <div>
                <h3>{v}</h3>
                <p>{t.valueBodies[i]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <ContactBand />
    </div>
  );
}
export function ProductsPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const products = getProducts(language);
  return (
    <div className="marketing">
      <PageIntro
        eyebrow="OUR PRODUCTS"
        title={t.catalogTitle}
        body={t.catalogBody}
      />
      <nav className="catalog-tabs" aria-label={t.products}>
        <a href="#apps">
          {t.apps}
          <ArrowRight size={16} />
        </a>
        <a href="#projects">
          {t.cases}
          <ArrowRight size={16} />
        </a>
      </nav>
      <section id="apps" className="marketing-section">
        <h2>{t.apps}</h2>
        <div className="product-grid">
          {products
            .filter((p) => p.kind === "app")
            .map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
        </div>
      </section>
      <section id="projects" className="marketing-section">
        <h2>{t.cases}</h2>
        <p>{t.casesBody}</p>
        <div className="product-grid">
          {products
            .filter((p) => p.kind === "case")
            .map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
        </div>
      </section>
      <ContactBand />
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}
export function ReaderPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const features = [
    { image: "/products/reader-library.webp", icon: Library },
    { image: "/products/reader-wide.webp", icon: BookOpen },
    { image: "/products/reader-settings.webp", icon: SlidersHorizontal },
    { image: "/products/reader-speech.webp", icon: Headphones },
  ];
  return (
    <div className="marketing reader-page">
      <Link href="/products" className="text-link">
        ← {t.products}
      </Link>
      <section className="reader-hero">
        <div>
          <Image
            src="/products/reader-icon.webp"
            alt=""
            width={72}
            height={72}
          />
          <p className="eyebrow">{t.reader} · TXT / EPUB / TTS</p>
          <h1>{t.readerTitle}</h1>
          <p className="hero-description">{t.readerBody}</p>
          <div className="release-notice">
            <span className="status-dot" />
            {t.releaseNote}
          </div>
          <Link href="/koofy-reader/support" className="text-link">
            {t.support}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="reader-hero-image">
          <Image
            src="/products/reader-library.webp"
            alt={t.readerFeatures[0]}
            width={585}
            height={1266}
            priority
            sizes="(max-width: 700px) 260px, 320px"
          />
        </div>
      </section>
      {features.map((f, i) => (
        <section
          key={f.image}
          className={`reader-story ${i % 2 ? "reverse" : ""}`}
        >
          <div className="story-copy">
            <f.icon size={28} aria-hidden="true" />
            <p className="eyebrow">0{i + 1}</p>
            <h2>{t.readerFeatures[i]}</h2>
            <p>{t.readerFeatureBodies[i]}</p>
          </div>
          <figure className="story-image">
            <Image
              src={f.image}
              alt={t.readerFeatures[i]}
              width={i === 1 ? 1032 : 585}
              height={i === 1 ? 1376 : 1266}
              sizes="(max-width: 700px) 85vw, 480px"
            />
            <figcaption>{t.screenshots}</figcaption>
          </figure>
        </section>
      ))}
      <div className="reader-links">
        <Link href="/koofy-reader/privacy">
          {t.privacy}
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/koofy-reader/support">
          {t.support}
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/products">
          {t.related}
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <ContactBand />
    </div>
  );
}
export function ProductPage({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const t = copy[language];
  const product = getProducts(language).find((p) => p.slug === slug)!;
  return (
    <div className="marketing product-detail">
      <Link href="/products" className="text-link">
        ← {t.products}
      </Link>
      <PageIntro
        eyebrow={product.status}
        title={product.name}
        body={product.description}
      />
      {product.image && (
        <div className="detail-image">
          <Image
            src={product.image}
            alt={product.imageAlt || product.name}
            width={1536}
            height={1024}
            sizes="(max-width: 700px) 92vw, 1080px"
            priority
          />
        </div>
      )}
      <section className="detail-actions">
        <h2>{t.overview}</h2>
        {product.links?.length ? (
          <div className="store-links">
            {product.links.map((l) => (
              <a
                className="brand-button"
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        ) : (
          <p>{t.unavailable}</p>
        )}
        <div className="reader-links">
          {product.privacy && (
            <Link href={product.privacy}>
              {t.privacy}
              <ArrowUpRight size={16} />
            </Link>
          )}
          {product.terms && (
            <Link href={product.terms}>
              {t.terms}
              <ArrowUpRight size={16} />
            </Link>
          )}
          <Link href="/support">
            {t.support}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <ContactBand />
    </div>
  );
}
export function PoliciesPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const products = getProducts(language).filter((p) => p.privacy || p.terms);
  return (
    <div className="marketing">
      <PageIntro
        eyebrow="PRIVACY & TERMS"
        title={t.policyTitle}
        body={t.policyBody}
      />
      <div className="policy-grid">
        {[
          {
            slug: "website",
            name: t.website,
            privacy: "/privacy",
            terms: "/terms",
          },
          ...products,
        ].map((p) => (
          <section className="policy-card" key={p.slug}>
            <h2>{p.name}</h2>
            {p.privacy && (
              <Link href={p.privacy}>
                {t.privacy}
                <ArrowUpRight size={18} />
              </Link>
            )}
            {p.terms && (
              <Link href={p.terms}>
                {t.terms}
                <ArrowUpRight size={18} />
              </Link>
            )}
          </section>
        ))}
      </div>
      <ContactBand />
    </div>
  );
}
export function SupportPage() {
  const { language } = useLanguage();
  const t = copy[language];
  return (
    <div className="marketing">
      <PageIntro
        eyebrow="HERE TO HELP"
        title={t.supportTitle}
        body={t.supportBody}
      />
      <section className="support-email">
        <Mail size={30} aria-hidden="true" />
        <a href="mailto:koofylab@gmail.com">
          koofylab@gmail.com
          <ArrowUpRight size={24} />
        </a>
        <p>{t.supportNote}</p>
      </section>
      <div className="policy-grid">
        <section className="policy-card">
          <h2>{t.reader}</h2>
          <Link href="/koofy-reader/support">
            {t.support}
            <ArrowUpRight size={18} />
          </Link>
        </section>
        <section className="policy-card">
          <h2>{t.policies}</h2>
          <Link href="/policies">
            {t.policyTitle}
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  );
}
export function AboutPage() {
  const { language, text } = useLanguage();
  const t = copy[language];
  return (
    <div className="marketing">
      <PageIntro
        eyebrow="ABOUT KOOFY LAB"
        title={t.title}
        body={text.about.description}
      />
      <section className="about-statement">
        <Image src="/KoofyLab2.png" alt="Koofy Lab" width={140} height={140} />
        <div>
          <h2>{t.valuesTitle}</h2>
          <p>{text.about.fitDescription}</p>
        </div>
      </section>
      <section className="about-values">
        {t.values.map((v, i) => (
          <article key={v}>
            <span className="value-number">0{i + 1}</span>
            <h2>{v}</h2>
            <p>{t.valueBodies[i]}</p>
          </article>
        ))}
      </section>
      <ContactBand />
    </div>
  );
}
