/** Categories belong to the work, independently of language and admin menu. */
export function workCategory(items: readonly { language?: string; category?: string }[]): string {
  return (items.find(item => (item.language || 'ko') === 'ko' && item.category?.trim())?.category
    || items.find(item => item.category?.trim())?.category || '소설').trim();
}
