# Rà soát tài nguyên và vận hành lớp học

## Kết quả rà soát 23/09/2026

Trước thay đổi, 11/12 bài tập chỉ có mô tả và ví dụ mẫu; số bài/dự án quảng bá không khớp nội dung thực tế. Chưa có giáo án để quay video. Vì vậy chưa thể xem tài nguyên cũ là một chương trình học hoàn chỉnh.

Đã bổ sung:

- 12 đề bài có chữ ký `solve`, định dạng đầu vào/đầu ra, giới hạn và quy ước biên; 68 test mẫu/ẩn (xem số thực tế trong admin nếu bộ test được sửa).
- 6 khóa × 5 bài khởi đầu: cấu trúc dữ liệu, thuật toán, Python, frontend, SQL, phỏng vấn.
- Mỗi bài có mục tiêu, yêu cầu đầu vào, bài thực hành/tiêu chí hoàn thành, tài liệu chính thức và khung quay khoảng 18 phút.
- Video YouTube hiện là cùng một [video demo trong tài liệu nhúng YouTube](https://developers.google.com/youtube/player_parameters), **không phải video giảng bài** và không được quảng bá như nội dung đã quay.
- Xóa lời quảng bá 20 dự án/100 bài Python và 150 bài phỏng vấn trong dữ liệu mẫu đang dùng; số video xuất bản được đếm từ database khi nhập chương trình.

Nguồn đọc: [MDN Learn](https://developer.mozilla.org/en-US/docs/Learn_web_development), [Python Tutorial](https://docs.python.org/3/tutorial/), [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html). Đây là tài liệu tham khảo; giáo án ngắn do ứng dụng biên soạn, không sao chép bài giảng của các nguồn này.

## Những gì chưa được coi là hoàn thiện

- Đây là chương trình khởi đầu và dàn ý quay, chưa phải toàn bộ khóa chuyên sâu hoặc kịch bản lời thoại hoàn chỉnh.
- Bộ test kiểm tra kết quả ở các trường hợp tiêu biểu, không chứng minh độ phức tạp hay ngăn học viên hard-code toàn bộ đáp án. Bài heap/chia để trị cần mentor review cách giải bên cạnh kết quả máy chấm.
- Python, SQL và dự án giao diện có bài thực hành tự kiểm tra, **chưa có runner tự chấm**. Máy chấm hiện chỉ chạy JavaScript đồng bộ.
- Mentor vẫn cần quay video, chạy lại ví dụ, kiểm tra âm thanh/phụ đề và thử với người học thật trước khi bán khóa hoàn chỉnh.

## Quy trình admin

1. `/admin/judge`: xem/tắt/bật bộ chấm, chỉnh JSON test và lời giải chuẩn. Mỗi bộ cần test mẫu và test ẩn. Khi lưu, lời giải chuẩn phải qua tất cả test.
2. `/admin/academy`: mở “Sửa video / giáo án”, thay link YouTube, chỉnh mục tiêu/bài tập/dàn ý. Bỏ chọn “Video demo” khi có bài giảng thật; bài thật dùng quyền truy cập khóa hiện có.
3. Giữ video chưa duyệt ở trạng thái ẩn. Test việc nhúng YouTube bằng tài khoản học viên trước khi xuất bản. Link được mã hóa trong DB, nhưng ID xuất hiện khi phát — không phải DRM.
4. Nút nhập mẫu có thể chạy lại; chỉ thêm lesson/config chưa có và nâng cấp đề mẫu gốc, không đè giáo án admin đã sửa.

## Vận hành máy chấm

- QuickJS WebAssembly nằm trong tiến trình Node con, không gắn callback I/O, không truyền biến môi trường bí mật. Heap QuickJS 16 MB, stack 256 KB, interrupt 250 ms/test, watchdog ngoài 10 giây. Tối đa 2 runner/tiến trình ứng dụng; mỗi tài khoản cách lượt chấm 12 giây.
- Kết quả test ẩn chỉ trả tổng số đạt, không trả input/expected. Chạy mẫu không ghi submission/XP. Nộp đúng được 30 XP/bài với khóa chống cộng trùng trên user.
- Chạy trên Node server có quyền tạo tiến trình và giữ `scripts/judge-worker.mjs` cùng dependencies. Chưa xác minh trên hosting serverless.
- **Trước khi mở công khai quy mô lớn:** chuyển runner sang máy/container riêng không có secrets, giới hạn CPU/RAM/PID bằng hệ điều hành, tắt mạng, filesystem read-only, hàng đợi toàn cục và giám sát. Giới hạn heap QuickJS/V8 không phải giới hạn RSS toàn tiến trình; watchdog không thay thế sandbox cấp hệ điều hành.
- Kiểm tra: `node scripts/teaching-check.mjs`; nhập mẫu: thêm `--seed`; kiểm tra tích hợp trên localhost:3000: `node scripts/auth-smoke.mjs`. Script cuối chỉ xóa các tài khoản test do chính nó tạo.
