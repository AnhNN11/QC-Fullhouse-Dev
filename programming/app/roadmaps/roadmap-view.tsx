"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Circle, ArrowUpRight, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AuthDialog from "@/app/auth-dialog";
import { useLearningContext } from '@/app/learning-context';
import type { SessionUser } from "@/lib/user-auth";
import { roadmapNodes, type LearningRoadmap, type RoadmapNode, type RoadmapStatus } from "@/lib/roadmaps";
import { type RoadmapGuide } from "@/lib/roadmap-guides";
import "./roadmap-detail.css";
const labels = { new: "Chưa học", learning: "Đang học", done: "Hoàn thành" };
export default function RoadmapView({ roadmap, guide }: { roadmap: LearningRoadmap; guide: RoadmapGuide }) {
  const accountId = useLearningContext()?.user?.id;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [statuses, setStatuses] = useState<Record<string, RoadmapStatus>>({});
  const [selected, setSelected] = useState<RoadmapNode | null>(null);
  const selectedGuide = guide.stages[roadmap.stages.findIndex(stage => stage.nodes.some(node => node.id === selected?.id))];
  const [authOpen, setAuthOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fetchProgress = useCallback(async () => {
    const response = await fetch(`/api/roadmaps/${roadmap.slug}`);
    if (!response.ok) throw new Error();
    return response.json() as Promise<{user: SessionUser | null; statuses: Record<string, RoadmapStatus>}>;
  }, [roadmap.slug]);
  const load = async () => {
    try {
      const data = await fetchProgress();
      setError(""); setUser(data.user); setStatuses(data.statuses); setReady(true);
    } catch { setError("Chưa tải được tiến độ. Thử tải lại trước khi cập nhật."); setReady(false); }
  };
  useEffect(() => {
    let active = true;
    fetchProgress().then(data => {
      if (!active) return;
      setError(""); setUser(data.user); setStatuses(data.statuses); setReady(true);
    }).catch(() => {
      if (!active) return;
      setError("Chưa tải được tiến độ. Thử tải lại trước khi cập nhật."); setReady(false);
    });
    return () => { active = false; };
  }, [fetchProgress, accountId]);
  const nodes = roadmapNodes(roadmap);
  const completed = nodes.filter(node=>statuses[node.id]==="done").length;
  async function save(status: RoadmapStatus) {
    if (!selected || saving || !ready) return;
    if (!user) { setAuthOpen(true); return; }
    setSaving(true); setError("");
    try {
      const response = await fetch(`/api/roadmaps/${roadmap.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nodeId: selected.id, status }) });
      if (response.status===401) { setUser(null); setStatuses({}); setAuthOpen(true); return; }
      if (!response.ok) throw new Error();
      setStatuses(current=>({...current,[selected.id]:status}));
    } catch { setError("Chưa lưu được thay đổi. Tiến độ trước đó vẫn được giữ; bạn có thể thử lại."); }
    finally { setSaving(false); }
  }
  return <div className="rm-container rm-detail rm-studio"><Link className="rm-back" href="/roadmaps"><ArrowLeft/> Tất cả lộ trình</Link>
    <section className="rm-detail-header"><span className="rm-eyebrow">{roadmap.category} / DOLPHINX ROADMAP</span><h1>{roadmap.title}</h1><p>{roadmap.description}</p><div className="rm-detail-meta"><span>Xem tự do · Không cần tài khoản</span><span>{roadmap.stages.length} chặng</span><span>{nodes.length} chủ đề</span><span>Bấm vào một ô để khám phá</span></div></section>
    <div className="rm-brief"><div><span>PHÙ HỢP VỚI BẠN NẾU</span><p>{guide.audience}</p></div><div><span>TRƯỚC KHI BẮT ĐẦU</span><p>{guide.prerequisite}</p></div></div>
    <div className="rm-progress"><div><strong>{ready ? `${completed} / ${nodes.length} hoàn thành` : "Đang tải tiến độ…"}</strong><span>{user ? "Tiến độ được lưu theo tài khoản" : "Xem tự do · Đăng nhập để lưu tiến độ"}</span></div><progress aria-label="Tiến độ lộ trình" max={nodes.length} value={completed}/>{!user && <button onClick={()=>setAuthOpen(true)}>Đăng nhập</button>}</div>
    {error && <div className="rm-error" role="alert">{error} <button onClick={()=>void load()}>Tải lại tiến độ</button></div>}
    <div className="rm-legend"><span><i/> Chưa học</span><span><i className="learning"/> Đang học</span><span><i className="done"/> Hoàn thành</span><small>Thứ tự gợi ý, không phải điều kiện khóa bài</small></div>
    <div className="rm-workspace"><nav className="rm-index" aria-label="Các chặng trong lộ trình"><span>BẢN ĐỒ HÀNH TRÌNH</span>{guide.stages.map((stage,index)=><a key={stage.label} href={`#stage-${index}`}><b>{String(index+1).padStart(2,"0")}</b>{stage.label}</a>)}<p>Bấm chủ đề để xem bài thực hành và tài liệu. Không cần hoàn thành theo thứ tự cứng.</p></nav><section className="rm-map" aria-label={`Sơ đồ ${roadmap.title}`}><div className="rm-start">{roadmap.title}</div>
      {roadmap.stages.map((stage,index)=><div className="rm-stage" id={`stage-${index}`} key={stage.title}><div className="rm-stage-label"><small>CHẶNG {String(index+1).padStart(2,"0")}</small><h2>{guide.stages[index].label}</h2><p>{guide.stages[index].focus}</p></div><div className="rm-stage-nodes">{stage.nodes.map(node=><button key={node.id} className={`rm-node ${statuses[node.id] ?? "new"}`} onClick={()=>setSelected(node)} aria-label={`${node.title} — ${labels[statuses[node.id] ?? "new"]}`}><span>{node.title}<small>{node.description}</small></span>{statuses[node.id]==="done"?<Check/>:statuses[node.id]==="learning"?<Circle/>:<ArrowUpRight/>}</button>)}<details className="rm-checkpoint"><summary>Tự kiểm tra trước chặng tiếp theo</summary><p>{guide.stages[index].checkpoint}</p><div>{guide.stages[index].resources.map(resource=><a href={resource.href} key={resource.href} target="_blank" rel="noopener noreferrer">{resource.title} ↗</a>)}</div></details></div></div>)}
      <div className="rm-finish"><Check/><strong>{guide.project}</strong><p>{roadmap.outcome}</p><ul>{guide.deliverables.map(item=><li key={item}>{item}</li>)}</ul><Link href={`/courses/${roadmap.course}`}>Khóa học liên quan <ArrowUpRight/></Link></div>
    </section></div><p className="rm-source">Thiết kế lấy cảm hứng từ <a href="https://roadmap.sh/" target="_blank" rel="noreferrer">roadmap.sh</a>. Nội dung lộ trình được biên soạn riêng cho DolphinX.</p>
    <Dialog open={!!selected && !authOpen} onOpenChange={open=>{if(!open&&!saving)setSelected(null);}}><DialogContent className="rm-node-dialog"><span className="rm-eyebrow">{roadmap.title}</span><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription><div className="rm-practice"><BookOpen/><div><h3>Thử làm một việc nhỏ</h3><p>{selected?.practice}</p></div></div><section className="rm-topic-resources"><h3>Đặt chủ đề vào lộ trình</h3><p>{selectedGuide?.focus}</p><h3>Tiêu chí hoàn thành chặng</h3><p>{selectedGuide?.checkpoint}</p><h3>Tài liệu chính thức của chặng</h3>{selectedGuide?.resources.map(resource=><a href={resource.href} key={resource.href} target="_blank" rel="noopener noreferrer">{resource.title} <ArrowUpRight size={14}/></a>)}</section><h3 className="rm-status-title">Tiến độ của bạn</h3><div className="rm-status-buttons">{(["new","learning","done"] as const).map(status=><button disabled={!ready||saving} key={status} aria-pressed={!!selected&&(statuses[selected.id]??"new")===status} onClick={()=>void save(status)}>{labels[status]}</button>)}</div><p aria-live="polite" className="rm-save-hint">{saving?"Đang lưu…":!user?"Đăng nhập để lưu trạng thái học.":"Thay đổi được lưu sau khi bạn chọn trạng thái."}</p>{error&&<p role="alert" className="rm-error">{error}</p>}<Link className="rm-course-link" href={`/courses/${roadmap.course}`}>Xem khóa học liên quan <ArrowUpRight/></Link></DialogContent></Dialog>
    <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={()=>void load()}/>
  </div>;
}
