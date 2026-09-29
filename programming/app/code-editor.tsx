"use client";
import Editor, { loader } from '@monaco-editor/react';
if (typeof window !== 'undefined') loader.config({ paths: { vs: new URL('/vendor/monaco/vs', window.location.origin).href } });

export default function CodeEditor({ value, onChange, readOnly }: { value: string; onChange: (code: string) => void; readOnly: boolean }) {
  return <Editor height="100%" language="javascript" value={value} theme="vs" onChange={value=>onChange(value ?? '')}
    loading={<p role="status" style={{padding:20}}>Đang tải Monaco Editor…</p>}
    options={{ readOnly, automaticLayout: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 23, tabSize: 2, insertSpaces: true, scrollBeyondLastLine: false, padding: { top: 16 }, ariaLabel: 'Trình soạn lời giải JavaScript', wordWrap: 'on', lineNumbersMinChars: 3, bracketPairColorization: { enabled: true }, formatOnPaste: true, formatOnType: true, fixedOverflowWidgets: true }} />;
}
