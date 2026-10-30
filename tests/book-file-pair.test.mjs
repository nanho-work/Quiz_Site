import test from 'node:test';
import assert from 'node:assert/strict';
import { matchBookFilePair } from '../lib/admin/firebase/book-file-pair.ts';
const file = (name, size = 100) => ({ name, size });
test('pairs image and body regardless of selection order and Unicode normalization', () => {
  const book = file('겨울옷.txt'), cover = file('겨울옷.PNG'.normalize('NFD'));
  assert.deepEqual(matchBookFilePair([cover, book]), { book, cover, title: '겨울옷' });
  assert.equal(matchBookFilePair([file('Story.epub'), file('story.webp')]).title, 'Story');
});
test('rejects ambiguity, mismatched names, wrong types, empty and oversized files', () => {
  for (const files of [[file('a.txt')], [file('a.txt'), file('b.png')], [file('a.txt'), file('a.epub')], [file('a.txt'), file('a.png'), file('a.jpg')], [file('a.txt', 0), file('a.png')], [file('a.txt'), file('a.png', 5 * 1024 * 1024 + 1)]]) assert.throws(() => matchBookFilePair(files));
});
