# DolphinX Programming

Ứng dụng học lập trình full-stack bằng Next.js 16, React 19, shadcn/ui và MongoDB Atlas. Bản review bao gồm landing page, dashboard học viên, phòng luyện code, lưu tiến độ và trung tâm quản trị.

## Chạy local

Yêu cầu Node.js 20.9 trở lên:

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Dashboard nằm tại [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

Sao chép `.env.example` thành `.env.local`, sau đó điền `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET`. Trang quản trị nằm tại [http://localhost:3000/admin](http://localhost:3000/admin).

## Kiến trúc

- `app/dashboard/page.tsx`: Server Component tải dữ liệu ban đầu trực tiếp từ database.
- `app/dashboard.tsx`: Client Component cho tìm kiếm, lọc, modal khóa học và code editor.
- `app/admin/*`: trang đăng nhập và trung tâm quản trị bằng shadcn/ui.
- `app/api/*`: Route Handlers cho dashboard, tiến độ, bài nộp và CRUD admin.
- `lib/db.ts`: seed và data-access layer MongoDB.
- `lib/admin-auth.ts`: session admin ký HMAC, lưu trong cookie `httpOnly`.

## Kiểm tra production

```bash
npm run lint
npm run build
npm start
```

Database sẽ tự seed nội dung mẫu ở lần kết nối thành công đầu tiên. Không commit `.env.local` hoặc đưa credential thật vào mã nguồn.

## Khóa học video và tư vấn 1:1

- `/courses`: danh mục khóa học từ MongoDB; `/courses/[id]`: chương trình và trình phát bài giảng đã xuất bản.
- `/consultation`: gửi mục tiêu, thông tin liên hệ và khung giờ tư vấn, có xác nhận đồng ý liên hệ.
- `/admin/academy`: thêm/ẩn/xuất bản bài video, cấp/thu hồi mã học 90 ngày và cập nhật trạng thái, ghi chú tư vấn. Mã học là bearer credential: người giữ mã có quyền sử dụng.
- `VIDEO_ENCRYPTION_KEY`: khóa 32 byte, biểu diễn 64 ký tự hex, dùng AES-256-GCM để mã hóa video ID trong database. Giữ và sao lưu khóa; đổi khóa sẽ khiến bài cũ không giải mã được nếu chưa migration.
- Server kiểm tra mã học còn hạn, chưa thu hồi và đúng khóa trước khi giải mã video. API danh mục không trả ciphertext hoặc video ID. Admin có quyền xem để kiểm tra nội dung.
- **YouTube không cung cấp khả năng giấu tuyệt đối video ID:** iframe hợp lệ phải chứa ID khi phát. Mã hóa database và kiểm soát quyền không phải DRM. Chưa có chống chia sẻ mã, thanh toán tự động hay tài khoản học viên riêng trong luồng video này.
- CRUD và gửi tư vấn cần kết nối Atlas hợp lệ; không hiển thị thành công giả khi database lỗi. Bản hiện tại chưa xác minh end-to-end với Atlas do credential bị từ chối.
