"use client";

import {
  FlaskConical,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminErrorMessage,
  listStageContentTesters,
  removeStageContentTester,
  upsertStageContentTester,
} from "../../../../lib/admin/firebase/admin-api";
import type { StageContentTesterSummary } from "../../../../lib/admin/stage-content/types";
import { AdminCard } from "../../shared/AdminCard";
import { AdminNotice } from "../../shared/AdminNotice";

export interface StageTesterService {
  list: () => Promise<{ items: StageContentTesterSummary[] }>;
  upsert: (targetUid: string, note: string) => Promise<StageContentTesterSummary>;
  remove: (targetUid: string) => Promise<{ uid: string; removed: true }>;
}

const defaultService: StageTesterService = {
  list: listStageContentTesters,
  upsert: upsertStageContentTester,
  remove: removeStageContentTester,
};

export function StageTestersPanel({
  testReleaseId,
  productionReleaseId,
  service = defaultService,
}: {
  testReleaseId: string | null;
  productionReleaseId: string | null;
  service?: StageTesterService;
}) {
  const [items, setItems] = useState<StageContentTesterSummary[]>([]);
  const [targetUid, setTargetUid] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [workingUid, setWorkingUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.list();
      setItems(response.items);
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sortedItems = useMemo(
    () => [...items].sort((left, right) => right.updatedAtMillis - left.updatedAtMillis),
    [items],
  );

  const handleUpsert = async () => {
    const query = targetUid.trim();
    if (!query) {
      setError("Firebase UID 또는 고객번호를 입력해 주세요.");
      return;
    }
    setWorkingUid("new");
    setError(null);
    setSuccess(null);
    try {
      const saved = await service.upsert(query, note.trim());
      setItems((current) => [saved, ...current.filter((item) => item.uid !== saved.uid)]);
      setTargetUid("");
      setNote("");
      setSuccess(`${saved.customerId} 계정을 TEST 채널에 등록했습니다. 게임을 완전히 종료한 뒤 다시 실행해 확인하세요.`);
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setWorkingUid(null);
    }
  };

  const handleRemove = async (item: StageContentTesterSummary) => {
    if (!window.confirm(`${item.customerId} 계정을 TEST 채널에서 해제할까요?\n진행 중인 전투는 기존 릴리스로 이어집니다.`)) return;
    setWorkingUid(item.uid);
    setError(null);
    setSuccess(null);
    try {
      await service.remove(item.uid);
      setItems((current) => current.filter((candidate) => candidate.uid !== item.uid));
      setSuccess(`${item.customerId} 계정을 해제했습니다. 다음 앱 재시작부터 Production 채널을 사용합니다.`);
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setWorkingUid(null);
    }
  };

  return (
    <AdminCard className="overflow-hidden">
      <div className="border-b border-slate-800 p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-emerald-300" />
              <h2 className="font-bold text-white">TEST 실기기 계정</h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-300">
                {items.length}명
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              등록된 계정만 TEST 스테이지 릴리스를 우선 수신합니다. 등록되지 않은 모든 사용자는 계속 Production을 사용합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading || workingUid !== null}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 목록 새로고침
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ReleaseBadge
            icon={<FlaskConical className="h-4 w-4" />}
            label="TEST 릴리스"
            releaseId={testReleaseId}
            tone="test"
          />
          <ReleaseBadge
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Production 릴리스"
            releaseId={productionReleaseId}
            tone="production"
          />
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-5 text-amber-100/80">
          해당 실기기 빌드에 Remote Config <code className="break-all font-mono text-amber-200">feature_remote_stage_content_enabled=true</code>가 적용되어야 합니다.
          TEST 릴리스가 없으면 등록 계정도 안전하게 Production으로 돌아갑니다.
        </div>
      </div>

      <div className="grid gap-4 border-b border-slate-800 bg-slate-950/30 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto] md:items-end md:p-6">
        <label className="text-xs font-bold text-slate-400">
          Firebase UID 또는 고객번호
          <input
            value={targetUid}
            maxLength={132}
            onChange={(event) => setTargetUid(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") void handleUpsert(); }}
            placeholder="예: SSF-nAOiac… 또는 Firebase UID"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm text-white outline-none placeholder:font-sans placeholder:text-slate-600 focus:border-emerald-500"
          />
        </label>
        <label className="text-xs font-bold text-slate-400">
          기기·용도 메모 <span className="font-normal text-slate-600">(선택)</span>
          <input
            value={note}
            maxLength={120}
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") void handleUpsert(); }}
            placeholder="예: Pixel 8 / 경로 검증"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"
          />
        </label>
        <button
          type="button"
          onClick={() => void handleUpsert()}
          disabled={workingUid !== null || !targetUid.trim()}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-black text-slate-950 disabled:opacity-40"
        >
          {workingUid === "new" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          등록·메모 수정
        </button>
      </div>

      <div className="space-y-4 p-5 md:p-6">
        {error ? <AdminNotice tone="error">{error}</AdminNotice> : null}
        {success ? <AdminNotice tone="success">{success}</AdminNotice> : null}

        {loading ? (
          <div className="flex min-h-28 items-center justify-center text-sm text-slate-500">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> TEST 계정 목록을 불러오는 중입니다.
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 px-4 py-10 text-center">
            <UsersRound className="mx-auto h-7 w-7 text-slate-700" />
            <p className="mt-3 text-sm font-bold text-slate-400">등록된 TEST 계정이 없습니다</p>
            <p className="mt-1 text-xs text-slate-600">현재 모든 사용자는 Production 스테이지를 사용합니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item) => (
              <div
                key={item.uid}
                className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="font-mono text-sm text-emerald-200">{item.customerId}</strong>
                    {item.note ? <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">{item.note}</span> : null}
                  </div>
                  <p className="mt-1 break-all font-mono text-[10px] text-slate-600">UID: {item.uid}</p>
                  <p className="mt-1 text-[11px] text-slate-500">마지막 변경 {formatDate(item.updatedAtMillis)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleRemove(item)}
                  disabled={workingUid !== null}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-500/25 bg-rose-500/5 px-3 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/10 disabled:opacity-40"
                >
                  {workingUid === item.uid ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  TEST 해제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminCard>
  );
}

function ReleaseBadge({
  icon,
  label,
  releaseId,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  releaseId: string | null;
  tone: "test" | "production";
}) {
  const style = tone === "test" ? "border-sky-500/20 bg-sky-500/5 text-sky-200" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-200";
  return (
    <div className={`rounded-xl border px-4 py-3 ${style}`}>
      <div className="flex items-center gap-2 text-xs font-bold">{icon}{label}</div>
      <p className="mt-2 truncate font-mono text-[11px] text-slate-400">{releaseId ?? "설정되지 않음"}</p>
    </div>
  );
}

function formatDate(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
