/** Editorial wall-clock time is always Asia/Seoul, never the browser timezone. */
export function scheduleAt(start: string, index: number, intervalDays: number): string {
  if (!/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start) || !Number.isInteger(intervalDays) || intervalDays < 1 || intervalDays > 31) return '';
  const timestamp = Date.parse(start + ':00+09:00');
  if (!Number.isFinite(timestamp)) return '';
  const roundTrip = new Date(timestamp + 9 * 3600000).toISOString().slice(0, 16);
  if (roundTrip !== start) return '';
  return new Date(timestamp + index * intervalDays * 86400000 + 9 * 3600000).toISOString().slice(0, 16) + ':00+09:00';
}
export function scheduleIssue(value: string | undefined, month: string): string | null {
  if (!value || scheduleAt(value.slice(0, 16), 0, 1) !== value) return '공개 일시를 지정해 주세요';
  if (!value.startsWith(month + '-')) return '공개 일시가 발행 월을 벗어납니다';
  return null;
}
