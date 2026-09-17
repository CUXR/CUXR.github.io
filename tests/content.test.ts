import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { projects, members } from '../src/lib/content';

test('published content resolves every local image', () => {
  for (const item of [...projects, ...members]) {
    if (item.image === null) continue;
    assert.ok(existsSync(`public${item.image}`), `${item.id}: missing ${item.image}`);
  }
});

test('member photos are optional and follow headshot availability', () => {
  for (const member of members) {
    const image = `/team/headshots/${member.id}.webp`;
    assert.equal(member.image, existsSync(`public${image}`) ? image : null);
  }
});
