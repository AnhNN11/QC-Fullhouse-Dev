import json,ast
from pathlib import Path
# Each module states a concrete teaching focus and observable output.
M=[
[('Làm quen Scratch; sự kiện, trình tự','Hoạt cảnh điều khiển nhân vật'),('Vòng lặp, tọa độ và âm thanh','Hoạt hình có chuyển động'),('Điều kiện, cảm biến và tương tác','Truyện có lựa chọn'),('Ghép cảnh, sửa lỗi và trình bày','Truyện tương tác hoàn chỉnh')],
[('Thiết kế luật chơi; điều khiển nhân vật','Bản mẫu màn chơi'),('Va chạm, điểm số và thời gian','Game có tính điểm'),('Biến, bản sao và nhiều màn','Game có độ khó tăng dần'),('Kiểm thử, cân bằng và giới thiệu','Game hoàn chỉnh kèm hướng dẫn')],
[('Biến, kiểu dữ liệu, nhập và xuất','Chương trình hỏi đáp'),('Điều kiện và vòng lặp','Game đoán số'),('Danh sách, chuỗi và hàm','Bộ câu hỏi trắc nghiệm'),('Chia bài toán, sửa lỗi và dự án','Ứng dụng quiz có tính điểm')],
[('Ôn hàm; cấu trúc dữ liệu','Chương trình xử lý danh sách'),('Tệp, JSON và xử lý ngoại lệ','Lưu và đọc thông tin'),('Mô-đun, đối tượng và kiểm thử','Chương trình chia thành mô-đun'),('Thiết kế và hoàn thiện dự án','Ứng dụng quản lý thông tin')],
[('AI làm được gì; dữ liệu cá nhân','Nhận diện giới hạn và dữ liệu cần giữ kín'),('Đặt câu hỏi có mục tiêu và ngữ cảnh','Bộ câu hỏi hỗ trợ học tập'),('Kiểm chứng và ghi nguồn','So sánh câu trả lời với nguồn gốc'),('Dự án học tập; giải thích cách dùng AI','Sản phẩm có nguồn và phần tự thực hiện')],
[('Kiểm tra đầu vào; xác định chương trình','Danh sách kiến thức cần củng cố'),('Học lại chủ đề còn thiếu theo khối','Bài thực hành theo chương trình'),('Luyện bài tích hợp và sửa lỗi','Bộ bài tập tự giải'),('Ôn tập và đánh giá cuối khóa','Bài kiểm tra thực hành; kế hoạch tiếp theo')],
[('Giao diện, sprite, object và room','Màn chơi với nhân vật'),('Sự kiện và chuyển động trực quan','Nhân vật điều khiển được'),('Va chạm, vật phẩm và điểm số','Game thu thập vật phẩm'),('Màn chơi, âm thanh và kiểm thử','Game 2D đầu tiên')],
[('GML: biến, điều kiện và vòng lặp','Cơ chế nhân vật bằng code'),('Hàm, trạng thái và va chạm','Nhân vật có trạng thái chơi'),('Kẻ địch, vật phẩm và giao diện','Màn chơi đầy đủ cơ chế'),('Lưu tiến độ, tối ưu và hoàn thiện','Game có nhiều màn và tài liệu')],
[('Studio; không gian 3D và đối tượng','Bản đồ nhỏ có bố cục'),('Địa hình, vật liệu và ánh sáng','Màn chơi được trang trí'),('Tương tác cơ bản và điểm hồi sinh','Màn vượt chướng ngại vật'),('Kiểm thử độ khó và trình bày','Trải nghiệm chơi có thể thử nội bộ')],
[('Luau: biến, hàm và sự kiện','Đối tượng phản hồi tương tác'),('Máy khách, máy chủ và RemoteEvent','Tương tác qua máy chủ'),('Điểm số, dữ liệu và kiểm tra đầu vào','Hệ thống điểm và lưu tiến độ mẫu'),('Ghép cơ chế; kiểm thử nhiều người','Game nhỏ có luật chơi rõ ràng')],
[('Vòng lặp game, màn hình và đầu vào','Nhân vật di chuyển'),('Va chạm, chuyển động và tài nguyên','Cơ chế chơi cơ bản'),('Điểm, âm thanh và trạng thái','Game có menu và kết quả'),('Thiết kế màn, sửa lỗi và đóng gói','Game 2D chạy trên máy tính')],
[('Scene, node và GDScript cơ bản','Scene tương tác'),('Input, chuyển động và vật lý 2D','Nhân vật và chướng ngại'),('Signal, giao diện và nhiều scene','Luồng chơi có menu'),('Dự án, kiểm thử và xuất bản chạy thử','Game 2D có thể trình diễn')],
[('HTML ngữ nghĩa, liên kết và ảnh','Trang giới thiệu có cấu trúc'),('CSS: màu, chữ và hộp bố cục','Trang được định dạng'),('Flexbox, Grid và responsive','Giao diện trên điện thoại'),('Khả năng truy cập; hoàn thiện và triển khai','Website cá nhân nhiều trang')],
[('Biến, dữ liệu, điều kiện và vòng lặp','Bài tập xử lý logic'),('Hàm, mảng và đối tượng','Xử lý dữ liệu quiz'),('DOM, sự kiện và biểu mẫu','Trang phản hồi thao tác'),('Bất đồng bộ, fetch và dự án','Quiz tương tác; xử lý lỗi cơ bản')],
[('Đọc yêu cầu; wireframe và cấu trúc','Bản thiết kế giao diện'),('Tổ chức CSS, thành phần và responsive','Bộ giao diện nhất quán'),('Tương tác, biểu mẫu và API mẫu','Trang hoạt động với dữ liệu'),('Kiểm thử, truy cập và triển khai','Website hoàn thiện kèm hướng dẫn')],
[('Component, JSX, props và state','Giao diện chia thành thành phần'),('Biểu mẫu, effect và chia sẻ state','Luồng nhập và cập nhật dữ liệu'),('Điều hướng, API và trạng thái tải/lỗi','Ứng dụng nhiều màn hình'),('Kiểm thử, cấu trúc và triển khai','Ứng dụng React theo đề tài')],
[('HTTP, Node.js và định tuyến','API đầu tiên'),('Cơ sở dữ liệu và CRUD','API lưu, đọc và sửa dữ liệu'),('Validation, lỗi và cấu hình','API có kiểm tra đầu vào'),('Kiểm thử, tài liệu và triển khai','Backend có tài liệu endpoint')],
[('Thiết kế dữ liệu và tổ chức dịch vụ','Sơ đồ dữ liệu và mã có cấu trúc'),('Xác thực và quản lý phiên','Đăng nhập đúng luồng'),('Phân quyền, kiểm tra và bảo vệ dữ liệu','Kiểm thử quyền truy cập'),('Truy vấn, nhật ký và vận hành','Backend được kiểm thử, triển khai')],
[('Yêu cầu, luồng người dùng và schema','Kế hoạch dự án cùng giao diện mẫu'),('Kết nối React, API và CRUD','Luồng dữ liệu xuyên suốt'),('Tài khoản, phân quyền và xử lý lỗi','Tính năng chính hoạt động'),('Kiểm thử toàn luồng và triển khai','Ứng dụng web hoàn chỉnh')],
[('Designer, component và sự kiện','Màn hình có tương tác'),('Biến, điều kiện và chuyển màn','Quiz nhiều câu hỏi'),('Lưu cục bộ và tính năng thiết bị','App lưu thông tin'),('Kiểm thử trên thiết bị và trình bày','App thời khóa biểu hoặc quiz')],
[('Kotlin nhập môn; công cụ Android','Chương trình Kotlin nhỏ'),('Giao diện và xử lý tương tác','App một màn hình'),('Điều hướng, state và danh sách','App nhiều màn hình'),('Lưu cục bộ; kiểm thử và dự án','App ghi chú hoặc lịch học')],
[('Kiến trúc app và bất đồng bộ','Dự án có cấu trúc'),('API, tải dữ liệu và lỗi mạng','Màn hình dữ liệu trực tuyến'),('Lưu trữ, tài khoản và phiên','Luồng tài khoản và dữ liệu'),('Kiểm thử, quyền thiết bị và bản chạy','App Android hoàn chỉnh')],
[('Swift nhập môn và Xcode','Bài tập Swift và app đầu tiên'),('SwiftUI: view, layout và state','Giao diện phản hồi thao tác'),('Điều hướng, danh sách và biểu mẫu','App nhiều màn hình'),('Lưu cục bộ; kiểm thử và dự án','App iPhone chạy trên môi trường học')],
[('Tổ chức app và quản lý trạng thái','Dự án có cấu trúc rõ'),('Bất đồng bộ, API và xử lý lỗi','App tải dữ liệu trực tuyến'),('Lưu trữ và quản lý tài khoản','Luồng dữ liệu và tài khoản'),('Kiểm thử, khả năng truy cập và demo','App iOS hoàn thiện để trình bày')],
[('Dart nhập môn và công cụ Flutter','App Flutter đầu tiên'),('Widget, layout và tương tác','Bộ màn hình có bố cục'),('State, điều hướng và biểu mẫu','App nhiều màn hình'),('Lưu cục bộ; kiểm thử và dự án','App quản lý lịch học')],
[('Kiến trúc và quản lý state','Dự án tổ chức theo tính năng'),('API, lỗi mạng và lưu dữ liệu','Luồng dữ liệu trực tuyến'),('Tài khoản và thông báo','Tính năng tài khoản hoạt động'),('Kiểm thử đa thiết bị và hoàn thiện','App Flutter nâng cao')],
[('Công cụ; component và layout mobile','Giao diện app đầu tiên'),('Điều hướng, state và biểu mẫu','App nhiều màn hình'),('API, lưu cục bộ và quyền thiết bị','App kết nối dịch vụ'),('Kiểm thử và bản chạy thử','Ứng dụng React Native hoàn chỉnh')],
[('Yêu cầu, API contract và dữ liệu','Thiết kế mobile cùng backend'),('Xây app, API và CRUD','Luồng dữ liệu đầu cuối'),('Tài khoản, quyền và lỗi mạng','Luồng người dùng đầy đủ'),('Kiểm thử, triển khai máy chủ và demo','App cùng backend vận hành thử')],
[('Chọn bài toán và giới hạn phạm vi','Đề cương, wireframe và tiêu chí'),('Xây dựng tính năng cốt lõi','Bản mẫu sử dụng được'),('Hoàn thiện và kiểm thử với người dùng','Danh sách lỗi và bản cải tiến'),('Tài liệu, trình diễn và phản biện','Hồ sơ dự án cá nhân')],
[('Biến, kiểu dữ liệu và nhập xuất','Chương trình tính toán'),('Điều kiện và vòng lặp','Bài toán logic'),('Mảng, chuỗi và hàm','Bộ bài tập xử lý dữ liệu'),('Độ phức tạp cơ bản và luyện tập','Bài đánh giá tự giải')],
[('Độ phức tạp, mảng, sắp xếp và tìm kiếm','Giải thích và so sánh lời giải'),('Ngăn xếp, hàng đợi và cấu trúc tập hợp','Giải bài với cấu trúc phù hợp'),('Đệ quy, tham lam và đồ thị cơ bản','Bài tập duyệt và tối ưu'),('Quy hoạch động nhập môn; tổng hợp','Bộ lời giải có kiểm thử')],
[('Kiểm tra đầu vào; chọn kỳ thi và dạng bài','Bản đồ năng lực cá nhân'),('Bổ sung chuyên đề còn thiếu','Bộ bài theo chuyên đề'),('Luyện đề có thời gian và chữa bài','Nhật ký lỗi và chiến thuật làm bài'),('Thi thử, phân tích và ôn trọng điểm','Kế hoạch ôn tiếp; không cam kết giải')],
[('Làm quen bo mạch; đèn và nút bấm','Bảng hiển thị tương tác'),('Cảm biến, điều kiện và vòng lặp','Thiết bị phản hồi môi trường'),('Trao đổi tín hiệu và tích hợp','Nguyên mẫu theo bộ kit'),('Kiểm thử và giới thiệu dự án','Thiết bị nhỏ giải quyết một nhu cầu')],
[('Bộ kit, an toàn và lắp ráp','Robot cơ bản'),('Động cơ và điều khiển chuyển động','Robot di chuyển theo lệnh'),('Cảm biến và thuật toán điều khiển','Robot thực hiện nhiệm vụ'),('Hiệu chỉnh, thử nghiệm và trình bày','Robot hoạt động cùng nhật ký thử')]
]
bs=json.loads(Path('tmp/pdfs/sheet_batches.json').read_text())
for b in bs:b['title']=b['title'].replace(':','')
N=[12,12,16,16,8,12,16,20,16,20,16,20,12,16,16,20,20,20,24,12,20,20,20,20,20,20,20,24,12,16,24,24,12,16]
mods=[]
for i in range(34):
 n=N[i];q,rem=divmod(n,4);start=1;st=[]
 for j,(topic,out) in enumerate(M[i]):
  count=q+(j<rem);end=start+count-1
  st.append([f'Chặng {j+1}',f'Buổi {start}-{end}',topic,out,'Hoàn thiện sản phẩm; làm 1 biến thể theo đề giáo viên.','Tự chạy sản phẩm; giải thích phần đã làm; sửa lỗi từ phản hồi.'])
  start=end+1
 mods.append(st)
mods += [
 [['Khởi động','0-15 phút','Giới thiệu và xem game mẫu','Hiểu nhiệm vụ','','Nêu được luật chơi'],['Thực hành','15-60 phút','Tạo nhân vật, điều khiển và mục tiêu','Bản mẫu game','Tùy biến nhân vật','Tự điều khiển nhân vật'],['Hoàn thiện','60-80 phút','Thêm điểm số; sửa lỗi','Game chơi được','Thử thêm một thử thách','Chơi được từ đầu đến cuối'],['Chia sẻ','80-90 phút','Trình diễn và gợi ý lộ trình','Biết bước học tiếp','Tiếp tục cải tiến','Giải thích một thao tác lập trình']],
 [['Khám phá','Buổi 1-2','Chọn công cụ, chủ đề và cơ chế cơ bản','Đề cương và mẫu đầu tiên','Thử 1 ý tưởng','Nêu mục tiêu dự án'],['Xây dựng','Buổi 3-4','Làm tính năng chính','Bản mẫu hoạt động','Hoàn thiện tính năng','Tự chạy luồng chính'],['Hoàn thiện','Buổi 5-6','Thêm nội dung; thử và sửa lỗi','Bản có thể trình diễn','Ghi nhật ký lỗi','Sửa được lỗi từ phản hồi'],['Trình bày','Buổi 7-8','Hoàn thiện sản phẩm và chia sẻ','Dự án cuối trại hè','Viết mô tả ngắn','Giải thích sản phẩm của mình']],
 [['Khám phá','Buổi 1','Giới thiệu chủ đề tháng và thử mẫu','Ý tưởng dự án','Chuẩn bị dữ liệu/tài nguyên','Nêu mục tiêu'],['Thực hiện','Buổi 2','Xây tính năng cốt lõi','Bản mẫu','Hoàn thiện tính năng','Tự chạy bản mẫu'],['Cải tiến','Buổi 3','Phản hồi chéo và sửa lỗi','Bản cải tiến','Ghi lại thay đổi','Giải thích cách sửa'],['Chia sẻ','Buổi 4','Trình diễn và chọn mục tiêu mới','Dự án tháng','Đề xuất chủ đề mới','Trình bày quá trình học']],
 [['Chẩn đoán','Buổi 1','Xem bài làm; xác định chỗ chưa hiểu','Mục tiêu hỗ trợ cá nhân','Làm bài tương đương','Giải thích lỗi cũ'],['Củng cố','Buổi 2','Học lại kiến thức cần thiết','Bài tập tự giải','Luyện theo điểm yếu','Tự giải bài tương đương'],['Áp dụng','Buổi 3','Vận dụng vào bài hoặc dự án','Phần việc tự hoàn thành','Kiểm thử và ghi câu hỏi','Tự sửa ít nhất một lỗi'],['Đánh giá','Buổi 4','Kiểm tra tiến bộ và hướng tiếp','Kế hoạch tự học','Tiếp tục luyện tập','Làm bài mới không cần làm hộ']]
]
reqs=[]
for i,b in enumerate(bs):
 sid=b['sheetId'];rows=[['LỘ TRÌNH ONLINE','Khung đề xuất; điều chỉnh sau đánh giá đầu vào','','','',''],['Chặng','Buổi / thời gian','Nội dung dạy','Đầu ra thực hành','Bài tập sau buổi','Tiêu chí đánh giá']]+mods[i]+[
 ['Khung buổi 90 phút','10 phút ôn bài; 15 phút hướng dẫn; 45 phút thực hành; 15 phút sửa bài; 5 phút giao bài.','','','',''],
 ['Lớp nhóm','4-8 học sinh cùng đầu vào; dạy theo chặng, phân bài tập cơ bản/nâng cao; kiểm tra cuối mỗi chặng.','','','',''],
 ['Lớp 1-1','Đánh giá đầu vào; có thể rút/gia hạn từng chặng. Thống nhất lại số buổi và học phí trước khi thay đổi.','','','',''],
 ['Điều kiện chuyển chặng','Hoàn thành tính năng chính, giải thích cách làm và sửa được lỗi cơ bản; bổ sung bài củng cố nếu chưa đạt.','','','',''],
 ['Phản hồi phụ huynh','Sau mỗi chặng: báo nội dung đã học, sản phẩm, điểm cần luyện và nhiệm vụ tiếp theo.','','','',''],
 ['Ghi chú','Đây là khung lộ trình, chưa thay thế giáo án từng buổi. Đầu vào, công cụ và độ khó do giáo viên xác nhận.','','','','']]
 if i==34:rows[6][1]='Workshop dùng phân bổ 90 phút ở bốn chặng trên.'
 def ran(a,b,c=0,d=6):return {'sheetId':sid,'startRowIndex':a,'endRowIndex':b,'startColumnIndex':c,'endColumnIndex':d}
 req=[{'updateCells':{'range':ran(19,31),'rows':[{'values':[{'userEnteredValue':{'stringValue':str(v)}} for v in rr]} for rr in rows],'fields':'userEnteredValue'}},
 {'repeatCell':{'range':ran(19,31),'cell':{'userEnteredFormat':{'textFormat':{'fontFamily':'Arial','fontSize':11},'wrapStrategy':'WRAP','verticalAlignment':'TOP'}},'fields':'userEnteredFormat'}},
 {'repeatCell':{'range':ran(19,21),'cell':{'userEnteredFormat':{'backgroundColor':{'red':.93,'green':.94,'blue':.95},'textFormat':{'bold':True}}},'fields':'userEnteredFormat(backgroundColor,textFormat.bold)'}},
 {'updateDimensionProperties':{'range':{'sheetId':sid,'dimension':'ROWS','startIndex':19,'endIndex':31},'properties':{'pixelSize':58},'fields':'pixelSize'}},
 {'updateDimensionProperties':{'range':{'sheetId':sid,'dimension':'ROWS','startIndex':21,'endIndex':25},'properties':{'pixelSize':112},'fields':'pixelSize'}}]
 for r in [19,25,26,27,28,29,30]:req.append({'mergeCells':{'range':ran(r,r+1,1,6),'mergeType':'MERGE_ALL'}})
 reqs.append({'title':b['title'],'sheetId':sid,'modules':mods[i],'requests':req})
Path('tmp/pdfs/roadmap_batches.json').write_text(json.dumps(reqs,ensure_ascii=False))
print('Built',len(reqs),'product roadmaps')
