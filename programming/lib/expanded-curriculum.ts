import type { Course } from "./types";
type Track = { course: Omit<Course, "progress">; prerequisite: string; resource: string; lessons: [string, string, string][] };
export const expandedCurriculum: Track[] = [
  { course: { id: "scratch-blocks", title: "Lập trình kéo thả cùng cá heo", description: "Học trình tự, vòng lặp và điều kiện qua khối lệnh. Có giáo án và video demo; thực hành tại phòng khối lệnh DolphinX.", icon: "▦", color: "blue", level: "Cơ bản", lessons: 5, students: "0", modules: ["Trình tự", "Di chuyển", "Vòng lặp", "Điều kiện", "Thử thách tổng hợp"] }, prerequisite: "Không cần biết code. Biết dùng chuột hoặc màn hình cảm ứng.", resource: "https://scratch.mit.edu/ideas", lessons: [
    ["Chương trình là một chuỗi chỉ dẫn", "Giải thích vì sao thứ tự các khối làm thay đổi kết quả.", "Trong phòng khối lệnh, ghép đi tới và quay phải; chạy hai thứ tự khác nhau rồi so sánh vị trí cá heo."],
    ["Tọa độ và hướng di chuyển", "Đọc ô bắt đầu, hướng quay và đích đến trên bản đồ.", "Vẽ đường đi trước khi kéo khối; đưa cá heo tới đích mà không đi qua tường hoặc ra ngoài bản đồ."],
    ["Lặp để chương trình ngắn hơn", "Nhận ra một chuỗi thao tác lặp và đặt nó trong khối lặp.", "Thay chuỗi đi tới giống nhau bằng lặp; kiểm tra kết quả không đổi và đếm số khối giảm."],
    ["Nếu phía trước có đường", "Dùng điều kiện để xử lý bản đồ thay đổi.", "Dùng nếu đường trống thì đi tới, ngược lại quay; thử ít nhất hai vị trí tường và giải thích quyết định."],
    ["Dự án: hành trình nhặt sao", "Kết hợp trình tự, vòng lặp và điều kiện; sửa lỗi dựa trên dấu vết chạy.", "Hoàn thành thử thách nhặt sao. Ghi lại một chương trình sai, vị trí lỗi và cách sửa; nộp bài để xem rubric chấm điểm."],
  ]},
  { course: { id: "javascript-practical", title: "JavaScript: từ hàm đến ứng dụng", description: "5 bài có giáo án, bài thực hành và video demo: dữ liệu, DOM, bất đồng bộ và mini project tìm kiếm.", icon: "JS", color: "yellow", level: "Cơ bản", lessons: 5, students: "0", modules: ["Dữ liệu", "Hàm", "DOM", "Bất đồng bộ", "Dự án"] }, prerequisite: "Biết HTML/CSS căn bản và mở DevTools.", resource: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", lessons: [
    ["Kiểu dữ liệu và chuyển đổi", "Phân biệt chuỗi với số và kiểm tra NaN trước khi tính toán.", "Hoàn thành resource Debug tổng tiền giỏ hàng; kiểm tra price='abc', âm và qty thập phân."],
    ["Hàm thuần và trường hợp biên", "Tách logic ra khỏi giao diện để kiểm thử được bằng dữ liệu nhỏ.", "Viết paginate; kiểm tra mảng rỗng, trang cuối và size=0 theo resource Phân trang."],
    ["DOM và sự kiện", "Đọc input và cập nhật text an toàn, không chèn HTML người dùng.", "Tạo danh sách việc cần làm với thêm/xóa và trạng thái rỗng; tên chứa <script> phải được hiển thị như văn bản."],
    ["Promise và cuộc đua request", "Hiểu kết quả có thể về khác thứ tự gửi và ngăn dữ liệu cũ ghi đè.", "Hoàn thành resource Tìm kiếm không trả kết quả cũ; thử delay 800ms và 100ms."],
    ["Dự án: thư viện có tìm kiếm", "Kết hợp tìm kiếm, phân trang và trạng thái lỗi trong một ứng dụng.", "Dựng thư viện 25 mục; đổi query đặt lại page=1; reload có hướng dẫn chạy, kèm ít nhất 6 test logic."],
  ]},
  { course: { id: "typescript-foundations", title: "TypeScript cho dự án thực tế", description: "5 bài từ type cơ bản đến kiểm tra dữ liệu API. Giáo án và bài thực hành sẵn; video demo chờ thay bằng bài quay.", icon: "TS", color: "blue", level: "Trung cấp", lessons: 5, students: "0", modules: ["Kiểu dữ liệu", "Union", "Generic", "Validation", "Dự án"] }, prerequisite: "Viết được hàm và xử lý mảng trong JavaScript.", resource: "https://www.typescriptlang.org/docs/handbook/", lessons: [
    ["Type không phải validation runtime", "Phân biệt lỗi compiler với dữ liệu sai từ bên ngoài.", "Định nghĩa Course; thử gán lessons='5' và giải thích tại sao JSON từ fetch vẫn cần kiểm tra."],
    ["Union và narrowing", "Mô hình hóa các trạng thái khác nhau thay vì dùng nhiều thuộc tính optional.", "Hoàn thành resource Trạng thái tải bằng TypeScript; thêm cancelled để kiểm tra exhaustiveness."],
    ["Generic giữ quan hệ kiểu", "Viết hàm tái sử dụng mà không làm mất kiểu trả về.", "Viết first<T>(items:T[]):T|undefined; compiler phải phân biệt kết quả mảng số và mảng Course."],
    ["Unknown và kiểm tra dữ liệu", "Thu hẹp dữ liệu theo từng điều kiện trước khi sử dụng.", "Hoàn thành parseCourse trong resource Kiểm tra unknown từ API, gồm null, array và thuộc tính thừa."],
    ["Dự án: client API có kiểu", "Kết hợp validation, result union và giao diện không có trạng thái bất khả thi.", "Tạo thư viện khóa học nhận unknown; lỗi schema hiện thông báo và không render thẻ sai; ghi 8 trường hợp kiểm thử."],
  ]},
  { course: { id: "git-teamwork", title: "Git và cộng tác nhóm", description: "5 bài thực hành trên repo thử nghiệm: commit, branch, merge, revert và review. Video demo, có kế hoạch quay từng bài.", icon: "Git", color: "navy", level: "Cơ bản", lessons: 5, students: "0", modules: ["Lịch sử", "Nhánh", "Xung đột", "Hoàn tác", "Code review"] }, prerequisite: "Biết thao tác tệp và mở terminal. Chỉ thực hành trên repo riêng.", resource: "https://git-scm.com/book/en/v2", lessons: [
    ["Working tree, stage và commit", "Phân biệt ba trạng thái của thay đổi và kiểm tra trước khi lưu lịch sử.", "Tạo README, stage một phần thay đổi rồi so sánh git diff và git diff --staged."],
    ["Nhánh cho một tính năng", "Tạo nhánh và chia commit theo mục đích có thể review.", "Làm resource Một tính năng, ba commit; giải thích từng commit và merge về nhánh chính."],
    ["Đọc và giải merge conflict", "Đối chiếu hai phiên bản và chủ động chọn nội dung cuối.", "Làm resource Giải conflict không mất nội dung; kiểm tra không còn marker trước commit."],
    ["Hoàn tác có lịch sử", "Dùng revert để hoàn tác commit đã chia sẻ mà vẫn giữ dấu vết.", "Trong repo thử nghiệm, tạo commit sai rồi revert; kiểm tra file trở về nội dung trước và lịch sử vẫn còn cả hai commit."],
    ["Dự án: bàn giao qua code review", "Giải thích thay đổi, bằng chứng kiểm thử và giới hạn thay vì chỉ gửi code.", "Viết mô tả review gồm mục tiêu, 3 thay đổi, cách test, ảnh mobile và điều chưa làm; nhờ một người chạy theo README."],
  ]},
];
