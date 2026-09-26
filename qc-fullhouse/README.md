# Fullhouse QC

Công cụ nội bộ dành cho QC Fullhouse quản lý giáo viên, contest và đánh giá từng buổi học được đồng bộ từ FullhouseDev. Ứng dụng sử dụng Next.js App Router, Ant Design và MongoDB Atlas.

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Nếu cổng 3000 đang được sử dụng, Next.js sẽ chọn cổng kế tiếp.

## Biến môi trường

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
MONGODB_DB=fullhouse_qc
APP_LOGIN_USERNAME=qc-fullhouse
APP_LOGIN_PASSWORD=change-this-password
APP_SESSION_SECRET=generate-a-long-random-secret
FULLHOUSE_SESSION_COOKIE=sessionid=<copy-from-browser-request>
FULLHOUSE_CRAWL_CONCURRENCY=4
```

Không commit `.env.local`. File này đã được loại trừ bởi `.gitignore`.

## API

- `GET /api/dashboard`: đọc KPI giáo viên và các record cần QC.
- `GET /api/qc-sessions`: danh sách buổi học đã crawl cùng trạng thái recording/QC.
- `POST /api/evaluations`: lưu kết quả QC của một buổi học.
- `/api/manage/teachers`: CRUD giáo viên.
- `/api/manage/contests`: CRUD contest, phân công giáo viên và quản lý thời gian bắt đầu/kết thúc.
- `GET /api/schedule?month=YYYY-MM`: lịch tháng, số buổi học và giáo viên theo ngày.

Các route `/api/manage/*` hỗ trợ `GET`, `POST`, `PUT` và `DELETE`. Contest bắt buộc gắn với một hoặc nhiều giáo viên, lưu thời gian bắt đầu/kết thúc và được giao diện tự động tính trạng thái cùng thời hạn còn lại.

## Crawl buổi học trên web

1. Đăng nhập `fullhousedev.com` trên trình duyệt.
2. Mở **QC buổi học** → **Crawl buổi học**.
3. Tải file `cookies.txt`/JSON export từ trình duyệt hoặc dán giá trị Cookie có `sessionid`.
4. Bấm **Bắt đầu crawl**. Cookie chỉ được dùng trong lần chạy hiện tại và không được lưu vào MongoDB.

Ngoài ra có thể chạy bằng CLI bằng cách đặt `FULLHOUSE_SESSION_COOKIE` trong `.env.local` rồi chạy:

```bash
npm run crawl:sessions
```

Hoặc dùng trực tiếp file cookie export:

```bash
npm run crawl:sessions -- --cookie-file=/duong-dan/fullhousedev-cookies.json
```

Crawl riêng một contest:

```bash
npm run crawl:sessions -- --contest=pynhatanh1on1062026
```

Script đọc danh sách contest hiện có trong MongoDB, crawl các buổi học và recording, sau đó upsert vào `class_sessions`. Link manifest được lưu ở `recordingManifestUrls`; các URL media `.webm`/`.ogg` công khai bên trong manifest được lưu ở `recordingMediaUrls` để sao chép từ màn hình QC sang công cụ phân tích. Điểm và nhận xét QC đã lưu không bị ghi đè khi crawl lại. Cookie chỉ nằm trong `.env.local`, không được commit hoặc gửi lên client.

## Quy trình QC

1. Chạy `npm run crawl:sessions` trên máy local.
2. Mở **QC buổi học** và lọc trạng thái **Chờ QC**.
3. Mở recording của từng buổi, chấm điểm, chọn kết quả và ghi nhận xét.
4. Dùng **Lịch buổi học** để xem số buổi và giáo viên theo ngày/ca.

Màn hình **Lịch buổi học** hiển thị số buổi ngay trên từng ngày, số ca tối, các contest chạy song song và giáo viên phụ trách. Có thể lọc nhanh theo buổi sáng, chiều hoặc tối.

Ví dụ payload cho API đánh giá:

```json
{
  "sessionId": "<mongo-object-id>",
  "score": 92,
  "outcome": "reviewed",
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

Crawler có thể chạy từ giao diện web trên Node.js runtime. Không đưa `FULLHOUSE_SESSION_COOKIE` lên Vercel; người dùng tải file cookie hoặc dán cookie cho từng lượt chạy. Khi triển khai ứng dụng, cấu hình các biến MongoDB và đăng nhập nội bộ của ứng dụng. Route crawler khai báo thời gian chạy tối đa 300 giây, nhưng giới hạn thực tế vẫn phụ thuộc gói của nền tảng triển khai.
