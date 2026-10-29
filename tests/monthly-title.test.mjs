import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyTitle, monthlyIssueFields } from '../lib/admin/firebase/monthly-defaults.ts';
test('localized issue titles include year and month, including next January', () => {
  assert.equal(monthlyTitle('2026-11'), '월간 쿠피 2026년 11월호');
  assert.equal(monthlyTitle('2026-11', 'ja'), '月刊クーフィー 2026年11月号');
  assert.equal(monthlyTitle('2027-01', 'en'), 'Koofy Monthly — January 2027');
  assert.equal(monthlyTitle('2026-13'), '');
});
test('automatic titles follow changes but authored titles are preserved', () => {
  const form = {title: monthlyTitle('2026-10'), issueMonth: '2026-10', language: 'ko', license: '', author: '', description: ''};
  assert.equal(monthlyIssueFields(form, '2026-11', 'en').title, 'Koofy Monthly — November 2026');
  assert.equal(monthlyIssueFields({...form, title: '특별한 11월호'}, '2026-11', 'ja').title, '특별한 11월호');
  assert.equal(monthlyIssueFields({...form, title: ''}, '2026-11').title, monthlyTitle('2026-11'));
});
