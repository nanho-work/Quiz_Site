export function formatAdminDate(value: number | null | undefined): string {
  if (!value || !Number.isFinite(value)) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("ko-KR").format(value ?? 0);
}

export function toDateTimeLocal(value: number): string {
  const date = new Date(value - new Date(value).getTimezoneOffset() * 60_000);
  return date.toISOString().slice(0, 16);
}

export function adminIdentifier(prefix: string): string {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${stamp}_${random}`;
}

export function firebaseUidFromCustomerId(value: string): string {
  const trimmed = value.trim();
  return /^SSF-/i.test(trimmed) ? trimmed.slice(4) : trimmed;
}
