import type { InputHTMLAttributes, ReactNode } from "react";

const inputClass = "mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50";

export function FieldGroup({ title, description, children }: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/45 p-4 md:p-5">
      <h3 className="font-bold text-white">{title}</h3>
      {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

export function TextField({ label, help, ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-400">
      {label}
      <input {...props} className={`${inputClass} ${props.className ?? ""}`} />
      {help ? <span className="mt-1 block font-normal leading-5 text-slate-600">{help}</span> : null}
    </label>
  );
}

export function NumberField({ label, help, value, onValue, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  help?: string;
  value: number | undefined;
  onValue: (value: number) => void;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-400">
      {label}
      <input
        {...props}
        type="number"
        value={value ?? ""}
        onChange={(event) => onValue(Number(event.target.value))}
        className={`${inputClass} tabular-nums ${props.className ?? ""}`}
      />
      {help ? <span className="mt-1 block font-normal leading-5 text-slate-600">{help}</span> : null}
    </label>
  );
}

export function SelectField({ label, children, ...props }: InputHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-400">
      {label}
      <select {...props} className={`${inputClass} ${props.className ?? ""}`}>{children}</select>
    </label>
  );
}

export function ToggleField({ label, checked, onChange, help }: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  help?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-emerald-500"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-200">{label}</span>
        {help ? <span className="mt-1 block text-xs leading-5 text-slate-500">{help}</span> : null}
      </span>
    </label>
  );
}

export function InlineHelp({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-sky-500/15 bg-sky-500/5 px-3 py-2 text-xs leading-5 text-sky-200">{children}</p>;
}

