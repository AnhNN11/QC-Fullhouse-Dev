import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Database, Layers, Play } from "lucide-react";

export function CourseDiscovery() {
  return <section className="landing-course-feature" id="programs"><div className="bp-container landing-course-feature-grid">
    <Link className="landing-course-feature-art" href="/courses" aria-label="Khám phá thư viện khóa học DolphinX"><Image src="/brand/course-overview-technologies-v1.png" alt="Cá heo DolphinX cùng logo Python, JavaScript, HTML5, CSS3, React, Next.js, Node.js và PostgreSQL" width={1536} height={1024} sizes="(max-width:700px) 90vw, 50vw"/><span>DOLPHINX / THƯ VIỆN KHÓA HỌC <ArrowUpRight size={20}/></span></Link>
    <div className="landing-course-feature-copy"><span className="bp-eyebrow">MỞ MỘT KHÓA HỌC. MỞ THÊM KHẢ NĂNG.</span><h2>Nhiều hướng đi.<br/>Một <em>khởi đầu.</em></h2><p>Các khóa học tại DolphinX giúp bạn xây nền tảng, luyện tư duy và từng bước tạo ra sản phẩm thực tế.</p><div className="landing-course-overview" aria-label="Các nhóm khóa học tại DolphinX">{[{id:"python",title:"Python thực chiến",description:"Từ cú pháp đến mini project."},{id:"frontend",title:"Web Frontend",description:"HTML, CSS, JavaScript và React."},{id:"sql",title:"SQL & cơ sở dữ liệu",description:"Truy vấn và tổ chức dữ liệu."},{id:"data-structures",title:"Cấu trúc dữ liệu",description:"Array, Stack, Queue, Linked List."},{id:"algorithms",title:"Thuật toán",description:"Tư duy giải quyết bài toán."},{id:"interview",title:"Luyện phỏng vấn",description:"Luyện giải và trình bày lời giải."}].map((course,index)=><Link href={`/courses/${course.id}`} key={course.id}><span>{String(index+1).padStart(2,"0")}</span><div><strong>{course.title}</strong><small>{course.description}</small></div><ArrowUpRight size={14}/></Link>)}</div><Link className="bp-button" href="/courses">Xem tất cả khóa học <ArrowUpRight size={18}/></Link><small>Xem giáo trình tự do · Đăng nhập khi bắt đầu học</small><small className="landing-technology-note">Logo minh họa các công nghệ; nội dung cụ thể xem trong giáo trình từng khóa.</small></div>
  </div></section>;
}

export function LearningTechnology() {
  return <section className="dx-learning bp-container" id="technology">
    <div className="dx-learning-art"><Image src="/brand/dolphin-lab-v1.png" alt="Linh vật cá heo DolphinX bên laptop và các khối công nghệ, hình minh họa AI" width={1448} height={1086} sizes="(max-width: 700px) 100vw, 50vw"/><span className="dx-art-label"><Code2/> LEARN. BUILD. REPEAT.</span></div>
    <div><span className="bp-eyebrow">TÒ MÒ VỀ CÔNG NGHỆ? BẮT ĐẦU TỪ ĐÂY.</span><h2>Ý tưởng nhỏ.<br/>Khả năng <em>không nhỏ.</em></h2><p>Hiểu cách công nghệ hoạt động bằng việc tự tay tạo ra sản phẩm. Cá heo DolphinX là biểu tượng cho sự tò mò và tinh thần khám phá ấy.</p>
      <div className="dx-tech-list"><Link href="/courses/python"><Code2/><span><strong>Python & tư duy lập trình</strong><small>Bắt đầu từ logic, phát triển thành kỹ năng.</small></span><ArrowUpRight/></Link><Link href="/courses/frontend"><Layers/><span><strong>Web & giao diện tương tác</strong><small>HTML, CSS, JavaScript và React.</small></span><ArrowUpRight/></Link><Link href="/courses/sql"><Database/><span><strong>SQL & cơ sở dữ liệu</strong><small>Tổ chức thông tin, tìm câu trả lời từ dữ liệu.</small></span><ArrowUpRight/></Link></div>
      <Link className="bp-button" href="/dashboard">Khám phá không gian học <ArrowUpRight/></Link>
    </div>
  </section>;
}

export function MentorShowcase() {
  return <section className="dx-mentors bp-container" id="mentors">
    <div className="bp-section-heading"><div><span className="bp-eyebrow">KHÔNG CHỈ HỌC. CÒN CÓ NGƯỜI ĐỒNG HÀNH.</span><h2>Hiểu cách học.<br/>Hiểu <em>người học.</em></h2></div><p>Một buổi trao đổi đúng lúc có thể<br/>giúp bạn nhìn vấn đề theo cách mới.</p></div>
    <div className="dx-mentor-layout"><article className="dx-mentor-profile"><div className="dx-mentor-portrait"><Image src="/brand/mentor-editorial-v1.png" alt="Chân dung mentor được tạo bằng AI để minh họa giao diện, không phải nhân sự thật" width={1086} height={1448} sizes="(max-width: 700px) 100vw, 35vw"/><span>ẢNH AI · HỒ SƠ MINH HỌA</span></div><div className="dx-mentor-bio"><span className="bp-eyebrow">MẪU HỒ SƠ · CHƯA PHẢI MENTOR THẬT</span><h3>Mentor lập trình</h3><p>Không chỉ đưa ra lời giải, mà cùng bạn đặt câu hỏi, hiểu nguyên nhân và tự tìm hướng đi tiếp theo.</p><div className="bp-tags"><span>Review code</span><span>Học qua dự án</span><span>Online 1:1</span></div><small>Tên, kinh nghiệm và lịch nhận học viên sẽ được bổ sung khi có hồ sơ mentor xác thực.</small></div></article>
    <div className="dx-mentor-details"><h3>Bạn cần người đồng hành<br/>ở bước nào?</h3>{[{n:"01",t:"Xây nền tảng",p:"Làm rõ khái niệm, luyện tư duy và tìm nhịp học phù hợp."},{n:"02",t:"Gỡ vướng khi thực hành",p:"Chia sẻ đoạn code, phân tích cách làm và hiểu lỗi gặp phải."},{n:"03",t:"Hoàn thiện dự án",p:"Trao đổi cấu trúc, cách trình bày và hướng cải thiện sản phẩm."}].map(item=><div className="dx-mentor-step" key={item.n}><span>{item.n}</span><div><h4>{item.t}</h4><p>{item.p}</p></div></div>)}<Link className="bp-button" href="/consultation">Trao đổi nhu cầu học <ArrowUpRight/></Link><p className="dx-mentor-note"><Play/> Nội dung và lịch học được thống nhất khi tư vấn.</p></div></div>
  </section>;
}
