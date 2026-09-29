import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Route, Video } from 'lucide-react';
import EduPublicShell, { EditorialHero } from '../edu-public-shell';
import AcademyForm from '../academy/form';
import { requestConsultation } from '../academy/actions';
import '../edu-contact.css';

export const metadata: Metadata = { title: 'Liên hệ | DolphinX Edu', description: 'Chia sẻ mục tiêu học lập trình và trao đổi về lộ trình, khóa học hoặc mentor 1:1 cùng DolphinX Edu.' };

const questions = [
  ['Chưa biết lập trình có thể đăng ký tư vấn không?', 'Có. Bạn có thể mô tả kinh nghiệm hiện tại, điều muốn làm được và thời gian có thể dành cho việc học. Đó là cơ sở để cùng chọn điểm bắt đầu phù hợp.'],
  ['Gửi yêu cầu có đồng nghĩa với đăng ký khóa học?', 'Không. Đây là yêu cầu trao đổi thông tin. Nội dung, lịch học và học phí cần được thống nhất trước khi bạn quyết định đăng ký.'],
  ['Tôi có thể xem lộ trình trước không?', 'Bạn có thể xem các lộ trình và thông tin chương trình công khai mà không cần đăng nhập. Tài khoản được dùng khi đăng ký học và lưu tiến độ.'],
  ['Cần chuẩn bị gì cho buổi trao đổi?', 'Hãy chuẩn bị mục tiêu, các nội dung từng học, dự án hoặc bài tập đang gặp khó và khung giờ phù hợp. Không cần có sẵn một kế hoạch hoàn chỉnh.'],
];

export default function ContactPage() {
  return <EduPublicShell>
<EditorialHero groupPortrait label="CÙNG KẾT NỐI" title="Một cuộc trò chuyện. Một hướng đi rõ hơn." image="/brand/company/presentation-original.png" alt="Ảnh gốc thành viên đội ngũ đang thuyết trình" />
    <section className="edu-container ed-contact-grid" aria-labelledby="contact-heading">
      <div data-reveal><span className="edu-label">BẮT ĐẦU TỪ BẠN</span><h2 id="contact-heading">Bạn muốn làm được<br/>điều gì tiếp theo?</h2><p className="ed-contact-intro">Chia sẻ điều bạn đang tìm kiếm. Chúng mình sẽ dựa trên mục tiêu và nền tảng của bạn để trao đổi về cách học phù hợp.</p>
        <div className="ed-contact-topics">{[{ Icon: Route, title: 'Chọn lộ trình', text: 'Tìm điểm bắt đầu và các chặng học tiếp theo.' }, { Icon: Video, title: 'Học cá nhân hóa 1:1', text: 'Trao đổi nội dung và lịch học theo nhu cầu.' }, { Icon: MessageCircle, title: 'Giải đáp về khóa học', text: 'Làm rõ giáo án, bài tập và cách đăng ký.' }].map(({ Icon, title, text }) => <div key={title}><Icon size={23} aria-hidden="true"/><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
        <Link href="/programs" className="edu-link">Khám phá chương trình trước <ArrowUpRight size={18}/></Link>
      </div>
      <div className="ed-contact-form"><span className="edu-label">LỜI NHẮN CỦA BẠN</span><h2>Cùng tìm hướng đi.</h2><p>Các trường bên dưới đều cần thiết để đội ngũ liên hệ đúng người, đúng nhu cầu.</p>
        <AcademyForm action={requestConsultation} label="Gửi yêu cầu tư vấn ↗">
          <label>Họ và tên<input name="name" required maxLength={100} autoComplete="name" placeholder="Chúng mình nên gọi bạn là…"/></label>
          <label>Email hoặc số điện thoại<input name="contact" required maxLength={150} placeholder="Thông tin để đội ngũ liên hệ"/></label>
          <label>Mục tiêu của bạn<textarea name="goal" required rows={4} maxLength={2000} placeholder="Bạn muốn học gì? Đang gặp khó ở đâu?"/></label>
          <label>Khung giờ thuận tiện<input name="availability" required maxLength={300} placeholder="Ví dụ: buổi tối trong tuần, sau 19:00"/></label>
          <input name="website" tabIndex={-1} autoComplete="off" className="ed-contact-trap" aria-hidden="true"/>
          <label className="ed-contact-consent"><input name="consent" type="checkbox" required/><span>Tôi đồng ý để DolphinX liên hệ về yêu cầu tư vấn này.</span></label>
        </AcademyForm>
        <small>Chỉ gửi thông tin cần thiết cho việc tư vấn. Không gửi mật khẩu hoặc thông tin thanh toán.</small>
      </div>
    </section>
    <section className="ed-contact-next"><div className="edu-container" data-reveal><span className="edu-label">SAU KHI GỬI YÊU CẦU</span><h2>Từng bước, cùng bạn.</h2><div className="ed-contact-steps">{[['01', 'Tiếp nhận', 'Yêu cầu được chuyển đến đội ngũ phụ trách tư vấn.'], ['02', 'Kết nối', 'Đội ngũ liên hệ qua thông tin bạn cung cấp để tìm hiểu thêm.'], ['03', 'Thống nhất', 'Cùng trao đổi hướng học, hình thức và lịch phù hợp trước khi đăng ký.']].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="edu-container edu-section ed-contact-faq" aria-labelledby="contact-faq-heading">
      <div className="ed-contact-faq-copy" data-reveal>
        <span className="edu-label">BẠN CÓ THỂ ĐANG BĂN KHOĂN</span>
        <h2 id="contact-faq-heading">Trước khi<br/>chúng mình trò chuyện.</h2>
        <div className="ed-contact-questions">{questions.map(([question, answer]) => <details key={question} name="contact-questions"><summary>{question}<ArrowUpRight aria-hidden="true"/></summary><p>{answer}</p></details>)}</div>
      </div>
      <figure className="ed-contact-portrait" data-reveal>
        <Image src="/brand/company/representative-white-v1.png" alt="Gương mặt đại diện DolphinX đeo kính, mặc đồng phục trắng trong studio" width={1024} height={1536} sizes="(max-width:850px) 90vw, 40vw"/>
        <figcaption>Chân dung từ ảnh đội ngũ cung cấp; đồng phục được chỉnh bằng AI.</figcaption>
      </figure>
    </section>
  </EduPublicShell>;
}
