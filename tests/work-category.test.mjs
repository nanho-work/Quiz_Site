import test from 'node:test';
import assert from 'node:assert/strict';
import { workCategory } from '../lib/admin/reader/work-category.ts';
test('missing translations inherit the existing work category', () => {
  assert.equal(workCategory([{language:'ko',category:'시'}]), '시');
  assert.equal(workCategory([{language:'en',category:'소설'},{language:'ko',category:'시'}]), '시');
  assert.equal(workCategory([{language:'ja',category:'에세이'}]), '에세이');
  assert.equal(workCategory([]), '소설');
});
