"use client";

import { useLanguage } from "../../components/LanguageProvider";

export default function AboutPage() {
  const { text } = useLanguage();
  const about = text.about;

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="mb-3 text-xs font-bold uppercase text-primary">
          {about.eyebrow}
        </p>
        <h1 className="text-4xl font-black text-foreground md:text-5xl">
          {about.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {about.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {about.values.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <h2 className="text-lg font-black text-foreground">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">
          {about.fitTitle}
        </h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {about.fitDescription}
        </p>
      </div>
    </section>
  );
}
