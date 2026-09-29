import assert from 'node:assert/strict';
import { test } from 'node:test';
import { newsletterEmail, newsletterId } from '../lib/newsletter.ts';

test('normalizes email consistently before identifying duplicate requests', () => {
  assert.equal(newsletterEmail(' User@Example.COM '), 'user@example.com');
  assert.equal(newsletterId(newsletterEmail(' User@Example.COM ')), newsletterId('user@example.com'));
  assert.match(newsletterId('user@example.com'), /^[a-f0-9]{64}$/);
});

test('rejects missing, malformed, oversized and header-injection input', () => {
  for (const value of [null, '', 'a', 'a@b', 'a b@c.com', 'a@b.com\nBcc:x@y.com', `${'a'.repeat(255)}@example.com`, new File(['test'], 'file.txt')]) {
    assert.equal(newsletterEmail(value), null);
  }
});
