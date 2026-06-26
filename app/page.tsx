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

const productTones = [
  {
    media: "bg-[#dff5ff]",
    dot: "bg-[#21b8ff]",
    ring: "group-hover:border-[#21b8ff]/50",
  },
  {
    media: "bg-[#fff3b9]",
    dot: "bg-[#ffbf1f]",
    ring: "group-hover:border-[#ffbf1f]/60",
  },
  {
    media: "bg-[#eef4ff]",
    dot: "bg-[#163764]",
    ring: "group-hover:border-[#163764]/30",
  },
  {
    media: "bg-[#fff0d7]",
    dot: "bg-[#e85d2a]",
    ring: "group-hover:border-[#e85d2a]/40",
  },
  {
    media: "bg-[#111111]",
    dot: "bg-[#ff8a00]",
    ring: "group-hover:border-[#ff8a00]/50",
  },
  {
    media: "bg-[#eaf3ff]",
    dot: "bg-[#2f6feb]",
    ring: "group-hover:border-[#2f6feb]/40",
  },
];

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
  toneIndex: number;
};

function ProductCard({ product, openLabel, toneIndex }: ProductCardProps) {
  const tone = productTones[toneIndex % productTones.length] ?? productTones[0];

  return (
    <article
      className={`group overflow-hidden rounded-lg border border-border bg-card shadow-[0_18px_50px_-34px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-34px_rgba(15,23,42,0.65)] ${tone.ring}`}
    >
      {product.image ? (
        <div
          className={`relative aspect-[16/10] overflow-hidden border-b border-border ${tone.media}`}
        >
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent"
            aria-hidden="true"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary">
              <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
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
      <section className="relative left-1/2 min-h-[78vh] w-screen -translate-x-1/2 overflow-hidden bg-[#f7fbff]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-95"
          style={{
            backgroundImage: "url('/KoofyLab_Banner.png')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center px-4 py-28 sm:px-6 md:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-bold uppercase text-primary shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {home.hero.eyebrow}
            </p>
            <h1 className="whitespace-pre-line text-4xl font-black leading-tight text-foreground md:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
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
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {home.capabilities.items.map((item, index) => {
                const Icon = capabilityIcons[index] ?? Wrench;

                return (
                  <div
                    key={item.title}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/70 bg-white/75 px-3 text-sm font-black text-foreground shadow-sm backdrop-blur"
                  >
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="min-w-0 truncate">{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="relative left-1/2 w-screen -translate-x-1/2 scroll-mt-24 bg-white py-16 shadow-[inset_0_1px_0_rgba(15,23,42,0.06),inset_0_-1px_0_rgba(15,23,42,0.06)] md:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-xs font-bold uppercase text-primary">
              {home.products.eyebrow}
            </p>
            <h2 className="text-3xl font-black leading-tight text-foreground md:text-5xl">
              {home.products.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              {home.products.description}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#163764]/15 bg-[#f4f8ff] p-4">
                <p className="text-3xl font-black text-[#163764]">
                  {home.products.sites.length}
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {home.products.sitesLabel}
                </p>
              </div>
              <div className="rounded-lg border border-[#ffbf1f]/25 bg-[#fff8d8] p-4">
                <p className="text-3xl font-black text-[#ad6a00]">
                  {home.products.apps.length}
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {home.products.appsLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-9">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-black text-foreground">
                  {home.products.appsTitle}
                </h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {home.products.apps.map((product, index) => (
                  <ProductCard
                    key={product.name}
                    product={product}
                    openLabel={text.common.open}
                    toneIndex={index}
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
              <div className="grid gap-5 sm:grid-cols-2">
                {home.products.sites.map((product, index) => (
                  <ProductCard
                    key={product.name}
                    product={product}
                    openLabel={text.common.open}
                    toneIndex={index + home.products.apps.length}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-primary">
              {home.capabilities.eyebrow}
            </p>
            <h2 className="max-w-md text-3xl font-black leading-tight text-foreground md:text-4xl">
              {home.capabilities.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground lg:hidden">
            {home.capabilities.description}
          </p>
        </div>

        <div>
          <p className="mb-5 hidden max-w-xl text-sm leading-6 text-muted-foreground lg:block">
            {home.capabilities.description}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {home.capabilities.items.map((item, index) => {
              const Icon = capabilityIcons[index] ?? Wrench;

              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-border bg-card p-5 shadow-sm"
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
