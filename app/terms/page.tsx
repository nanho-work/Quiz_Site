"use client";

import { useLanguage } from "../../components/LanguageProvider";

export default function TermsPage() {
  const { text } = useLanguage();
  const terms = text.terms;

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-black text-foreground">
        {terms.title}
      </h1>

      <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
        {terms.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              {section.heading}
            </h2>
            {"body" in section ? (
              <p>{section.body}</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
