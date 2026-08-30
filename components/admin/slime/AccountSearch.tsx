"use client";

import { Copy, MailPlus, Search } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { adminErrorMessage, getAdminAccount } from "../../../lib/admin/firebase/admin-api";
import { formatAdminDate, formatNumber } from "../../../lib/admin/format";
import type { AdminAccount } from "../../../lib/admin/types";
import { AdminCard } from "../shared/AdminCard";
import { AdminNotice } from "../shared/AdminNotice";

export function AccountSearch() {
  const [query, setQuery] = useState("");
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setAccount(null);
    try {
      setAccount(await getAdminAccount(query));
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard className="p-5 md:p-6">
        <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="고객번호(SSF-…), Firebase UID 또는 정확한 이메일"
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
            />
          </div>
          <button disabled={loading || !query.trim()} className="h-12 rounded-xl bg-emerald-500 px-6 text-sm font-bold text-slate-950 disabled:opacity-50">
            {loading ? "조회 중…" : "계정 조회"}
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500">개인정보 조회는 관리자 감사 로그에 기록됩니다. 부분 이메일 검색과 전체 사용자 목록 조회는 지원하지 않습니다.</p>
      </AdminCard>

      {error ? <AdminNotice tone="error">{error}</AdminNotice> : null}
      {account ? <AccountResult account={account} /> : null}
    </div>
  );
}

function AccountResult({ account }: { account: AdminAccount }) {
  const authority = account.authority;
  const clearedStages = authority ? Object.values(authority.stages).filter((stage) => stage.cleared).length : 0;
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
      <AdminCard className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Firebase Account</p>
            <h2 className="mt-2 text-lg font-bold text-white">{account.displayName || "이름 미등록"}</h2>
            <p className="mt-1 text-sm text-slate-400">{account.email || "게스트 계정"}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${account.disabled || account.deletionRequested ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/15 text-emerald-300"}`}>
            {account.deletionRequested ? "삭제 처리 중" : account.disabled ? "사용 중지" : "정상"}
          </span>
        </div>
        <dl className="mt-6 space-y-4 text-sm">
          <InfoRow label="고객번호" value={account.customerId} copy />
          <InfoRow label="Firebase UID" value={account.uid} copy />
          <InfoRow label="로그인 제공자" value={account.providerIds.join(", ") || "anonymous"} />
          <InfoRow label="생성 시각" value={formatAdminDate(account.createdAtMillis)} />
          <InfoRow label="최근 로그인" value={formatAdminDate(account.lastSignInAtMillis)} />
        </dl>
        <Link
          href={`/admin/projects/slime-strike-force/mailbox?targetUid=${encodeURIComponent(account.uid)}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500/15"
        >
          <MailPlus className="h-4 w-4" /> 개별 우편 작성
        </Link>
      </AdminCard>

      <AdminCard className="p-6">
        <h2 className="font-bold text-white">게임 권위 상태</h2>
        {!authority ? (
          <AdminNotice tone="error">게임 서버 상태가 아직 생성되지 않은 계정입니다.</AdminNotice>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="골드" value={formatNumber(authority.balances.gold)} />
              <Metric label="젬" value={formatNumber(authority.balances.gems)} />
              <Metric label="특수 열쇠" value={formatNumber(authority.balances.specialKeys)} />
              <Metric label="광고 건너뛰기" value={formatNumber(authority.balances.adSkipTickets)} />
              <Metric label="에너지" value={formatNumber(authority.energy.current)} />
              <Metric label="클리어 기록" value={`${clearedStages}개`} />
              <Metric label="캐릭터" value={authority.character.selectedCharacterId} />
              <Metric label="상태 Revision" value={formatNumber(authority.revision)} />
            </div>
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              <p className="font-semibold text-slate-300">활성 전투</p>
              <p className="mt-2 text-slate-500">
                {authority.activeBattle ? `${authority.activeBattle.stageId} · ${authority.activeBattle.status} · ${authority.activeBattle.runId}` : "없음"}
              </p>
              <p className="mt-3 text-xs text-slate-600">서버 갱신: {formatAdminDate(authority.updatedAtMillis)}</p>
            </div>
          </>
        )}
      </AdminCard>
    </div>
  );
}

function InfoRow({ label, value, copy = false }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="grid grid-cols-[7rem_1fr_auto] items-start gap-2 border-b border-slate-800 pb-3 last:border-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="break-all text-slate-200">{value}</dd>
      {copy ? <button onClick={() => void navigator.clipboard.writeText(value)} className="text-slate-500 hover:text-white" aria-label={`${label} 복사`}><Copy className="h-4 w-4" /></button> : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 truncate font-bold text-white">{value}</p></div>;
}
