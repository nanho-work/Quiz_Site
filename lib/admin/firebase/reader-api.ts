import { getAdminFirebaseServices } from './client';
import { koofyReaderFirebaseConfig } from './koofy-reader';
export type ReaderKind = 'book' | 'font' | 'series';
export interface ReaderMetadata { collectionType?: 'general'; translationGroupId?: string; autoCompile?: boolean; expectedEpisodes?: number; byline?: string; issueMonth?: string; releaseDate?: string; releaseAt?: string; compilationId?: string; language?: 'ko' | 'en' | 'ja'; title: string; author: string; description: string; license: string; category?: string; source?: string; seriesId?: string; seriesTitle?: string; episodeNumber?: number; seriesStatus?: 'ongoing' | 'completed' }
export interface ReaderAsset { path: string; sha256: string; size: number; extension: string; contentType: string; weight?: number }
export interface ReaderContent extends ReaderMetadata {
  id: string; kind: ReaderKind; revision: number; assets: Record<string, ReaderAsset>;
  compilationError?: string; deleting?: boolean;
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
export function listReaderContent(kind: ReaderKind, after?: string, seriesId?: string) {
  return request<{ items: ReaderContent[]; nextCursor: string | null }>({ kind, ...(seriesId ? { seriesId } : kind === 'book' ? { topLevel: '1' } : {}), ...(after ? { after } : {}) });
}
export function mutateReaderContent(input: { action: 'create'; kind: ReaderKind; seriesId?: string; metadata: ReaderMetadata } | { action: 'save' | 'publish' | 'unpublish' | 'removeAsset' | 'compileMonthly' | 'correctMonthlyLanguage'; language?: 'ko' | 'en' | 'ja'; id: string; revision: number; metadata?: ReaderMetadata; slot?: string }) {
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

export function deleteReaderContent(item: ReaderContent, draftOnly = false) {
  return request<{ id: string; deleted: boolean }>({}, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id: item.id, revision: item.revision, draftOnly }),
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

export function ensureMonthlyIssues(issueMonth: string) {
  return request<{ items: ReaderContent[] }>({}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ensureMonthlyIssues', issueMonth }) });
}
export function ensureMonthlyEpisode(seriesId: string, metadata: ReaderMetadata) {
  return request<ReaderContent>({}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ensureMonthlyEpisode', seriesId, metadata }) });
}

export function linkReaderTranslations(items: ReaderContent[]) {
  return request<{ items: ReaderContent[] }>({}, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "linkTranslations", items: items.map(({ id, revision }) => ({ id, revision })) }) });
}

export async function uploadSharedReaderCover(file: File) {
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('공통 삽화는 5MB 이하여야 합니다.');
  return request<{ hash: string }>({ action: 'uploadSharedCover' }, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file });
}
export function attachSharedReaderCover(item: ReaderContent, hash: string) {
  return request<ReaderContent>({}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'attachSharedCover', id: item.id, revision: item.revision, hash }) });
}

/** Admin-only preview of the saved cover, including unpublished drafts. */
export function getReaderCoverPreview(item:ReaderContent) {
 return request<{url:string;expiresAt:number}>({action:'coverPreview',id:item.id,revision:String(item.revision)});
}
