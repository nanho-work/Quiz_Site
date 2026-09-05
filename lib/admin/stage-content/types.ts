export type StageContentChannel = "test" | "production";

export interface RewardAmounts {
  gold?: number;
  gems?: number;
  energy?: number;
  green?: number;
  blue?: number;
  red?: number;
}

export interface ChoiceSchedule {
  firstUnit: number;
  intervalUnits: number;
  maxCount: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface StageDefinition {
  id: string;
  contentVersion: string;
  displayName: string;
  monsterVisualId: string;
  secondaryMonsterVisualId?: string;
  dualLaneEnabled?: boolean;
  dualLaneUnitRatio?: number;
  dualLaneHealthRatio?: number;
  parallelLaneCount?: number;
  parallelLaneUnitRatio?: number;
  parallelLaneHealthRatio?: number;
  battleMode?: number;
  bottomLanePathKind?: number;
  spiralPath?: {
    centerWorld: Point;
    outerRadiusWorld: number;
    innerRadiusWorld: number;
    turns: number;
    samplesPerTurn: number;
    startAngleDegrees: number;
    clockwise: boolean;
  };
  rectangularSpiralPath?: {
    centerWorld: Point;
    outerHalfWidthWorld: number;
    outerHalfHeightWorld: number;
    loops: number;
    clockwise: boolean;
  };
  starSpiralPath?: {
    centerWorld: Point;
    outerHalfWidthWorld: number;
    outerHalfHeightWorld: number;
    innerScale: number;
    startAngleDegrees: number;
    clockwise: boolean;
  };
  patternPath?: {
    kind: number;
    centerWorld: Point;
    outerHalfWidthWorld: number;
    outerHalfHeightWorld: number;
    innerScale: number;
    samples: number;
    clockwise: boolean;
  };
  gridWidth: number;
  gridHeight: number;
  horizontalPathInsetCells: number;
  headerOverlayEntryWaypointCount: number;
  headerOverlayEntryOffsetWorld: number;
  berserkNormalSeconds: number;
  berserkDurationSeconds: number;
  berserkMovementMultiplier: number;
  segmentSpacingMultiplier: number;
  movementSpeedMultiplier?: number;
  energyCost: number;
  segmentGenerationSeconds: number;
  segmentSpawnSeconds: number;
  startingHealth: number;
  endingHealth: number;
  collapseSeconds: number;
  skillChoiceSchedule: ChoiceSchedule;
  optionChoiceSchedule: ChoiceSchedule;
  waypoints: Point[];
}

export interface StageProgressionEntry {
  stageId: string;
  stageNumber: number;
  multiplier: number;
  combatHealthMultiplier?: number;
  baseHealthStep?: number;
  previewMonsterVisualId: string;
}

export interface DifficultyProgression {
  difficulty: 0 | 1 | 2;
  displayName: string;
  healthMultiplier: number;
  clearReward: RewardAmounts;
  progressRewards: Array<{ percent: 25 | 50 | 100; reward: RewardAmounts }>;
}

export interface StageContentBundle {
  schemaVersion: number;
  contentVersion: string;
  minimumAndroidBuild: number;
  stageProgression: {
    contentVersion: string;
    freeRefreshPerChoice: number;
    optionAdRefreshLimit: number;
    acquireAllAdLimit: number;
    stages: StageProgressionEntry[];
    difficulties: DifficultyProgression[];
  };
  stages: StageDefinition[];
  tutorialStage: StageDefinition;
}

export interface StageContentResponse {
  schemaVersion: number;
  releaseId: string;
  bundleSha256: string;
  bundleJson: string;
  contentVersion: string;
  minimumAndroidBuild: number;
  source: "packaged" | "published";
  createdAtMillis: number;
}

export interface StageContentReleaseSummary {
  releaseId: string;
  bundleSha256: string;
  contentVersion: string;
  minimumAndroidBuild: number;
  stageCount: number;
  note: string;
  createdByUid: string;
  createdAtMillis: number;
}

export interface StageContentChannelSummary {
  channel: StageContentChannel;
  releaseId: string | null;
  bundleSha256: string | null;
  updatedByUid: string;
  updatedAtMillis: number | null;
  previousReleaseId: string | null;
  previousUntilMillis: number | null;
}

export interface StageContentTesterSummary {
  uid: string;
  customerId: string;
  note: string;
  createdByUid: string;
  createdAtMillis: number;
  updatedByUid: string;
  updatedAtMillis: number;
}

export type StageEditorSection = "stage" | "progression" | "releases" | "json";
