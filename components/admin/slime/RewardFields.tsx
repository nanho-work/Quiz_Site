"use client";

import type { MailboxReward } from "../../../lib/admin/types";

const fields: Array<{ key: keyof MailboxReward; label: string; max: number }> = [
  { key: "gold", label: "골드", max: 10_000_000 },
  { key: "gems", label: "젬", max: 100_000 },
  { key: "specialKeys", label: "특수 열쇠", max: 10_000 },
  { key: "adSkipTickets", label: "광고 건너뛰기", max: 10_000 },
];

export function RewardFields({
  value,
  disabled,
  onChange,
}: {
  value: MailboxReward;
  disabled: boolean;
  onChange: (value: MailboxReward) => void;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-3 text-sm font-bold text-slate-200">보상 구성</legend>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {fields.map((field) => (
          <label key={field.key} className="text-xs font-semibold text-slate-500">
            {field.label}
            <input
              type="number"
              min={0}
              max={field.max}
              step={1}
              value={value[field.key]}
              onChange={(event) => onChange({
                ...value,
                [field.key]: Math.max(0, Math.min(field.max, Number(event.target.value) || 0)),
              })}
              className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-right text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-40"
            />
          </label>
        ))}
      </div>
      {disabled ? <p className="mt-2 text-xs text-slate-600">공지는 보상을 포함할 수 없습니다.</p> : null}
    </fieldset>
  );
}
