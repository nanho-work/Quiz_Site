"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ExternalLink,
  Gamepad2,
  Globe2,
  Layers,
  Mail,
  Puzzle,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";

import { useLanguage } from "../components/LanguageProvider";

const capabilityIcons = [Gamepad2, Smartphone, Bot, Wrench];

type ProductCardProps = {
  product: {
    name: string;
    category: string;
    description: string;
    status: string;
    image?: string;
    imageAlt?: string;
    href?: string;
    links?: Array<{
      label: string;
      href: string;
    }>;
  };
  openLabel: string;
};

function ProductCard({ product, openLabel }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
      {product.image ? (
        <div className="relative aspect-[3/2] border-b border-border bg-muted">
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 100vw"
            className="object-contain"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              {product.category}
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground">
              {product.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
            {product.status}
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        {product.links?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {product.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : product.href ? (
          <Link
            href={product.href}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            {openLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  const { text } = useLanguage();
  const home = text.home;

  return (
    <div className="space-y-20">
      <section className="relative left-1/2 min-h-[74vh] w-screen -translate-x-1/2 overflow-hidden bg-[#f7fbff]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage: "url('/KoofyLab_Banner.png')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/15"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[74vh] max-w-6xl items-center px-4 py-24 sm:px-6 md:py-28 lg:px-8">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-bold uppercase text-primary shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {home.hero.eyebrow}
            </p>
            <h1 className="whitespace-pre-line text-4xl font-black leading-tight text-foreground md:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
              {home.hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                {home.hero.productsCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="mailto:koofylab@gmail.com"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white/85 px-5 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/30 hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {home.hero.contactCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="grid scroll-mt-24 gap-10 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-primary">
            {home.products.eyebrow}
          </p>
          <h2 className="text-3xl font-black text-foreground md:text-4xl">
            {home.products.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {home.products.description}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-3xl font-black text-foreground">
                {home.products.sites.length}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {home.products.sitesLabel}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-3xl font-black text-foreground">
                {home.products.apps.length}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {home.products.appsLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-black text-foreground">
                {home.products.appsTitle}
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {home.products.apps.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  openLabel={text.common.open}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-black text-foreground">
                {home.products.sitesTitle}
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {home.products.sites.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  openLabel={text.common.open}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-primary">
              {home.capabilities.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-foreground">
              {home.capabilities.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {home.capabilities.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {home.capabilities.items.map((item, index) => {
            const Icon = capabilityIcons[index] ?? Wrench;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-border bg-background p-5"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="whitespace-nowrap text-base font-black text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
          <Rocket className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-black text-foreground">
            {home.process.title}
          </h2>
          <div className="mt-6 space-y-4">
            {home.process.principles.map((principle, index) => (
              <div key={principle} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-6 text-muted-foreground">
                  {principle}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-[#0d1b3d] p-6 text-white shadow-sm md:p-8">
          <Layers className="h-7 w-7 text-[#34d5ff]" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-black">
            {home.refinement.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/75">
            {home.refinement.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/80">
            {home.refinement.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-primary/20 bg-primary/5 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              {home.operations.eyebrow}
            </div>
            <h2 className="text-2xl font-black text-foreground">
              {home.operations.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {home.operations.description}
            </p>
          </div>
          <Link
            href="/bus-pop/privacy"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-card px-5 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            {home.operations.cta}
            <Puzzle className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
