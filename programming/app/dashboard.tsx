"use client";

import { ArrowUpRight, BookOpen, Code2, Compass, Flame, GraduationCap, Play, Sparkles, Target, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import "./student-dashboard.css";
import CourseCover from "@/app/course-cover";
import PracticeWorkspace from "./practice-workspace";
import "./dashboard-updates.css";
import { useLearningContext } from "./learning-context";
import AuthDialog from "./auth-dialog";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/user-auth";
import { useMemo, useRef, useState } from "react";
import { dashboardCourseHref, dashboardCourseLabel, isCourseInProgress } from "@/lib/dashboard-courses";
import type { Course, DashboardData, Problem } from "@/lib/types";

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5M9 20v-6h6v6"/></>,
    library: <><rect x="4" y="4" width="5" height="16" rx="1"/><rect x="10.5" y="4" width="4.5" height="16" rx="1"/><path d="m16.5 5 3-1 2.5 14.5-3 1z"/></>,
    code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    map: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h4a3 3 0 0 1 3 3v6M9 18H6a3 3 0 0 1-3-3v-3"/></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0zM10 14h4v3h3v3H7v-3h3z"/><path d="M8 6H4v2a3 3 0 0 0 4 3M16 6h4v2a3 3 0 0 1-4 3"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    fire: <path d="M13 3s1 4-2 6c-2-3-5-2-5-2s-3 5-1 10c2 5 10 5 13 1 4-6-2-11-2-11s0 4-3 5c1-5 0-9 0-9Z"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    close: <path d="M6 6l12 12M18 6 6 18"/>,
    play: <path d="m8 5 11 7-11 7z"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function Dashboard({ initialData, initialUser }: { initialData: DashboardData; initialUser: SessionUser | null }) {
  const router = useRouter();
  const courseStrip = useRef<HTMLDivElement>(null);
  function scrollCourses(direction: number) { const element = courseStrip.current; if (element) element.scrollBy({ left: direction * element.clientWidth * .85, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
  const [data, setData] = useState(initialData);
  const [previousData, setPreviousData] = useState(initialData);
  if (previousData !== initialData) { setPreviousData(initialData); setData(initialData); }
  const learning = useLearningContext();
  const user = learning ? learning.user : initialUser;
  const query = learning?.query ?? '';
  const setQuery = learning?.setQuery ?? (() => {});
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<{problem:Problem}|null>(null);
  const [selectedProblem,setSelectedProblem] = useState<Problem|null>(null);
  const [code,setCode] = useState("");
  const [grading,setGrading] = useState(false);
  const [gradeMessage,setGradeMessage] = useState("");
  async function submitCode(mode: 'run' | 'submit') {
    if (!selectedProblem || grading) return;
    setGrading(true); setGradeMessage('Đang chạy test…');
    try {
      const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ problemId: selectedProblem.id, language: 'javascript', code, mode }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setGradeMessage(`${mode === 'run' ? 'Test mẫu (không ghi tiến độ)' : 'Bài nộp'}: ${result.passed}/${result.total} · ${result.runtimeMs} ms. ${result.message}`);
      if (mode === 'submit') { const fresh = await fetch('/api/dashboard'); if (fresh.ok) setData(await fresh.json()); }
    } catch (error) { setGradeMessage(error instanceof Error ? error.message : 'Không kết nối được máy chấm.'); }
    finally { setGrading(false); }
  }
  const [problemQuery,setProblemQuery] = useState("");
  const [activeTopic,setActiveTopic] = useState("Tất cả");
  const [difficulty,setDifficulty] = useState("Tất cả độ khó");
  const [visibleCount,setVisibleCount] = useState(8);
  const [accountError,setAccountError] = useState("");
  const { learner,courses,problems,topics } = data;
  const normalize = (value:string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").toLowerCase().trim();
  const filteredCourses = courses.filter(course=>normalize(course.title+" "+course.description).includes(normalize(query)));
  const filteredProblems = useMemo(()=>problems.filter(problem=>
    (activeTopic==="Tất cả"||problem.topic===activeTopic) &&
    (difficulty==="Tất cả độ khó"||problem.difficulty===difficulty) &&
    normalize(problem.title+" "+problem.topic).includes(normalize(query)) &&
    normalize(problem.title+" "+problem.topic).includes(normalize(problemQuery))
  ),[problems,activeTopic,difficulty,query,problemQuery]);
  const continueCourse = user ? courses.find(isCourseInProgress) : undefined;
  const calendarDate = new Date(data.today+"T00:00:00Z");
  const year=calendarDate.getUTCFullYear(), month=calendarDate.getUTCMonth();
  const monthDays=new Date(Date.UTC(year,month+1,0)).getUTCDate();
  const offset=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7;
  const weekDays=data.weeklyActivity.reduce((sum,day)=>sum+day,0);
  const openProblem=(problem:Problem)=>{
    if(!user){setPendingTarget({problem});setAuthOpen(true);return;}
    setSelectedProblem(problem);setCode(problem.starterCode.replaceAll('\\n', '\n'));setGradeMessage('');
  };
  const openCourse=(course:Course)=>{

    router.push(dashboardCourseHref(course, Boolean(user)));
  };
  const signedIn=async(account:SessionUser)=>{
    learning?.setUser(account);setAccountError("");
    try {const response=await fetch("/api/dashboard");if(!response.ok)throw new Error();setData(await response.json());}
    catch {setAccountError("Chưa tải được tiến độ. Tải lại trang để đồng bộ.");}

    if(pendingTarget?.problem){setSelectedProblem(pendingTarget.problem);setCode(pendingTarget.problem.starterCode.replaceAll("\\n", "\n"));setGradeMessage("");}
    setPendingTarget(null);
  };
  return <>
    <AuthDialog open={authOpen} onOpenChange={open=>{setAuthOpen(open);if(!open)setPendingTarget(null);}} onSuccess={signedIn}/>
      <main className="dashboard" id="dashboard-top"><div className="main-column">
        {accountError&&<p role="alert" className="dx-dashboard-notice">{accountError}</p>}
        <section className="sd-hero">
          <div className="sd-hero-copy"><span className="sd-eyebrow"><span/> KHÔNG GIAN HỌC LẬP TRÌNH</span><h1>{user ? <>Chào {learner.name},<br/><em>học thêm một điều mới.</em></> : <>Bắt đầu từ tò mò.<br/><em>Tiến xa bằng thực hành.</em></>}</h1><p>{user ? "Mỗi bài học là một bước tiến. Tiếp tục hành trình theo nhịp của riêng bạn." : "Khám phá khóa học, luyện bài tập và xây dựng kỹ năng cùng DolphinX."}</p><div className="sd-hero-actions">{<button onClick={()=>continueCourse ? openCourse(continueCourse) : router.push("/courses")}><Play size={15}/>{continueCourse ? "Tiếp tục học" : "Khám phá khóa học"}<ArrowUpRight size={16}/></button>}<a href="#practice">Thử sức với bài tập <Code2 size={16}/></a></div><span className="sd-hero-caption">{user && continueCourse ? continueCourse.title : "Học nền tảng · Làm dự án · Phát triển tư duy"}</span></div>
          <div className="sd-code-art" aria-hidden="true"><div className="sd-code-window"><div className="sd-window-bar"><span/><span/><span/><small>your-first-step.js</small><Code2 size={16}/></div><div className="sd-code-lines"><p><b>01</b><i>const</i> journey = &#123;</p><p><b>02</b>  curiosity: <em>true</em>,</p><p><b>03</b>  practice: <em>&quot;every day&quot;</em>,</p><p><b>04</b>  possibilities: <em>Infinity</em></p><p><b>05</b>&#125;;</p><p><b>06</b><span>buildYourFuture</span>(journey);</p></div><div className="sd-code-result"><span>✓</span> Sẵn sàng cho bước đầu tiên.</div></div><div className="sd-art-tag"><Sparkles size={15}/> A little progress, every day.</div></div>
        </section>
        <section className="sd-stats" aria-label={user ? "Tiến độ học tập" : "Khám phá DolphinX"}>{(user ? [{icon:BookOpen,value:courses.filter(isCourseInProgress).length,label:"Khóa đang học",tone:"blue"},{icon:Target,value:data.solvedCount,label:"Bài tập đã giải",tone:"cyan"},{icon:Flame,value:learner.streak,label:"Ngày học liên tiếp",tone:"amber"}] : [{icon:BookOpen,value:courses.length,label:"Khóa học để khám phá",tone:"blue"},{icon:Code2,value:problems.length,label:"Bài tập thực hành",tone:"cyan"},{icon:Compass,value:Math.max(0,topics.length-1),label:"Chủ đề lập trình",tone:"violet"}]).map(item=><div className="sd-stat" key={item.label}><span className={item.tone}><item.icon size={21}/></span><div><strong>{item.value}</strong><p>{item.label}</p></div></div>)}</section>
        {query&&<p role="status" className="dx-search-results">{filteredCourses.length} khóa học · {filteredProblems.length} bài tập phù hợp <button onClick={()=>{setQuery("");setProblemQuery("");setActiveTopic("Tất cả");setDifficulty("Tất cả độ khó");}}>Xóa bộ lọc</button></p>}
        <section className="course-section"><div className="section-title"><div><h2>Chọn hành trình của bạn</h2><p>Chọn nền tảng phù hợp và học từng bước.</p></div><div className="course-strip-actions"><button onClick={()=>router.push("/courses")}>Tất cả khóa học →</button><button aria-label="Khóa học trước" onClick={()=>scrollCourses(-1)}>‹</button><button aria-label="Khóa học tiếp theo" onClick={()=>scrollCourses(1)}>›</button></div></div>
          <div className="course-scroller" ref={courseStrip} aria-label="Khóa học nổi bật" tabIndex={0}>{filteredCourses.map(course=><button className={`course-card ${course.color}`} onClick={()=>openCourse(course)} key={course.id}><CourseCover course={course}/><div className="course-body"><div className="course-badges"><span>{course.level}</span><span>{course.modules.length} chương</span></div><h3>{course.title}</h3><p>{course.description}</p>{user&&course.enrolled&&course.progress>0&&<div className="sd-progress" role="progressbar" aria-label={`Tiến độ ${course.title}`} aria-valuenow={course.progress} aria-valuemin={0} aria-valuemax={100}><i style={{width:`${Math.min(100,Math.max(0,course.progress))}%`}}/></div>}<div className="course-footer"><span>{user&&course.enrolled&&course.progress>0?`Tiến độ: ${course.progress}%`:`${course.lessons} bài học`}</span><b>{dashboardCourseLabel(course, Boolean(user))} <Icon name="chevron"/></b></div></div></button>)}</div>
          {!filteredCourses.length&&<p className="empty-state">Không có khóa học phù hợp. Thử từ khóa khác.</p>}
        </section>
        <section className="practice-section" id="practice"><div className="section-title"><div><h2>Kho bài tập</h2><p>Đọc đề, suy nghĩ và tự soạn lời giải.</p></div><span>{data.solvedCount}/{data.totalProblems} đã giải · {filteredProblems.length} bài phù hợp</span></div>
          <details className="grading-explainer"><summary>ⓘ Cách chấm bài & tính XP</summary><p>Chấm JavaScript cho bài đã có bộ test được duyệt. Chạy mẫu không cộng XP; nộp đúng lần đầu nhận 30 XP. Bài chưa được duyệt vẫn ở chế độ tự luyện.</p></details>
          <div className="topic-scroll">{topics.map(topic=><button aria-pressed={activeTopic===topic} className={activeTopic===topic?"active":""} onClick={()=>{setActiveTopic(topic);setVisibleCount(8);}} key={topic}>{topic}<small>{topic === "Tất cả" ? problems.length : problems.filter(item=>item.topic===topic).length}</small></button>)}</div>
          <div className="problem-toolbar"><label><Icon name="search"/><input aria-label="Tìm bài tập" value={problemQuery} onChange={event=>{setProblemQuery(event.target.value);setVisibleCount(8);}} placeholder="Tìm bài tập..."/></label><select value={difficulty} onChange={event=>{setDifficulty(event.target.value);setVisibleCount(8);}} aria-label="Lọc độ khó"><option>Tất cả độ khó</option><option>Dễ</option><option>Trung bình</option><option>Khó</option></select><button className="random-button" disabled={!filteredProblems.length} onClick={()=>openProblem(filteredProblems[Math.floor(Math.random()*filteredProblems.length)])}>⤨ Bài ngẫu nhiên</button></div>
          <div className="problem-table"><div className="problem-head"><span>BÀI</span><span>TÊN BÀI</span><span>CHỦ ĐỀ</span><span>CHẾ ĐỘ</span><span>ĐỘ KHÓ</span></div>{filteredProblems.slice(0,visibleCount).map(problem=><button className="problem-row" onClick={()=>openProblem(problem)} key={problem.id}><span className={`status-dot ${problem.status}`}>{problem.status === "done" ? "✓" : "○"}</span><span className="problem-name"><b>{problem.id}. {problem.title}</b></span><span className="topic-tag">{problem.topic}</span><span className="acceptance">{problem.gradingEnabled ? "Chấm tự động" : "Tự luyện"}</span><span className={`difficulty ${problem.difficulty==="Dễ"?"easy":problem.difficulty==="Khó"?"hard":"medium"}`}>{problem.difficulty}</span></button>)}</div>
          {!filteredProblems.length&&<p className="empty-state">Không tìm thấy bài tập phù hợp.</p>}
          {filteredProblems.length>visibleCount&&<button className="load-more" onClick={()=>setVisibleCount(count=>count+8)}>Xem thêm bài tập ↓</button>}
        </section>
      </div>
      <aside className="right-rail">{user?<><section className="rail-card calendar-card"><div className="rail-title"><div><span className="calendar-icon">▣</span><div><h3>Ngày học của bạn</h3><p>Tháng {month+1}, {year} · Giờ Việt Nam</p></div></div></div><div className="calendar-days">{["T2","T3","T4","T5","T6","T7","CN"].map(day=><span key={day}>{day}</span>)}</div><div className="calendar-grid">{Array.from({length:offset},(_,i)=><span aria-hidden="true" key={`blank-${i}`}/>)}{Array.from({length:monthDays},(_,i)=><span key={i} aria-label={`Ngày ${i+1}${data.learningDays.includes(i+1)?", có hoạt động":""}`} aria-current={i+1===calendarDate.getUTCDate()?"date":undefined} className={`${data.learningDays.includes(i+1)?"learned":""} ${i+1===calendarDate.getUTCDate()?"today":""}`}>{i+1}</span>)}</div><div className="streak-total"><span>🔥</span><div><strong>{learner.streak} ngày liên tiếp</strong><small>Kỷ lục: {learner.bestStreak} ngày</small></div></div><p className="dx-rail-note">Ghi nhận ngày cập nhật tiến độ khóa học hoặc chủ đề roadmap, kể từ khi bật tính năng.</p></section>
        <section className="rail-card progress-card"><h3>Hoạt động tuần này</h3><div className="weekly-chart"><div className="chart-bars">{data.weeklyActivity.map((value,i)=><span key={i} aria-label={`${["Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy","Chủ nhật"][i]}: ${value?"có hoạt động":"chưa có hoạt động"}`}><i style={{height:value?"60px":"0px"}}/>{["T2","T3","T4","T5","T6","T7","CN"][i]}</span>)}</div></div><p className="dx-rail-note">{weekDays}/7 ngày có hoạt động học</p></section></>:<section className="rail-card dx-guest-card"><span className="sd-rail-icon"><GraduationCap size={24}/></span><span className="sd-eyebrow">HỌC THEO NHỊP CỦA BẠN</span><h3>Không gian riêng của bạn</h3><p>Đăng nhập để lưu tiến độ khóa học, kết quả bài tập và theo dõi ngày học.</p><button className="dx-account-button" onClick={()=>setAuthOpen(true)}>Đăng nhập / Đăng ký</button></section>}
        <section className="rail-card sd-mentor"><span className="sd-rail-icon"><UsersIcon/></span><span className="sd-eyebrow">ĐỒNG HÀNH CÙNG MENTOR</span><h3>Gỡ rối cùng người hướng dẫn.</h3><p>Trao đổi mục tiêu và tìm khóa học phù hợp với bạn.</p><div className="sd-mentor-tags"><span>Online 1–1</span><span>Lịch học linh hoạt</span></div><Link href="/consultation">Tìm hiểu & đăng ký tư vấn <ArrowUpRight size={15}/></Link></section>
      </aside></main>
    {selectedProblem && <PracticeWorkspace key={selectedProblem.id} problem={selectedProblem} code={code} onCode={setCode} grading={grading} message={gradeMessage} onSubmit={submitCode} onClose={()=>setSelectedProblem(null)}/>}
  </>;
}
