import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleAt, scheduleIssue } from '../lib/admin/reader/monthly-schedule.ts';
test('ten stories are spaced daily in Korea regardless of browser timezone', () => {
  assert.equal(scheduleAt('2026-11-05T09:00', 9, 1), '2026-11-14T09:00:00+09:00');
  assert.equal(scheduleAt('2026-11-05T09:00', 2, 3), '2026-11-11T09:00:00+09:00');
});
test('overflow remains visible but is rejected before upload', () => {
  const end = scheduleAt('2026-11-30T23:00', 1, 1);
  assert.equal(end, '2026-12-01T23:00:00+09:00');
  assert.ok(scheduleIssue(end, '2026-11'));
  assert.equal(scheduleIssue('2028-02-29T09:00:00+09:00', '2028-02'), null);
});
test('bad dates, missing schedule and invalid intervals cannot be submitted', () => {
  for (const start of ['', '2026-02-30T09:00', '2026-11-01T24:00']) assert.equal(scheduleAt(start, 0, 1), '');
  for (const interval of [0, -1, 1.5, 32]) assert.equal(scheduleAt('2026-11-01T09:00', 0, interval), '');
  assert.ok(scheduleIssue(undefined, '2026-11'));
});
