export function matchBookFilePair<T extends { name: string; size: number }>(files: T[]): { book: T; cover: T; title: string } {
  if (files.length !== 2) throw new Error('한 작품의 본문 파일과 이미지 파일, 총 2개를 선택해 주세요.');
  const ext = (f: T) => f.name.split('.').pop()?.toLowerCase();
  const stem = (f: T) => f.name.replace(/\.[^.]+$/, '').normalize('NFC').trim();
  const books = files.filter(f => ['txt', 'epub'].includes(ext(f) || ''));
  const images = files.filter(f => ['png', 'jpg', 'jpeg', 'webp'].includes(ext(f) || ''));
  if (books.length !== 1 || images.length !== 1) throw new Error('TXT 또는 EPUB 1개와 이미지 1개가 필요합니다.');
  const book = books[0], cover = images[0];
  if (!stem(book) || stem(book).toLowerCase() !== stem(cover).toLowerCase()) throw new Error('파일명이 같은 본문과 이미지를 선택해 주세요. 예: 겨울옷.txt + 겨울옷.png');
  if (book.size <= 0 || book.size > 20 * 1024 * 1024 || cover.size <= 0 || cover.size > 5 * 1024 * 1024) throw new Error('빈 파일은 등록할 수 없습니다. 본문 최대 20MB, 이미지 최대 5MB입니다.');
  return { book, cover, title: stem(book) };
}
