import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { projects, members } from '../src/lib/content';

test('published content resolves every local image', () => {
  for (const item of [...projects, ...members]) {
    assert.ok(existsSync(`public${item.image}`), `${item.id}: missing ${item.image}`);
  }
});
