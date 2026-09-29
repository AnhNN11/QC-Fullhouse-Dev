"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseFields from "./course-fields";
import { Activity, ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, Code2, ExternalLink, GraduationCap, LayoutDashboard, Loader2, LogOut, Menu, MessageSquare, Pencil, Plus, RefreshCw, Search, Send, SlidersHorizontal, Trash2, Users, X } from "lucide-react";
import { normalizeCourseLevel, courseLevelTone } from "@/lib/course-options";
import type { AdminData } from "@/lib/db";
import type { Course, Problem } from "@/lib/types";
import { logoutAdmin } from "./actions";
import Brand from "../brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import "./management.css";

type Editor = { type: "course"; item?: Course } | { type: "problem"; item?: Problem } | { type: "learner"; item: AdminData["learners"][number] } | null;
type View = "overview" | "courses" | "learners" | "problems" | "activity";
const views = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "courses", label: "Khóa học", icon: BookOpen },
  { id: "learners", label: "Học viên", icon: Users },
  { id: "problems", label: "Kho bài tập", icon: Code2 },
  { id: "activity", label: "Hoạt động học tập", icon: Activity },
] as const;
const count = (n: number) => n.toLocaleString("vi-VN");
const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
const shortDay = (value: string) => value.slice(8, 10) + "/" + value.slice(5, 7);
const PAGE_SIZE = 8;

export default function AdminShell({ initialData }: { initialData: AdminData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [view, setView] = useState<View>("overview");
  const [editor, setEditor] = useState<Editor>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [days, setDays] = useState(14);
  const [mobileNav, setMobileNav] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const match = (value: string) => normalize(value).includes(normalize(query.trim()));
  const filteredCourses = data.courses.filter(item => match(`${item.title} ${item.level}`) && (filter === "all" || normalizeCourseLevel(item.level) === filter));
  const filteredProblems = data.problems.filter(item => match(`${item.title} ${item.topic}`) && (filter === "all" || item.difficulty === filter));
  const filteredLearners = data.learners.filter(item => match(`${item.name} ${item.email}`) && (filter === "all" || (filter === "enrolled" ? item.enrolledCourses > 0 : !item.enrolledCourses)));
  const filteredSubmissions = data.submissions.filter(item => match(`${item.learnerName} ${item.problemTitle} ${item.language}`) && (filter === "all" || (filter === "accepted" ? item.accepted : !item.accepted)));
  const total = view === "courses" ? filteredCourses.length : view === "learners" ? filteredLearners.length : view === "problems" ? filteredProblems.length : filteredSubmissions.length;
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, maxPage);
  const start = (currentPage - 1) * PAGE_SIZE;
  const trend = data.activityTrend.slice(-days);
  const peak = Math.max(1, ...trend.map(day => day.learners));
  const activeDays = trend.filter(day => day.learners > 0).length;
  const popularCourses = useMemo(() => [...data.courses].sort((a, b) => (data.enrollmentCounts[b.id] ?? 0) - (data.enrollmentCounts[a.id] ?? 0)).slice(0, 5), [data]);
  const acceptedRate = data.submissions.length ? Math.round(data.stats.accepted / data.submissions.length * 100) : 0;

  function navigate(next: View) { setView(next); setQuery(""); setFilter("all"); setPage(1); setMobileNav(false); }
  function openEditor(next: Editor) { if (next?.type === "course") { router.push(`/admin/courses/${next.item ? encodeURIComponent(next.item.id) : "new"}`); return; } setError(""); setNotice(""); setEditor(next); }
  async function refresh() {
    setRefreshing(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin", { cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 401 ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." : "Không thể tải dữ liệu. Vui lòng thử lại.");
      setData(await response.json()); setNotice("Đã cập nhật dữ liệu mới nhất.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải dữ liệu."); }
    finally { setRefreshing(false); }
  }
  async function mutate(action: string, payload: Record<string, unknown>) {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, payload }) });
      const result = await response.json() as AdminData & { error?: string };
      if (!response.ok) throw new Error(result.error || "Không thể cập nhật dữ liệu.");
      setData(result); setEditor(null); setNotice(action.startsWith("delete") ? "Đã xóa nội dung." : "Đã lưu thay đổi.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể cập nhật dữ liệu."); }
    finally { setSaving(false); }
  }
  function submitEditor(formData: FormData) {
    if (!editor || saving) return;
    if (editor.type === "course") void mutate("saveCourse", {
      id: editor.item?.id, audience: formData.get("audience"), outcomes: String(formData.get("outcomes") ?? "").split("\n").map(v=>v.trim()).filter(Boolean), prerequisites: String(formData.get("prerequisites") ?? "").split("\n").map(v=>v.trim()).filter(Boolean), introVideoUrl: String(formData.get("introVideoUrl") ?? "").trim(), title: formData.get("title"), description: formData.get("description"), icon: formData.get("icon"), color: formData.get("color"), level: formData.get("level"), lessons: Number(formData.get("lessons")), students: formData.get("students"), modules: String(formData.get("modules") ?? "").split("\n").map(v => v.trim()).filter(Boolean),
    });
    else if (editor.type === "problem") void mutate("saveProblem", {
      id: editor.item?.id, title: formData.get("title"), slug: editor.item?.slug, topic: formData.get("topic"), difficulty: formData.get("difficulty"), acceptance: formData.get("acceptance"), statement: formData.get("statement"), exampleInput: formData.get("exampleInput"), exampleOutput: formData.get("exampleOutput"), explanation: formData.get("explanation"), constraints: String(formData.get("constraints") ?? "").split("\n").map(v => v.trim()).filter(Boolean), starterCode: formData.get("starterCode"),
    });
    else void mutate("updateLearner", { id: editor.item.id, name: formData.get("name"), level: Number(formData.get("level")), xp: Number(formData.get("xp")) });
  }
  async function remove(type: "Course" | "Problem", id: string | number, title: string) {
    if (saving || !window.confirm(`Xóa “${title}”? Nội dung, quyền truy cập và dữ liệu tiến độ liên quan sẽ bị xóa. Không thể hoàn tác.`)) return;
    await mutate(`delete${type}`, { id });
  }
  function exportLearners() {
    const cell = (value: string | number) => '"' + String(value).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""') + '"';
    const rows = [["Học viên", "Email", "Khóa đang học", "Cấp độ", "XP", "Hoạt động gần nhất"], ...filteredLearners.map(item => [item.name, item.email, item.enrolledCourses, item.level, item.xp, item.lastActiveDay ?? ""])];
    const url = URL.createObjectURL(new Blob(["\uFEFF" + rows.map(row => row.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "dolphinx-hoc-vien.csv"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Đã xuất ${filteredLearners.length} học viên theo bộ lọc hiện tại.`);
  }
  const filters = view === "courses" ? [...new Set(data.courses.map(c => normalizeCourseLevel(c.level)))].map(v => [v, v]) : view === "learners" ? [["enrolled", "Có đăng ký học"], ["unassigned", "Chưa đăng ký học"]] : view === "problems" ? [["Dễ", "Dễ"], ["Trung bình", "Trung bình"], ["Khó", "Khó"]] : [["accepted", "Đã đạt"], ["failed", "Chưa đạt"]];

  function courseRows(courses: Course[], compact = false) {
    return courses.map(course => <TableRow key={course.id}>
      <TableCell><div className="mg-course"><span className={`mg-course-symbol ${course.color}`}><Code2 /></span><div><button className="mg-name" onClick={() => openEditor({ type: "course", item: course })}>{course.title}</button><p>{compact ? `${course.modules.length} chương học` : course.description}</p></div></div></TableCell>
      <TableCell><span className={`mg-level mg-level-${courseLevelTone(course.level)}`}>{normalizeCourseLevel(course.level)}</span></TableCell>
      <TableCell><span className="mg-numeric">{count(data.enrollmentCounts[course.id] ?? 0)}</span></TableCell>
      {!compact && <TableCell>{course.lessons} bài</TableCell>}
      <TableCell className="mg-row-actions"><Button variant="ghost" size="icon-sm" aria-label={`Sửa ${course.title}`} onClick={() => openEditor({ type: "course", item: course })}><Pencil /></Button>{!compact && <Button variant="ghost" size="icon-sm" disabled={saving} aria-label={`Xóa ${course.title}`} onClick={() => remove("Course", course.id, course.title)}><Trash2 /></Button>}</TableCell>
    </TableRow>);
  }
  return <div className="mg-app">
    <a className="mg-skip" href="#management-main">Đến nội dung chính</a>
    <aside className={`mg-sidebar ${mobileNav ? "is-open" : ""}`} id="management-navigation">
      <div className="mg-brand"><Brand /><button className="mg-mobile-close" onClick={() => setMobileNav(false)} aria-label="Đóng menu"><X /></button></div>
      <div className="mg-workspace"><span>DX</span><div><strong>DolphinX Education</strong><small>Không gian quản trị</small></div></div>
      <p className="mg-nav-label">QUẢN LÝ HỌC TẬP</p>
      <nav aria-label="Quản lý học tập">{views.map(item => <button key={item.id} aria-current={view === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><item.icon /><span>{item.label}</span>{item.id === "courses" && <small>{data.stats.courses}</small>}{item.id === "learners" && <small>{data.stats.learners}</small>}</button>)}</nav>
      <p className="mg-nav-label">VẬN HÀNH</p>
      <nav aria-label="Vận hành"><Link href="/admin/enrollments"><GraduationCap /> Đăng ký khóa học</Link><Link href="/admin/academy"><MessageSquare /> Video & tư vấn 1–1</Link><Link href="/admin/newsletter"><Send /> Người quan tâm</Link><Link href="/admin/email"><Send /> Email Studio</Link></nav>
      <details className="mg-more"><summary>Công cụ nâng cao</summary><nav aria-label="Công cụ nâng cao"><Link href="/admin/community">Cộng đồng</Link><Link href="/admin/contests">Cuộc thi & xếp hạng</Link><Link href="/admin/blocks">Khối lệnh</Link><Link href="/admin/library">Tài nguyên & lộ trình</Link><Link href="/admin/judge">Máy chấm & giáo án</Link></nav></details>
      <div className="mg-sidebar-bottom"><Link href="/" target="_blank" rel="noopener noreferrer"><ExternalLink /> Xem website</Link><form action={logoutAdmin}><button type="submit"><LogOut /> Đăng xuất</button></form><div className="mg-account"><span>AD</span><div><strong>Quản trị viên</strong><small>DolphinX Education</small></div></div></div>
    </aside>
    {mobileNav && <button className="mg-backdrop" onClick={() => setMobileNav(false)} aria-label="Đóng menu điều hướng" />}
    <main className="mg-main" id="management-main">
      <header className="mg-topbar"><div className="mg-breadcrumb"><button className="mg-menu" aria-label="Mở menu" aria-expanded={mobileNav} aria-controls="management-navigation" onClick={() => setMobileNav(true)}><Menu /></button><span>Không gian quản trị</span><ChevronRight /><strong>{views.find(item => item.id === view)?.label}</strong></div><div className="mg-top-actions"><button onClick={refresh} disabled={refreshing || saving} aria-label="Làm mới dữ liệu"><RefreshCw className={refreshing ? "animate-spin" : ""} /></button><span className="mg-top-avatar">AD</span></div></header>
      <div className="mg-body">
        <section className="mg-page-heading"><div><p className="mg-eyebrow">DOLPHINX / EDUCATION</p><h1>{view === "overview" ? "Tổng quan học viện" : views.find(item => item.id === view)?.label}</h1><p>{view === "overview" ? "Theo dõi việc học. Kết nối từng học viên." : view === "courses" ? "Tổ chức nội dung và cập nhật chương trình học." : view === "learners" ? "Theo dõi đăng ký và hoạt động của từng học viên." : view === "problems" ? "Quản lý đề bài và nội dung thực hành." : "Kết quả từ 100 bài nộp gần nhất của học viên."}</p></div><div className="mg-heading-actions">{view === "learners" ? <Button variant="outline" onClick={exportLearners} disabled={!filteredLearners.length}><ArrowDownToLine /> Xuất danh sách</Button> : <Button onClick={() => openEditor({ type: view === "problems" ? "problem" : "course" })}><Plus />{view === "problems" ? "Thêm bài tập" : "Thêm khóa học"}</Button>}</div></section>
        <div aria-live="polite">{notice && <div className="mg-notice"><CheckCircle2 />{notice}<button aria-label="Đóng thông báo" onClick={() => setNotice("")}><X /></button></div>}</div>
        {error && !editor && <div className="mg-error" role="alert">{error}<button onClick={() => setError("")} aria-label="Đóng lỗi"><X /></button></div>}
        {view === "overview" ? <>
          <div className="mg-stats">{[
            { label: "Tổng học viên", value: data.stats.learners, icon: Users, note: "Tài khoản đã đăng ký", tone: "blue", target: "learners" as View },
            { label: "Khóa học", value: data.stats.courses, icon: BookOpen, note: `${count(data.stats.problems)} bài tập trong thư viện`, tone: "cyan", target: "courses" as View },
            { label: "Đăng ký đang hiệu lực", value: data.operations.activeEnrollments, icon: GraduationCap, note: "Theo từng học viên · khóa học", tone: "violet", href: "/admin/enrollments" },
            { label: "Cần tư vấn", value: data.operations.pendingConsultations, icon: MessageSquare, note: "Yêu cầu mới chưa xử lý", tone: "amber", href: "/admin/academy" },
          ].map(stat => <article className="mg-stat" key={stat.label}><div><span className={`mg-stat-icon ${stat.tone}`}><stat.icon /></span><span className="mg-stat-label">{stat.label}</span>{stat.href ? <Link href={stat.href} aria-label={`Xem ${stat.label}`}><ArrowUpRight /></Link> : <button aria-label={`Xem ${stat.label}`} onClick={() => navigate(stat.target!)}><ArrowUpRight /></button>}</div><strong>{count(stat.value)}</strong><p>{stat.note}</p></article>)}</div>
          <div className="mg-overview-grid"><section className="mg-panel mg-activity-panel"><div className="mg-panel-heading"><div><h2>Nhịp học tập</h2><p>Số học viên hoạt động mỗi ngày</p></div><div className="mg-segment" aria-label="Khoảng thời gian">{[7, 14].map(value => <button key={value} aria-pressed={days === value} onClick={() => setDays(value)}>{value} ngày</button>)}</div></div><div className="mg-chart-summary"><strong>{activeDays}<small>/{days} ngày</small></strong><span>có hoạt động học tập</span><span className="mg-chart-key"><i /> Học viên</span></div><div className="mg-chart" role="img" aria-label={trend.map(item => `${shortDay(item.day)}: ${item.learners} học viên`).join("; ")}><div className="mg-chart-grid"><span>{peak}</span><span>{peak / 2}</span><span>0</span></div><div className="mg-bars">{trend.map((item, index) => <div className="mg-chart-column" key={item.day}><div className="mg-bar-space"><div className={`mg-bar ${index === trend.length - 1 ? "today" : ""}`} style={{ height: `${item.learners / peak * 100}%`, minHeight: item.learners ? 4 : 0 }} title={`${shortDay(item.day)}: ${item.learners} học viên`} /><span className="mg-bar-tooltip">{item.learners}</span></div><small>{index % (days === 14 ? 2 : 1) === 0 || index === trend.length - 1 ? shortDay(item.day) : ""}</small></div>)}</div></div>{activeDays === 0 && <p className="mg-chart-empty">Chưa có hoạt động trong khoảng thời gian này.</p>}<div className="mg-chart-foot"><span>Mỗi học viên được tính một lần mỗi ngày.</span><button onClick={() => navigate("activity")}>Xem bài nộp <ArrowRight /></button></div></section>
            <section className="mg-panel mg-result-panel"><div className="mg-panel-heading"><div><h2>Kết quả thực hành</h2><p>{data.submissions.length} bài nộp gần nhất</p></div><span className="mg-mini-icon"><CheckCircle2 /></span></div><div className="mg-donut" style={{ background: `conic-gradient(#0aabc5 ${acceptedRate}%, #edf2f7 0)` }} role="img" aria-label={data.submissions.length ? `${acceptedRate}% bài nộp đạt` : "Chưa có bài nộp"}><div><strong>{data.submissions.length ? `${acceptedRate}%` : "—"}</strong><span>Bài nộp đạt</span></div></div><div className="mg-result-legend"><div><i /><span>Đã đạt</span><strong>{data.stats.accepted}</strong></div><div><i /><span>Chưa đạt</span><strong>{data.submissions.length - data.stats.accepted}</strong></div></div><p className="mg-muted">{data.submissions.length ? "Tính theo bài nộp, không phải tỷ lệ hoàn thành khóa học." : "Kết quả sẽ xuất hiện khi học viên nộp bài."}</p></section>
          </div>
          <div className="mg-overview-grid"><section className="mg-panel"><div className="mg-panel-heading"><div><h2>Khóa học đang được theo dõi</h2><p>Sắp xếp theo số đăng ký đang hiệu lực</p></div><button className="mg-text-link" onClick={() => navigate("courses")}>Tất cả <ArrowRight /></button></div><Table><TableHeader><TableRow><TableHead>Khóa học</TableHead><TableHead>Trình độ</TableHead><TableHead>Học viên</TableHead><TableHead><span className="sr-only">Thao tác</span></TableHead></TableRow></TableHeader><TableBody>{popularCourses.length ? courseRows(popularCourses, true) : <EmptyRow columns={4} text="Chưa có khóa học. Thêm khóa học đầu tiên để bắt đầu." />}</TableBody></Table></section>
            <section className="mg-panel mg-operations"><div className="mg-panel-heading"><div><h2>Không gian vận hành</h2><p>Tiếp nối hành trình của học viên</p></div></div><Link href="/admin/academy"><span className="mg-operation-icon"><MessageSquare /></span><div><strong>Tư vấn lộ trình</strong><small>{data.operations.pendingConsultations ? `${data.operations.pendingConsultations} yêu cầu đang chờ` : "Chưa có yêu cầu mới"}</small></div><ArrowUpRight /></Link><Link href="/admin/enrollments"><span className="mg-operation-icon"><GraduationCap /></span><div><strong>Quản lý đăng ký</strong><small>Xem và cập nhật quyền học</small></div><ArrowUpRight /></Link><Link href="/admin/academy"><span className="mg-operation-icon"><BookOpen /></span><div><strong>Bài giảng & học liệu</strong><small>Biên soạn nội dung khóa học</small></div><ArrowUpRight /></Link><div className="mg-operation-note"><Code2 /><p>Mỗi khóa học là một khởi đầu.<br /><strong>Cùng học viên tiến bộ mỗi ngày.</strong></p></div></section></div>
        </> : <section className="mg-panel mg-list-panel"><div className="mg-list-toolbar"><div className="mg-search"><Search /><Input aria-label="Tìm kiếm danh sách" placeholder={view === "learners" ? "Tìm tên hoặc email học viên…" : view === "courses" ? "Tìm tên khóa học…" : "Tìm kiếm…"} value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />{query && <button aria-label="Xóa tìm kiếm" onClick={() => { setQuery(""); setPage(1); }}><X /></button>}</div><div className="mg-filter"><SlidersHorizontal /><Select value={filter} onValueChange={value => { setFilter(value ?? "all"); setPage(1); }}><SelectTrigger aria-label="Lọc danh sách"><SelectValue>{filter === "all" ? "Tất cả" : filters.find(([value]) => value === filter)?.[1]}</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem>{filters.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div><span className="mg-list-count">{count(total)} kết quả</span></div>
          {view === "courses" && <Table><TableHeader><TableRow><TableHead>Khóa học</TableHead><TableHead>Trình độ</TableHead><TableHead>Học viên đăng ký</TableHead><TableHead>Nội dung</TableHead><TableHead className="mg-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>{total ? courseRows(filteredCourses.slice(start, start + PAGE_SIZE)) : <EmptyRow columns={5} text={query || filter !== "all" ? "Không tìm thấy khóa học phù hợp." : "Chưa có khóa học. Hãy thêm khóa học đầu tiên."} />}</TableBody></Table>}
          {view === "learners" && <Table><TableHeader><TableRow><TableHead>Học viên</TableHead><TableHead>Khóa đang học</TableHead><TableHead>Cấp độ / XP</TableHead><TableHead>Hoạt động gần nhất</TableHead><TableHead className="mg-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>{total ? filteredLearners.slice(start, start + PAGE_SIZE).map(learner => <TableRow key={learner.id}><TableCell><div className="mg-person"><span>{learner.initials}</span><div><strong>{learner.name}</strong><small>{learner.email}</small></div></div></TableCell><TableCell>{learner.enrolledCourses ? <span className="mg-level">{learner.enrolledCourses} khóa</span> : <span className="mg-muted">Chưa đăng ký</span>}</TableCell><TableCell><strong>Lv. {learner.level}</strong><small className="mg-cell-sub">{count(learner.xp)} XP</small></TableCell><TableCell>{learner.lastActiveDay ? shortDay(learner.lastActiveDay) + "/" + learner.lastActiveDay.slice(0, 4) : <span className="mg-muted">Chưa có hoạt động</span>}</TableCell><TableCell className="mg-row-actions"><Button variant="ghost" size="sm" onClick={() => openEditor({ type: "learner", item: learner })}><Pencil /> Chỉnh sửa</Button></TableCell></TableRow>) : <EmptyRow columns={5} text={query || filter !== "all" ? "Không tìm thấy học viên phù hợp." : "Học viên sẽ xuất hiện sau khi đăng ký tài khoản."} />}</TableBody></Table>}
          {view === "problems" && <Table><TableHeader><TableRow><TableHead>Bài tập</TableHead><TableHead>Chủ đề</TableHead><TableHead>Độ khó</TableHead><TableHead>Tỷ lệ đúng</TableHead><TableHead className="mg-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>{total ? filteredProblems.slice(start, start + PAGE_SIZE).map(problem => <TableRow key={problem.id}><TableCell><div className="mg-problem"><span>#{problem.id}</span><strong>{problem.title}</strong></div></TableCell><TableCell>{problem.topic}</TableCell><TableCell><Badge variant={problem.difficulty === "Khó" ? "destructive" : "secondary"}>{problem.difficulty}</Badge></TableCell><TableCell>{problem.acceptance}</TableCell><TableCell className="mg-row-actions"><Button variant="ghost" size="icon-sm" aria-label={`Sửa ${problem.title}`} onClick={() => openEditor({ type: "problem", item: problem })}><Pencil /></Button><Button variant="ghost" size="icon-sm" disabled={saving} aria-label={`Xóa ${problem.title}`} onClick={() => remove("Problem", problem.id, problem.title)}><Trash2 /></Button></TableCell></TableRow>) : <EmptyRow columns={5} text="Chưa có bài tập phù hợp với bộ lọc." />}</TableBody></Table>}
          {view === "activity" && <Table><TableHeader><TableRow><TableHead>Học viên</TableHead><TableHead>Bài tập</TableHead><TableHead>Ngôn ngữ</TableHead><TableHead>Kết quả</TableHead><TableHead>Ngày nộp</TableHead></TableRow></TableHeader><TableBody>{total ? filteredSubmissions.slice(start, start + PAGE_SIZE).map(submission => <TableRow key={submission.id}><TableCell className="mg-strong">{submission.learnerName}</TableCell><TableCell>{submission.problemTitle}</TableCell><TableCell><span className="mg-code-label">{submission.language}</span></TableCell><TableCell><span className={`mg-outcome ${submission.accepted ? "passed" : ""}`}>{submission.accepted ? <Check /> : <X />}{submission.accepted ? "Đã đạt" : "Chưa đạt"}</span></TableCell><TableCell>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(submission.createdAt))}</TableCell></TableRow>) : <EmptyRow columns={5} text="Chưa có bài nộp phù hợp với bộ lọc." />}</TableBody></Table>}
          <div className="mg-pagination"><span>{total ? `${start + 1}–${Math.min(start + PAGE_SIZE, total)} trong ${count(total)} kết quả` : "0 kết quả"}</span><div><Button variant="outline" size="icon-sm" aria-label="Trang trước" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button><span>Trang {currentPage} / {maxPage}</span><Button variant="outline" size="icon-sm" aria-label="Trang sau" disabled={currentPage >= maxPage} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button></div></div>
        </section>}
        <footer className="mg-footer"><span>DolphinX Education <span> / </span> Không gian quản trị</span><span>Cập nhật {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(data.generatedAt))}</span></footer>
      </div>
    </main>
    <Dialog open={Boolean(editor)} onOpenChange={open => { if (!open && !saving) { setEditor(null); setError(""); } }}><DialogContent className="mg-dialog"><DialogHeader><DialogTitle>{editor?.type === "course" ? `${editor.item ? "Chỉnh sửa" : "Thêm"} khóa học` : editor?.type === "problem" ? `${editor.item ? "Chỉnh sửa" : "Thêm"} bài tập` : "Chỉnh sửa học viên"}</DialogTitle><DialogDescription>Kiểm tra thông tin trước khi lưu. Thay đổi sẽ được áp dụng trên hệ thống.</DialogDescription></DialogHeader>{editor && <form onSubmit={event => { event.preventDefault(); submitEditor(new FormData(event.currentTarget)); }} className="admin-editor-form"><fieldset disabled={saving} className="mg-editor-fields">{editor.type === "course" ? <CourseFields course={editor.item} /> : editor.type === "problem" ? <ProblemFields problem={editor.item} /> : <LearnerFields learner={editor.item} />}</fieldset>{error && <p className="admin-form-error" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" disabled={saving} onClick={() => setEditor(null)}>Hủy</Button><Button type="submit" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Check />}Lưu thay đổi</Button></DialogFooter></form>}</DialogContent></Dialog>
  </div>;
}
function EmptyRow({ columns, text }: { columns: number; text: string }) { return <TableRow><TableCell colSpan={columns}><div className="mg-empty"><Search /><strong>{text}</strong><span>Thử thay đổi bộ lọc hoặc làm mới dữ liệu.</span></div></TableCell></TableRow>; }
function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string | number; type?: string; required?: boolean }) {
  return <div className="grid gap-2"><Label htmlFor={`admin-${name}`}>{label}</Label><Input id={`admin-${name}`} name={name} defaultValue={defaultValue} type={type} min={type === "number" ? (name === "level" ? 1 : 0) : undefined} required={required} /></div>;
}


function ProblemFields({ problem }: { problem?: Problem }) {
  return <><div className="admin-form-grid"><Field label="Tên bài tập" name="title" defaultValue={problem?.title} required /><Field label="Chủ đề" name="topic" defaultValue={problem?.topic ?? "Mảng"} /><div className="grid gap-2"><Label htmlFor="admin-difficulty">Độ khó</Label><Select name="difficulty" defaultValue={problem?.difficulty ?? "Dễ"}><SelectTrigger id="admin-difficulty"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Dễ">Dễ</SelectItem><SelectItem value="Trung bình">Trung bình</SelectItem><SelectItem value="Khó">Khó</SelectItem></SelectContent></Select></div><Field label="Tỉ lệ đúng" name="acceptance" defaultValue={problem?.acceptance ?? "0%"} /></div><div className="grid gap-2"><Label htmlFor="admin-statement">Đề bài</Label><Textarea id="admin-statement" name="statement" rows={4} defaultValue={problem?.statement} /></div><div className="admin-form-grid"><Field label="Đầu vào mẫu" name="exampleInput" defaultValue={problem?.exampleInput} /><Field label="Đầu ra mẫu" name="exampleOutput" defaultValue={problem?.exampleOutput} /></div><Field label="Giải thích" name="explanation" defaultValue={problem?.explanation} /><div className="grid gap-2"><Label htmlFor="admin-constraints">Ràng buộc (mỗi dòng một mục)</Label><Textarea id="admin-constraints" name="constraints" defaultValue={problem?.constraints.join("\n")} /></div><div className="grid gap-2"><Label htmlFor="admin-starterCode">Code khởi tạo</Label><Textarea id="admin-starterCode" name="starterCode" className="admin-code-input" rows={8} defaultValue={problem?.starterCode ?? "function solve(input) {\n  return input;\n}"} /></div></>;
}

function LearnerFields({ learner }: { learner: AdminData["learners"][number] }) {
  return <div className="admin-form-grid"><Field label="Tên học viên" name="name" defaultValue={learner.name} required /><Field label="Cấp độ" name="level" type="number" defaultValue={learner.level} /><Field label="Điểm XP" name="xp" type="number" defaultValue={learner.xp} /><p>Chuỗi học: {learner.streak} ngày · Tự động tính từ hoạt động thực tế.</p></div>;
}
