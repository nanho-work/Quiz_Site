"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import { useLanguage } from "../../components/LanguageProvider";

export default function ContactPage() {
  const { text } = useLanguage();
  const contact = text.contact;

  return (
    <section className="mx-auto max-w-3xl">
      <p className="mb-3 text-xs font-bold uppercase text-primary">
        {contact.eyebrow}
      </p>
      <h1 className="text-4xl font-black text-foreground md:text-5xl">
        {contact.title}
      </h1>
      <p className="mt-5 text-base leading-7 text-muted-foreground">
        {contact.description}
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">
              {contact.emailTitle}
            </h2>
            <a
              href="mailto:koofylab@gmail.com"
              className="mt-2 inline-block font-semibold text-primary underline-offset-4 hover:underline"
            >
              koofylab@gmail.com
            </a>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {contact.emailNote}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground">
        {contact.policyPrompt}{" "}
        <Link
          href="/bus-pop/privacy"
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          {contact.policyCta}
        </Link>
        .
      </div>
    </section>
  );
}
