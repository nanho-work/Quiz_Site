import { httpsCallable } from "firebase/functions";
import { getAdminFirebaseServices } from "./client";
import type {
  AdminAccount,
  AdminAuditLog,
  AdminMailboxItem,
  MailboxDraft,
} from "../types";
import type {
  StageContentChannelSummary,
  StageContentReleaseSummary,
  StageContentResponse,
} from "../stage-content/types";

async function callAdminFunction<TRequest, TResponse>(
  name: string,
  data: TRequest,
): Promise<TResponse> {
  const { functions } = getAdminFirebaseServices();
  const callable = httpsCallable<TRequest, TResponse>(functions, name);
  const response = await callable(data);
  return response.data;
}

export function getAdminAccount(query: string): Promise<AdminAccount> {
  return callAdminFunction<{ query: string }, AdminAccount>("adminGetAccount", { query });
}

export function listMailboxCampaigns(): Promise<{ items: AdminMailboxItem[] }> {
  return callAdminFunction<Record<string, never>, { items: AdminMailboxItem[] }>(
    "adminListMailboxCampaigns",
    {},
  );
}

export function listDirectMailbox(targetUid: string): Promise<{ targetUid: string; items: AdminMailboxItem[] }> {
  return callAdminFunction<{ targetUid: string }, { targetUid: string; items: AdminMailboxItem[] }>(
    "adminListDirectMailbox",
    { targetUid },
  );
}

export function upsertMailboxCampaign(draft: MailboxDraft): Promise<{ campaignId: string }> {
  return callAdminFunction("adminUpsertMailboxCampaign", {
    campaignId: draft.id,
    ...mailboxPayload(draft),
  });
}

export function sendDirectMailboxItem(
  targetUid: string,
  draft: MailboxDraft,
): Promise<{ targetUid: string; mailId: string }> {
  return callAdminFunction("adminSendMailboxItem", {
    targetUid,
    mailId: draft.id,
    ...mailboxPayload(draft),
  });
}

export function listAdminAuditLogs(): Promise<{ items: AdminAuditLog[] }> {
  return callAdminFunction<Record<string, never>, { items: AdminAuditLog[] }>(
    "adminListAuditLogs",
    {},
  );
}

export function initializeStageContent(): Promise<StageContentResponse> {
  return callAdminFunction<Record<string, never>, StageContentResponse>(
    "adminInitializeStageContent",
    {},
  );
}

export function validateStageContent(bundleJson: string): Promise<StageContentResponse> {
  return callAdminFunction<{ bundleJson: string }, StageContentResponse>(
    "adminValidateStageContent",
    { bundleJson },
  );
}

export function publishStageContentToTest(
  bundleJson: string,
  note: string,
): Promise<StageContentReleaseSummary> {
  return callAdminFunction("adminPublishStageContent", {
    bundleJson,
    channel: "test",
    note,
  });
}

export function promoteStageContentToProduction(releaseId: string): Promise<StageContentResponse> {
  return callAdminFunction("adminPromoteStageContent", {
    releaseId,
    channel: "production",
  });
}

export function getStageContentRelease(releaseId: string): Promise<StageContentResponse> {
  return callAdminFunction("adminGetStageContent", { releaseId });
}

export function listStageContentReleases(): Promise<{ items: StageContentReleaseSummary[] }> {
  return callAdminFunction("adminListStageContentReleases", {});
}

export function listStageContentChannels(): Promise<{ items: StageContentChannelSummary[] }> {
  return callAdminFunction("adminListStageContentChannels", {});
}

function mailboxPayload(draft: MailboxDraft) {
  return {
    kind: draft.kind,
    title: draft.title,
    body: draft.body,
    active: draft.active,
    startAtMillis: draft.startAtMillis,
    expiresAtMillis: draft.expiresAtMillis,
    sortPriority: draft.sortPriority,
    rewards: draft.rewards,
  };
}

export function adminErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const value = error as { code?: unknown; message?: unknown };
    if (value.code === "functions/permission-denied") return "이 작업을 수행할 관리자 권한이 없습니다.";
    if (value.code === "functions/not-found") return "조건에 맞는 계정을 찾지 못했습니다.";
    if (value.code === "functions/already-exists") return "같은 식별자의 데이터가 이미 존재합니다.";
    if (value.code === "functions/failed-precondition") return "현재 계정 또는 서버 상태에서는 처리할 수 없습니다.";
    if (typeof value.message === "string" && value.message.trim()) return value.message;
  }
  return "요청 처리 중 알 수 없는 오류가 발생했습니다.";
}
