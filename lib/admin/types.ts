export interface AdminRoles {
  superAdmin: boolean;
  supportAdmin: boolean;
  mailAdmin: boolean;
  financeAdmin: boolean;
}

export interface AuthoritySummary {
  revision: number;
  balances: {
    gold: number;
    gems: number;
    specialKeys: number;
    adSkipTickets: number;
  };
  energy: { current: number };
  character: {
    selectedCharacterId: string;
    level: number;
    attackLevel: number;
    criticalChanceLevel: number;
    cooldownReductionLevel: number;
  };
  stages: Record<string, { cleared: boolean }>;
  activeBattle: { runId: string; stageId: string; status: string } | null;
  updatedAtMillis: number;
}

export interface AdminAccount {
  uid: string;
  customerId: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  disabled: boolean;
  providerIds: string[];
  createdAtMillis: number | null;
  lastSignInAtMillis: number | null;
  deletionRequested: boolean;
  authority: AuthoritySummary | null;
}

export type MailboxKind = "notice" | "mail";

export interface MailboxReward {
  gold: number;
  gems: number;
  specialKeys: number;
  adSkipTickets: number;
}

export interface AdminMailboxItem {
  id: string;
  kind: MailboxKind;
  title: string;
  body: string;
  active: boolean;
  startAtMillis: number;
  expiresAtMillis: number;
  createdAtMillis: number;
  updatedAtMillis: number;
  sortPriority: number;
  publishedByUid: string;
  rewards: MailboxReward;
}

export interface MailboxDraft {
  id: string;
  kind: MailboxKind;
  title: string;
  body: string;
  active: boolean;
  startAtMillis: number;
  expiresAtMillis: number;
  sortPriority: number;
  rewards: MailboxReward;
}

export interface AdminAuditLog {
  id: string;
  adminUid: string;
  action: string;
  targetUid: string | null;
  resourceType: string;
  resourceId: string;
  summary: Record<string, string | number | boolean | null>;
  createdAtMillis: number;
}
