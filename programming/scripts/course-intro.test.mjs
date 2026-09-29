import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const context = { exports: {}, URL };
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/course-intro.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const { courseIntroId, normalizeCourseIntro } = context.exports;

test('accept and normalize supported public YouTube URLs', () => {
  for (const url of ['https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk', 'https://www.youtube-nocookie.com/embed/abcdefghijk']) {
    assert.equal(courseIntroId(url), 'abcdefghijk');
    assert.equal(normalizeCourseIntro(url), 'https://www.youtube.com/watch?v=abcdefghijk');
  }
});
test('reject unsafe or invalid URLs', () => {
  for (const url of ['javascript:alert(1)', 'https://youtube.com.evil.test/watch?v=abcdefghijk', 'http://youtube.com/watch?v=abcdefghijk', 'https://youtu.be/abc', 'https://user:pass@youtube.com/watch?v=abcdefghijk', null]) {
    assert.equal(courseIntroId(url), null);
    assert.throws(() => normalizeCourseIntro(url));
  }
});
test('allow admin to remove a video', () => {
  assert.equal(normalizeCourseIntro(''), '');
  assert.equal(courseIntroId(undefined), null);
});
