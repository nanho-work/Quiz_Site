"use client";

import { useLanguage } from "../../components/LanguageProvider";
import PrivacyPolicyNav from "../../components/legal/PrivacyPolicyNav";

export default function PrivacyPolicyPage() {
  const { text } = useLanguage();
  const privacy = text.privacy;

  return (
    <section className="mx-auto max-w-4xl">
      <PrivacyPolicyNav active="website" />

      <h1 className="text-3xl font-black text-foreground">
        {privacy.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {privacy.updatedLabel}: {privacy.updatedAt}
      </p>

      <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
        {privacy.sections.map((section) => (
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
