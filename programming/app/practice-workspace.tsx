"use client";

import { useState } from "react";
import { ArrowLeft, Code2, FileText, Play, Send, Terminal, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Problem } from "@/lib/types";
import "./practice-workspace.css";
import dynamic from "next/dynamic";
const CodeEditor = dynamic(() => import("./code-editor"), { ssr: false });

export default function PracticeWorkspace({ problem, code, onCode, grading, message, onSubmit, onClose }: {
  problem: Problem; code: string; onCode: (value: string) => void; grading: boolean;
  message: string; onSubmit: (mode: 'run' | 'submit') => Promise<void>; onClose: () => void;
}) {
  const [tab, setTab] = useState<'sample' | 'result'>('sample');
  const [reset, setReset] = useState(false);
  function run(mode: 'run' | 'submit') { setTab('result'); void onSubmit(mode); }
  return <Dialog open onOpenChange={open => { if (!open && !grading) onClose(); }}>
    <DialogContent className="dx-code-workspace" style={{ translate: 'none', transform: 'none' }} showCloseButton={false}>
      <header className="code-topbar">
        <button className="code-back" onClick={onClose} disabled={grading}><ArrowLeft size={16}/> Kho bài tập</button>
        <span className="code-brand">Dolphin<span>X</span> <small>WORKSPACE</small></span>
        <div className="code-actions"><button disabled={grading || !problem.gradingEnabled || !code.trim() || code.length > 20000} onClick={()=>run('run')}><Play size={15}/> Chạy thử</button><button className="code-submit" disabled={grading || !problem.gradingEnabled || !code.trim() || code.length > 20000} onClick={()=>run('submit')}><Send size={15}/>{grading ? 'Đang chấm…' : 'Nộp bài'}</button></div>
      </header>
      <div className="code-columns">
        <section className="code-panel code-description">
          <div className="code-panel-heading"><FileText size={16}/><strong>Đề bài</strong><span>JavaScript Challenge</span></div>
          <div className="code-statement">
            <DialogTitle className="code-problem-title">{problem.id}. {problem.title}</DialogTitle>
            <div className="code-tags"><span className={problem.difficulty === 'Dễ' ? 'easy' : problem.difficulty === 'Khó' ? 'hard' : 'medium'}>{problem.difficulty}</span><span>{problem.topic}</span><span>{problem.gradingEnabled ? 'Chấm tự động' : 'Tự luyện'}</span></div>
            <p className="code-prose">{problem.statement}</p>
            <h3>Ví dụ 1</h3><div className="code-example"><b>Đầu vào</b><pre>{problem.exampleInput}</pre><b>Đầu ra</b><pre>{problem.exampleOutput}</pre>{problem.explanation && <p><b>Giải thích: </b>{problem.explanation}</p>}</div>
            <h3>Ràng buộc</h3><ul>{problem.constraints.map(item=><li key={item}>{item}</li>)}</ul>
            <DialogDescription className="code-runtime-note">Viết hàm solve bằng JavaScript đồng bộ. Không hỗ trợ import, mạng hoặc đọc file. Chạy thử dùng test mẫu; nộp bài chạy cả test ẩn trên máy chủ.</DialogDescription>
            {!problem.gradingEnabled && <p className="code-warning">Bài đang ở chế độ tự luyện, chưa có bộ test được admin duyệt.</p>}
          </div>
        </section>
        <div className="code-right">
          <section className="code-panel code-editor-panel">
            <div className="code-panel-heading"><Code2 size={16}/><strong>Code</strong><span>solve.js</span></div>
            <div className="code-editor-toolbar"><span>JavaScript <small>ES2020</small></span><button onClick={()=>setReset(true)} disabled={grading} aria-label="Khôi phục code mẫu"><RotateCcw size={14}/> Khôi phục</button></div>
            {reset && <div className="code-reset-confirm" role="alert">Thay lời giải hiện tại bằng code mẫu? <button onClick={()=>{onCode(problem.starterCode.replaceAll('\\n','\n'));setReset(false);}}>Khôi phục</button><button onClick={()=>setReset(false)}>Hủy</button></div>}
            <div className="code-monaco-editor" style={{flex:1,minHeight:0}} onKeyDown={event=>{if((event.metaKey || event.ctrlKey) && event.key==='Enter'){event.preventDefault();if(!grading && problem.gradingEnabled && code.trim() && code.length<=20000)run('run');}}}><CodeEditor value={code} onChange={onCode} readOnly={grading}/></div>
            <div className="code-editor-status"><span>{code.length.toLocaleString('vi-VN')} / 20.000 ký tự</span><span>Ctrl / ⌘ + Enter: chạy thử</span></div>
          </section>
          <section className="code-panel code-console">
            <div className="code-panel-heading"><Terminal size={16}/><div className="code-console-tabs"><button aria-pressed={tab==='sample'} onClick={()=>setTab('sample')}>Test case</button><button aria-pressed={tab==='result'} onClick={()=>setTab('result')}>Kết quả</button></div></div>
            <div className="code-console-content">{tab==='sample' ? <><span className="code-case-label">Ví dụ 1 · chỉ đọc</span><label>Đầu vào<pre>{problem.exampleInput}</pre></label><label>Kết quả mong đợi<pre>{problem.exampleOutput}</pre></label></> : <div role="status" aria-live="polite" aria-busy={grading}><strong>{grading ? 'Đang chạy bộ kiểm thử…' : message ? 'Kết quả từ máy chấm' : 'Chưa có kết quả'}</strong><p>{message || 'Nhấn Chạy thử để kiểm tra test mẫu, hoặc Nộp bài để chấm và lưu tiến độ.'}</p></div>}</div>
            <footer>Hai lượt chấm cách nhau ít nhất 12 giây. Bản nháp mất khi đóng màn này.</footer>
          </section>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
