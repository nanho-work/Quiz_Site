import type { Point, StageDefinition } from "./types";

export interface WorldRect {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
}

export interface UnityStagePathLine {
  id: string;
  label: string;
  points: Point[];
}

export interface UnityStagePathModel {
  boardBounds: WorldRect;
  visibleBounds: WorldRect;
  centerWorld: Point;
  isCenterAimStage: boolean;
  lines: UnityStagePathLine[];
}

// Keep these values in sync with PrototypeAppController and SegmentView.
export const UNITY_STAGE_BOARD_BOUNDS: Readonly<WorldRect> = Object.freeze({
  xMin: -4.5,
  yMin: -7,
  width: 9,
  height: 15,
});
export const UNITY_CAMERA_HALF_HEIGHT = 10;
export const UNITY_SEGMENT_DIAMETER = 1.5;
export const DEFAULT_PREVIEW_ASPECT = 1440 / 2960;

const CENTER_PLAYER_CLEARANCE_WORLD = 1.55;
const CENTER_SAFE_ROUTE_SAMPLE_STEP = 0.18;
const EPSILON = 0.000001;
const DUPLICATE_POINT_EPSILON_SQUARED = 0.00000001;

const BATTLE_MODE_BOTTOM_LANE = 0;
const BATTLE_MODE_CENTER_SPIRAL = 1;
const BATTLE_MODE_CENTER_RECTANGLE = 2;
const BATTLE_MODE_CENTER_STAR = 3;
const BATTLE_MODE_CENTER_PATTERN = 4;

const BOTTOM_PATH_TWIN_SERPENTINE = 1;
const BOTTOM_PATH_PARALLEL_CONVERGING = 2;
const PATTERN_TWIN_SPRING = 5;
const PATTERN_TWIN_COLUMN_SWEEP = 6;

export function buildUnityStagePathModel(
  stage: StageDefinition,
  cameraAspect = DEFAULT_PREVIEW_ASPECT,
): UnityStagePathModel {
  if (!Number.isFinite(cameraAspect) || cameraAspect <= 0) {
    throw new Error("카메라 화면비는 0보다 커야 합니다.");
  }

  const boardBounds = { ...UNITY_STAGE_BOARD_BOUNDS };
  const cameraHalfWidth = UNITY_CAMERA_HALF_HEIGHT * cameraAspect;
  const visibleBounds: WorldRect = {
    xMin: -cameraHalfWidth,
    yMin: -UNITY_CAMERA_HALF_HEIGHT,
    width: cameraHalfWidth * 2,
    height: UNITY_CAMERA_HALF_HEIGHT * 2,
  };
  const center = centerWorld(stage);
  const lines: UnityStagePathLine[] = [];

  if (usesParallelConvergingPath(stage)) {
    const laneCount = Math.max(2, Math.trunc(stage.parallelLaneCount ?? 2));
    for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
      const authored = buildParallelConvergingWorldWaypoints(stage, boardBounds, laneIndex, laneCount);
      lines.push({
        id: `lane-${laneIndex + 1}`,
        label: `레인 ${laneIndex + 1}`,
        points: prependOffscreenEntry(authored, visibleBounds, UNITY_SEGMENT_DIAMETER),
      });
    }
  } else if (stage.dualLaneEnabled) {
    lines.push({
      id: "primary",
      label: "주 경로",
      points: buildRuntimeLane(stage, boardBounds, visibleBounds, 0),
    });
    lines.push({
      id: "secondary",
      label: "보조 경로",
      points: buildRuntimeLane(stage, boardBounds, visibleBounds, 1),
    });
  } else {
    lines.push({
      id: "primary",
      label: "주 경로",
      points: buildRuntimeLane(stage, boardBounds, visibleBounds, 0),
    });
  }

  return {
    boardBounds,
    visibleBounds,
    centerWorld: center,
    isCenterAimStage: isCenterAimStage(stage),
    lines,
  };
}

export function unityPathLabel(stage: StageDefinition): string {
  if (usesParallelConvergingPath(stage)) return `중앙 합류형 ${stage.parallelLaneCount ?? 1}개 레인`;
  if (usesTwinSerpentinePath(stage)) return "트윈 뱀형 경로";
  if ((stage.battleMode ?? BATTLE_MODE_BOTTOM_LANE) === BATTLE_MODE_CENTER_PATTERN) {
    if (stage.dualLaneEnabled && (stage.patternPath?.kind ?? 0) <= 4) return "기본 트윈 경로";
    const patternLabels = ["하트", "8자", "번개", "꽃", "역회전 소용돌이", "트윈 스프링", "트윈 열 이동"];
    return patternLabels[stage.patternPath?.kind ?? 0] ?? "패턴 경로";
  }
  return ["수동 좌표 경로", "원형 나선", "사각 나선", "이중 별 경로"]
    [stage.battleMode ?? BATTLE_MODE_BOTTOM_LANE] ?? "알 수 없는 경로";
}

function buildRuntimeLane(
  stage: StageDefinition,
  boardBounds: WorldRect,
  visibleBounds: WorldRect,
  laneIndex: number,
): Point[] {
  if (usesTwinSerpentinePath(stage)) {
    return prependOffscreenEntry(
      buildTwinSerpentineWorldWaypoints(stage, boardBounds, laneIndex),
      visibleBounds,
      UNITY_SEGMENT_DIAMETER,
    );
  }

  const authored = buildWorldWaypoints(stage, boardBounds, laneIndex);
  if (!isCenterAimStage(stage)) {
    return prependOffscreenEntry(authored, visibleBounds, UNITY_SEGMENT_DIAMETER);
  }

  const center = centerWorld(stage);
  const safeRoute = buildCenterSafeRoute(authored, center);
  if (!stage.dualLaneEnabled) {
    return prependRadialEntry(safeRoute, visibleBounds, UNITY_SEGMENT_DIAMETER, center);
  }
  if (usesTwinSpringPath(stage) || usesTwinColumnSweepPath(stage)) {
    return prependSideEntry(safeRoute, visibleBounds, UNITY_SEGMENT_DIAMETER, laneIndex === 1);
  }
  return prependTopEntry(safeRoute, visibleBounds, UNITY_SEGMENT_DIAMETER);
}

function buildWorldWaypoints(stage: StageDefinition, worldBounds: WorldRect, laneIndex: number): Point[] {
  if (usesTwinSerpentinePath(stage)) {
    return buildTwinSerpentineWorldWaypoints(stage, worldBounds, laneIndex);
  }
  if (usesParallelConvergingPath(stage)) {
    return buildParallelConvergingWorldWaypoints(
      stage,
      worldBounds,
      laneIndex,
      Math.max(2, Math.trunc(stage.parallelLaneCount ?? 2)),
    );
  }

  switch (stage.battleMode ?? BATTLE_MODE_BOTTOM_LANE) {
    case BATTLE_MODE_CENTER_SPIRAL:
      return buildSpiralWorldWaypoints(stage);
    case BATTLE_MODE_CENTER_RECTANGLE:
      return buildRectangularSpiralWorldWaypoints(stage);
    case BATTLE_MODE_CENTER_STAR:
      return buildStarSpiralWorldWaypoints(stage);
    case BATTLE_MODE_CENTER_PATTERN:
      return stage.dualLaneEnabled
        ? buildDualLaneWorldWaypoints(stage, laneIndex)
        : buildCenterPatternWorldWaypoints(stage);
    default:
      return buildAuthoredBottomWorldWaypoints(stage, worldBounds);
  }
}

function buildAuthoredBottomWorldWaypoints(stage: StageDefinition, worldBounds: WorldRect): Point[] {
  if (!stage.waypoints || stage.waypoints.length < 2) {
    throw new Error(`${stage.id}: 수동 경로 좌표가 2개 이상 필요합니다.`);
  }
  const gridWidth = positive(stage.gridWidth, `${stage.id}: 그리드 가로`);
  const gridHeight = positive(stage.gridHeight, `${stage.id}: 그리드 세로`);
  const normalizedHorizontalInset = stage.horizontalPathInsetCells / gridWidth;
  const overlayEntryY = rectYMax(worldBounds) +
    ((stage.headerOverlayEntryWaypointCount ?? 0) > 0 ? stage.headerOverlayEntryOffsetWorld : 0);
  const points = stage.waypoints.map((waypoint, index) => {
    const normalizedX = lerp(
      normalizedHorizontalInset,
      1 - normalizedHorizontalInset,
      clamp01(waypoint.x / gridWidth),
    );
    const normalizedY = clamp01(waypoint.y / gridHeight);
    return {
      x: lerp(worldBounds.xMin, rectXMax(worldBounds), normalizedX),
      y: index < (stage.headerOverlayEntryWaypointCount ?? 0)
        ? overlayEntryY
        : lerp(worldBounds.yMin, rectYMax(worldBounds), normalizedY),
    };
  });
  return buildBottomCenterFinishApproach(stage, points, worldBounds);
}

function buildBottomCenterFinishApproach(
  stage: StageDefinition,
  authored: Point[],
  worldBounds: WorldRect,
): Point[] {
  const rowHeight = worldBounds.height / positive(stage.gridHeight, `${stage.id}: 그리드 세로`);
  const diagonalStartY = worldBounds.yMin + rowHeight * 2;
  let crossingSegment = -1;
  let crossing = { x: 0, y: 0 };

  for (let index = 0; index < authored.length - 1; index += 1) {
    const from = authored[index];
    const to = authored[index + 1];
    if (from.y + 0.0001 < diagonalStartY || to.y - 0.0001 > diagonalStartY ||
      to.y > from.y + 0.0001) continue;
    const t = approximately(from.y, to.y) ? 1 : inverseLerp(from.y, to.y, diagonalStartY);
    crossingSegment = index;
    crossing = lerpPoint(from, to, t);
  }

  if (crossingSegment < 0) {
    throw new Error(`${stage.id}: 경로가 중앙 합류 시작 행까지 내려오지 않습니다.`);
  }

  const result: Point[] = [];
  for (let index = 0; index <= crossingSegment; index += 1) addPatternPoint(result, authored[index]);
  addPatternPoint(result, crossing);
  addPatternPoint(result, { x: rectCenter(worldBounds).x, y: worldBounds.yMin + rowHeight });
  addPatternPoint(result, { x: rectCenter(worldBounds).x, y: worldBounds.yMin });
  return result;
}

function buildSpiralWorldWaypoints(stage: StageDefinition): Point[] {
  const path = required(stage.spiralPath, `${stage.id}: 원형 나선 설정`);
  const sampleCount = Math.max(1, Math.ceil(path.turns * path.samplesPerTurn));
  const direction = path.clockwise ? -1 : 1;
  const points: Point[] = [];
  for (let sample = 0; sample <= sampleCount; sample += 1) {
    const progress = sample / sampleCount;
    const radius = lerp(path.outerRadiusWorld, path.innerRadiusWorld, progress);
    const angle = degreesToRadians(path.startAngleDegrees + direction * 360 * path.turns * progress);
    points.push({
      x: path.centerWorld.x + Math.cos(angle) * radius,
      y: path.centerWorld.y + Math.sin(angle) * radius,
    });
  }
  if (approximately(path.innerRadiusWorld, 0)) points[points.length - 1] = { ...path.centerWorld };
  return points;
}

function buildRectangularSpiralWorldWaypoints(stage: StageDefinition): Point[] {
  const path = required(stage.rectangularSpiralPath, `${stage.id}: 사각 나선 설정`);
  const loops = Math.max(1, Math.trunc(path.loops));
  const stepX = path.outerHalfWidthWorld / loops;
  const stepY = path.outerHalfHeightWorld / loops;
  const center = path.centerWorld;
  const points: Point[] = [];

  if (path.clockwise) {
    points.push(add(center, { x: -path.outerHalfWidthWorld, y: path.outerHalfHeightWorld }));
    for (let loop = 0; loop < loops; loop += 1) {
      const left = -path.outerHalfWidthWorld + stepX * loop;
      const right = path.outerHalfWidthWorld - stepX * loop;
      const top = path.outerHalfHeightWorld - stepY * loop;
      const bottom = -path.outerHalfHeightWorld + stepY * loop;
      points.push(add(center, { x: right, y: top }));
      points.push(add(center, { x: right, y: bottom }));
      points.push(add(center, { x: left, y: bottom }));
      if (loop < loops - 1) points.push(add(center, { x: left, y: top - stepY }));
    }
  } else {
    points.push(add(center, { x: path.outerHalfWidthWorld, y: path.outerHalfHeightWorld }));
    for (let loop = 0; loop < loops; loop += 1) {
      const left = -path.outerHalfWidthWorld + stepX * loop;
      const right = path.outerHalfWidthWorld - stepX * loop;
      const top = path.outerHalfHeightWorld - stepY * loop;
      const bottom = -path.outerHalfHeightWorld + stepY * loop;
      points.push(add(center, { x: left, y: top }));
      points.push(add(center, { x: left, y: bottom }));
      points.push(add(center, { x: right, y: bottom }));
      if (loop < loops - 1) points.push(add(center, { x: right, y: top - stepY }));
    }
  }
  points.push({ ...center });
  return points;
}

function buildStarSpiralWorldWaypoints(stage: StageDefinition): Point[] {
  const path = required(stage.starSpiralPath, `${stage.id}: 별 나선 설정`);
  const direction = path.clockwise ? -1 : 1;
  const points: Point[] = [];
  addFivePointStar(
    points,
    path.centerWorld,
    path.outerHalfWidthWorld,
    path.outerHalfHeightWorld,
    path.startAngleDegrees,
    direction,
  );
  addFivePointStar(
    points,
    path.centerWorld,
    path.outerHalfWidthWorld * path.innerScale,
    path.outerHalfHeightWorld * path.innerScale,
    path.startAngleDegrees,
    direction,
  );
  points.push({ ...path.centerWorld });
  return points;
}

function addFivePointStar(
  points: Point[],
  center: Point,
  halfWidth: number,
  halfHeight: number,
  startAngleDegrees: number,
  direction: number,
): void {
  for (let point = 0; point <= 5; point += 1) {
    const vertex = (point * 2) % 5;
    const angle = degreesToRadians(startAngleDegrees + direction * vertex * 72);
    points.push({
      x: center.x + Math.cos(angle) * halfWidth,
      y: center.y + Math.sin(angle) * halfHeight,
    });
  }
}

function buildCenterPatternWorldWaypoints(stage: StageDefinition): Point[] {
  const path = required(stage.patternPath, `${stage.id}: 패턴 경로 설정`);
  const center = path.centerWorld;
  let points: Point[];
  switch (path.kind) {
    case 0:
      points = buildHeartPattern(path, center);
      break;
    case 1:
      points = buildFigureEightPattern(path, center);
      break;
    case 2:
      points = buildLightningPattern(path, center);
      break;
    case 3:
      points = buildFlowerPattern(path, center);
      break;
    case 4:
      points = buildReversingVortexPattern(path, center);
      break;
    default:
      throw new Error(`${stage.id}: 지원하지 않는 단일 패턴입니다.`);
  }
  addPatternPoint(points, center);
  return points;
}

type PatternPath = NonNullable<StageDefinition["patternPath"]>;

function buildHeartPattern(path: PatternPath, center: Point): Point[] {
  const points: Point[] = [];
  const evaluate = (progress: number): Point => {
    const angle = progress * Math.PI * 2;
    return {
      x: Math.sin(angle) ** 3 * path.outerHalfWidthWorld,
      y: (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 17 * path.outerHalfHeightWorld,
    };
  };
  addSampledClosedPattern(points, path.samples, path.clockwise, evaluate, center, 1);
  addSampledClosedPattern(points, path.samples, path.clockwise, evaluate, center, path.innerScale);
  return points;
}

function buildFigureEightPattern(path: PatternPath, center: Point): Point[] {
  const points: Point[] = [];
  const evaluate = (progress: number): Point => {
    const angle = progress * Math.PI * 2;
    return {
      x: Math.sin(angle) * path.outerHalfWidthWorld,
      y: Math.sin(angle * 2) * path.outerHalfHeightWorld,
    };
  };
  addSampledClosedPattern(points, path.samples, path.clockwise, evaluate, center, 1);
  addSampledClosedPattern(points, path.samples, path.clockwise, evaluate, center, path.innerScale);
  return points;
}

function buildLightningPattern(path: PatternPath, center: Point): Point[] {
  const width = path.outerHalfWidthWorld;
  const height = path.outerHalfHeightWorld;
  const outer = [
    { x: -width, y: height },
    { x: width * 0.7, y: height * 0.55 },
    { x: -width * 0.65, y: height * 0.05 },
    { x: width, y: -height * 0.3 },
    { x: -width * 0.55, y: -height * 0.7 },
    { x: width * 0.45, y: -height },
    { x: -width, y: height },
  ];
  return [
    ...outer.map((point) => add(center, point)),
    ...outer.map((point) => add(center, multiply(point, path.innerScale))),
  ];
}

function buildFlowerPattern(path: PatternPath, center: Point): Point[] {
  const points: Point[] = [];
  const evaluate = (progress: number): Point => {
    const angle = progress * Math.PI * 2;
    const radius = Math.sin(angle * 3);
    return {
      x: Math.cos(angle) * radius * path.outerHalfWidthWorld,
      y: Math.sin(angle) * radius * path.outerHalfHeightWorld,
    };
  };
  addSampledClosedPattern(points, path.samples, path.clockwise, evaluate, center, 1);
  addSampledClosedPattern(points, path.samples, path.clockwise, evaluate, center, path.innerScale);
  return points;
}

function buildReversingVortexPattern(path: PatternPath, center: Point): Point[] {
  const points: Point[] = [];
  const direction = path.clockwise ? -1 : 1;
  for (let sample = 0; sample <= path.samples; sample += 1) {
    const progress = sample / path.samples;
    const radius = lerp(1, path.innerScale, progress);
    const angle = direction * progress * Math.PI * 5;
    points.push({
      x: center.x + Math.cos(angle) * path.outerHalfWidthWorld * radius,
      y: center.y + Math.sin(angle) * path.outerHalfHeightWorld * radius,
    });
  }
  const startAngle = direction * Math.PI * 5;
  for (let sample = 1; sample <= path.samples; sample += 1) {
    const progress = sample / path.samples;
    const radius = lerp(path.innerScale, 0.025, progress);
    const angle = startAngle - direction * progress * Math.PI * 4;
    points.push({
      x: center.x + Math.cos(angle) * path.outerHalfWidthWorld * radius,
      y: center.y + Math.sin(angle) * path.outerHalfHeightWorld * radius,
    });
  }
  return points;
}

function addSampledClosedPattern(
  points: Point[],
  rawSamples: number,
  clockwise: boolean,
  evaluate: (progress: number) => Point,
  center: Point,
  scale: number,
): void {
  const samples = Math.max(1, Math.trunc(rawSamples));
  for (let sample = 0; sample <= samples; sample += 1) {
    let progress = sample / samples;
    if (clockwise) progress = 1 - progress;
    addPatternPoint(points, add(center, multiply(evaluate(progress), scale)));
  }
}

function buildDualLaneWorldWaypoints(stage: StageDefinition, laneIndex: number): Point[] {
  const path = required(stage.patternPath, `${stage.id}: 복수 경로 패턴 설정`);
  if (path.kind === PATTERN_TWIN_SPRING) return buildTwinSpringWorldWaypoints(stage, laneIndex);
  if (path.kind === PATTERN_TWIN_COLUMN_SWEEP) return buildTwinColumnSweepWorldWaypoints(stage, laneIndex);

  const center = centerWorld(stage);
  // StageDefinition stores these as C# floats. Preserve Mathf.Lerp float32
  // rounding because it changes the runtime resample count on exact 0.18-unit
  // boundaries (notably stage 6 rows 1/2/4/8/10).
  const width = Math.fround(path.outerHalfWidthWorld);
  const height = Math.fround(path.outerHalfHeightWorld);
  const row = (rowNumber: number) => unityLerp(height, -height, Math.fround((rowNumber - 1) / 9));
  const leftInner = Math.fround(-width / 6);
  const rightInner = Math.fround(width / 6);
  if (laneIndex === 0) {
    return [
      add(center, { x: -width, y: row(1) }), add(center, { x: width, y: row(1) }),
      add(center, { x: width, y: row(2) }), add(center, { x: -width, y: row(2) }),
      add(center, { x: -width, y: row(4) }), add(center, { x: width, y: row(4) }),
      add(center, { x: width, y: row(8) }), add(center, { x: -width, y: row(8) }),
      add(center, { x: -width, y: row(10) }), add(center, { x: leftInner, y: row(10) }), center,
    ];
  }
  return [
    add(center, { x: width, y: row(1) }), add(center, { x: -width, y: row(1) }),
    add(center, { x: -width, y: row(3) }), add(center, { x: width, y: row(3) }),
    add(center, { x: width, y: row(7) }), add(center, { x: -width, y: row(7) }),
    add(center, { x: -width, y: row(9) }), add(center, { x: width, y: row(9) }),
    add(center, { x: width, y: row(10) }), add(center, { x: rightInner, y: row(10) }), center,
  ];
}

function buildTwinColumnSweepWorldWaypoints(stage: StageDefinition, laneIndex: number): Point[] {
  const path = required(stage.patternPath, `${stage.id}: 트윈 열 이동 설정`);
  const center = centerWorld(stage);
  const width = path.outerHalfWidthWorld;
  const height = path.outerHalfHeightWorld;
  const columnStep = width * 2 / 6;
  if (laneIndex === 0) {
    return [
      add(center, { x: -width, y: 0 }), add(center, { x: -width, y: height }),
      add(center, { x: -width + columnStep, y: height }),
      add(center, { x: -width + columnStep, y: -height }),
      add(center, { x: -width + columnStep * 2, y: -height }),
      add(center, { x: -width + columnStep * 2, y: height }),
      add(center, { x: 0, y: height }), center,
    ];
  }
  return [
    add(center, { x: width, y: 0 }), add(center, { x: width, y: -height }),
    add(center, { x: width - columnStep, y: -height }),
    add(center, { x: width - columnStep, y: height }),
    add(center, { x: width - columnStep * 2, y: height }),
    add(center, { x: width - columnStep * 2, y: -height }),
    add(center, { x: 0, y: -height }), center,
  ];
}

function buildTwinSpringWorldWaypoints(stage: StageDefinition, laneIndex: number): Point[] {
  const horizontalLoopCount = 2;
  const verticalLoopCount = 4;
  const path = required(stage.patternPath, `${stage.id}: 트윈 스프링 설정`);
  const center = centerWorld(stage);
  const halfWidth = path.outerHalfWidthWorld;
  const halfHeight = path.outerHalfHeightWorld;
  const springRadius = halfHeight * 2 / Math.max(1, stage.gridHeight - 1);
  const horizontalSamples = Math.max(horizontalLoopCount * 12, Math.trunc(path.samples / 2));
  const verticalSamples = Math.max(verticalLoopCount * 12, Math.trunc(path.samples));
  const upper: Point[] = [];

  for (let sample = 0; sample <= horizontalSamples; sample += 1) {
    const progress = sample / horizontalSamples;
    const angle = progress * Math.PI * 2 * horizontalLoopCount;
    addPatternPoint(upper, add(center, {
      x: lerp(-halfWidth, halfWidth, progress) + springRadius * Math.sin(angle),
      y: halfHeight - springRadius + springRadius * Math.cos(angle),
    }));
  }
  for (let sample = 1; sample <= verticalSamples; sample += 1) {
    const progress = sample / verticalSamples;
    const angle = progress * Math.PI * 2 * verticalLoopCount;
    addPatternPoint(upper, add(center, {
      x: halfWidth - springRadius + springRadius * Math.cos(angle),
      y: lerp(halfHeight, -halfHeight, progress) - springRadius * Math.sin(angle),
    }));
  }
  addPatternPoint(upper, center);
  return laneIndex === 0 ? upper : upper.map((point) => subtract(multiply(center, 2), point));
}

function buildTwinSerpentineWorldWaypoints(
  stage: StageDefinition,
  worldBounds: WorldRect,
  laneIndex: number,
): Point[] {
  const horizontalInset = worldBounds.width * stage.horizontalPathInsetCells / stage.gridWidth;
  const left = worldBounds.xMin + horizontalInset;
  const right = rectXMax(worldBounds) - horizontalInset;
  const columnStep = (right - left) / Math.max(1, stage.gridWidth - 1);
  const top = rectYMax(worldBounds);
  const bottom = worldBounds.yMin;
  const rowHeight = worldBounds.height / stage.gridHeight;
  const diagonalStartY = bottom + rowHeight * 2;
  const centerEntry = { x: rectCenter(worldBounds).x, y: bottom + rowHeight };
  const finish = { x: rectCenter(worldBounds).x, y: bottom };
  if (laneIndex === 0) {
    return [
      { x: left, y: top }, { x: left, y: diagonalStartY },
      { x: left + columnStep, y: diagonalStartY }, { x: left + columnStep, y: top },
      { x: left + columnStep * 2, y: top }, { x: left + columnStep * 2, y: diagonalStartY },
      centerEntry, finish,
    ];
  }
  return [
    { x: right, y: top }, { x: right, y: diagonalStartY },
    { x: right - columnStep, y: diagonalStartY }, { x: right - columnStep, y: top },
    { x: right - columnStep * 2, y: top }, { x: right - columnStep * 2, y: diagonalStartY },
    centerEntry, finish,
  ];
}

function buildParallelConvergingWorldWaypoints(
  stage: StageDefinition,
  worldBounds: WorldRect,
  laneIndex: number,
  laneCount: number,
): Point[] {
  const horizontalInset = worldBounds.width * stage.horizontalPathInsetCells / stage.gridWidth;
  const left = worldBounds.xMin + horizontalInset;
  const right = rectXMax(worldBounds) - horizontalInset;
  const laneProgress = laneCount <= 1 ? 0.5 : laneIndex / (laneCount - 1);
  const laneX = lerp(left, right, laneProgress);
  const rowHeight = worldBounds.height / stage.gridHeight;
  const diagonalStartY = worldBounds.yMin + rowHeight * 2;
  const centerX = rectCenter(worldBounds).x;
  return [
    { x: laneX, y: rectYMax(worldBounds) },
    { x: laneX, y: diagonalStartY },
    { x: centerX, y: worldBounds.yMin + rowHeight },
    { x: centerX, y: worldBounds.yMin },
  ];
}

function buildCenterSafeRoute(authored: Point[], center: Point): Point[] {
  if (authored.length < 2) throw new Error("중앙 경로 좌표가 2개 이상 필요합니다.");
  const sampled: Point[] = [];
  for (let segment = 0; segment < authored.length - 1; segment += 1) {
    const from = authored[segment];
    const to = authored[segment + 1];
    const steps = Math.max(1, unityCeilToInt(distance(from, to) / CENTER_SAFE_ROUTE_SAMPLE_STEP));
    if (segment === 0) sampled.push(from);
    for (let step = 1; step <= steps; step += 1) sampled.push(lerpPoint(from, to, step / steps));
  }

  const result: Point[] = [];
  let lastDirection = { x: 0, y: 1 };
  for (let index = 0; index < sampled.length - 1; index += 1) {
    const offset = subtract(sampled[index], center);
    if (squaredMagnitude(offset) > EPSILON) lastDirection = normalize(offset);
    const point = magnitude(offset) < CENTER_PLAYER_CLEARANCE_WORLD
      ? add(center, multiply(lastDirection, CENTER_PLAYER_CLEARANCE_WORLD))
      : sampled[index];
    appendCenterSafePoint(result, point, center);
  }
  appendCenterSafePoint(result, add(center, multiply(lastDirection, CENTER_PLAYER_CLEARANCE_WORLD)), center);
  if (squaredDistance(result[result.length - 1], center) > EPSILON) result.push(center);
  return result;
}

function appendCenterSafePoint(result: Point[], point: Point, center: Point): void {
  if (result.length === 0) {
    result.push(point);
    return;
  }
  const previous = result[result.length - 1];
  if (squaredDistance(previous, point) <= DUPLICATE_POINT_EPSILON_SQUARED) return;
  if (distanceFromCenterToSegment(center, previous, point) >= CENTER_PLAYER_CLEARANCE_WORLD - 0.001) {
    result.push(point);
    return;
  }

  const fromAngle = Math.atan2(previous.y - center.y, previous.x - center.x);
  const toAngle = Math.atan2(point.y - center.y, point.x - center.x);
  const delta = degreesToRadians(deltaAngle(radiansToDegrees(fromAngle), radiansToDegrees(toAngle)));
  const arcSteps = Math.max(2, unityCeilToInt(
    Math.fround(Math.fround(Math.abs(delta) * CENTER_PLAYER_CLEARANCE_WORLD) /
      CENTER_SAFE_ROUTE_SAMPLE_STEP),
  ));
  const fromBoundary = add(center, multiply({ x: Math.cos(fromAngle), y: Math.sin(fromAngle) },
    CENTER_PLAYER_CLEARANCE_WORLD));
  if (squaredDistance(previous, fromBoundary) > DUPLICATE_POINT_EPSILON_SQUARED) result.push(fromBoundary);
  for (let step = 1; step <= arcSteps; step += 1) {
    const angle = fromAngle + delta * step / arcSteps;
    result.push(add(center, multiply({ x: Math.cos(angle), y: Math.sin(angle) },
      CENTER_PLAYER_CLEARANCE_WORLD)));
  }
  if (squaredDistance(result[result.length - 1], point) > DUPLICATE_POINT_EPSILON_SQUARED) result.push(point);
}

function distanceFromCenterToSegment(center: Point, from: Point, to: Point): number {
  const segment = subtract(to, from);
  if (squaredMagnitude(segment) <= EPSILON) return distance(center, from);
  const t = clamp01(dot(subtract(center, from), segment) / squaredMagnitude(segment));
  return distance(center, add(from, multiply(segment, t)));
}

function prependRadialEntry(authored: Point[], visibleBounds: WorldRect, clearance: number, center: Point): Point[] {
  const first = authored[0];
  let outward = normalize(subtract(first, center));
  if (squaredMagnitude(outward) <= EPSILON) outward = { x: 0, y: 1 };
  const tx = outward.x > EPSILON
    ? (rectXMax(visibleBounds) - first.x) / outward.x
    : outward.x < -EPSILON ? (visibleBounds.xMin - first.x) / outward.x : Number.POSITIVE_INFINITY;
  const ty = outward.y > EPSILON
    ? (rectYMax(visibleBounds) - first.y) / outward.y
    : outward.y < -EPSILON ? (visibleBounds.yMin - first.y) / outward.y : Number.POSITIVE_INFINITY;
  const distanceToExit = rectContains(visibleBounds, first) ? Math.max(0, Math.min(tx, ty)) : 0;
  const edgeProjection = tx <= ty ? Math.abs(outward.x) : Math.abs(outward.y);
  const entry = add(first, multiply(outward,
    distanceToExit + Math.max(0, clearance) / Math.max(0.0001, edgeProjection)));
  return [entry, ...authored];
}

function prependOffscreenEntry(authored: Point[], visibleBounds: WorldRect, clearance: number): Point[] {
  if (authored.length < 2) throw new Error("화면 밖 진입 경로 좌표가 2개 이상 필요합니다.");
  const first = authored[0];
  const outward = normalize(subtract(first, authored[1]));
  if (squaredMagnitude(outward) <= EPSILON) throw new Error("첫 경로 구간에 진행 방향이 없습니다.");

  let distanceToExit = 0;
  let exitNormalProjection = 1;
  if (rectContains(visibleBounds, first)) {
    const tx = outward.x > EPSILON
      ? (rectXMax(visibleBounds) - first.x) / outward.x
      : outward.x < -EPSILON ? (visibleBounds.xMin - first.x) / outward.x : Number.POSITIVE_INFINITY;
    const ty = outward.y > EPSILON
      ? (rectYMax(visibleBounds) - first.y) / outward.y
      : outward.y < -EPSILON ? (visibleBounds.yMin - first.y) / outward.y : Number.POSITIVE_INFINITY;
    distanceToExit = Math.max(0, Math.min(tx, ty));
    exitNormalProjection = tx <= ty ? Math.abs(outward.x) : Math.abs(outward.y);
  }
  const entry = add(first, multiply(outward,
    distanceToExit + Math.max(0, clearance) / Math.max(0.0001, exitNormalProjection)));
  return [entry, ...authored];
}

function prependSideEntry(
  authored: Point[],
  visibleBounds: WorldRect,
  clearance: number,
  enterFromRight: boolean,
): Point[] {
  const entryX = enterFromRight
    ? rectXMax(visibleBounds) + Math.max(0, clearance)
    : visibleBounds.xMin - Math.max(0, clearance);
  return [{ x: entryX, y: authored[0].y }, ...authored];
}

function prependTopEntry(authored: Point[], visibleBounds: WorldRect, clearance: number): Point[] {
  return [{ x: authored[0].x, y: rectYMax(visibleBounds) + Math.max(0, clearance) }, ...authored];
}

function addPatternPoint(points: Point[], point: Point): void {
  if (points.length > 0 && squaredDistance(points[points.length - 1], point) <=
    DUPLICATE_POINT_EPSILON_SQUARED) return;
  points.push(point);
}

function centerWorld(stage: StageDefinition): Point {
  switch (stage.battleMode ?? BATTLE_MODE_BOTTOM_LANE) {
    case BATTLE_MODE_CENTER_RECTANGLE:
      return { ...(stage.rectangularSpiralPath?.centerWorld ?? { x: 0, y: 0 }) };
    case BATTLE_MODE_CENTER_STAR:
      return { ...(stage.starSpiralPath?.centerWorld ?? { x: 0, y: 0 }) };
    case BATTLE_MODE_CENTER_PATTERN:
      return { ...(stage.patternPath?.centerWorld ?? { x: 0, y: 0 }) };
    default:
      return { ...(stage.spiralPath?.centerWorld ?? { x: 0, y: 0 }) };
  }
}

function isCenterAimStage(stage: StageDefinition): boolean {
  const mode = stage.battleMode ?? BATTLE_MODE_BOTTOM_LANE;
  return mode >= BATTLE_MODE_CENTER_SPIRAL && mode <= BATTLE_MODE_CENTER_PATTERN;
}

function usesTwinSerpentinePath(stage: StageDefinition): boolean {
  return (stage.bottomLanePathKind ?? 0) === BOTTOM_PATH_TWIN_SERPENTINE;
}

function usesParallelConvergingPath(stage: StageDefinition): boolean {
  return (stage.bottomLanePathKind ?? 0) === BOTTOM_PATH_PARALLEL_CONVERGING;
}

function usesTwinSpringPath(stage: StageDefinition): boolean {
  return (stage.battleMode ?? 0) === BATTLE_MODE_CENTER_PATTERN && stage.dualLaneEnabled === true &&
    stage.patternPath?.kind === PATTERN_TWIN_SPRING;
}

function usesTwinColumnSweepPath(stage: StageDefinition): boolean {
  return (stage.battleMode ?? 0) === BATTLE_MODE_CENTER_PATTERN && stage.dualLaneEnabled === true &&
    stage.patternPath?.kind === PATTERN_TWIN_COLUMN_SWEEP;
}

function rectXMax(rect: WorldRect): number { return rect.xMin + rect.width; }
function rectYMax(rect: WorldRect): number { return rect.yMin + rect.height; }
function rectCenter(rect: WorldRect): Point {
  return { x: rect.xMin + rect.width * 0.5, y: rect.yMin + rect.height * 0.5 };
}
function rectContains(rect: WorldRect, point: Point): boolean {
  return point.x >= rect.xMin && point.x <= rectXMax(rect) &&
    point.y >= rect.yMin && point.y <= rectYMax(rect);
}
function add(left: Point, right: Point): Point { return { x: left.x + right.x, y: left.y + right.y }; }
function subtract(left: Point, right: Point): Point { return { x: left.x - right.x, y: left.y - right.y }; }
function multiply(point: Point, scalar: number): Point { return { x: point.x * scalar, y: point.y * scalar }; }
function dot(left: Point, right: Point): number { return left.x * right.x + left.y * right.y; }
function squaredMagnitude(point: Point): number { return point.x * point.x + point.y * point.y; }
function magnitude(point: Point): number { return Math.sqrt(squaredMagnitude(point)); }
function normalize(point: Point): Point {
  const length = magnitude(point);
  return length <= EPSILON ? { x: 0, y: 0 } : { x: point.x / length, y: point.y / length };
}
function squaredDistance(left: Point, right: Point): number { return squaredMagnitude(subtract(left, right)); }
function distance(left: Point, right: Point): number { return Math.sqrt(squaredDistance(left, right)); }
function lerp(from: number, to: number, progress: number): number { return from + (to - from) * progress; }
function lerpPoint(from: Point, to: Point, progress: number): Point {
  return { x: lerp(from.x, to.x, progress), y: lerp(from.y, to.y, progress) };
}
function clamp01(value: number): number { return Math.min(1, Math.max(0, value)); }
function inverseLerp(from: number, to: number, value: number): number {
  return approximately(from, to) ? 0 : clamp01((value - from) / (to - from));
}
function approximately(left: number, right: number): boolean {
  return Math.abs(left - right) < Math.max(0.000001 * Math.max(Math.abs(left), Math.abs(right)), Number.EPSILON * 8);
}
function degreesToRadians(value: number): number { return value * Math.PI / 180; }
function radiansToDegrees(value: number): number { return value * 180 / Math.PI; }
function repeat(value: number, length: number): number { return clamp(value - Math.floor(value / length) * length, 0, length); }
function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
function deltaAngle(current: number, target: number): number {
  let delta = repeat(target - current, 360);
  if (delta > 180) delta -= 360;
  return delta;
}
function unityCeilToInt(value: number): number { return Math.ceil(Math.fround(value)); }
function unityLerp(from: number, to: number, progress: number): number {
  return Math.fround(Math.fround(from) + Math.fround(Math.fround(to - from) * clamp01(progress)));
}
function positive(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} 값은 0보다 커야 합니다.`);
  return value;
}
function required<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) throw new Error(`${label}이 없습니다.`);
  return value;
}
