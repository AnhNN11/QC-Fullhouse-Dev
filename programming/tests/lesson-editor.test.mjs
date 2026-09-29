import {test} from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../lib/lesson-editor.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {parseLessonFields,lessonPublishError}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const form=values=>{const f=new FormData();for(const [k,v]of Object.entries(values))f.set(k,v);return f;};
test('draft can be prepared without video or learning materials',()=>{
 const data=parseLessonFields(form({title:' Bài 1 ',module:'Chương 1',order:'0'}),true);
 assert.equal(data.title,'Bài 1');assert.equal(data.order,0);assert.equal(data.objective,'');assert.match(lessonPublishError(data),/video/);
});
test('editing order and chapter preserves fields absent in older forms',()=>{
 const data=parseLessonFields(form({title:'Mới',objective:'Mục tiêu',exercise:'Bài tập'}));
 assert.ok(!('module' in data));assert.ok(!('order' in data));
 const moved=parseLessonFields(form({module:'Chương 2',order:'3'}));assert.equal(moved.module,'Chương 2');assert.equal(moved.order,3);
});
test('invalid order and blank required fields are rejected',()=>{
 for(const order of ['','-1','1.5','abc'])assert.throws(()=>parseLessonFields(form({order})));
 assert.throws(()=>parseLessonFields(form({module:' '})));
});
test('publication requires video, objective and exercise',()=>{
 assert.match(lessonPublishError({encryptedVideo:'encrypted'}),/mục tiêu/);
 assert.match(lessonPublishError({encryptedVideo:'encrypted',objective:'Hiểu biến'}),/bài tập/);
 assert.equal(lessonPublishError({encryptedVideo:'encrypted',objective:'Hiểu biến',exercise:'Khai báo biến'}),null);
});
