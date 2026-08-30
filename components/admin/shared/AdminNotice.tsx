import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function AdminNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-sky-500/20 bg-sky-500/10 text-sky-100",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
    error: "border-rose-500/20 bg-rose-500/10 text-rose-100",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-6 ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
