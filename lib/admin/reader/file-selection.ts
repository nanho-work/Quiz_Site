/** Browser-independent selection rules. Server validation remains authoritative. */
export interface UploadFile { name: string; size: number; lastModified: number }
export const READER_FILE_ACCEPT = {
  body: '.txt,.epub', image: '.png,.jpg,.jpeg,.webp',
  content: '.txt,.epub,.png,.jpg,.jpeg,.webp', font: '.ttf,.otf',
};
export function validateFileSelection(files: Pick<UploadFile, 'name' | 'size'>[], accept: string, multiple = false, maxFiles = 1000): string | null {
  if (!files.length) return null;
  if (!multiple && files.length !== 1) return '이 영역에는 파일 한 개만 넣어 주세요.';
  if (files.length > maxFiles) return `한 번에 최대 ${maxFiles}개 파일을 선택해 주세요.`;
  const extensions = accept.toLowerCase().split(',').map(x => x.trim().replace(/^\./, ''));
  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const limit = ['txt','epub'].includes(ext) ? 20 : ['ttf','otf'].includes(ext) ? 10 : 5;
    if (!extensions.includes(ext)) return `${file.name}: 지원하지 않는 파일 형식입니다.`;
    if (file.size <= 0 || file.size > limit * 1024 * 1024) return `${file.name}: 비어 있지 않은 ${limit}MB 이하 파일을 선택해 주세요.`;
  }
  return null;
}
/** Re-selecting a file replaces that filename, while other selected files remain. */
export function mergeSelectedFiles<T extends UploadFile>(current: T[], incoming: T[]): T[] {
  const result = new Map(current.map(f => [f.name.normalize('NFC'), f]));
  incoming.forEach(f => result.set(f.name.normalize('NFC'), f));
  return [...result.values()];
}
