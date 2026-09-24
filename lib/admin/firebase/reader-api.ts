import { getAdminFirebaseServices } from './client';
import { koofyReaderFirebaseConfig } from './koofy-reader';
export type ReaderKind = 'book' | 'font';
export interface ReaderMetadata { title: string; author: string; description: string; license: string; category?: string; source?: string }
export interface ReaderAsset { path: string; sha256: string; size: number; extension: string; contentType: string; weight?: number }
export interface ReaderContent extends ReaderMetadata {
  id: string; kind: ReaderKind; revision: number; assets: Record<string, ReaderAsset>;
  deleting?: boolean;
  published: boolean; publishedContent: (ReaderMetadata & { assets: Record<string, ReaderAsset>; version: number; preview?: ReaderAsset }) | null; updatedAt: string;
}
const endpoint = process.env.NEXT_PUBLIC_READER_ADMIN_URL || `https://asia-northeast3-${koofyReaderFirebaseConfig.projectId}.cloudfunctions.net/readerAdmin`;
async function request<T>(query: Record<string, string>, init: RequestInit = {}): Promise<T> {
  const user = getAdminFirebaseServices().auth.currentUser;
  if (!user) throw new Error('관리자 로그인이 필요합니다.');
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' && !(process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('안전한 관리자 API 주소가 필요합니다.');
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal, cache: 'no-store', headers: { ...init.headers, Authorization: `Bearer ${await user.getIdToken()}` } });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.error || '서버에 연결하지 못했습니다. 배포 상태와 관리자 권한을 확인해 주세요.');
    if (!data) throw new Error('서버 응답을 읽지 못했습니다.');
    return data as T;
  } catch (error) {
    if (error instanceof TypeError || (error instanceof Error && error.name === 'AbortError')) throw new Error('서버 연결이 중단되었습니다. 목록을 새로고침해 저장 여부를 확인해 주세요.');
    throw error;
  } finally { clearTimeout(timer); }
}
export function listReaderContent(kind: ReaderKind, after?: string) {
  return request<{ items: ReaderContent[]; nextCursor: string | null }>({ kind, ...(after ? { after } : {}) });
}
export function mutateReaderContent(input: { action: 'create'; kind: ReaderKind; metadata: ReaderMetadata } | { action: 'save' | 'publish' | 'unpublish' | 'removeAsset'; id: string; revision: number; metadata?: ReaderMetadata; slot?: string }) {
  return request<ReaderContent>({}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
}
export function uploadReaderAsset(item: ReaderContent, slot: string, file: File) {
  if (slot === 'book') {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'epub' && extension !== 'txt') throw new Error('EPUB 또는 TXT 파일을 선택해 주세요.');
    slot = extension;
  }
  const maximum = slot === 'epub' || slot === 'txt' ? 20 : slot === 'cover' ? 5 : 10;
  if (file.size <= 0 || file.size > maximum * 1024 * 1024) throw new Error(`파일은 ${maximum}MB 이하여야 합니다.`);
  return request<ReaderContent>({ action: 'upload', id: item.id, revision: String(item.revision), slot }, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file });
}

export function deleteReaderContent(item: ReaderContent) {
  return request<{ id: string; deleted: boolean }>({}, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id: item.id, revision: item.revision }),
  });
}

export function listReaderCategories() {
  return request<{ categories: string[] }>({ action: 'categories' });
}
export function addReaderCategory(name: string) {
  return request<{ categories: string[] }>({}, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'addCategory', name }),
  });
}
