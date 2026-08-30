import { formatAdminDate, formatNumber } from "../../../lib/admin/format";
import type { AdminMailboxItem } from "../../../lib/admin/types";

export function MailboxHistory({ items, emptyText }: { items: AdminMailboxItem[]; emptyText: string }) {
  if (items.length === 0) return <p className="py-10 text-center text-sm text-slate-600">{emptyText}</p>;
  return (
    <div className="divide-y divide-slate-800">
      {items.map((item) => (
        <article key={item.id} className="px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${item.kind === "mail" ? "bg-amber-500/15 text-amber-300" : "bg-sky-500/15 text-sky-300"}`}>
                  {item.kind === "mail" ? "우편" : "공지"}
                </span>
                <span className={`text-[11px] font-semibold ${item.active ? "text-emerald-400" : "text-slate-600"}`}>{item.active ? "활성" : "비활성"}</span>
              </div>
              <h3 className="mt-2 font-bold text-white">{item.title}</h3>
              <p className="mt-1 break-all text-xs text-slate-600">{item.id}</p>
            </div>
            <div className="text-right text-xs leading-5 text-slate-500">
              <p>{formatAdminDate(item.startAtMillis)} 시작</p>
              <p>{formatAdminDate(item.expiresAtMillis)} 만료</p>
            </div>
          </div>
          {item.kind === "mail" ? (
            <p className="mt-3 text-xs text-slate-400">
              골드 {formatNumber(item.rewards.gold)} · 젬 {formatNumber(item.rewards.gems)} · 열쇠 {formatNumber(item.rewards.specialKeys)} · 광고권 {formatNumber(item.rewards.adSkipTickets)}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
