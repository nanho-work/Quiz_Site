"use client";

import { useMemo, useState } from "react";
import type { Point, StageDefinition } from "../../../../lib/admin/stage-content/types";
import {
  buildUnityStagePathModel,
  unityPathLabel,
  type UnityStagePathModel,
  type WorldRect,
} from "../../../../lib/admin/stage-content/unity-path-engine";

const svgWidth = 300;
const svgHeight = 560;
const svgPadding = 16;
const centerClearanceWorld = 1.55;
const laneColors = ["#34d399", "#38bdf8", "#f59e0b", "#a78bfa", "#fb7185"];

const aspectPresets = [
  { id: "1440x2960", label: "1440 × 2960 · 테스트 기준", aspect: 1440 / 2960 },
  { id: "1080x2400", label: "1080 × 2400 · 20:9", aspect: 1080 / 2400 },
  { id: "1080x1920", label: "1080 × 1920 · 16:9", aspect: 1080 / 1920 },
] as const;

export function StagePathPreview({ stage }: { stage: StageDefinition }) {
  const [aspectId, setAspectId] = useState<(typeof aspectPresets)[number]["id"]>("1440x2960");
  const aspect = aspectPresets.find((preset) => preset.id === aspectId)?.aspect ?? aspectPresets[0].aspect;
  const preview = useMemo(() => {
    try {
      return { model: buildUnityStagePathModel(stage, aspect), error: null };
    } catch (error) {
      return {
        model: null,
        error: error instanceof Error ? error.message : "경로를 계산하지 못했습니다.",
      };
    }
  }, [aspect, stage]);
  const label = pathLabel(stage);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">경로 미리보기</p>
          <p className="mt-0.5 text-xs text-slate-500">{label}</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
          Unity 경로 기준
        </span>
      </div>

      <label className="mt-3 block text-[11px] font-semibold text-slate-500">
        표시할 기기 화면비
        <select
          value={aspectId}
          onChange={(event) => setAspectId(event.target.value as (typeof aspectPresets)[number]["id"])}
          className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-emerald-500"
        >
          {aspectPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
        </select>
      </label>

      {preview.model ? <UnityPathSvg model={preview.model} stage={stage} /> : (
        <div className="mt-3 flex min-h-56 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 p-5 text-center text-xs leading-5 text-rose-200">
          {preview.error}
        </div>
      )}

      {preview.model ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-400">
          {preview.model.lines.map((line, index) => (
            <span key={line.id} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: laneColors[index % laneColors.length] }} />
              {line.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />시작</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" />도착</span>
        </div>
      ) : null}

      <p className="mt-3 text-[11px] leading-5 text-slate-500">
        좌표, 화면 밖 진입, 중앙 안전 반경과 복수 레인을 Unity 런타임과 같은 순서로 계산합니다.
        흰 테두리는 실제 기기 화면이며 테두리 밖 경로는 몬스터가 보이기 전의 진입 구간입니다.
      </p>
    </div>
  );
}

function UnityPathSvg({ model, stage }: { model: UnityStagePathModel; stage: StageDefinition }) {
  const displayBounds = calculateDisplayBounds(model);
  const project = createProjector(displayBounds);
  const visibleRect = projectRect(model.visibleBounds, project);
  const boardRect = projectRect(model.boardBounds, project);
  const center = project(model.centerWorld);
  const finish = model.lines[0]?.points.length
    ? project(model.lines[0].points[model.lines[0].points.length - 1])
    : center;
  const scale = project.scale;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="mt-3 max-h-[620px] w-full rounded-lg bg-slate-950"
      role="img"
      aria-label={`${unityPathLabel(stage)} Unity 실제 경로 미리보기`}
    >
      <rect x="0" y="0" width={svgWidth} height={svgHeight} rx="10" fill="#020617" />
      <rect
        x={visibleRect.x}
        y={visibleRect.y}
        width={visibleRect.width}
        height={visibleRect.height}
        fill="#0f172a"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <text x={visibleRect.x + 7} y={visibleRect.y + 14} fill="#94a3b8" fontSize="9" fontWeight="700">
        실제 기기 화면
      </text>

      <rect
        x={boardRect.x}
        y={boardRect.y}
        width={boardRect.width}
        height={boardRect.height}
        fill="#0b1220"
        fillOpacity="0.45"
        stroke="#64748b"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {gridLines(stage, model.boardBounds, project)}

      {model.isCenterAimStage ? (
        <circle
          cx={center.x}
          cy={center.y}
          r={centerClearanceWorld * scale}
          fill="#fb7185"
          fillOpacity="0.06"
          stroke="#fb7185"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      ) : null}

      {model.lines.map((line, index) => {
        const projected = line.points.map(project);
        const start = projected[0];
        const color = laneColors[index % laneColors.length];
        return (
          <g key={line.id}>
            <polyline
              points={projected.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")}
              fill="none"
              stroke="#020617"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
            <polyline
              points={projected.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")}
              fill="none"
              stroke={color}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={index === 0 ? 1 : 0.86}
            />
            {start ? <circle cx={start.x} cy={start.y} r="5" fill="#34d399" stroke="#020617" strokeWidth="2" /> : null}
          </g>
        );
      })}

      {model.lines[0]?.points.length ? (
        <circle cx={finish.x} cy={finish.y} r="5.5" fill="#fb7185" stroke="#020617" strokeWidth="2" />
      ) : null}
    </svg>
  );
}

function gridLines(
  stage: StageDefinition,
  board: WorldRect,
  project: Projector,
): React.ReactNode[] {
  const lines: React.ReactNode[] = [];
  const columns = Math.max(1, Math.trunc(stage.gridWidth));
  const rows = Math.max(1, Math.trunc(stage.gridHeight));
  for (let column = 0; column <= columns; column += 1) {
    const x = board.xMin + board.width * column / columns;
    const from = project({ x, y: board.yMin });
    const to = project({ x, y: board.yMin + board.height });
    lines.push(<line key={`column-${column}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#1e293b" strokeWidth="0.8" />);
  }
  for (let row = 0; row <= rows; row += 1) {
    const y = board.yMin + board.height * row / rows;
    const from = project({ x: board.xMin, y });
    const to = project({ x: board.xMin + board.width, y });
    lines.push(<line key={`row-${row}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#1e293b" strokeWidth="0.8" />);
  }
  return lines;
}

interface Projector {
  (point: Point): Point;
  scale: number;
}

function createProjector(bounds: WorldRect): Projector {
  const scale = Math.min(
    (svgWidth - svgPadding * 2) / bounds.width,
    (svgHeight - svgPadding * 2) / bounds.height,
  );
  const renderedWidth = bounds.width * scale;
  const renderedHeight = bounds.height * scale;
  const offsetX = (svgWidth - renderedWidth) * 0.5;
  const offsetY = (svgHeight - renderedHeight) * 0.5;
  const projector = ((point: Point) => ({
    x: offsetX + (point.x - bounds.xMin) * scale,
    y: offsetY + (bounds.yMin + bounds.height - point.y) * scale,
  })) as Projector;
  projector.scale = scale;
  return projector;
}

function calculateDisplayBounds(model: UnityStagePathModel): WorldRect {
  const points: Point[] = [
    { x: model.visibleBounds.xMin, y: model.visibleBounds.yMin },
    { x: model.visibleBounds.xMin + model.visibleBounds.width, y: model.visibleBounds.yMin + model.visibleBounds.height },
    { x: model.boardBounds.xMin, y: model.boardBounds.yMin },
    { x: model.boardBounds.xMin + model.boardBounds.width, y: model.boardBounds.yMin + model.boardBounds.height },
    ...model.lines.flatMap((line) => line.points),
  ];
  const minimumX = Math.min(...points.map((point) => point.x));
  const maximumX = Math.max(...points.map((point) => point.x));
  const minimumY = Math.min(...points.map((point) => point.y));
  const maximumY = Math.max(...points.map((point) => point.y));
  const margin = 0.35;
  return {
    xMin: minimumX - margin,
    yMin: minimumY - margin,
    width: Math.max(1, maximumX - minimumX + margin * 2),
    height: Math.max(1, maximumY - minimumY + margin * 2),
  };
}

function projectRect(rect: WorldRect, project: Projector) {
  const topLeft = project({ x: rect.xMin, y: rect.yMin + rect.height });
  const bottomRight = project({ x: rect.xMin + rect.width, y: rect.yMin });
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
}

export function pathLabel(stage: StageDefinition): string {
  return unityPathLabel(stage);
}
