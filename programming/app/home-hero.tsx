import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Code2, Map, MessagesSquare } from 'lucide-react';
import './home-hero.css';

export default function HomeHero() {
  return <section className="dx-hero" aria-labelledby="home-hero-title">
    <div className="bp-container dx-hero-grid">
      <div className="dx-hero-copy">
        <span className="dx-hero-kicker"><span aria-hidden="true"/> MỘT KHỞI ĐẦU NHỎ. MỘT TƯƠNG LAI MỚI.</span>
        <h1 id="home-hero-title">Từ dòng code đầu tiên.<br/><span>Đến điều bạn <br/>muốn tạo ra.</span></h1>
        <p>Học lập trình bằng tiếng Việt, thực hành từng bước và xây sản phẩm của riêng bạn. Có lộ trình rõ ràng, có mentor khi cần.</p>
        <div className="dx-hero-actions"><Link className="dx-hero-primary" href="/dashboard">Bắt đầu học <ArrowUpRight size={20}/></Link><a className="dx-hero-secondary" href="#roadmaps">Khám phá lộ trình <ArrowRight size={18}/></a></div>
        <div className="dx-hero-note"><Check size={15}/> Vào xem ngay, chưa cần đăng nhập</div>
        <div className="dx-hero-topics" aria-label="Các hướng học"><span>BẠN CÓ THỂ BẮT ĐẦU VỚI</span><div><Link href="/roadmaps/python">Python</Link><Link href="/roadmaps/frontend">Frontend</Link><Link href="/roadmaps/backend">Backend</Link><Link href="/roadmaps/sql">SQL</Link></div></div>
      </div>
      <div className="dx-hero-scene dx-hero-people">
        <div className="dx-hero-orbit" aria-hidden="true"/>
        <figure className="dx-hero-portrait"><Image src="/brand/bright-learner.png" alt="Ảnh AI minh họa người học trong thư viện, cầm sách và mỉm cười" width={1086} height={1448} priority sizes="(max-width: 800px) 70vw, 32vw"/></figure>
        <figure className="dx-hero-mentor"><Image src="/brand/bright-mentor.png" alt="Ảnh AI minh họa mentor hướng dẫn người học lập trình trên laptop" width={1448} height={1086} priority sizes="(max-width: 800px) 55vw, 27vw"/><figcaption><MessagesSquare size={17}/><span>Có người cùng bạn gỡ khó</span></figcaption></figure>
        <a className="dx-hero-floating" href="#roadmaps"><span><Map size={19}/></span><div><small>KHÔNG BIẾT BẮT ĐẦU TỪ ĐÂU?</small><strong>Mở bản đồ học tập <ArrowUpRight size={15}/></strong></div></a>
        <div className="dx-hero-mascot"><Image src="/brand/course-coding-mascot-v3.png" alt="" width={90} height={90}/><span>Cùng bạn,<br/><strong>từng bước nhỏ.</strong></span></div>
        <span className="dx-hero-photo-disclaimer">ẢNH AI MINH HỌA · KHÔNG PHẢI HỒ SƠ HỌC VIÊN / MENTOR</span>
      </div>
    </div>
    <div className="bp-container"><div className="dx-hero-foundations"><div><Map/><span><strong>Biết mình học gì tiếp theo</strong><small>Lộ trình từ nền tảng đến dự án</small></span></div><div><Code2/><span><strong>Hiểu bằng cách tự tay làm</strong><small>Bài tập code & phản hồi tự động</small></span></div><Link href="/consultation"><MessagesSquare/><span><strong>Có người cùng gỡ khó</strong><small>Tư vấn học online 1:1 theo mục tiêu</small></span><ArrowUpRight size={17}/></Link></div></div>
  </section>;
}
