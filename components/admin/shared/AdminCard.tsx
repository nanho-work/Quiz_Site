import type { ReactNode } from "react";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10 ${className}`}>
      {children}
    </section>
  );
}
