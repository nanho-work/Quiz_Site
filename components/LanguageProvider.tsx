"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { usePathname } from "next/navigation";

import {
  defaultLanguage,
  getHtmlLang,
  isLanguageCode,
  type LanguageCode,
  translations,
} from "../lib/i18n";

const storageKey = "koofy-language";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  text: (typeof translations)[LanguageCode];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectBrowserLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const stored = window.localStorage.getItem(storageKey);
  if (isLanguageCode(stored)) {
    return stored;
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ko")) {
    return "ko";
  }
  if (browserLanguage.startsWith("ja")) {
    return "ja";
  }
  if (browserLanguage.startsWith("zh")) {
    return "zh";
  }

  return defaultLanguage;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Explicit language URLs are stable for both crawlers and visitors.
  // Legacy routes retain browser/preference-based language selection.
  const routeLocale = pathname.split("/")[1];
  const fixedLanguage = ["ko", "en", "ja"].includes(routeLocale) ? routeLocale as LanguageCode : null;
  const [preferredLanguage, setLanguageState] = useState<LanguageCode>(
    pathname === "/" || pathname === "/koofy-reader" || pathname.startsWith("/koofy-image") ? "ko" : defaultLanguage
  );

  const language = fixedLanguage || preferredLanguage;

  useEffect(() => {
    setLanguageState(detectBrowserLanguage());
  }, []);

  useEffect(() => {
    if (fixedLanguage) setLanguageState(fixedLanguage);
  }, [fixedLanguage]);

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(language);
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      text: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
