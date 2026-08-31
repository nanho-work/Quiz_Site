"use client";

import { Plus, Trash2 } from "lucide-react";
import type { StageDefinition } from "../../../../lib/admin/stage-content/types";
import { plannedUnits } from "../../../../lib/admin/stage-content/editor";
import { FieldGroup, InlineHelp, NumberField, SelectField, TextField, ToggleField } from "./StageFields";
import { StagePathPreview } from "./StagePathPreview";

type PathType = "manual" | "spiral" | "rectangle" | "star" | "pattern" | "twin" | "parallel";

export function StageDefinitionForm({ stage, onChange }: {
  stage: StageDefinition;
  onChange: (stage: StageDefinition) => void;
}) {
  const update = <K extends keyof StageDefinition>(key: K, value: StageDefinition[K]) =>
    onChange({ ...stage, [key]: value });
  const pathType = currentPathType(stage);
  const totalUnits = plannedUnits(stage);

  return (
    <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <FieldGroup title="표시 및 리소스" description="ID는 이미 배포된 스테이지 연결에 사용되므로 수정할 수 없습니다.">
          <TextField label="스테이지 ID" value={stage.id} disabled />
          <TextField label="설정 버전" value={stage.contentVersion} maxLength={64} onChange={(event) => update("contentVersion", event.target.value)} help="예: stage_01_v15" />
          <TextField label="관리용 이름" value={stage.displayName} maxLength={120} onChange={(event) => update("displayName", event.target.value)} />
          <TextField label="주 몬스터 리소스 ID" value={stage.monsterVisualId} onChange={(event) => update("monsterVisualId", event.target.value)} />
          {stage.dualLaneEnabled ? <TextField label="보조 몬스터 리소스 ID" value={stage.secondaryMonsterVisualId ?? ""} onChange={(event) => update("secondaryMonsterVisualId", event.target.value)} /> : null}
        </FieldGroup>

        <FieldGroup title="전투 난이도" description={`현재 설정으로 약 ${totalUnits.toLocaleString("ko-KR")}마리가 생성됩니다.`}>
          <NumberField label="시작 체력" value={stage.startingHealth} min={1} step={1} onValue={(value) => update("startingHealth", value)} />
          <NumberField label="종료 체력" value={stage.endingHealth} min={1} step={1} onValue={(value) => update("endingHealth", value)} help="시작 체력보다 작을 수 없습니다." />
          <NumberField label="생성 시간(초)" value={stage.segmentGenerationSeconds} min={0} step={1} onValue={(value) => update("segmentGenerationSeconds", value)} />
          <NumberField label="생성 간격(초)" value={stage.segmentSpawnSeconds} min={0.01} step={0.05} onValue={(value) => update("segmentSpawnSeconds", value)} />
          <NumberField label="몬스터 간격 배율" value={stage.segmentSpacingMultiplier} min={0.01} step={0.05} onValue={(value) => update("segmentSpacingMultiplier", value)} />
          <NumberField label="이동 속도 배율" value={stage.movementSpeedMultiplier ?? 1} min={0.01} step={0.05} onValue={(value) => update("movementSpeedMultiplier", value)} help="1이 기본 속도입니다." />
          <NumberField label="처치 후 축소 시간(초)" value={stage.collapseSeconds} min={0.01} step={0.05} onValue={(value) => update("collapseSeconds", value)} />
          <NumberField label="입장 에너지" value={stage.energyCost} min={1} max={100} step={1} onValue={(value) => update("energyCost", value)} />
        </FieldGroup>

        <FieldGroup title="광폭화" description="일반 구간과 광폭화 구간이 반복되는 시간 설정입니다.">
          <NumberField label="일반 유지(초)" value={stage.berserkNormalSeconds} min={0} step={0.5} onValue={(value) => update("berserkNormalSeconds", value)} />
          <NumberField label="광폭화 유지(초)" value={stage.berserkDurationSeconds} min={0} step={0.5} onValue={(value) => update("berserkDurationSeconds", value)} />
          <NumberField label="광폭화 속도 배율" value={stage.berserkMovementMultiplier} min={1} step={0.1} onValue={(value) => update("berserkMovementMultiplier", value)} />
        </FieldGroup>

        <FieldGroup title="경로 방식" description="기존 앱 엔진이 지원하는 경로만 선택할 수 있습니다.">
          <SelectField label="경로 유형" value={pathType} onChange={(event) => onChange(changePathType(stage, event.target.value as PathType))}>
            <option value="manual">수동 좌표</option>
            <option value="spiral">원형 나선</option>
            <option value="rectangle">사각 나선</option>
            <option value="star">별 나선</option>
            <option value="pattern">패턴 경로</option>
            <option value="twin">트윈 뱀형</option>
            <option value="parallel">평행 레인</option>
          </SelectField>
          <NumberField label="그리드 가로" value={stage.gridWidth} min={1} max={100} step={1} onValue={(value) => update("gridWidth", value)} />
          <NumberField label="그리드 세로" value={stage.gridHeight} min={1} max={100} step={1} onValue={(value) => update("gridHeight", value)} />
          <NumberField label="가로 여백(칸)" value={stage.horizontalPathInsetCells} min={0} step={0.05} onValue={(value) => update("horizontalPathInsetCells", value)} />
          <div className="sm:col-span-2 xl:col-span-2">
            <ToggleField label="2개 경로 사용" checked={stage.dualLaneEnabled === true} onChange={(checked) => onChange(toggleDualLane(stage, checked))} help="두 번째 몬스터와 경로별 생성·체력 비율이 필요합니다." />
          </div>
          {stage.dualLaneEnabled ? <>
            <NumberField label="보조 경로 생성 비율" value={stage.dualLaneUnitRatio} min={0.01} max={1} step={0.05} onValue={(value) => update("dualLaneUnitRatio", value)} />
            <NumberField label="보조 경로 체력 비율" value={stage.dualLaneHealthRatio} min={0.01} max={1} step={0.05} onValue={(value) => update("dualLaneHealthRatio", value)} />
          </> : null}
        </FieldGroup>

        <PathSettings stage={stage} pathType={pathType} onChange={onChange} />

        <FieldGroup title="선택지 등장 시점" description="스킬과 옵션 선택이 같은 몬스터 번호에서 겹치면 서버 검증에 실패합니다.">
          <ScheduleFields label="스킬 선택" value={stage.skillChoiceSchedule} onChange={(value) => update("skillChoiceSchedule", value)} />
          <ScheduleFields label="옵션 선택" value={stage.optionChoiceSchedule} onChange={(value) => update("optionChoiceSchedule", value)} />
        </FieldGroup>
      </div>
      <div className="2xl:sticky 2xl:top-24"><StagePathPreview stage={stage} /></div>
    </div>
  );
}

function PathSettings({ stage, pathType, onChange }: {
  stage: StageDefinition;
  pathType: PathType;
  onChange: (stage: StageDefinition) => void;
}) {
  if (pathType === "manual") return <WaypointEditor stage={stage} onChange={onChange} />;
  if (pathType === "parallel") {
    return (
      <FieldGroup title="평행 레인 설정">
        <NumberField label="레인 개수" value={stage.parallelLaneCount} min={2} max={5} step={1} onValue={(value) => onChange({ ...stage, parallelLaneCount: value })} />
        <NumberField label="레인별 생성 비율" value={stage.parallelLaneUnitRatio} min={0.01} max={1} step={0.05} onValue={(value) => onChange({ ...stage, parallelLaneUnitRatio: value })} />
        <NumberField label="레인별 체력 비율" value={stage.parallelLaneHealthRatio} min={0.01} max={1} step={0.05} onValue={(value) => onChange({ ...stage, parallelLaneHealthRatio: value })} />
      </FieldGroup>
    );
  }
  if (pathType === "spiral" && stage.spiralPath) {
    const path = stage.spiralPath;
    return <FieldGroup title="원형 나선 설정">
      <PointFields label="중심" value={path.centerWorld} onChange={(centerWorld) => onChange({ ...stage, spiralPath: { ...path, centerWorld } })} />
      <NumberField label="바깥 반지름" value={path.outerRadiusWorld} min={0.01} step={0.1} onValue={(outerRadiusWorld) => onChange({ ...stage, spiralPath: { ...path, outerRadiusWorld } })} />
      <NumberField label="안쪽 반지름" value={path.innerRadiusWorld} min={0} step={0.1} onValue={(innerRadiusWorld) => onChange({ ...stage, spiralPath: { ...path, innerRadiusWorld } })} />
      <NumberField label="회전 수" value={path.turns} min={0.01} step={0.25} onValue={(turns) => onChange({ ...stage, spiralPath: { ...path, turns } })} />
      <NumberField label="회전당 점 개수" value={path.samplesPerTurn} min={8} max={1000} step={1} onValue={(samplesPerTurn) => onChange({ ...stage, spiralPath: { ...path, samplesPerTurn } })} />
      <NumberField label="시작 각도" value={path.startAngleDegrees} step={1} onValue={(startAngleDegrees) => onChange({ ...stage, spiralPath: { ...path, startAngleDegrees } })} />
      <ToggleField label="시계 방향" checked={path.clockwise} onChange={(clockwise) => onChange({ ...stage, spiralPath: { ...path, clockwise } })} />
    </FieldGroup>;
  }
  if (pathType === "rectangle" && stage.rectangularSpiralPath) {
    const path = stage.rectangularSpiralPath;
    return <FieldGroup title="사각 나선 설정">
      <PointFields label="중심" value={path.centerWorld} onChange={(centerWorld) => onChange({ ...stage, rectangularSpiralPath: { ...path, centerWorld } })} />
      <NumberField label="가로 반폭" value={path.outerHalfWidthWorld} min={0.01} step={0.1} onValue={(outerHalfWidthWorld) => onChange({ ...stage, rectangularSpiralPath: { ...path, outerHalfWidthWorld } })} />
      <NumberField label="세로 반폭" value={path.outerHalfHeightWorld} min={0.01} step={0.1} onValue={(outerHalfHeightWorld) => onChange({ ...stage, rectangularSpiralPath: { ...path, outerHalfHeightWorld } })} />
      <NumberField label="겹 수" value={path.loops} min={2} step={1} onValue={(loops) => onChange({ ...stage, rectangularSpiralPath: { ...path, loops } })} />
      <ToggleField label="시계 방향" checked={path.clockwise} onChange={(clockwise) => onChange({ ...stage, rectangularSpiralPath: { ...path, clockwise } })} />
    </FieldGroup>;
  }
  if (pathType === "star" && stage.starSpiralPath) {
    const path = stage.starSpiralPath;
    return <FieldGroup title="별 나선 설정">
      <PointFields label="중심" value={path.centerWorld} onChange={(centerWorld) => onChange({ ...stage, starSpiralPath: { ...path, centerWorld } })} />
      <NumberField label="가로 반폭" value={path.outerHalfWidthWorld} min={0.01} step={0.1} onValue={(outerHalfWidthWorld) => onChange({ ...stage, starSpiralPath: { ...path, outerHalfWidthWorld } })} />
      <NumberField label="세로 반폭" value={path.outerHalfHeightWorld} min={0.01} step={0.1} onValue={(outerHalfHeightWorld) => onChange({ ...stage, starSpiralPath: { ...path, outerHalfHeightWorld } })} />
      <NumberField label="안쪽 크기 비율" value={path.innerScale} min={0.01} max={0.99} step={0.01} onValue={(innerScale) => onChange({ ...stage, starSpiralPath: { ...path, innerScale } })} />
      <NumberField label="시작 각도" value={path.startAngleDegrees} step={1} onValue={(startAngleDegrees) => onChange({ ...stage, starSpiralPath: { ...path, startAngleDegrees } })} />
      <ToggleField label="시계 방향" checked={path.clockwise} onChange={(clockwise) => onChange({ ...stage, starSpiralPath: { ...path, clockwise } })} />
    </FieldGroup>;
  }
  if ((pathType === "pattern" || pathType === "twin") && stage.patternPath) {
    const path = stage.patternPath;
    return <FieldGroup title="패턴 경로 설정">
      <SelectField label="엔진 패턴" value={path.kind} onChange={(event) => onChange({ ...stage, patternPath: { ...path, kind: Number(event.target.value) } })}>
        <option value={0}>패턴 0 · 기본 트윈</option><option value={1}>패턴 1 · 뱀형</option><option value={2}>패턴 2</option><option value={3}>패턴 3</option><option value={4}>패턴 4</option><option value={5}>패턴 5 · 트윈 스프링</option><option value={6}>패턴 6 · 트윈 열 이동</option>
      </SelectField>
      <PointFields label="중심" value={path.centerWorld} onChange={(centerWorld) => onChange({ ...stage, patternPath: { ...path, centerWorld } })} />
      <NumberField label="가로 반폭" value={path.outerHalfWidthWorld} min={0.01} step={0.1} onValue={(outerHalfWidthWorld) => onChange({ ...stage, patternPath: { ...path, outerHalfWidthWorld } })} />
      <NumberField label="세로 반폭" value={path.outerHalfHeightWorld} min={0.01} step={0.1} onValue={(outerHalfHeightWorld) => onChange({ ...stage, patternPath: { ...path, outerHalfHeightWorld } })} />
      <NumberField label="안쪽 크기 비율" value={path.innerScale} min={0.01} max={0.99} step={0.01} onValue={(innerScale) => onChange({ ...stage, patternPath: { ...path, innerScale } })} />
      <NumberField label="샘플 수" value={path.samples} min={24} max={10000} step={1} onValue={(samples) => onChange({ ...stage, patternPath: { ...path, samples } })} />
      <ToggleField label="시계 방향" checked={path.clockwise} onChange={(clockwise) => onChange({ ...stage, patternPath: { ...path, clockwise } })} />
    </FieldGroup>;
  }
  return <InlineHelp>경로 설정이 불완전합니다. 경로 유형을 다시 선택하면 안전한 기본값을 생성합니다.</InlineHelp>;
}

function WaypointEditor({ stage, onChange }: { stage: StageDefinition; onChange: (stage: StageDefinition) => void }) {
  const updatePoint = (index: number, key: "x" | "y", value: number) => {
    const waypoints = stage.waypoints.map((point, pointIndex) => pointIndex === index ? { ...point, [key]: value } : point);
    onChange({ ...stage, waypoints });
  };
  return (
    <FieldGroup title="수동 좌표" description="위에서 아래로 이동하는 순서입니다. 시작점은 0번입니다.">
      <NumberField label="헤더 진입 점 개수" value={stage.headerOverlayEntryWaypointCount} min={0} max={stage.waypoints.length} step={1} onValue={(value) => onChange({ ...stage, headerOverlayEntryWaypointCount: value })} />
      <NumberField label="헤더 진입 오프셋" value={stage.headerOverlayEntryOffsetWorld} min={0} step={0.1} onValue={(value) => onChange({ ...stage, headerOverlayEntryOffsetWorld: value })} />
      <details className="sm:col-span-2 xl:col-span-3 rounded-lg border border-slate-800 bg-slate-900/70">
        <summary className="cursor-pointer px-4 py-3 text-xs font-bold text-slate-300 hover:text-white">좌표 {stage.waypoints.length}개 상세 편집</summary>
        <div className="space-y-2 border-t border-slate-800 p-3">
          {stage.waypoints.map((point, index) => (
            <div key={index} className="grid grid-cols-[42px_1fr_1fr_36px] items-end gap-2 rounded-lg bg-slate-900 p-2">
              <span className="pb-2 text-center text-xs font-bold text-slate-600">{index}</span>
              <NumberField label="X" value={point.x} min={0} max={stage.gridWidth} step={0.1} onValue={(value) => updatePoint(index, "x", value)} />
              <NumberField label="Y" value={point.y} min={0} max={stage.gridHeight} step={0.1} onValue={(value) => updatePoint(index, "y", value)} />
              <button type="button" onClick={() => onChange({ ...stage, waypoints: stage.waypoints.filter((_, pointIndex) => pointIndex !== index) })} className="mb-1 rounded-lg p-2 text-slate-600 hover:bg-rose-500/10 hover:text-rose-300" aria-label={`${index}번 좌표 삭제`}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => onChange({ ...stage, waypoints: [...stage.waypoints, { x: stage.gridWidth / 2, y: 0 }] })} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-2.5 text-xs font-bold text-slate-400 hover:border-emerald-500/50 hover:text-emerald-300"><Plus className="h-4 w-4" /> 좌표 추가</button>
        </div>
      </details>
    </FieldGroup>
  );
}

function PointFields({ label, value, onChange }: { label: string; value: { x: number; y: number }; onChange: (value: { x: number; y: number }) => void }) {
  return <div className="grid grid-cols-2 gap-2"><NumberField label={`${label} X`} value={value.x} step={0.1} onValue={(x) => onChange({ ...value, x })} /><NumberField label={`${label} Y`} value={value.y} step={0.1} onValue={(y) => onChange({ ...value, y })} /></div>;
}

function ScheduleFields({ label, value, onChange }: { label: string; value: StageDefinition["skillChoiceSchedule"]; onChange: (value: StageDefinition["skillChoiceSchedule"]) => void }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-900 p-3"><p className="mb-3 text-xs font-bold text-emerald-300">{label}</p><div className="grid gap-3"><NumberField label="첫 등장 몬스터 번호" value={value.firstUnit} min={1} step={1} onValue={(firstUnit) => onChange({ ...value, firstUnit })} /><NumberField label="이후 간격" value={value.intervalUnits} min={1} step={1} onValue={(intervalUnits) => onChange({ ...value, intervalUnits })} /><NumberField label="최대 횟수" value={value.maxCount} min={0} step={1} onValue={(maxCount) => onChange({ ...value, maxCount })} help="0은 가능한 동안 계속입니다." /></div></div>;
}

function currentPathType(stage: StageDefinition): PathType {
  if ((stage.bottomLanePathKind ?? 0) === 2) return "parallel";
  if ((stage.bottomLanePathKind ?? 0) === 1) return "twin";
  return (["manual", "spiral", "rectangle", "star", "pattern"] as PathType[])[stage.battleMode ?? 0] ?? "manual";
}

function changePathType(stage: StageDefinition, type: PathType): StageDefinition {
  const next: StageDefinition = { ...stage, bottomLanePathKind: 0, headerOverlayEntryWaypointCount: 0, headerOverlayEntryOffsetWorld: 0, waypoints: [] };
  if (type === "manual") return { ...next, battleMode: 0, waypoints: stage.waypoints.length >= 2 ? stage.waypoints : [{ x: 0, y: stage.gridHeight }, { x: stage.gridWidth / 2, y: 0 }] };
  if (type === "spiral") return { ...next, battleMode: 1, spiralPath: stage.spiralPath ?? { centerWorld: { x: 0, y: 0 }, outerRadiusWorld: 8, innerRadiusWorld: 0, turns: 6, samplesPerTurn: 48, startAngleDegrees: 90, clockwise: true } };
  if (type === "rectangle") return { ...next, battleMode: 2, rectangularSpiralPath: stage.rectangularSpiralPath ?? { centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 4, outerHalfHeightWorld: 8, loops: 5, clockwise: true } };
  if (type === "star") return { ...next, battleMode: 3, starSpiralPath: stage.starSpiralPath ?? { centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 4, outerHalfHeightWorld: 8, innerScale: 0.55, startAngleDegrees: 162, clockwise: true } };
  if (type === "parallel") return { ...next, battleMode: 0, bottomLanePathKind: 2, dualLaneEnabled: false, parallelLaneCount: stage.parallelLaneCount ?? 3, parallelLaneUnitRatio: stage.parallelLaneUnitRatio ?? 0.34, parallelLaneHealthRatio: stage.parallelLaneHealthRatio ?? 1 };
  const twin = type === "twin";
  return { ...next, battleMode: twin ? 0 : 4, bottomLanePathKind: twin ? 1 : 0, dualLaneEnabled: twin ? true : stage.dualLaneEnabled, secondaryMonsterVisualId: stage.secondaryMonsterVisualId ?? stage.monsterVisualId, dualLaneUnitRatio: stage.dualLaneUnitRatio ?? 0.7, dualLaneHealthRatio: stage.dualLaneHealthRatio ?? 0.6, patternPath: stage.patternPath ?? { kind: twin ? 1 : 0, centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 4, outerHalfHeightWorld: 8, innerScale: 0.55, samples: 72, clockwise: true } };
}

function toggleDualLane(stage: StageDefinition, enabled: boolean): StageDefinition {
  if (!enabled) return { ...stage, dualLaneEnabled: false };
  return { ...stage, dualLaneEnabled: true, secondaryMonsterVisualId: stage.secondaryMonsterVisualId ?? stage.monsterVisualId, dualLaneUnitRatio: stage.dualLaneUnitRatio ?? 0.7, dualLaneHealthRatio: stage.dualLaneHealthRatio ?? 0.6 };
}
