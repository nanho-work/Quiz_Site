import assert from "node:assert/strict";
import test from "node:test";
import { applyStageElevenToTwentyMonsterSequence } from "../lib/admin/stage-content/editor.ts";
import { buildUnityStagePathModel } from "../lib/admin/stage-content/unity-path-engine.ts";

const canonicalAspect = 9 / 20;
const tolerance = 0.0002;

const base = {
  contentVersion: "test",
  displayName: "test",
  monsterVisualId: "test",
  gridWidth: 6,
  gridHeight: 10,
  horizontalPathInsetCells: 0.55,
  headerOverlayEntryWaypointCount: 0,
  headerOverlayEntryOffsetWorld: 0,
  battleMode: 0,
  bottomLanePathKind: 0,
  waypoints: [],
};

const stages = [
  {
    ...base,
    id: "stage_01",
    headerOverlayEntryWaypointCount: 1,
    headerOverlayEntryOffsetWorld: 1.5,
    waypoints: [
      [0, 10], [0, 10], [0, 9], [0, 1], [1, 1], [1, 10], [2, 10], [2, 1],
      [3, 1], [3, 10], [4, 10], [4, 1], [5, 1], [5, 10], [6, 10], [6, 1],
      [5, 1], [5, 0.5], [3, 0.5], [3, 0],
    ].map(([x, y]) => ({ x, y })),
  },
  {
    ...base,
    id: "stage_02",
    headerOverlayEntryWaypointCount: 2,
    headerOverlayEntryOffsetWorld: 1.5,
    waypoints: [
      [0, 10], [6, 10], [6, 10], [0, 10], [0, 9], [6, 9], [6, 8], [0, 8],
      [0, 7], [6, 7], [6, 6], [0, 6], [0, 5], [6, 5], [6, 4], [0, 4],
      [0, 3], [6, 3], [6, 2], [0, 2], [0, 1], [6, 1], [6, 0.5], [3, 0.5], [3, 0],
    ].map(([x, y]) => ({ x, y })),
  },
  {
    ...base,
    id: "stage_03",
    battleMode: 1,
    spiralPath: {
      centerWorld: { x: 0, y: 0 }, outerRadiusWorld: 8.4, innerRadiusWorld: 0,
      turns: 8, samplesPerTurn: 48, startAngleDegrees: 120, clockwise: true,
    },
  },
  {
    ...base,
    id: "stage_04",
    battleMode: 2,
    rectangularSpiralPath: {
      centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 3.9,
      outerHalfHeightWorld: 8.8, loops: 5, clockwise: true,
    },
  },
  {
    ...base,
    id: "stage_05",
    battleMode: 3,
    starSpiralPath: {
      centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 4.45,
      outerHalfHeightWorld: 8.1, innerScale: 0.55, startAngleDegrees: 162, clockwise: true,
    },
  },
  {
    ...base,
    id: "stage_06",
    battleMode: 4,
    dualLaneEnabled: true,
    patternPath: {
      kind: 0, centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 4.45,
      outerHalfHeightWorld: 8.1, innerScale: 0.55, samples: 72, clockwise: true,
    },
  },
  {
    ...base,
    id: "stage_07",
    bottomLanePathKind: 1,
    dualLaneEnabled: true,
  },
  {
    ...base,
    id: "stage_08",
    battleMode: 4,
    dualLaneEnabled: true,
    patternPath: {
      kind: 5, centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 3.8,
      outerHalfHeightWorld: 8.1, innerScale: 0.55, samples: 48, clockwise: true,
    },
  },
  {
    ...base,
    id: "stage_09",
    bottomLanePathKind: 2,
    parallelLaneCount: 5,
  },
  {
    ...base,
    id: "stage_10",
    battleMode: 4,
    dualLaneEnabled: true,
    patternPath: {
      kind: 6, centerWorld: { x: 0, y: 0 }, outerHalfWidthWorld: 3.8,
      outerHalfHeightWorld: 8.1, innerScale: 0.55, samples: 96, clockwise: true,
    },
  },
];

const expected = {
  stage_01: { counts: [19], starts: [[-3.675, 11.5]], end: [0, -7], centerAim: false },
  stage_02: { counts: [23], starts: [[-6, 9.5]], end: [0, -7], centerAim: false },
  stage_03: { counts: [1431], starts: [[-6, 10.3923]], end: [0, 0], centerAim: true },
  stage_04: { counts: [831], starts: [[-5.09659, 11.5]], end: [0, 0], centerAim: true },
  stage_05: { counts: [627], starts: [[-6, 3.54856]], end: [0, 0], centerAim: true },
  stage_06: { counts: [355, 355], starts: [[-4.45, 11.5], [4.45, 11.5]], end: [0, 0], centerAim: true },
  stage_07: { counts: [9, 9], starts: [[-3.675, 11.5], [3.675, 11.5]], end: [0, -7], centerAim: false },
  stage_08: { counts: [481, 481], starts: [[-6, 8.1], [6, -8.1]], end: [0, 0], centerAim: true },
  stage_09: {
    counts: [5, 5, 5, 5, 5],
    starts: [[-3.675, 11.5], [-1.8375, 11.5], [0, 11.5], [1.8375, 11.5], [3.675, 11.5]],
    end: [0, -7], centerAim: false,
  },
  stage_10: { counts: [297, 297], starts: [[-6, 0], [6, 0]], end: [0, 0], centerAim: true },
};

test("stages 1-10 match Unity runtime lane counts and boundary coordinates", () => {
  for (const stage of stages) {
    const model = buildUnityStagePathModel(stage, canonicalAspect);
    const golden = expected[stage.id];
    assert.deepEqual(model.lines.map((line) => line.points.length), golden.counts, `${stage.id} point counts`);
    model.lines.forEach((line, laneIndex) => {
      assertPoint(line.points[0], golden.starts[laneIndex], `${stage.id} lane ${laneIndex + 1} start`);
      assertPoint(line.points.at(-1), golden.end, `${stage.id} lane ${laneIndex + 1} end`);
    });
    assert.equal(model.isCenterAimStage, golden.centerAim, `${stage.id} center mode`);
  }
});

test("center-aim routes keep every non-final segment outside the player clearance", () => {
  for (const stage of stages.filter((candidate) => expected[candidate.id].centerAim)) {
    const model = buildUnityStagePathModel(stage, canonicalAspect);
    for (const line of model.lines) {
      for (let index = 1; index < line.points.length - 2; index += 1) {
        const distance = distanceToSegment({ x: 0, y: 0 }, line.points[index], line.points[index + 1]);
        // Unity approximates the protected-circle arc with chords no longer than
        // 0.18 world units, so the chord midpoint can sit about 0.0024 inside 1.55.
        assert.ok(distance >= 1.547, `${stage.id} ${line.id} segment ${index} enters clearance: ${distance}`);
      }
    }
  }
});

test("side entries follow the selected device aspect while authored routes remain unchanged", () => {
  const stage = stages.find((candidate) => candidate.id === "stage_08");
  const narrow = buildUnityStagePathModel(stage, 1440 / 2960);
  const wide = buildUnityStagePathModel(stage, 9 / 16);
  assertNear(narrow.lines[0].points[0].x, -(10 * 1440 / 2960 + 1.5), "narrow left entry");
  assertNear(wide.lines[0].points[0].x, -(10 * 9 / 16 + 1.5), "wide left entry");
  assertPoint(narrow.lines[0].points[1], [wide.lines[0].points[1].x, wide.lines[0].points[1].y], "authored route");
});

test("packaged stage draft assigns the remote monster rotation to stages 11-20", () => {
  const source = {
    schemaVersion: 1,
    contentVersion: "stage_balance_v4",
    minimumAndroidBuild: 1,
    tutorialStage: { id: "tutorial", contentVersion: "tutorial_v1" },
    stages: Array.from({ length: 20 }, (_, index) => ({
      id: `stage_${String(index + 1).padStart(2, "0")}`,
      contentVersion: `stage_${String(index + 1).padStart(2, "0")}_v1`,
      monsterVisualId: index < 10 ? "legacy" : "repeated",
      secondaryMonsterVisualId: index >= 10 ? "old_secondary" : undefined,
    })),
    stageProgression: {
      contentVersion: "stage_balance_v4",
      freeRefreshPerChoice: 1,
      optionAdRefreshLimit: 3,
      acquireAllAdLimit: 1,
      difficulties: [],
      stages: Array.from({ length: 20 }, (_, index) => ({
        stageId: `stage_${String(index + 1).padStart(2, "0")}`,
        stageNumber: index + 1,
        multiplier: 1,
        previewMonsterVisualId: index < 10 ? "legacy" : "repeated",
      })),
    },
  };

  const draft = applyStageElevenToTwentyMonsterSequence(source, 19);
  const expected = {
    stage_11: ["rice_ball_egg", undefined],
    stage_12: ["rice_ball_flying_fish_roe", undefined],
    stage_13: ["rice_ball_kimchi_fried_rice", undefined],
    stage_14: ["rice_ball_pollock_roe_mayo", undefined],
    stage_15: ["rice_ball_salmon", undefined],
    stage_16: ["rice_ball_shrimp_mayo", "gunkan_avocado"],
    stage_17: ["gunkan_corn", "gunkan_crab"],
    stage_18: ["gunkan_egg", "gunkan_pollock_roe"],
    stage_19: ["gunkan_shrimp", undefined],
    stage_20: ["gunkan_tuna", "pudding_blueberry"],
  };

  for (const [stageId, [primary, secondary]] of Object.entries(expected)) {
    const stage = draft.stages.find((candidate) => candidate.id === stageId);
    const progression = draft.stageProgression.stages.find((candidate) => candidate.stageId === stageId);
    assert.equal(stage.monsterVisualId, primary, `${stageId} primary`);
    assert.equal(stage.secondaryMonsterVisualId, secondary, `${stageId} secondary`);
    assert.equal(progression.previewMonsterVisualId, primary, `${stageId} preview`);
    assert.match(stage.contentVersion, /_units_11_20_v1$/);
  }
  assert.equal(draft.minimumAndroidBuild, 19);
  assert.equal(draft.stageProgression.contentVersion, draft.contentVersion);
  assert.equal(draft.stages[0].monsterVisualId, "legacy", "stages 1-10 must stay unchanged");
  assert.equal(source.stages[10].monsterVisualId, "repeated", "source bundle must not be mutated");
});

function assertPoint(actual, [expectedX, expectedY], label) {
  assert.ok(actual, `${label}: point missing`);
  assertNear(actual.x, expectedX, `${label} x`);
  assertNear(actual.y, expectedY, `${label} y`);
}

function assertNear(actual, expectedValue, label) {
  assert.ok(Math.abs(actual - expectedValue) <= tolerance,
    `${label}: expected ${expectedValue}, received ${actual}`);
}

function distanceToSegment(center, from, to) {
  const segmentX = to.x - from.x;
  const segmentY = to.y - from.y;
  const lengthSquared = segmentX ** 2 + segmentY ** 2;
  if (lengthSquared <= 0.000001) return Math.hypot(center.x - from.x, center.y - from.y);
  const raw = ((center.x - from.x) * segmentX + (center.y - from.y) * segmentY) / lengthSquared;
  const progress = Math.max(0, Math.min(1, raw));
  return Math.hypot(center.x - (from.x + segmentX * progress), center.y - (from.y + segmentY * progress));
}
