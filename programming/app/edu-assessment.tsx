import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import './edu-assessment.css';

const rows = [
  ['Chạy thử', 'Test mẫu', 'Kiểm tra lời giải với những ví dụ công khai trước khi nộp.', 'Đối chiếu đầu vào và kết quả mong đợi.'],
  ['Nộp bài', 'Test mẫu + test ẩn', 'Lời giải được kiểm tra với toàn bộ bộ test đã được admin duyệt.', 'Xem số test đạt và tổng số test sau lượt chấm.'],
  ['Đạt toàn bộ', 'Đúng tất cả test', 'Lời giải vượt qua bộ test của bài ở lượt nộp đó.', 'Thử giải thích cách làm và tìm cách tối ưu hơn.'],
  ['Chưa đạt', 'Còn test chưa qua', 'Kết quả chưa khớp hoặc lời giải gặp lỗi, vượt giới hạn chạy.', 'Kiểm tra trường hợp biên, sửa code rồi thử lại.'],
];

export default function EduAssessment() {
  return (
    <section className="ed-assessment" aria-labelledby="assessment-heading" data-reveal>
      <div className="edu-container">
        <header className="ed-assessment-heading">
          <span className="edu-label">ĐÁNH GIÁ & TIẾN BỘ</span>
          <h2 id="assessment-heading">Hiểu kết quả.<br/>Biết bước tiếp theo.</h2>
          <p>Mỗi lượt thực hành là một phản hồi để học tiếp, không chỉ là một con số.</p>
        </header>
        <div className="ed-assessment-table-wrap">
          <table className="ed-assessment-table">
            <caption>Cách đọc kết quả bài tập lập trình tự động</caption>
            <thead><tr><th scope="col">Bước / kết quả</th><th scope="col">Phạm vi kiểm tra</th><th scope="col">Ý nghĩa</th><th scope="col">Bạn có thể làm gì?</th></tr></thead>
            <tbody>{rows.map(([step, scope, meaning, next]) => <tr key={step}>
              <th scope="row">{step}</th>
              <td data-label="Phạm vi kiểm tra">{scope}</td>
              <td data-label="Ý nghĩa">{meaning}</td>
              <td data-label="Bước tiếp theo">{next}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="ed-assessment-footnote">
          <p>Máy chấm hiện hỗ trợ JavaScript và các bài có bộ test được duyệt. Bạn cần đăng nhập để chạy hoặc nộp bài; chạy thử không lưu thành lượt nộp. Kết quả test không thay thế đánh giá toàn diện về chất lượng code hay chứng nhận hoàn thành khóa học.</p>
          <Link className="edu-text-link" href="/dashboard#practice">Khám phá bài thực hành <ArrowUpRight size={18}/></Link>
        </div>
      </div>
    </section>
  );
}
