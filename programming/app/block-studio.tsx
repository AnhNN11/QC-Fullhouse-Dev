"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { Block, BlockKind, BlockChallenge, blockLabels, countBlocks, gradeBlocks, validateProgram } from "@/lib/blocks";
import { findBlock, insertBlock, newBlock, removeBlock, type Slot } from "@/lib/block-editor";
import AuthDialog from "./auth-dialog";
import "./blocks.css";
type Grade = ReturnType<typeof gradeBlocks>;
type Drag = { kind: BlockKind } | { id: string };
export default function BlockStudio({ challenge, initialProgram, initialBest }: { challenge: BlockChallenge; initialProgram: Block[]; initialBest: number | null }) {
  const [program, setProgram] = useState<Block[]>(initialProgram), [grade, setGrade] = useState<Grade | null>(null);
  const [best, setBest] = useState(initialBest), [worldIndex, setWorldIndex] = useState(0), [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [authOpen, setAuthOpen] = useState(false), [dragging, setDragging] = useState(false);
  const [dragPoint, setDragPoint] = useState({ x: 0, y: 0 });
  const [slot, setSlot] = useState<Slot>({ parent: null, branch: "body", index: initialProgram.length });
  const drag = useRef<Drag | null>(null);
  const world = challenge.worlds[worldIndex], result = grade?.results[worldIndex];
  const frame = result?.frames[Math.min(step, result.frames.length - 1)] ?? { ...world.start, collected: [], blockId: "start" };
  useEffect(() => {
    if (!playing || !result || step >= result.frames.length - 1) return;
    const timer = window.setTimeout(() => setStep(step + 1), 260);
    return () => window.clearTimeout(timer);
  }, [playing, result, step]);
  const animating = playing && Boolean(result && step < result.frames.length - 1);
  function change(next: Block[]) {
    try { validateProgram(next, challenge.allowed); setProgram(next); setGrade(null); setPlaying(false); setStep(0); setError(""); setNotice(""); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Chương trình không hợp lệ."); }
  }
  function put(item: Drag, target: Slot) {
    try {
      const block = "kind" in item ? newBlock(item.kind, crypto.randomUUID()) : findBlock(program, item.id);
      if (!block) return;
      change(insertBlock(program, block, target, "id" in item));
      setSlot({ ...target, index: target.index + 1 });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Chưa thả được khối."); }
  }
  function begin(event: PointerEvent<HTMLButtonElement>, item: Drag) {
    if (pending) return;
    drag.current = item; setDragPoint({ x: event.clientX, y: event.clientY }); setDragging(true); event.currentTarget.setPointerCapture(event.pointerId);
  }
  function end(event: PointerEvent<HTMLButtonElement>) {
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-block-slot]");
    if (target && drag.current) put(drag.current, JSON.parse(target.dataset.blockSlot!) as Slot);
    drag.current = null; setDragging(false);
  }
  function run() {
    try { setGrade(gradeBlocks(challenge, program)); setStep(0); setPlaying(true); setError(""); setNotice("Kết quả chạy thử, chưa lưu. Bấm Nộp bài để máy chủ chấm và lưu điểm."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Chưa chạy được."); }
  }
  async function submit() {
    setPending(true); setError("");
    try {
      const response = await fetch(`/api/blocks/${challenge.slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ program }) });
      if (response.status === 401) { setAuthOpen(true); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chưa chấm được.");
      setGrade(data); setBest(data.bestScore); setPlaying(false); setStep(0); setNotice(`Đã lưu điểm trên máy chủ · Lần nộp ${data.attempts}.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Lỗi kết nối. Thử lại nhé."); }
    finally { setPending(false); }
  }
  function zone(target: Slot) {
    const active = slot.parent === target.parent && slot.branch === target.branch && slot.index === target.index;
    return <button type="button" className={`block-slot ${active ? "selected" : ""}`} data-block-slot={JSON.stringify(target)} aria-pressed={active} onClick={() => setSlot(target)} disabled={pending}>＋ {active ? "Vị trí đang chọn — thả khối ở đây" : "Thả khối / chọn vị trí chèn"}</button>;
  }
  function stack(items: Block[], parent: string | null = null, branch: Slot["branch"] = "body") {
    return <div className="block-stack">{zone({ parent, branch, index: 0 })}{items.map((b, index) => <div key={b.id}><article className={`code-block kind-${b.kind} ${frame.blockId === b.id && grade ? "executing" : ""}`}><div className="block-line"><button type="button" className="block-grip" aria-label={`Kéo ${blockLabels[b.kind]}`} onPointerDown={event => begin(event, { id: b.id })} onPointerUp={end} onPointerMove={event => { if (drag.current) setDragPoint({ x: event.clientX, y: event.clientY }); }} onPointerCancel={() => { drag.current = null; setDragging(false); }} disabled={pending}>⠿</button><strong>{blockLabels[b.kind]}</strong>{b.count !== undefined && <input aria-label={`Số ${b.kind === "repeat" ? "lần lặp" : "bước"}`} type="number" min={1} max={b.kind === "repeat" ? 20 : 10} value={b.count} disabled={pending} onChange={event => { const copy = structuredClone(program); findBlock(copy, b.id)!.count = Number(event.target.value); change(copy); }}/>}<button type="button" title="Chuyển đến vị trí đang chọn" aria-label={`Chuyển ${blockLabels[b.kind]} đến vị trí chọn`} onClick={() => put({ id: b.id }, slot)} disabled={pending}>↪</button><button type="button" aria-label={`Xóa ${blockLabels[b.kind]}`} onClick={() => { change(removeBlock(program, b.id)); setSlot({ parent: null, branch: "body", index: 0 }); }} disabled={pending}>×</button></div>{b.body && <div className="block-nested"><small>{b.kind === "repeat" ? "Làm các lệnh bên trong" : "Thì"}</small>{stack(b.body, b.id)}</div>}{b.otherwise && <div className="block-nested"><small>Nếu không</small>{stack(b.otherwise, b.id, "otherwise")}</div>}</article>{zone({ parent, branch, index: index + 1 })}</div>)}</div>;
  }
  return <main className={`blocks-page ${dragging ? "is-dragging" : ""}`}><Link href="/resources/blocks">← Phòng khối lệnh</Link><header className="studio-heading"><div><span>THỬ THÁCH / {challenge.level}</span><h1>{challenge.title}</h1><p>{challenge.description}</p></div><div className="block-best">Kỷ lục cá nhân<strong>{best === null ? "—" : best}<small>/100</small></strong></div></header><details className="block-instructions" open><summary>Nhiệm vụ & cách tính điểm</summary><ul>{challenge.instructions.map(item => <li key={item}>{item}</li>)}</ul><p>60 điểm đến đích + 30 điểm sao (bài không có sao được phần này khi đến đích). 10 điểm tối ưu khi qua mọi bản đồ và dùng tối đa {challenge.maxBlocks} khối. Điểm bản đồ lấy trung bình. Va chạm không tính là đến đích.</p></details><div className="studio-grid"><aside className="block-toolbox"><h2>Kho khối lệnh</h2><p>Kéo bằng tay nắm ⠿ vào ô nét đứt. Hoặc chọn vị trí chèn rồi bấm tên khối. Nút ↪ chuyển khối đã có vào vị trí chọn.</p>{challenge.allowed.map(kind => <div className={`palette-block kind-${kind}`} key={kind}><button type="button" className="block-grip" aria-label={`Kéo khối mới ${blockLabels[kind]}`} disabled={pending} onPointerDown={event => begin(event, { kind })} onPointerUp={end} onPointerMove={event => { if (drag.current) setDragPoint({ x: event.clientX, y: event.clientY }); }} onPointerCancel={() => { drag.current = null; setDragging(false); }}>⠿</button><button type="button" disabled={pending} onClick={() => put({ kind }, slot)}>{blockLabels[kind]} ＋</button></div>)}</aside><section className="block-workspace"><div className="workspace-title"><h2>Chương trình của bạn</h2><span>{countBlocks(program)} / {challenge.maxBlocks} khối tối ưu</span></div><div className="start-block">⚑ Khi bấm Chạy thử</div>{stack(program)}<button className="block-clear" disabled={pending || !program.length} onClick={() => { if (window.confirm("Xóa chương trình đang soạn? Điểm đã nộp vẫn được giữ.")) { change([]); setSlot({ parent: null, branch: "body", index: 0 }); } }}>Xóa chương trình đang soạn</button></section><section className="block-stage"><h2>Sân khấu cá heo</h2><label>Bản đồ kiểm thử<select value={worldIndex} onChange={event => { setWorldIndex(Number(event.target.value)); setStep(0); setPlaying(false); }}>{challenge.worlds.map((w, i) => <option key={w.name} value={i}>{w.name}</option>)}</select></label><div className="ocean-grid" style={{ gridTemplateColumns: `repeat(${world.size},1fr)`, gridTemplateRows: `repeat(${world.size},1fr)` }} role="img" aria-label={`Cá heo ở (${frame.x},${frame.y}), hướng ${["phải","xuống","trái","lên"][frame.direction]}. Đích (${world.goal.x},${world.goal.y}).`}>{Array.from({ length: world.size ** 2 }, (_, index) => {
    const x = index % world.size, y = Math.floor(index / world.size), isDolphin = x === frame.x && y === frame.y;
    const wall = world.walls.some(p => p.x === x && p.y === y), star = world.stars.some(p => p.x === x && p.y === y) && !frame.collected.includes(`${x},${y}`), goal = world.goal.x === x && world.goal.y === y;
    return <div key={index} className={`ocean-cell ${wall ? "wall" : ""} ${goal ? "goal" : ""}`}><small>{x},{y}</small>{isDolphin ? <span className="dolphin-token">🐬<b>{["→","↓","←","↑"][frame.direction]}</b></span> : wall ? "🪨" : star ? "⭐" : goal ? "⚑" : ""}</div>;
  })}</div><p className="stage-legend">🐬 Cá heo · ⭐ Sao · ⚑ Đích · 🪨 Tường</p><div className="studio-controls"><button onClick={run} disabled={pending}>▶ Chạy thử</button><button onClick={() => { if (result && step >= result.frames.length - 1) { setStep(0); setPlaying(true); } else setPlaying(!playing); }} disabled={!result}>{animating ? "Tạm dừng" : "Phát / tiếp tục"}</button><button onClick={() => { setPlaying(false); setStep(value => Math.min(value + 1, (result?.frames.length ?? 1) - 1)); }} disabled={!result}>Từng bước</button><button className="submit-blocks" onClick={() => void submit()} disabled={pending || !program.length}>{pending ? "Đang chấm…" : "Nộp bài & lưu điểm"}</button></div><p aria-live="polite">{result ? `Bước ${step}/${result.frames.length - 1} · Đã nhặt ${frame.collected.length}/${world.stars.length} sao` : "Sẵn sàng. Hãy ghép khối lệnh rồi chạy thử."}</p>{grade && <div className="block-feedback"><strong>{grade.score}/100 điểm</strong><p>{grade.passed ? "Đã hoàn thành tất cả bản đồ!" : "Chưa hoàn thành mọi bản đồ. Xem từng bản đồ để sửa chương trình."}</p>{!grade.efficient && <p>Hãy giảm còn {challenge.maxBlocks} khối để nhận 10 điểm tối ưu.</p>}{grade.results.map(r => <p key={r.name}>{r.name}: {r.reached ? "✓ Đến đích" : "Chưa đến đích"} · {r.collected}/{r.totalStars} sao{r.error ? ` · ${r.error}` : ""}</p>)}</div>}{notice && <p role="status">{notice}</p>}{error && <p role="alert" className="block-error">{error}</p>}</section></div>{dragging && <div className="block-drag-preview" style={{ left: dragPoint.x + 12, top: dragPoint.y + 12 }}>⠿ Thả khối vào ô nét đứt</div>}<AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={() => { setNotice("Đã đăng nhập. Bấm Nộp bài để lưu điểm."); }}/></main>;
}
