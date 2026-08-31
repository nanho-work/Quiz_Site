import type { StageContentBundle, StageDefinition } from "./types";

export function parseStageContentBundle(bundleJson: string): StageContentBundle {
  const parsed: unknown = JSON.parse(bundleJson);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("스테이지 JSON의 최상위 값은 객체여야 합니다.");
  }
  const bundle = parsed as StageContentBundle;
  if (!Array.isArray(bundle.stages) || bundle.stages.length === 0 || !bundle.stageProgression) {
    throw new Error("스테이지 목록 또는 진행 설정이 없습니다.");
  }
  return bundle;
}

export function cloneStageBundle(bundle: StageContentBundle): StageContentBundle {
  return JSON.parse(JSON.stringify(bundle)) as StageContentBundle;
}

export function serializeStageBundle(bundle: StageContentBundle): string {
  return JSON.stringify(bundle, null, 2);
}

export function localBundleFingerprint(bundle: StageContentBundle | null): string {
  return bundle ? JSON.stringify(bundle) : "";
}

export function changedStageIds(
  baseline: StageContentBundle | null,
  current: StageContentBundle | null,
): string[] {
  if (!baseline || !current) return [];
  const baselineById = new Map(baseline.stages.map((stage) => [stage.id, JSON.stringify(stage)]));
  return current.stages
    .filter((stage) => baselineById.get(stage.id) !== JSON.stringify(stage))
    .map((stage) => stage.id);
}

export function isProgressionChanged(
  baseline: StageContentBundle | null,
  current: StageContentBundle | null,
): boolean {
  if (!baseline || !current) return false;
  return JSON.stringify(baseline.stageProgression) !== JSON.stringify(current.stageProgression) ||
    baseline.contentVersion !== current.contentVersion ||
    baseline.minimumAndroidBuild !== current.minimumAndroidBuild;
}

export function plannedUnits(stage: StageDefinition): number {
  const base = Math.floor(stage.segmentGenerationSeconds / stage.segmentSpawnSeconds) + 1;
  const pathKind = stage.bottomLanePathKind ?? 0;
  const lanes = pathKind === 2 ? stage.parallelLaneCount ?? 1 : stage.dualLaneEnabled ? 2 : 1;
  const ratio = pathKind === 2 ? stage.parallelLaneUnitRatio ?? 1 :
    stage.dualLaneEnabled ? stage.dualLaneUnitRatio ?? 1 : 1;
  return Math.max(1, Math.ceil(base * ratio)) * lanes;
}

export function stageNumberLabel(stageId: string): string {
  const match = /^stage_(\d+)$/.exec(stageId);
  return match ? `스테이지 ${Number(match[1])}` : stageId;
}

export function newContentVersion(current: string): string {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
  ].join("");
  const base = current.replace(/_edit_\d{12}$/, "");
  return `${base}_edit_${stamp}`.slice(0, 64);
}

