"use client";

import {
  busPuzzlePrivacyLanguages,
  getBusPuzzlePrivacyContent,
} from "../../lib/legal/busPuzzlePrivacy";
import { useLanguage } from "../LanguageProvider";
import PrivacyPolicyNav from "./PrivacyPolicyNav";

export default function BusPopPrivacyClient() {
  const { language, setLanguage } = useLanguage();
  const content = getBusPuzzlePrivacyContent(language);

  return (
    <section className="mx-auto max-w-4xl">
      <PrivacyPolicyNav active="bus-pop" />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">Bus Pop</p>
          <h1 className="text-3xl font-bold md:text-4xl">{content.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {content.updatedLabel}: {content.updatedAt}
          </p>
        </div>

        <nav className="flex shrink-0 flex-wrap gap-2" aria-label="Language selection">
          {busPuzzlePrivacyLanguages.map((item) => {
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

      <p className="mb-10 rounded-lg border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        {content.intro}
      </p>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        {content.sections.map((section) => (
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
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {content.contactLabel}
          </h2>
          <a className="underline underline-offset-4" href={`mailto:${content.contactEmail}`}>
            {content.contactEmail}
          </a>
        </section>
      </div>
    </section>
  );
}
