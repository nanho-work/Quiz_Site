"use client";

import { FormEvent, useMemo, useState } from "react";
import { adminIdentifier, firebaseUidFromCustomerId, toDateTimeLocal } from "../../../lib/admin/format";
import type { MailboxDraft, MailboxKind, MailboxReward } from "../../../lib/admin/types";
import { AdminNotice } from "../shared/AdminNotice";
import { RewardFields } from "./RewardFields";

const emptyReward: MailboxReward = { gold: 0, gems: 0, specialKeys: 0, adSkipTickets: 0 };

export function MailboxComposer({
  mode,
  initialTargetUid = "",
  submitting,
  error,
  success,
  onSubmit,
}: {
  mode: "campaign" | "direct";
  initialTargetUid?: string;
  submitting: boolean;
  error: string | null;
  success: string | null;
  onSubmit: (targetUid: string | null, draft: MailboxDraft) => Promise<void>;
}) {
  const now = useMemo(() => Date.now(), []);
  const [target, setTarget] = useState(initialTargetUid);
  const [id, setId] = useState(() => adminIdentifier(mode === "campaign" ? "campaign" : "mail"));
  const [kind, setKind] = useState<MailboxKind>("notice");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [startAt, setStartAt] = useState(toDateTimeLocal(now));
  const [expiresAt, setExpiresAt] = useState(toDateTimeLocal(now + 7 * 24 * 60 * 60 * 1_000));
  const [priority, setPriority] = useState(0);
  const [active, setActive] = useState(true);
  const [rewards, setRewards] = useState<MailboxReward>(emptyReward);

  const handleKind = (nextKind: MailboxKind) => {
    setKind(nextKind);
    if (nextKind === "notice") setRewards(emptyReward);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const targetUid = mode === "direct" ? firebaseUidFromCustomerId(target) : null;
    await onSubmit(targetUid, {
      id: id.trim(),
      kind,
      title: title.trim(),
      body: body.trim(),
      active,
      startAtMillis: new Date(startAt).getTime(),
      expiresAtMillis: new Date(expiresAt).getTime(),
      sortPriority: priority,
      rewards: kind === "notice" ? emptyReward : rewards,
    });
    if (mode === "direct") setId(adminIdentifier("mail"));
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      {mode === "direct" ? (
        <Field label="대상 고객번호 또는 UID">
          <input required value={target} onChange={(event) => setTarget(event.target.value)} placeholder="SSF-… 또는 Firebase UID" className={inputClass} />
        </Field>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={mode === "campaign" ? "캠페인 ID" : "우편 ID"} hint="영문, 숫자, _와 -만 사용">
          <input required pattern="[A-Za-z0-9_-]{1,128}" value={id} onChange={(event) => setId(event.target.value)} className={inputClass} />
        </Field>
        <Field label="메시지 구분">
          <select value={kind} onChange={(event) => handleKind(event.target.value as MailboxKind)} className={inputClass}>
            <option value="notice">[공지] 보상 없음</option>
            <option value="mail">[우편] 보상 가능</option>
          </select>
        </Field>
      </div>
      <Field label="제목" hint="게임 목록에는 [공지] 또는 [우편]이 자동으로 붙습니다.">
        <input required maxLength={80} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} />
      </Field>
      <Field label="본문">
        <textarea required maxLength={4000} rows={7} value={body} onChange={(event) => setBody(event.target.value)} className={`${inputClass} h-auto resize-y py-3 leading-6`} />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="노출 시작">
          <input required type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} className={inputClass} />
        </Field>
        <Field label="만료 시각">
          <input required type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className={inputClass} />
        </Field>
        <Field label="정렬 우선순위" hint="-1000 ~ 1000">
          <input type="number" min={-1000} max={1000} value={priority} onChange={(event) => setPriority(Number(event.target.value) || 0)} className={inputClass} />
        </Field>
      </div>
      <RewardFields value={rewards} disabled={kind === "notice"} onChange={setRewards} />
      <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
        <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="h-4 w-4 accent-emerald-500" />
        저장 즉시 활성 상태로 등록
      </label>
      {error ? <AdminNotice tone="error">{error}</AdminNotice> : null}
      {success ? <AdminNotice tone="success">{success}</AdminNotice> : null}
      <button
        disabled={submitting}
        className="w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {submitting ? "서버 검증 및 저장 중…" : mode === "campaign" ? "전체 캠페인 저장" : "개별 우편 발송"}
      </button>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      {hint ? <span className="ml-2 text-xs font-normal text-slate-600">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass = "h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500";
