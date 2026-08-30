import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">{eyebrow}</p> : null}
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
