"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface RootChromeProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export function RootChrome({ children, header, footer }: RootChromeProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;

  return (
    <div className="min-h-screen bg-background">
      {header}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        {children}
      </main>
      {footer}
    </div>
  );
}
