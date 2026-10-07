export interface NamedFile { name: string; size: number; lastModified: number }
export interface EpisodeRow<F extends NamedFile = File> {
  key: string; number: string; title: string; description: string;
  books: F[]; covers: F[];
}
const normalize = (value: string) => value.normalize('NFC').replace(/[\s_]+/g, ' ').trim();
export function parseEpisodeName(name: string, seriesTitle: string) {
  const stem = normalize(name.replace(/\.[^.]+$/, ''));
  const prefix = normalize(seriesTitle);
  const rest = prefix && stem.startsWith(prefix + ' ') ? stem.slice(prefix.length).trim() : stem;
  const match = rest.match(/^(?:제\s*)?(\d{1,6})(?:\s*화)?(?:[\s.\-]+|$)(.*)$/);
  return { key: stem.toLocaleLowerCase(), number: match ? String(Number(match[1])) : '', title: match ? match[2].trim() : rest };
}
export function mergeEpisodeFiles<F extends NamedFile>(rows: EpisodeRow<F>[], files: F[], seriesTitle: string) {
  const result = rows.map(row => ({ ...row, books: [...row.books], covers: [...row.covers] }));
  const rejected: string[] = [];
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const slot = ['txt', 'epub'].includes(extension || '') ? 'books' : ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '') ? 'covers' : null;
    if (!slot || file.size <= 0 || file.size > (slot === 'books' ? 20 : 5) * 1024 * 1024) { rejected.push(file.name); continue; }
    const parsed = parseEpisodeName(file.name, seriesTitle);
    let row = result.find(item => item.key === parsed.key);
    if (!row) { row = { ...parsed, description: '', books: [], covers: [] }; result.push(row); }
    if (!row[slot].some(old => old.name === file.name && old.size === file.size && old.lastModified === file.lastModified)) row[slot].push(file);
  }
  return { rows: result.sort((a, b) => (Number(a.number) || Infinity) - (Number(b.number) || Infinity) || a.key.localeCompare(b.key, 'ko')), rejected };
}
export function episodeIssues(row: EpisodeRow<NamedFile>, rows: EpisodeRow<NamedFile>[], existingNumbers: Set<number>) {
  const problems: string[] = [];
  const number = Number(row.number);
  if (!/^\d+$/.test(row.number) || !Number.isSafeInteger(number) || number < 1 || number > 100000) problems.push('회차 번호 확인');
  else {
    if (rows.filter(other => Number(other.number) === number).length > 1) problems.push('목록 안 회차 번호 중복');
    if (existingNumbers.has(number)) problems.push('이미 등록된 회차');
  }
  if (!row.title.trim() || row.title.length > 160) problems.push('제목 확인');
  if (row.description.length > 2000) problems.push('설명은 2,000자 이하');
  if (row.books.length !== 1) problems.push(row.books.length ? '본문이 여러 개입니다' : '본문 없음');
  if (row.covers.length > 1) problems.push('표지가 여러 개입니다');
  return problems;
}
