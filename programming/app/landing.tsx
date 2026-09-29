import Image from "next/image";
import Link from "next/link";

const courses = [
  { icon: "Py", tone: "sun", level: "Cho người mới", lessons: "48 bài học", title: "Python từ số 0", description: "Học cú pháp, tư duy và hoàn thành dự án đầu tiên của bạn." },
  { icon: "</>", tone: "coral", level: "Phổ biến", lessons: "56 bài học", title: "Web Frontend", description: "Tự tay xây website hiện đại với HTML, CSS, JavaScript và React." },
  { icon: "⌁", tone: "violet", level: "Nền tảng", lessons: "40 bài học", title: "Thuật toán nhập môn", description: "Hiểu cách giải quyết vấn đề qua những ví dụ trực quan, gần gũi." },
];

const benefits = [
  { number: "01", icon: "✦", title: "Học theo lộ trình", description: "Bài học được sắp xếp vừa sức, có mục tiêu rõ ràng và không khiến bạn bị ngợp." },
  { number: "02", icon: "{ }", title: "Code ngay trên web", description: "Đọc đề, viết code và xem kết quả trong cùng một màn hình — không cần cài đặt." },
  { number: "03", icon: "↗", title: "Tiến bộ mỗi ngày", description: "Theo dõi chuỗi học, XP và kỹ năng đã mở khóa để luôn có động lực đi tiếp." },
];

const logos = ["Python", "JavaScript", "React", "C++", "SQL"];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Check() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function LandingPage() {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="Điều hướng trang giới thiệu">
        <Link className="landing-brand" href="/">
          <Image src="/dolphinx-logo.png" alt="DolphinX" width={148} height={56} priority />
          <span>Programming</span>
        </Link>
        <div className="landing-links">
          <a href="#features">Tính năng</a>
          <a href="#courses">Khóa học</a>
          <a href="#roadmap">Lộ trình</a>
          <a href="#community">Cộng đồng</a>
        </div>
        <div className="landing-actions">
          <Link className="nav-login" href="/dashboard">Đăng nhập</Link>
          <Link className="nav-start" href="/dashboard">Học miễn phí <Arrow /></Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <span className="eyebrow"><i /> NỀN TẢNG HỌC LẬP TRÌNH TIẾNG VIỆT</span>
          <h1>Biến ý tưởng thành<br/><span>dòng code đầu tiên.</span></h1>
          <p>Học lập trình dễ hiểu, luyện tập trực tiếp và xây dự án thực tế — tất cả trong một không gian dành riêng cho người Việt.</p>
          <div className="hero-actions">
            <Link className="primary-cta" href="/dashboard">Bắt đầu học miễn phí <Arrow /></Link>
            <a className="secondary-cta" href="#how-it-works"><span>▶</span> Xem cách hoạt động</a>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars"><span>AN</span><span>MH</span><span>KL</span><span>+12K</span></div>
            <div><strong>4.9/5 <b>★★★★★</b></strong><small>Từ hơn 12.000 học viên</small></div>
          </div>
        </div>

        <div className="hero-demo" aria-label="Minh họa trình luyện code">
          <div className="demo-top"><div><i /><i /><i /></div><span>two_sum.js</span><b>JavaScript⌄</b></div>
          <div className="demo-body">
            <div className="demo-task">
              <span className="task-tag">BÀI TẬP 01</span>
              <h2>Tổng của hai số</h2>
              <p>Cho một mảng số nguyên và một số <code>target</code>, hãy tìm hai phần tử có tổng bằng target.</p>
              <div className="example-box"><small>VÍ DỤ</small><code>nums = [2, 7, 11, 15]<br/>target = 9</code></div>
              <div className="task-info"><span>◷ 15 phút</span><span>● Dễ</span></div>
            </div>
            <div className="demo-editor">
              <div className="code-lines"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
              <pre><code><em>function</em> <b>twoSum</b>(nums, target) {'{'}{`\n`}  <span>const</span> seen = <em>new</em> Map();{`\n\n`}  <em>for</em> (let i = 0; i &lt; nums.length; i++) {'{'}{`\n`}    <span>const</span> needed = target - nums[i];{`\n`}    <em>if</em> (seen.has(needed)) {'{'}{`\n`}      <em>return</em> [seen.get(needed), i];{`\n`}    {'}'}{`\n`}  {'}'}{`\n`}{'}'}</code></pre>
            </div>
          </div>
          <div className="demo-footer"><div><span className="success-dot">✓</span><p><strong>Chính xác!</strong><small>Chạy trong 48 ms</small></p></div><button>Chạy code <span>▶</span></button></div>
          <div className="floating-card xp-card"><span>⚡</span><div><strong>+30 XP</strong><small>Bài đầu tiên!</small></div></div>
          <div className="floating-card streak-card"><span>🔥</span><div><strong>7 ngày</strong><small>Chuỗi học tập</small></div></div>
        </div>
      </section>

      <section className="tech-strip" aria-label="Công nghệ có thể học">
        <p>Bắt đầu hành trình với</p>
        <div>{logos.map((logo, index) => <span key={logo}><i>{["Py", "JS", "⚛", "C+", "▱"][index]}</i>{logo}</span>)}</div>
      </section>

      <section className="benefit-section" id="features">
        <div className="section-heading centered">
          <span className="eyebrow">KHÔNG CHỈ LÀ XEM VIDEO</span>
          <h2>Học bằng cách <span>thật sự làm.</span></h2>
          <p>Mỗi tính năng đều được thiết kế để biến kiến thức thành kỹ năng bạn có thể sử dụng.</p>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => <article className="benefit-card" key={benefit.number}><span className="benefit-number">{benefit.number}</span><div className="benefit-icon">{benefit.icon}</div><h3>{benefit.title}</h3><p>{benefit.description}</p><a href="#how-it-works">Khám phá <Arrow /></a></article>)}
        </div>
      </section>

      <section className="course-showcase" id="courses">
        <div className="section-heading row-heading">
          <div><span className="eyebrow">BẮT ĐẦU TỪ ĐÂY</span><h2>Khóa học được yêu thích.</h2></div>
          <Link href="/dashboard">Xem tất cả khóa học <Arrow /></Link>
        </div>
        <div className="landing-course-grid">
          {courses.map((course) => <Link className="landing-course-card" href="/dashboard" key={course.title}>
            <div className={`landing-course-art ${course.tone}`}><span>{course.icon}</span><i/><i/></div>
            <div className="landing-course-body"><div><span>{course.level}</span><small>{course.lessons}</small></div><h3>{course.title}</h3><p>{course.description}</p><strong>Bắt đầu học <Arrow /></strong></div>
          </Link>)}
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="roadmap-card" id="how-it-works">
          <div className="roadmap-copy"><span className="eyebrow">LỘ TRÌNH CỦA RIÊNG BẠN</span><h2>Từ “chưa biết gì” đến tự tin xây sản phẩm.</h2><p>Không cần đoán xem nên học gì tiếp theo. DolphinX giúp bạn đi từng bước đúng hướng.</p><ul><li><Check/><span><strong>Kiểm tra đầu vào</strong><small>Xác định điểm bắt đầu phù hợp với bạn.</small></span></li><li><Check/><span><strong>Học và thực hành</strong><small>Bài học ngắn, bài tập ngay sau mỗi khái niệm.</small></span></li><li><Check/><span><strong>Xây dự án thật</strong><small>Hoàn thiện portfolio để chứng minh kỹ năng.</small></span></li></ul><Link className="primary-cta" href="/dashboard">Khám phá lộ trình <Arrow /></Link></div>
          <div className="roadmap-visual"><div className="path-line"/><div className="path-step done"><span>✓</span><div><small>CHẶNG 01</small><strong>Nền tảng lập trình</strong><p>12/12 bài hoàn thành</p></div><b>100%</b></div><div className="path-step current"><span>⌁</span><div><small>CHẶNG 02</small><strong>Cấu trúc dữ liệu</strong><p>8/20 bài hoàn thành</p></div><b>40%</b></div><div className="path-step"><span>◇</span><div><small>CHẶNG 03</small><strong>Thuật toán cốt lõi</strong><p>Chưa bắt đầu</p></div><b>0%</b></div><div className="path-step"><span>★</span><div><small>CHẶNG 04</small><strong>Dự án tốt nghiệp</strong><p>Mở khóa sau chặng 03</p></div><b>🔒</b></div></div>
        </div>
      </section>

      <section className="community-section" id="community">
        <div><span className="eyebrow">CỘNG ĐỒNG DOLPHINX</span><h2>Bạn không học một mình.</h2><p>Hỏi đáp, chia sẻ lời giải và cùng hàng nghìn người học Việt Nam tiến bộ mỗi ngày.</p></div>
        <div className="community-stats"><span><strong>12K+</strong><small>Học viên</small></span><span><strong>160+</strong><small>Bài luyện code</small></span><span><strong>92%</strong><small>Học viên hài lòng</small></span></div>
      </section>

      <section className="final-cta"><div className="cta-glow"/><span className="eyebrow">SẴN SÀNG CHƯA?</span><h2>Dòng code đầu tiên<br/>đang chờ bạn.</h2><p>Tham gia miễn phí. Không cần thẻ tín dụng.</p><Link className="light-cta" href="/dashboard">Bắt đầu học ngay <Arrow /></Link></section>

      <footer className="landing-footer"><Link className="landing-brand" href="/"><Image src="/dolphinx-logo.png" alt="DolphinX" width={135} height={51}/><span>Programming</span></Link><p>Học lập trình bằng tiếng Việt, theo cách dễ hiểu nhất.</p><div><a href="#features">Tính năng</a><a href="#courses">Khóa học</a><a href="#community">Cộng đồng</a><span>© 2026 DolphinX</span></div></footer>
    </main>
  );
}
