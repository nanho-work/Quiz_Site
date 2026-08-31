"use client";

import { CheckCircle2, Clock3, DownloadCloud, History, Radio } from "lucide-react";
import { formatAdminDate } from "../../../../lib/admin/format";
import type { StageContentChannelSummary, StageContentReleaseSummary } from "../../../../lib/admin/stage-content/types";
import { AdminCard } from "../../shared/AdminCard";

export function StageChannelCards({ channels }: { channels: StageContentChannelSummary[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["test", "production"] as const).map((name) => {
        const channel = channels.find((item) => item.channel === name);
        const production = name === "production";
        return (
          <AdminCard key={name} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`rounded-xl p-2 ${production ? "bg-emerald-500/10 text-emerald-300" : "bg-sky-500/10 text-sky-300"}`}><Radio className="h-5 w-5" /></span>
                <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{name}</p><p className="mt-1 text-sm font-bold text-white">{channel?.releaseId ? shortHash(channel.releaseId) : "설정되지 않음"}</p></div>
              </div>
              {channel?.releaseId ? <CheckCircle2 className={`h-5 w-5 ${production ? "text-emerald-400" : "text-sky-400"}`} /> : null}
            </div>
            <p className="mt-4 text-xs text-slate-600">최근 변경: {channel?.updatedAtMillis ? formatAdminDate(channel.updatedAtMillis) : "-"}</p>
            {channel?.previousReleaseId ? <p className="mt-1 text-[11px] text-slate-700">이전 릴리스 {shortHash(channel.previousReleaseId)} · 이어하기 유예 {channel.previousUntilMillis ? formatAdminDate(channel.previousUntilMillis) : "-"}</p> : null}
          </AdminCard>
        );
      })}
    </div>
  );
}

export function StageReleaseHistory({ releases, channels, selectedReleaseId, loading, onLoad }: {
  releases: StageContentReleaseSummary[];
  channels: StageContentChannelSummary[];
  selectedReleaseId: string | null;
  loading: boolean;
  onLoad: (releaseId: string) => void;
}) {
  const testId = channels.find((item) => item.channel === "test")?.releaseId;
  const productionId = channels.find((item) => item.channel === "production")?.releaseId;
  return (
    <AdminCard className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4"><History className="h-5 w-5 text-slate-500" /><div><h2 className="font-bold text-white">릴리스 이력</h2><p className="mt-1 text-xs text-slate-600">최근 50개, 최신순</p></div></div>
      <div className="divide-y divide-slate-800">
        {releases.map((release) => {
          const selected = selectedReleaseId === release.releaseId;
          return (
            <button type="button" key={release.releaseId} disabled={loading} onClick={() => onLoad(release.releaseId)} className={`flex w-full flex-col gap-3 px-5 py-4 text-left transition sm:flex-row sm:items-center sm:justify-between ${selected ? "bg-emerald-500/5" : "hover:bg-slate-800/50"}`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-white">{release.contentVersion}</p>
                  {release.releaseId === productionId ? <Badge tone="production">PRODUCTION</Badge> : null}
                  {release.releaseId === testId ? <Badge tone="test">TEST</Badge> : null}
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{release.note || "메모 없음"}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-700">{release.releaseId}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-xs text-slate-600">
                <span>빌드 {release.minimumAndroidBuild}+</span><span>{release.stageCount}개</span><span>{formatAdminDate(release.createdAtMillis)}</span><DownloadCloud className="h-4 w-4" />
              </div>
            </button>
          );
        })}
        {!loading && releases.length === 0 ? <div className="px-5 py-12 text-center text-sm text-slate-600">생성된 스테이지 릴리스가 없습니다.</div> : null}
      </div>
    </AdminCard>
  );
}

function Badge({ tone, children }: { tone: "production" | "test"; children: React.ReactNode }) {
  return <span className={`rounded-full px-2 py-1 text-[9px] font-black tracking-wider ${tone === "production" ? "bg-emerald-500/10 text-emerald-300" : "bg-sky-500/10 text-sky-300"}`}>{children}</span>;
}

function shortHash(value: string): string {
  return `${value.slice(0, 10)}…${value.slice(-6)}`;
}

