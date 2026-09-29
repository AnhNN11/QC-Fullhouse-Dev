"use client";

import Image from "next/image";
import Link from "next/link";
import Brand from "./brand";
import { useState } from "react";
import "./workshop.css";

const courses = [
  { id: "01", name: "Làm quen với Python", tag: "BẮT ĐẦU TỪ SỐ 0", text: "Từ câu lệnh đầu tiên đến một trò chơi do chính bạn viết.", type: "python", color: "yellow" },
  { id: "02", name: "Tự tay làm website", tag: "HTML · CSS · JAVASCRIPT", text: "Biến một trang trắng thành góc nhỏ của bạn trên internet.", type: "web", color: "pink" },
  { id: "03", name: "Tư duy giải bài toán", tag: "THUẬT TOÁN NHẬP MÔN", text: "Chia nhỏ vấn đề, tìm quy luật và thử những cách giải mới.", type: "logic", color: "mint" },
];
const navigation = [["#features", "Cách học"], ["#courses", "Khóa học"], ["#playground", "Thử viết code"]];

function Arrow() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>; }

function CourseArt({ type }: { type: string }) {
  return <svg className="workshop-course-art" viewBox="0 0 340 200" aria-hidden="true">
    {type === "python" ? <>
      <path d="M115 58h84a29 29 0 0 1 29 29v19h-93a20 20 0 0 0-20 20v23H91a27 27 0 0 1-27-27v-8a27 27 0 0 1 27-27h24Z" fill="#075FC2" stroke="#071C4B" strokeWidth="3"/>
      <path d="M115 58h84a29 29 0 0 1 29 29v19h-93a20 20 0 0 0-20 20v23H91a27 27 0 0 1-27-27v-8a27 27 0 0 1 27-27h24Z" fill="#FFFFFF" stroke="#071C4B" strokeWidth="3" transform="rotate(180 170 105)"/>
      <circle cx="135" cy="75" r="5" fill="#FFFFFF"/><circle cx="205" cy="135" r="5" fill="#071C4B"/>
      <path d="m284 40 4 12 12 4-12 5-4 12-5-12-12-5 12-4Z" fill="#17BAD7"/><text x="26" y="179" fill="#071C4B" fontSize="17" transform="rotate(-8 26 179)">hello, world!</text>
    </> : type === "web" ? <>
      <rect x="66" y="36" width="216" height="142" rx="8" fill="#071C4B" transform="rotate(5 174 107)"/><rect x="56" y="26" width="216" height="142" rx="8" fill="#FFFFFF" stroke="#071C4B" strokeWidth="3" transform="rotate(-5 164 97)"/>
      <path d="M61 61h207" stroke="#071C4B" strokeWidth="3"/><circle cx="75" cy="46" r="4" fill="#17BAD7"/><circle cx="89" cy="46" r="4" fill="#A5E8F7"/>
      <rect x="77" y="82" width="76" height="64" rx="3" fill="#BFEFFF"/><path d="m91 125 15-22 17 16 14-10" stroke="#071C4B" strokeWidth="3"/><path d="M172 89h71m-71 17h54m-54 17h64" stroke="#071C4B" strokeWidth="6"/>
      <path d="m256 128 3 47 13-13 16-1Z" fill="#075FC2" stroke="#071C4B" strokeWidth="3"/>
    </> : <>
      <path d="M99 69h144M99 69v74h69m75-74v74h-75" stroke="#071C4B" strokeWidth="3" strokeDasharray="6 5"/>
      <rect x="68" y="35" width="63" height="63" rx="13" fill="#A5E8F7" stroke="#071C4B" strokeWidth="3" transform="rotate(-10 99 66)"/>
      <circle cx="243" cy="69" r="34" fill="#D5E8FC" stroke="#071C4B" strokeWidth="3"/><path d="m151 115 45 8-8 45-45-8Z" fill="#075FC2" stroke="#071C4B" strokeWidth="3"/>
      <text x="88" y="76" fontSize="25" fill="#071C4B">1</text><text x="234" y="78" fontSize="25" fill="#071C4B">2</text><text x="160" y="152" fontSize="25" fill="#fff">3</text>
      <path d="m289 139 8 10 17-26" stroke="#071C4B" strokeWidth="5"/>
    </>}
  </svg>;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("bạn");
  const [output, setOutput] = useState<string | null>(null);
  return <div className="workshop">
    <header className="ws-header">
      <Brand/>
      <nav className="ws-desktop-nav" aria-label="Điều hướng chính">{navigation.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="ws-nav-actions"><Link href="/dashboard" className="ws-enter">Vào học <Arrow/></Link><button className="ws-menu" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} aria-controls="ws-mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button></div>
      {menuOpen && <nav id="ws-mobile-nav" className="ws-mobile-nav" aria-label="Điều hướng mobile">{navigation.map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<Arrow/></a>)}</nav>}
    </header>
    <main>
      <section className="ws-hero">
        <div className="ws-hero-copy"><span className="ws-kicker"><i/> DÀNH CHO NHỮNG BỘ ÓC TÒ MÒ</span><h1>Ý tưởng nhỏ.<br/>Dòng code đầu.<br/><span>Khả năng lớn.</span></h1><p>Một nơi để học, thử, sai và làm lại.<br/>Cùng biến “mình không biết code” thành<br className="desktop-break"/> “nhìn này, mình làm được rồi!”</p><div className="ws-hero-actions"><Link className="ws-button" href="/dashboard">Khám phá khóa học <Arrow/></Link><a className="ws-text-link" href="#playground">Thử một dòng code ↗</a></div><div className="ws-hero-note"><span>✳</span> Tiếng Việt dễ hiểu. Bắt đầu miễn phí.</div></div>
        <div className="ws-hero-art ws-creative-studio">
          <div className="ws-studio-heading"><span className="sticker-code">&lt;hello /&gt;</span><span>XƯỞNG SÁNG TẠO CỦA BẠN</span></div>
          <Image className="ws-studio-image" src="/brand/coding-workshop-hero-v1.png" alt="Minh họa xưởng lập trình: cửa sổ code kết nối với khối thuật toán, trang web và trò chơi." width={1536} height={1024} sizes="(max-width: 800px) 90vw, 560px" priority/>
          <div className="ws-studio-steps"><span><b>01</b> Học một chút</span><span><b>02</b> Thử một ý tưởng</span><span><b>03</b> Tạo điều hay</span></div>
          <div className="ws-terminal"><div><span/><span/><span/><small>my-first-idea.js</small></div><code><span>const</span> future = <b>you.create();</b><br/><em>{"// bắt đầu từ hôm nay ✨"}</em></code></div>
        </div>
      </section>
      <div className="ws-ticker" aria-label="Học qua thực hành"><span>THỬ MỘT Ý TƯỞNG</span><b>✳</b><span>VIẾT MỘT DÒNG CODE</span><b>✳</b><span>TẠO MỘT ĐIỀU HAY</span><b>✳</b><span>LẶP LẠI!</span><b>↻</b></div>
      <section className="ws-courses ws-section" id="courses"><div className="ws-section-heading"><div><span className="ws-kicker">01 / CHỌN CỬA VÀO CỦA BẠN</span><h2>Hôm nay, bạn muốn<br/>tạo ra điều gì?</h2></div><p>Không cần biết trước mọi thứ.<br/>Chỉ cần chọn thứ khiến bạn tò mò.</p></div><div className="ws-course-grid">{courses.map(course => <Link href="/dashboard" className={`ws-course ${course.color}`} key={course.id}><div className="ws-course-top"><span>#{course.id}</span><span>↗</span></div><CourseArt type={course.type}/><div className="ws-course-content"><span className="ws-kicker">{course.tag}</span><h3>{course.name}</h3><p>{course.text}</p><span className="ws-course-link">Khám phá khóa học <Arrow/></span></div></Link>)}</div><p className="ws-course-footnote">Python, Web, SQL, thuật toán… <Link href="/dashboard">Còn nhiều điều để khám phá <span>↗</span></Link></p></section>
      <section className="ws-playground" id="playground"><div className="ws-play-copy"><span className="ws-kicker">02 / CHẠM TAY VÀO CODE</span><h2>Đọc thì hiểu.<br/><span>Thử mới nhớ.</span></h2><p>Không tải phần mềm, không cài đặt phức tạp. Thay tên của bạn, bấm chạy và xem dòng code gửi lời chào.</p><span className="ws-hand-note">Thử đi, không làm hỏng gì đâu! ↘</span></div><div className="ws-live-editor"><div className="ws-editor-top"><span><i/><i/><i/></span><span>hello.js</span><small>JAVASCRIPT</small></div><div className="ws-editor-code"><label htmlFor="learner-name">01 <span>const</span> name = <b>&quot;</b><input id="learner-name" aria-label="Tên của bạn" value={name} maxLength={24} onChange={e => { setName(e.target.value); setOutput(null); }}/><b>&quot;;</b></label><div><em>02</em> <span>console</span>.log(<b>&quot;Xin chào, &quot;</b> + name + <b>&quot;!&quot;</b>);</div><div className="ws-code-comment"><em>03</em>{" // một lời chào, một khởi đầu mới"}</div></div><div className="ws-run-row"><span>↳ Kết quả</span><button onClick={() => setOutput(`Xin chào, ${name}!`)}>Chạy code <span>▶</span></button></div><div className={`ws-output ${output ? "has-output" : ""}`} aria-live="polite">{output ? <><span>✓</span><div><strong>{output}</strong><small>Bạn vừa chạy dòng code đầu tiên. Làm thêm một bài nhé?</small><Link href="/dashboard">Vào phòng luyện code <Arrow/></Link></div></> : <p>Kết quả của bạn sẽ xuất hiện ở đây<span className="ws-cursor">▍</span></p>}</div></div></section>
      <section className="ws-learning ws-section" id="features"><div className="ws-section-heading"><div><span className="ws-kicker">03 / HỌC THEO CÁCH CỦA BẠN</span><h2>Chậm cũng được.<br/><span>Miễn là bắt đầu.</span></h2></div><div className="ws-seal">CỨ THỬ ĐI!<span>✳</span>BẠN LÀM ĐƯỢC</div></div><div className="ws-learning-grid"><article><div className="ws-steps-art" aria-hidden="true"><span>01</span><i/><span>02</span><i/><span>03</span><b>↗</b></div><h3>Từng bước, vừa sức.</h3><p>Từ biến và vòng lặp đến dự án đầu tiên. Luôn biết mình đang ở đâu và nên học gì tiếp.</p></article><article><div className="ws-error-art" aria-hidden="true"><span>bug found 🐛</span><b>Đã hiểu thêm một chút!</b><i>✓</i></div><h3>Sai là một phần của học.</h3><p>Thử một lời giải, đọc kết quả rồi thử lại. Mỗi lỗi là một cơ hội để hiểu sâu hơn.</p></article><article><div className="ws-project-art" aria-hidden="true"><span>my-website.html</span><b>MADE<br/>BY ME <i>★</i></b></div><h3>Có thứ để tự hào.</h3><p>Một trò chơi nhỏ, website cá nhân hay bài toán khó. Học để làm ra thứ của riêng mình.</p></article></div></section>
      <section className="ws-finish"><div className="ws-finish-mark"><Image src="/brand/dolphinx-studio-official-mark.webp" alt="" width={144} height={144}/></div><div><span className="ws-kicker">KHÔNG CẦN HOÀN HẢO ĐỂ BẮT ĐẦU</span><h2>“Một ngày nào đó”<br/>hay <span>ngày đầu tiên?</span></h2><Link href="/dashboard" className="ws-button">Chọn ngày đầu tiên <Arrow/></Link><p>Miễn phí để khám phá. Tò mò là đủ.</p></div><span className="ws-finish-star" aria-hidden="true">✳</span></section>
    </main>
    <footer className="ws-footer"><Brand/><p>Một chút tò mò. Rất nhiều khả năng.</p><a href="#courses">Khóa học ↗</a><span>© 2026 DolphinX</span></footer>
  </div>;
}
