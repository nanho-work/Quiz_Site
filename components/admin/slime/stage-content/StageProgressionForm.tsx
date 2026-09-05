"use client";

import type { DifficultyProgression, RewardAmounts, StageContentBundle } from "../../../../lib/admin/stage-content/types";
import { cloneStageBundle, newContentVersion, stageNumberLabel } from "../../../../lib/admin/stage-content/editor";
import { FieldGroup, NumberField, TextField } from "./StageFields";

const rewardKeys = [
  ["gold", "골드"], ["gems", "젬"], ["energy", "에너지"],
  ["green", "일반 조각"], ["blue", "희귀 조각"], ["red", "영웅 조각"],
] as const;

const legacyCombatHealthMultiplier = (stageNumber: number) =>
  1 + Math.max(0, stageNumber - 1) * 0.25;

export function StageProgressionForm({ bundle, onChange }: {
  bundle: StageContentBundle;
  onChange: (bundle: StageContentBundle) => void;
}) {
  const update = (work: (draft: StageContentBundle) => void) => {
    const draft = cloneStageBundle(bundle);
    work(draft);
    onChange(draft);
  };
  const applyRecommendedDifficulty = () => update((draft) => {
    const version = newContentVersion(draft.contentVersion.replace(/^stage_balance_v3/, "stage_balance_v4"));
    draft.contentVersion = version;
    draft.stageProgression.contentVersion = version;
    draft.stageProgression.stages.forEach((entry) => {
      entry.combatHealthMultiplier = legacyCombatHealthMultiplier(entry.stageNumber);
      delete entry.baseHealthStep;
    });
    draft.stageProgression.difficulties.forEach((entry) => {
      entry.healthMultiplier = entry.difficulty === 0 ? 1 : entry.difficulty === 1 ? 1.5 : 2.2;
    });
  });
  return (
    <div className="space-y-5">
      <FieldGroup title="릴리스 기본 설정" description="콘텐츠 버전은 이번 수정 묶음을 구분하는 운영용 이름입니다.">
        <TextField label="콘텐츠 버전" value={bundle.contentVersion} maxLength={64} onChange={(event) => update((draft) => { draft.contentVersion = event.target.value; draft.stageProgression.contentVersion = event.target.value; })} />
        <NumberField label="최소 Android 빌드" value={bundle.minimumAndroidBuild} min={1} max={1000000} step={1} onValue={(value) => update((draft) => { draft.minimumAndroidBuild = value; })} help="이보다 낮은 빌드는 이 콘텐츠를 사용할 수 없습니다." />
        <NumberField label="선택지별 무료 새로고침" value={bundle.stageProgression.freeRefreshPerChoice} min={0} max={10} step={1} onValue={(value) => update((draft) => { draft.stageProgression.freeRefreshPerChoice = value; })} />
        <NumberField label="광고 새로고침 한도" value={bundle.stageProgression.optionAdRefreshLimit} min={0} max={100} step={1} onValue={(value) => update((draft) => { draft.stageProgression.optionAdRefreshLimit = value; })} />
        <NumberField label="전체 선택 광고 한도" value={bundle.stageProgression.acquireAllAdLimit} min={0} max={100} step={1} onValue={(value) => update((draft) => { draft.stageProgression.acquireAllAdLimit = value; })} />
      </FieldGroup>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/45">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 p-4 md:p-5">
          <div><h3 className="font-bold text-white">스테이지별 체력·보상 배율</h3><p className="mt-1 text-xs text-slate-500">보상 배율은 클리어·구간 보상에만, 전투 체력 배율은 몬스터의 시작·종료 체력에만 적용됩니다.</p></div>
          <button type="button" onClick={applyRecommendedDifficulty} className="rounded-lg border border-emerald-700/70 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20">권장 완화값 적용</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-950 text-xs text-slate-600"><tr><th className="px-4 py-3">스테이지</th><th className="px-4 py-3">보상 배율</th><th className="px-4 py-3">전투 체력 배율</th><th className="px-4 py-3">미리보기 몬스터 ID</th></tr></thead>
            <tbody className="divide-y divide-slate-800">
              {bundle.stageProgression.stages.map((entry, index) => <tr key={entry.stageId}>
                <td className="px-4 py-3 font-semibold text-white">{stageNumberLabel(entry.stageId)}</td>
                <td className="px-4 py-3"><input type="number" min={0.01} max={1000} step={0.1} value={entry.multiplier} onChange={(event) => update((draft) => { draft.stageProgression.stages[index].multiplier = Number(event.target.value); })} className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" /></td>
                <td className="px-4 py-3"><input type="number" min={0.01} max={1000} step={0.05} value={entry.combatHealthMultiplier ?? legacyCombatHealthMultiplier(entry.stageNumber)} onChange={(event) => update((draft) => { draft.stageProgression.stages[index].combatHealthMultiplier = Number(event.target.value); delete draft.stageProgression.stages[index].baseHealthStep; })} className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" /></td>
                <td className="px-4 py-3"><input value={entry.previewMonsterVisualId} onChange={(event) => update((draft) => { draft.stageProgression.stages[index].previewMonsterVisualId = event.target.value; })} className="w-full min-w-56 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" /></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <div className="space-y-5">
        {bundle.stageProgression.difficulties.map((difficulty, index) => (
          <DifficultyEditor key={difficulty.difficulty} value={difficulty} onChange={(value) => update((draft) => { draft.stageProgression.difficulties[index] = value; })} />
        ))}
      </div>
    </div>
  );
}

function DifficultyEditor({ value, onChange }: { value: DifficultyProgression; onChange: (value: DifficultyProgression) => void }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/45 p-4 md:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={`난이도 ${value.difficulty} 표시명`} value={value.displayName} maxLength={40} onChange={(event) => onChange({ ...value, displayName: event.target.value })} />
        <NumberField label="몬스터 체력 배율" value={value.healthMultiplier} min={0.01} max={1000} step={0.1} onValue={(healthMultiplier) => onChange({ ...value, healthMultiplier })} />
      </div>
      <RewardEditor title="클리어 보상" value={value.clearReward} onChange={(clearReward) => onChange({ ...value, clearReward })} />
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {value.progressRewards.map((entry, index) => <RewardEditor key={entry.percent} title={`${entry.percent}% 구간 보상`} value={entry.reward} compact onChange={(reward) => onChange({ ...value, progressRewards: value.progressRewards.map((item, itemIndex) => itemIndex === index ? { ...item, reward } : item) })} />)}
      </div>
    </section>
  );
}

function RewardEditor({ title, value, onChange, compact = false }: { title: string; value: RewardAmounts; onChange: (value: RewardAmounts) => void; compact?: boolean }) {
  return (
    <div className={`mt-4 rounded-lg border border-slate-800 bg-slate-900/70 p-3 ${compact ? "" : ""}`}>
      <p className="mb-3 text-xs font-bold text-emerald-300">{title}</p>
      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"}`}>
        {rewardKeys.map(([key, label]) => <NumberField key={key} label={label} value={value[key] ?? 0} min={0} step={1} onValue={(amount) => onChange({ ...value, [key]: amount })} />)}
      </div>
    </div>
  );
}
