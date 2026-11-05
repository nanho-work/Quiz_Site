/** Read every episode page; fail on repeated cursors instead of hanging. */
export async function collectEpisodePages<T>(fetchPage: (after?: string) => Promise<{items: T[]; nextCursor?: string | null}>): Promise<T[]> {
  const items: T[] = [];
  const seen = new Set<string>();
  let after: string | undefined;
  do {
    const page = await fetchPage(after);
    items.push(...page.items);
    after = page.nextCursor || undefined;
    if (after && seen.has(after)) throw new Error('회차 목록을 끝까지 읽지 못했습니다. 다시 확인해 주세요.');
    if (after) seen.add(after);
  } while (after);
  return items;
}
