import type { Point, StageDefinition } from "../../../../lib/admin/stage-content/types";

const width = 280;
const height = 360;
const padding = 22;

export function StagePathPreview({ stage }: { stage: StageDefinition }) {
  const lines = previewLines(stage);
  const label = pathLabel(stage);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">경로 미리보기</p>
          <p className="mt-0.5 text-xs text-slate-500">{label}</p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-300">형태 참고용</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto max-h-[360px] w-full rounded-lg bg-slate-900" role="img" aria-label={`${label} 경로 미리보기`}>
        <defs>
          <linearGradient id={`path-${stage.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {Array.from({ length: 7 }, (_, index) => <line key={`v-${index}`} x1={padding + index * (width - padding * 2) / 6} y1={padding} x2={padding + index * (width - padding * 2) / 6} y2={height - padding} stroke="#1e293b" strokeWidth="1" />)}
        {Array.from({ length: 11 }, (_, index) => <line key={`h-${index}`} x1={padding} y1={padding + index * (height - padding * 2) / 10} x2={width - padding} y2={padding + index * (height - padding * 2) / 10} stroke="#1e293b" strokeWidth="1" />)}
        {lines.map((line, index) => (
          <polyline
            key={index}
            points={line.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ")}
            fill="none"
            stroke={`url(#path-${stage.id})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={index === 0 ? 1 : 0.72}
          />
        ))}
        {lines[0]?.length ? <circle cx={lines[0][0].x} cy={lines[0][0].y} r="6" fill="#34d399" /> : null}
        {lines[0]?.length ? <circle cx={lines[0][lines[0].length - 1].x} cy={lines[0][lines[0].length - 1].y} r="6" fill="#fb7185" /> : null}
      </svg>
      <p className="mt-3 text-[11px] leading-5 text-slate-600">실제 이동 결과는 Unity 엔진 계산을 기준으로 합니다. production 승격 전에 test 빌드에서 반드시 확인하세요.</p>
    </div>
  );
}

export function pathLabel(stage: StageDefinition): string {
  if ((stage.bottomLanePathKind ?? 0) === 2) return `평행 ${stage.parallelLaneCount ?? 1}개 레인`;
  if ((stage.bottomLanePathKind ?? 0) === 1) return "트윈 뱀형 경로";
  return ["수동 좌표 경로", "원형 나선", "사각 나선", "별 나선", "패턴 경로"][stage.battleMode ?? 0] ?? "알 수 없는 경로";
}

function previewLines(stage: StageDefinition): Point[][] {
  if ((stage.bottomLanePathKind ?? 0) === 2) {
    const lanes = Math.max(2, stage.parallelLaneCount ?? 2);
    return Array.from({ length: lanes }, (_, index) => {
      const x = padding + (index + 0.5) * (width - padding * 2) / lanes;
      return [{ x, y: padding }, { x, y: height - padding }];
    });
  }
  const raw = rawPreviewPoints(stage);
  const first = normalize(raw);
  if (!stage.dualLaneEnabled || first.length === 0) return [first];
  const offset = 7;
  return [first.map((point) => ({ x: point.x - offset, y: point.y })), first.map((point) => ({ x: point.x + offset, y: point.y }))];
}

function rawPreviewPoints(stage: StageDefinition): Point[] {
  const mode = stage.battleMode ?? 0;
  if (mode === 0 && stage.waypoints.length > 1) {
    return stage.waypoints.map((point) => ({ x: point.x, y: stage.gridHeight - point.y }));
  }
  if (mode === 1 && stage.spiralPath) {
    const path = stage.spiralPath;
    const samples = Math.min(360, Math.max(48, Math.ceil(path.turns * 32)));
    return Array.from({ length: samples }, (_, index) => {
      const t = index / Math.max(1, samples - 1);
      const radius = path.outerRadiusWorld + (path.innerRadiusWorld - path.outerRadiusWorld) * t;
      const direction = path.clockwise ? 1 : -1;
      const angle = (path.startAngleDegrees * Math.PI / 180) + direction * t * path.turns * Math.PI * 2;
      return { x: path.centerWorld.x + Math.cos(angle) * radius, y: path.centerWorld.y + Math.sin(angle) * radius };
    });
  }
  if (mode === 2 && stage.rectangularSpiralPath) {
    const path = stage.rectangularSpiralPath;
    const points: Point[] = [];
    for (let loop = 0; loop < path.loops; loop += 1) {
      const scale = 1 - loop / Math.max(1, path.loops);
      const x = path.outerHalfWidthWorld * scale;
      const y = path.outerHalfHeightWorld * scale;
      points.push({ x: -x, y: -y }, { x, y: -y }, { x, y }, { x: -x, y });
    }
    points.push({ x: 0, y: 0 });
    return path.clockwise ? points : points.map((point) => ({ x: -point.x, y: point.y }));
  }
  if (mode === 3 && stage.starSpiralPath) {
    const path = stage.starSpiralPath;
    return Array.from({ length: 31 }, (_, index) => {
      const t = index / 30;
      const radius = (index % 2 === 0 ? 1 : path.innerScale) * (1 - t * 0.72);
      const angle = path.startAngleDegrees * Math.PI / 180 + (path.clockwise ? 1 : -1) * index * Math.PI * 0.8;
      return { x: Math.cos(angle) * path.outerHalfWidthWorld * radius, y: Math.sin(angle) * path.outerHalfHeightWorld * radius };
    });
  }
  const pattern = stage.patternPath;
  if (pattern) {
    const samples = 96;
    return Array.from({ length: samples }, (_, index) => {
      const t = index / (samples - 1);
      if (pattern.kind === 5) return { x: Math.sin(t * Math.PI * 8) * pattern.outerHalfWidthWorld, y: (t - 0.5) * pattern.outerHalfHeightWorld * 2 };
      if (pattern.kind === 6) return { x: (Math.round(t * 6) % 2 ? 1 : -1) * pattern.outerHalfWidthWorld, y: (t - 0.5) * pattern.outerHalfHeightWorld * 2 };
      const radius = 1 - t * 0.55;
      const angle = t * Math.PI * (pattern.kind + 4) * (pattern.clockwise ? 1 : -1);
      return { x: Math.cos(angle) * pattern.outerHalfWidthWorld * radius, y: Math.sin(angle) * pattern.outerHalfHeightWorld * radius };
    });
  }
  return [];
}

function normalize(points: Point[]): Point[] {
  if (points.length === 0) return [];
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = Math.max(1, maxX - minX);
  const rangeY = Math.max(1, maxY - minY);
  return points.map((point) => ({
    x: padding + (point.x - minX) / rangeX * (width - padding * 2),
    y: padding + (point.y - minY) / rangeY * (height - padding * 2),
  }));
}

