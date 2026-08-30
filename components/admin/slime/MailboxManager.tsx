"use client";

import { RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  adminErrorMessage,
  listDirectMailbox,
  listMailboxCampaigns,
  sendDirectMailboxItem,
  upsertMailboxCampaign,
} from "../../../lib/admin/firebase/admin-api";
import type { AdminMailboxItem, MailboxDraft } from "../../../lib/admin/types";
import { AdminCard } from "../shared/AdminCard";
import { MailboxComposer } from "./MailboxComposer";
import { MailboxHistory } from "./MailboxHistory";

export function MailboxManager() {
  const searchParams = useSearchParams();
  const initialTargetUid = searchParams.get("targetUid") ?? "";
  const [mode, setMode] = useState<"campaign" | "direct">(initialTargetUid ? "direct" : "campaign");
  const [campaigns, setCampaigns] = useState<AdminMailboxItem[]>([]);
  const [directItems, setDirectItems] = useState<AdminMailboxItem[]>([]);
  const [directTarget, setDirectTarget] = useState(initialTargetUid);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refreshCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCampaigns((await listMailboxCampaigns()).items);
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDirect = useCallback(async (targetUid: string) => {
    if (!targetUid) return;
    setLoading(true);
    setError(null);
    try {
      setDirectItems((await listDirectMailbox(targetUid)).items);
      setDirectTarget(targetUid);
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refreshCampaigns(); }, [refreshCampaigns]);
  useEffect(() => {
    if (initialTargetUid) void refreshDirect(initialTargetUid);
  }, [initialTargetUid, refreshDirect]);

  const handleSubmit = async (targetUid: string | null, draft: MailboxDraft) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (targetUid) {
        await sendDirectMailboxItem(targetUid, draft);
        setSuccess(`${targetUid} 계정에 ${draft.id} 우편을 등록했습니다.`);
        await refreshDirect(targetUid);
      } else {
        await upsertMailboxCampaign(draft);
        setSuccess(`${draft.id} 캠페인을 저장했습니다.`);
        await refreshCampaigns();
      }
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setSubmitting(false);
    }
  };

  const items = mode === "campaign" ? campaigns : directItems;
  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1.5">
        <ModeButton active={mode === "campaign"} onClick={() => setMode("campaign")}>전체 공지·우편</ModeButton>
        <ModeButton active={mode === "direct"} onClick={() => setMode("direct")}>개별 사용자 우편</ModeButton>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminCard className="p-5 md:p-6">
          <h2 className="mb-5 font-bold text-white">{mode === "campaign" ? "전체 캠페인 작성" : "개별 우편 작성"}</h2>
          <MailboxComposer
            key={`${mode}:${initialTargetUid}`}
            mode={mode}
            initialTargetUid={initialTargetUid}
            submitting={submitting}
            error={error}
            success={success}
            onSubmit={handleSubmit}
          />
        </AdminCard>
        <AdminCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 md:px-6">
            <div>
              <h2 className="font-bold text-white">발송 이력</h2>
              {mode === "direct" && directTarget ? <p className="mt-1 max-w-72 truncate text-xs text-slate-600">{directTarget}</p> : null}
            </div>
            <button
              onClick={() => void (mode === "campaign" ? refreshCampaigns() : refreshDirect(directTarget || initialTargetUid))}
              disabled={loading || mode === "direct" && !directTarget && !initialTargetUid}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"
              aria-label="발송 이력 새로고침"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <MailboxHistory items={items} emptyText={mode === "campaign" ? "등록된 캠페인이 없습니다." : "대상 계정으로 발송한 우편이 없습니다."} />
        </AdminCard>
      </div>
    </div>
  );
}

function ModeButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${active ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}>{children}</button>;
}
