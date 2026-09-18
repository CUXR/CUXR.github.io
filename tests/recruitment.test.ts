import assert from 'node:assert/strict';
import test from 'node:test';
import { recruitment, recruitmentSchema, isRecruiting, upcomingEvents } from '../src/lib/recruitment';

test('recruitment switches at the exact Eastern-time boundaries', () => {
  const start = Date.parse(recruitment.opensAt);
  const end = Date.parse(recruitment.closesAt);
  assert.equal(isRecruiting(recruitment, start - 1), false);
  assert.equal(isRecruiting(recruitment, start), true);
  assert.equal(isRecruiting(recruitment, end - 1), true);
  assert.equal(isRecruiting(recruitment, end), false);
  assert.equal(new Date(end).toISOString(), '2026-10-16T03:59:00.000Z');
});
test('the emergency switch overrides dates', () => {
  assert.equal(isRecruiting({ ...recruitment, enabled: false }, Date.parse(recruitment.opensAt)), false);
});
test('past sessions disappear at their ending instant', () => {
  assert.deepEqual(upcomingEvents(recruitment, Date.parse('2026-09-21T19:00:00-04:00')).map((event) => event.id), ['october-session']);
  assert.equal(upcomingEvents(recruitment, Date.parse('2026-10-02T19:30:00-04:00')).length, 0);
});
test('invalid schedules and unsafe links fail validation', () => {
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, closesAt: recruitment.opensAt }).success, false);
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, applicationUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, coffeeChatUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, timeZone: 'invalid' }).success, false);
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, events: [{ ...recruitment.events[0], endsAt: recruitment.events[0].startsAt }] }).success, false);
});
test('application and coffee chat links are independently optional', () => {
  for (const applicationUrl of [recruitment.applicationUrl, null, undefined]) {
    for (const coffeeChatUrl of [recruitment.coffeeChatUrl, null, undefined]) {
      assert.equal(recruitmentSchema.safeParse({ ...recruitment, applicationUrl, coffeeChatUrl }).success, true);
    }
  }
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, applicationUrl: '' }).success, false);
  assert.equal(recruitmentSchema.safeParse({ ...recruitment, coffeeChatUrl: '' }).success, false);
});
