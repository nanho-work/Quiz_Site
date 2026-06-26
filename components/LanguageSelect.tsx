"use client";

import { languages } from "../lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSelect() {
  const { language, setLanguage, text } = useLanguage();

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{text.common.languageLabel}</span>
      <select
        aria-label={text.common.languageLabel}
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="h-9 min-w-[78px] rounded-md border border-border bg-background px-2 text-xs font-bold text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.shortLabel} {item.flagIcon}
          </option>
        ))}
      </select>
    </label>
  );
}
