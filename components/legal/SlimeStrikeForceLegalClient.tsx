"use client";

import Link from "next/link";

import {
  getSlimeStrikeForceLegalContent,
  slimeStrikeForceLegalLanguages,
} from "../../lib/legal/slimeStrikeForceLegal";
import { useLanguage } from "../LanguageProvider";
import PrivacyPolicyNav from "./PrivacyPolicyNav";

type SlimeStrikeForceLegalKind = "privacy" | "terms";

export default function SlimeStrikeForceLegalClient({
  kind,
}: {
  kind: SlimeStrikeForceLegalKind;
}) {
  const { language, setLanguage } = useLanguage();
  const content = getSlimeStrikeForceLegalContent(language);
  const document = content[kind];
  const tabs = [
    {
      key: "privacy" as const,
      href: "/slime-strike-force/privacy",
      label: content.privacyTab,
    },
    {
      key: "terms" as const,
      href: "/slime-strike-force/terms",
      label: content.termsTab,
    },
  ];

  return (
    <section className="mx-auto max-w-4xl">
      <PrivacyPolicyNav active="slime-strike-force" />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">
            {content.productName}
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">{document.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {document.updatedLabel}: {document.updatedAt}
          </p>
        </div>

        <nav className="flex shrink-0 flex-wrap gap-2" aria-label="Language selection">
          {slimeStrikeForceLegalLanguages.map((item) => {
            const isActive = item.code === content.languageCode;

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <nav
        className="mb-8 grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-2"
        aria-label={`${content.productName} legal documents`}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === kind;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "rounded-lg px-4 py-3 text-center text-sm font-bold transition sm:text-base",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <p className="mb-10 rounded-lg border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        {document.intro}
      </p>

      <div className="space-y-8 leading-relaxed text-muted-foreground">
        {document.sections.map((section) => (
          <section key={section.heading} id={section.id}>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              {section.heading}
            </h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-2">
                {paragraph}
              </p>
            ))}

            {section.bullets ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}

            {section.links ? (
              <ul className="mt-3 space-y-1.5">
                {section.links.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary underline underline-offset-4"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-5">
        <p className="font-semibold text-foreground">{document.contactLabel}</p>
        <a
          href={`mailto:${document.contactEmail}`}
          className="mt-1 inline-block font-semibold text-primary underline underline-offset-4"
        >
          {document.contactEmail}
        </a>
      </div>
    </section>
  );
}
