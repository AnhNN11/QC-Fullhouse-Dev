# DolphinX Email Studio

Mở `/admin/email` sau khi đăng nhập quản trị. Ba mẫu thư hỗ trợ nội dung tùy chỉnh, ảnh cá heo đính kèm CID, phiên bản HTML + plain text và xem trước desktop/mobile. Mỗi lần gửi có một người nhận. Studio không tự gửi đến danh sách newsletter.

## Bật gửi

Điền các biến trong `.env.email.example` vào `.env.local` hoặc môi trường máy chủ, rồi khởi động lại ứng dụng. `SMTP_FROM` là địa chỉ email đã được nhà cung cấp cho phép gửi. `SMTP_REPLY_TO` là địa chỉ nhận phản hồi; để trống sẽ dùng `SMTP_FROM`. Không điền mật khẩu thường vào mã nguồn hoặc commit thông tin bí mật.

- Cổng 465: TLS ngay khi kết nối.
- Cổng 587: yêu cầu nâng cấp STARTTLS.
- Gmail/Workspace: dùng phương thức xác thực SMTP mà tài khoản được phép sử dụng; trường SMTP_PASSWORD có thể là mật khẩu ứng dụng nếu nhà cung cấp cho phép.

Tài liệu SMTP: https://nodemailer.com/smtp

## Thử và gửi

Điền email của chính bạn, kiểm tra bản xem trước, chọn “Kiểm tra & gửi” rồi “Gửi email”. Đây là thao tác gửi thật. Khi chưa cấu hình SMTP, nút gửi bị vô hiệu hóa. Chưa có email nào được gửi trong quá trình phát triển tính năng.

`lib/mailer.ts` cung cấp `sendDolphinEmail(draft)` cho server. Endpoint `/api/admin/email` yêu cầu phiên admin và same-origin; kiểm tra payload, bỏ qua người đã yêu cầu ngừng nhận, giới hạn 10 yêu cầu gửi/phút, chống lặp cùng requestId và ghi lịch sử. Không tự thử gửi lại khi kết quả SMTP không chắc chắn. Kiểm tra nhà cung cấp trước khi gửi lại.

“SMTP đã nhận” không có nghĩa đã vào inbox. Cần cấu hình tên miền/SPF/DKIM theo dịch vụ email và thử trên hộp thư thực tế. Chưa kiểm thử gửi thật vì chưa có cấu hình SMTP.

Chạy kiểm tra cục bộ không phát sinh email: `node --test tests/email-template.test.mjs`.
