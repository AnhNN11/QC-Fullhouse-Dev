import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/dashboard-courses.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { dashboardCourseHref, dashboardCourseLabel, isCourseInProgress } = context.exports;

test('guests can browse details even with stale progress/enrollment data', () => {
  const course = { id: 'data-structures', enrolled: true, progress: 40 };
  assert.equal(dashboardCourseHref(course, false), '/courses/data-structures');
  assert.equal(dashboardCourseLabel(course, false), 'Khám phá');
});

test('revoked or missing enrollment cannot resume historical progress', () => {
  for (const enrolled of [false, undefined]) {
    const course = { id: 'js', enrolled, progress: 40 };
    assert.equal(isCourseInProgress(course), false);
    assert.equal(dashboardCourseHref(course, true), '/courses/js');
    assert.equal(dashboardCourseLabel(course, true), 'Khám phá');
  }
});

test('active enrollment supports starting, continuing and reviewing', () => {
  for (const [progress, label, inProgress] of [[0, 'Vào học', false], [40, 'Tiếp tục', true], [100, 'Ôn tập', false]]) {
    const course = { id: 'js', enrolled: true, progress };
    assert.equal(dashboardCourseHref(course, true), '/courses/js/learn');
    assert.equal(dashboardCourseLabel(course, true), label);
    assert.equal(isCourseInProgress(course), inProgress);
  }
});

test('course identifiers are encoded', () => {
  assert.equal(dashboardCourseHref({ id: 'a/b ?' }, false), '/courses/a%2Fb%20%3F');
});
