import { scheduleAt } from './monthly-schedule';
/** Undefined means languages disagree. Empty string explicitly means immediate. */
export function commonRelease(items: {releaseAt?: string; releaseDate?: string}[]): string | undefined {
  const values = new Set(items.map(x => x.releaseAt || (x.releaseDate ? x.releaseDate + 'T09:00:00+09:00' : '')));
  return values.size > 1 ? undefined : [...values][0] || '';
}
export function releaseFields(value: string) {
  if (value && scheduleAt(value.slice(0,16), 0, 1) !== value) throw new Error('올바른 공개 일시를 입력해 주세요.');
  // Explicit empty values clear an old schedule on the server.
  return { releaseAt: value, releaseDate: value.slice(0,10) };
}
export function assignSchedule(numbers: number[], start: string, interval: number): Record<number,string> {
  if (!scheduleAt(start,0,interval)) throw new Error('시작 일시와 발행 간격을 확인해 주세요.');
  return Object.fromEntries([...new Set(numbers)].sort((a,b)=>a-b).map((n,i)=>[n,scheduleAt(start,i,interval)]));
}

export function needsPublication(item?: {published:boolean;revision:number;publishedContent:{version:number}|null}): boolean {
  return !item?.published || item.revision !== item.publishedContent?.version;
}
