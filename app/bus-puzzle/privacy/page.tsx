import type { Metadata } from "next";
import Link from "next/link";

import {
  busPuzzlePrivacyLanguages,
  getBusPuzzlePrivacyContent,
} from "../../../lib/legal/busPuzzlePrivacy";

export const metadata: Metadata = {
  title: "Bus Puzzle 개인정보 처리방침 | Koofy",
  description: "Koofy Lab Bus Puzzle 앱의 개인정보 처리방침입니다.",
  alternates: {
    canonical: "/bus-puzzle/privacy",
    languages: {
      ko: "/bus-puzzle/privacy?lang=ko",
      en: "/bus-puzzle/privacy?lang=en",
    },
  },
};

type PageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function BusPuzzlePrivacyPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const content = getBusPuzzlePrivacyContent(params.lang);

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">Bus Puzzle</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{content.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {content.updatedLabel}: {content.updatedAt}
          </p>
        </div>

        <nav className="flex shrink-0 gap-2" aria-label="Language selection">
          {busPuzzlePrivacyLanguages.map((language) => {
            const isActive = language.code === content.languageCode;

            return (
              <Link
                key={language.code}
                href={`/bus-puzzle/privacy?lang=${language.code}`}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {language.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <p className="mb-10 rounded-2xl border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        {content.intro}
      </p>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 text-xl font-semibold text-foreground">{section.heading}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-2">
                {paragraph}
              </p>
            ))}

            {section.bullets ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 text-xl font-semibold text-foreground">{content.contactLabel}</h2>
          <a className="underline underline-offset-4" href={`mailto:${content.contactEmail}`}>
            {content.contactEmail}
          </a>
        </section>
      </div>
    </section>
  );
}
