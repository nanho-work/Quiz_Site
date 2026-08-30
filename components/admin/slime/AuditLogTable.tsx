"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { adminErrorMessage, listAdminAuditLogs } from "../../../lib/admin/firebase/admin-api";
import { formatAdminDate } from "../../../lib/admin/format";
import type { AdminAuditLog } from "../../../lib/admin/types";
import { AdminCard } from "../shared/AdminCard";
import { AdminNotice } from "../shared/AdminNotice";

export function AuditLogTable() {
  const [items, setItems] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems((await listAdminAuditLogs()).items);
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <div className="space-y-5">
      {error ? <AdminNotice tone="error">{error}</AdminNotice> : null}
      <AdminCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-bold text-white">최근 관리자 작업</h2>
            <p className="mt-1 text-xs text-slate-600">계정 개인정보 조회도 감사 대상입니다.</p>
          </div>
          <button onClick={() => void refresh()} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white" aria-label="감사 로그 새로고침">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-600">
              <tr><th className="px-5 py-3">시각</th><th className="px-5 py-3">작업</th><th className="px-5 py-3">대상</th><th className="px-5 py-3">관리자 UID</th><th className="px-5 py-3">요약</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="text-slate-300">
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatAdminDate(item.createdAtMillis)}</td>
                  <td className="px-5 py-4 font-semibold text-white">{item.action}</td>
                  <td className="max-w-56 truncate px-5 py-4">{item.targetUid || `${item.resourceType}:${item.resourceId}`}</td>
                  <td className="max-w-44 truncate px-5 py-4 text-xs text-slate-500">{item.adminUid}</td>
                  <td className="max-w-80 truncate px-5 py-4 text-xs text-slate-500">{Object.entries(item.summary).map(([key, value]) => `${key}=${String(value)}`).join(" · ") || "-"}</td>
                </tr>
              ))}
              {!loading && items.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-600">기록된 관리자 작업이 없습니다.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
