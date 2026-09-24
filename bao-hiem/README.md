# Bảo Tín An Tâm

Website tiếng Việt của đại lý bảo hiểm MIC & PVI, xây dựng bằng Next.js 16 / React 19. Thiết kế tham khảo cấu trúc Insurance Framer, sử dụng nền trắng, gradient xanh ngọc, thẻ kính mờ và font Manrope hỗ trợ đầy đủ tiếng Việt.

## Chạy dự án

```sh
npm install
npm run dev -- --port 3001
```

Kiểm tra: `npm run lint` và `npm run build`. Chạy production: `npm run start` sau khi build.

## Các trang

- `/`: Trang chủ, dịch vụ, giới thiệu, góc an tâm, tư vấn, câu hỏi và cẩm nang.
- `/ve-chung-toi`: Câu chuyện thương hiệu, giá trị và thông tin pháp lý doanh nghiệp.
- `/san-pham`: Lọc nhóm sản phẩm; bốn trang chi tiết tại `/san-pham/[slug]`.
- `/cau-chuyen`: Bốn tình huống minh họa với trang chi tiết riêng tại `/cau-chuyen/[slug]`.
- `/cam-nang`: Ba bài hướng dẫn và trang chi tiết tại `/cam-nang/[slug]`.
- `/boi-thuong`: Quy trình hướng dẫn, kênh nhà bảo hiểm và FAQ.
- `/lien-he`: Biểu mẫu tư vấn, nhận sản phẩm đã chọn qua `?san-pham=slug`.

Tổng cộng 18 trang nội dung, kèm trang 404. Điều hướng Next Link, metadata riêng từng trang, responsive desktop/tablet/mobile; hỗ trợ giảm chuyển động.

## Liên hệ và giới hạn vận hành

Điện thoại và email thật theo hồ sơ doanh nghiệp. Biểu mẫu mở ứng dụng email bằng `mailto:`; người dùng phải kiểm tra và gửi email. Chưa có backend tiếp nhận, CRM hoặc gửi email tự động. Website đang chạy cục bộ, chưa cấu hình hosting hoặc tên miền.

Showcase là các **tình huống minh họa**, không phải khách hàng, ca bồi thường hay lời chứng thực thực tế. Không sử dụng số liệu thành tích hoặc nhân viên giả định. Các ảnh người được tạo bằng AI và dùng làm hình minh họa.

## Nguồn

- Giấy đăng ký do người dùng cung cấp: Công ty TNHH Bảo Tín An Tâm; MST 0319574619; đăng ký 29/05/2026; 750/9/9A Nguyễn Kiệm, Phường Đức Nhuận, TP.HCM; 0985 775 836; baotinantam@gmail.com. Không công khai thông tin định danh cá nhân.
- MIC: https://baohiem.mic.vn/product và https://e.mic.vn/bao-hiem-vat-chat-xe-mic
- PVI: https://www.pvi.com.vn/vi/products/personal
- Hướng dẫn PVI: https://online.pvi.com.vn/huong-dan-boi-thuong và https://online.pvi.com.vn/huong-dan-mua-va-quan-ly-hop-dong-bao-hiem
- Logo đối tác lấy từ website chính thức MIC/PVI. Quan hệ đại lý theo thông tin người dùng cung cấp.
- Thiết kế tham khảo: https://insurance-template.framer.website/ và các trang `/about-us`, `/services`, `/showcases`. Nội dung viết riêng bằng tiếng Việt, không nhập số liệu và đánh giá của mẫu.

## Hình ảnh

Logo và sáu nhóm ảnh (logo, gia đình, ô tô, du lịch, doanh nghiệp, tư vấn) tạo bằng image_gen tích hợp, tối ưu WebP và lưu tại `public/images/`. Prompt đầy đủ ở `docs/image-prompts.md`.

## Kiểm tra đã thực hiện

- Build production, TypeScript và ESLint.
- HTTP 200 và một H1 cho 18 trang; ảnh tải thành công.
- Không tràn ngang ở 375px, 768px, 1440px.
- Lọc doanh nghiệp, mở chi tiết, chuyển đúng sản phẩm sang liên hệ.
- Chặn số điện thoại không hợp lệ, hiển thị hướng dẫn email, menu mobile, FAQ và reduced-motion.
- Kiểm tra font thực tế của chữ tiếng Việt bằng Chrome DevTools Protocol.
