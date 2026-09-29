import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import './edu-study-options.css';

const options = [
  {
    title: 'Tự khám phá', subtitle: 'Bắt đầu từ điều bạn tò mò', badge: 'Lộ trình mở',
    href: '/roadmaps', action: 'Khám phá lộ trình',
    features: ['Xem lộ trình mà không cần đăng nhập', 'Khám phá các chủ đề theo từng chặng học', 'Đọc bài viết và tài liệu được giới thiệu', 'Tự chọn nhịp học phù hợp với quỹ thời gian'],
    note: 'Phù hợp khi bạn muốn tìm hiểu trước khi chọn khóa học.',
  },
  {
    title: 'Học theo khóa', subtitle: 'Đi từng bước, thực hành từng bài', badge: 'Có cấu trúc',
    href: '/courses', action: 'Xem các khóa học',
    features: ['Xem giáo án và thông tin từng khóa', 'Học bài giảng theo quyền truy cập đã đăng ký', 'Đăng nhập để lưu tiến độ học tập', 'Thực hành bài tập đi kèm nội dung học'],
    note: 'Nội dung, học phí và quyền truy cập được thể hiện theo từng khóa.',
  },
  {
    title: 'Mentor 1:1', subtitle: 'Trao đổi từ mục tiêu của riêng bạn', badge: 'Cá nhân hóa',
    href: '/consultation', action: 'Trao đổi với đội ngũ',
    features: ['Chia sẻ nền tảng và mục tiêu muốn đạt', 'Trao đổi nội dung cần được hỗ trợ', 'Thống nhất lịch học và hình thức đồng hành', 'Xác nhận học phí trước khi bắt đầu'],
    note: 'Gửi yêu cầu tư vấn không đồng nghĩa với đăng ký hoặc thanh toán.',
  },
];

export default function EduStudyOptions() {
  return <section className="ed-study-band" aria-labelledby="study-options-heading">
    <div className="edu-container">
      <div className="ed-study-heading" data-reveal>
        <span className="edu-label">CÁCH HỌC PHÙ HỢP</span>
        <h2 id="study-options-heading">Bạn chọn nhịp.<br/>Chúng mình đồng hành.</h2>
        <p>Tự khám phá, học theo khóa hoặc trao đổi cùng mentor. Bắt đầu từ cách phù hợp với bạn hôm nay.</p>
      </div>
      <div className="ed-study-cards">
        {options.map(option => <article className="ed-study-card" key={option.href} data-reveal>
          <header><div><h3>{option.title}</h3><p>{option.subtitle}</p></div><span className="ed-study-badge">{option.badge}</span></header>
          <ul>{option.features.map(feature => <li key={feature}><Check aria-hidden="true"/><span>{feature}</span></li>)}</ul>
          <p className="ed-study-note">{option.note}</p>
          <Link href={option.href}>{option.action}<ArrowUpRight aria-hidden="true"/></Link>
        </article>)}
      </div>
    </div>
  </section>;
}
