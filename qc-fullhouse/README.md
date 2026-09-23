# Fullhouse QC

Công cụ nội bộ dành cho QC Fullhouse quản lý và đánh giá chất lượng đội ngũ giáo viên. Ứng dụng sử dụng Next.js App Router, Ant Design và MongoDB Atlas. Ứng dụng không có tài khoản hoặc đăng nhập nội bộ; lớp truy cập có thể được bảo vệ bằng Cloudflare Zero Trust khi triển khai.

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run seed
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Nếu cổng 3000 đang được sử dụng, Next.js sẽ chọn cổng kế tiếp.

## Biến môi trường

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
MONGODB_DB=fullhouse_qc
```

Không commit `.env.local`. File này đã được loại trừ bởi `.gitignore`.

## API

- `GET /api/dashboard`: đọc KPI, tiêu chí, lớp học và lịch giảng dạy từ MongoDB.
- `POST /api/evaluations`: QC lưu phiếu đánh giá giáo viên.
- `/api/manage/teachers`: CRUD giáo viên.
- `/api/manage/contests`: CRUD contest, phân công giáo viên và quản lý thời gian bắt đầu/kết thúc.
- `/api/manage/courses`: CRUD khóa học.
- `/api/manage/classes`: CRUD lớp học và phân công giáo viên.
- `/api/manage/sessions`: CRUD các buổi học thuộc lớp.
- `GET/POST /api/daily-reports`: tổng hợp và lưu Daily QC Report theo ngày.
- `GET /api/schedule?month=YYYY-MM`: lịch tháng, số buổi học và giáo viên theo ngày.

Các route `/api/manage/*` hỗ trợ `GET`, `POST`, `PUT` và `DELETE`. Contest bắt buộc gắn với một hoặc nhiều giáo viên, lưu thời gian bắt đầu/kết thúc và được giao diện tự động tính trạng thái cùng thời hạn còn lại. Lớp học lưu liên kết tới khóa học và giáo viên; buổi học lưu liên kết tới lớp học, đường dẫn record, trạng thái QC và nhận xét sau khi kiểm tra record.

## Quy trình QC hằng ngày

1. Mở **Buổi học & record**, gắn đường dẫn video cho từng buổi học.
2. QC xem record, cập nhật trạng thái và nhập nhận xét.
3. Mở **Daily QC Report**, chọn ngày cần tổng hợp.
4. Kiểm tra số record đã xem, đang chờ hoặc có vấn đề.
5. Lưu báo cáo vào MongoDB hoặc dùng **Sao chép để gửi sếp**.

Màn hình **Lịch buổi học** hiển thị số buổi ngay trên từng ngày, số ca tối, danh sách lớp chạy song song và giáo viên phụ trách. Có thể lọc nhanh theo buổi sáng, chiều hoặc tối.

Ví dụ payload cho API đánh giá:

```json
{
  "teacherId": "gv-001",
  "classCode": "FH-EF1-0426",
  "score": 92,
  "note": "Buổi học đạt mục tiêu đề ra."
}
```

## Kiểm tra và build

```bash
npm run lint
npm run build
npm start
```

## Triển khai

Khi triển khai lên Vercel hoặc một nền tảng Node.js khác, cấu hình hai biến `MONGODB_URI` và `MONGODB_DB` trong phần Environment Variables. MongoDB Atlas Network Access cũng phải cho phép IP của nền tảng triển khai truy cập cluster.
