# Rà soát giao diện — 24/09/2026

## Các vấn đề và thay đổi

- Thẻ bảo hiểm có quá nhiều lớp: số thứ tự, nhãn viết hoa, icon, mũi tên nổi và CTA. Đã giữ lại ảnh, tiêu đề, mô tả và một CTA.
- Trang dịch vụ: thay thẻ dọc lớn bằng hai cột thẻ ngang. Chiều cao desktop 1440px giảm từ 526px xuống 205px.
- Trang chủ: thẻ sản phẩm giảm từ 466px xuống 311px, ảnh cao 158px.
- Điện thoại 390px: danh sách bảo hiểm dùng ảnh 104px bên trái, thẻ cao khoảng 149px thay vì 470–508px. Thông tin vẫn được hiển thị đầy đủ.
- Cập nhật kích thước ảnh responsive phù hợp object-fit cover để thumbnail không bị nhòe.
- Bộ lọc chuyển sang nút aria-pressed trong nhóm có nhãn, phù hợp chức năng lọc thay vì khai báo tab không có tabpanel.
- Đồng bộ cỡ tiêu đề, nhịp khoảng cách, chiều cao ảnh, thẻ nội dung và biểu mẫu trên tất cả nhóm trang.
- Trang chủ bỏ khối hỗ trợ lặp; liên kết bồi thường vẫn có ở điều hướng và footer.
- Danh sách showcase xem trước và cẩm nang chuyển thành bố cục gọn trên điện thoại.
- Đã kiểm tra chữ tiếng Việt sử dụng đúng font Manrope, không rơi về Arial.

## Kiểm tra

- 18 trang trả về HTTP 200, mỗi trang có một H1, ảnh tải thành công.
- Không tràn ngang ở 375px, 768px và 1440px; rà thêm bố cục đại diện ở 390px.
- Không phát hiện chữ bị cắt ngang trong các heading, đoạn văn, nút và liên kết của các nhóm trang đại diện.
- Luồng lọc doanh nghiệp → trang chi tiết → trang liên hệ giữ đúng sản phẩm đã chọn.
- Số điện thoại không hợp lệ bị chặn; trạng thái soạn email hiển thị; menu mobile, FAQ và reduced-motion hoạt động.
- Không có pageerror trong lượt kiểm tra Playwright.
- Build production, TypeScript, ESLint thành công.

Biểu mẫu tiếp tục dùng mailto như phạm vi hiện tại: chưa có backend nhận hồ sơ hay gửi email tự động.

## Graphics review — 24 September 2026

- Reviewed original family, consultation, automotive, travel and business photographs visually; no obvious malformed anatomy, broken assets or unintended stretching identified. Icons are SVG/CSS and remain crisp.
- Found mobile home hero was enlarging a landscape source to cover a 390×848 box, requiring 2544 source pixels at 2× while loading only 1080. Replaced with a generated 1024×1536 portrait and a separate picture source; added visible breathing room so content does not hide the family. Desktop also uses a new composition with subject to the right and clear copy space.
- Recovered native 1536×1024 sources for automotive, travel and business rather than the previous 1100px exports. Product detail / story cover optimization quality raised to 85.
- Verified all 18 content routes: HTTP 200, single H1, no broken images; no horizontal overflow at 375, 768, 1440. Product filter, detail-to-contact selection, phone validation, mobile navigation, FAQ and reduced-motion checks passed; no runtime exceptions. Vietnamese heading glyphs rendered using Manrope.
- Inspected screenshots of desktop/mobile home, about and automotive detail and all image geometries on 12 representative routes at 2× pixel density. Build and lint successful.
- Limit: image generation returned 1536px desktop output despite a higher-resolution request. Full-width desktop background photographs and story covers do not provide native 2× detail across a 1440px viewport; no synthetic upscaling was used. They load normally and are suitable at approximately 1×; true high-resolution photography would improve large Retina displays further.
- Exact new prompts and actual asset dimensions recorded in image-prompts.md.

## Contrast and service graphics pass

- Replaced the three home service-value icons with dedicated transparent 3D spot illustrations (conversation, document clarity, support), with responsive right-aligned image areas.
- Removed the page-level animation starting at opacity 0.4, so content is fully opaque immediately on navigation.
- Darkened secondary card text, labels, muted headings, orbit lines and nodes; strengthened card borders and footer line decoration. Increased tiny benefit labels to 10px.
- Verified the three images decode and layouts do not overflow at 390, 768, 1024 and 1440px; inspected desktop and mobile screenshots. Lint and production build passed.
