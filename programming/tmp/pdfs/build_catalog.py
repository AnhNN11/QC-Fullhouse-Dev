from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER
from pypdf import PdfReader
from pathlib import Path
import json
ROOT='/Users/nhatanh/programming'
pdfmetrics.registerFont(TTFont('Arial','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold')
navy=colors.HexColor('#102d56'); blue=colors.HexColor('#1265d9'); muted=colors.HexColor('#51677f'); pale=colors.HexColor('#edf5fc')
styles=getSampleStyleSheet()
for name,size,lead,col in [('Body',10,15,navy),('Small',8.4,11.8,navy),('Tiny',7.7,10.3,navy),('TitleX',29,35,navy),('H1X',21,27,navy),('H2X',13,19,blue),('Note',9,13,muted)]:
 styles.add(ParagraphStyle(name,fontName='Arial',fontSize=size,leading=lead,textColor=col,spaceAfter=8))
styles.add(ParagraphStyle('TH',fontName='ArialBold',fontSize=8,leading=11,textColor=colors.white))
P=lambda t,s='Body':Paragraph(t,styles[s])
story=[]
def add(t,s='Body'):story.append(P(t,s))
def gap(n=10):story.append(Spacer(1,n))
def title(k,t,desc):
 add(k.upper(),'H2X');add(t,'H1X');add(desc,'Note');gap(9)
def table(headers,rows,widths):
 data=[[P(str(x),'TH') for x in headers]]+[[P(str(x),'Small') for x in row] for row in rows]
 t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),navy),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,pale]),('LINEBELOW',(0,0),(-1,0),0.6,blue)]))
 story.append(t)
def page():story.append(PageBreak())
def money(v):return f'{v:,.0f}'.replace(',','.')
# name, audience/output, sessions, video thousands, group per session thousands, private per session thousands
sections=[
('01 / NỀN TẢNG','Lập trình nhập môn','Khởi đầu bằng sản phẩm nhỏ; học sinh mới học không cần đăng ký ngay lộ trình chuyên sâu.',[
('Scratch sáng tạo','Lớp 3-6, mới học. Làm truyện và hoạt hình tương tác.',12,490,125,300),
('Scratch làm game','Lớp 4-7, biết Scratch. Game có điểm số và màn chơi.',12,590,125,300),
('Python cơ bản','Lớp 6-10, mới học. Quiz và chương trình nhỏ.',16,790,150,350),
('Python nâng cao','Lớp 7-12, biết Python cơ bản. Ứng dụng quản lý dữ liệu đơn giản.',16,990,175,400),
('AI và học tập số','Lớp 6-12. Đặt câu hỏi, kiểm chứng thông tin và làm dự án học tập.',8,390,125,300),
('Tin học trên lớp','Khóa riêng theo khối và bộ sách. Củng cố kiến thức, thực hành môn Tin học tại trường.',12,490,125,300)]),
('02 / GAME','Sáng tạo trò chơi','Chọn một công cụ theo sở thích; không cần học lần lượt tất cả các nền tảng.',[
('GameMaker cơ bản','Lớp 6-10, mới học. Tạo game 2D và cơ chế chơi cơ bản.',16,790,150,350),
('GameMaker / GML','Lớp 7-12, biết GameMaker. Lập trình nhân vật, vật phẩm và màn chơi.',20,1190,175,400),
('Roblox Studio','Lớp 5-9, mới học. Dựng thế giới và màn chơi tương tác.',16,790,150,350),
('Roblox / Luau','Lớp 6-12, biết Studio. Lập trình luật chơi và tương tác.',20,1190,175,400),
('Python làm game','Lớp 7-12, biết Python. Làm game 2D bằng code.',16,990,175,400),
('Godot cơ bản','Lớp 7-12, có nền tảng lập trình. Hoàn thiện một game 2D.',20,1190,175,400)]),
('03 / WEBSITE','Frontend, Backend & Fullstack','Khuyến nghị học sinh THCS có nền tảng hoặc THPT. Fullstack là khóa dự án sau Frontend và Backend.',[
('HTML & CSS','Lớp 7-12, mới học. Website cá nhân tương thích điện thoại.',12,590,150,350),
('JavaScript cơ bản','Lớp 8-12, biết HTML/CSS. Quiz và tương tác trên website.',16,790,150,350),
('Frontend dự án','Biết HTML/CSS và JavaScript. Hoàn thiện giao diện web nhiều trang.',16,990,175,400),
('Frontend / React','Biết JavaScript. Ứng dụng web có thành phần và dữ liệu.',20,1290,175,400),
('Backend cơ bản','Biết JavaScript. Node.js, API và cơ sở dữ liệu cơ bản.',20,1290,175,400),
('Backend nâng cao','Biết Backend cơ bản. Đăng nhập, phân quyền và kiểm tra dữ liệu.',20,1490,200,450),
('Fullstack Web','Biết React và Backend. Xây dựng, kiểm thử và triển khai ứng dụng.',24,1790,200,450)]),
('04 / MOBILE','Ứng dụng Android & iOS','Ưu tiên THPT hoặc học sinh có nền tảng. Android, iOS và Flutter là các hướng lựa chọn khác nhau.',[
('App Inventor','Lớp 6-9, mới học. App quiz hoặc thời khóa biểu bằng kéo thả.',12,590,150,350),
('Android / Kotlin','Biết lập trình cơ bản. Kotlin nhập môn và app nhiều màn hình.',20,1190,175,400),
('Android nâng cao','Biết Kotlin và Android. App có API, lưu trữ và tài khoản.',20,1490,200,450),
('iOS / SwiftUI','Biết lập trình cơ bản. Swift nhập môn và app iPhone.',20,1290,200,450),
('iOS nâng cao','Biết Swift/SwiftUI. App kết nối dữ liệu và quản lý trạng thái.',20,1590,200,450),
('Flutter cơ bản','Biết lập trình cơ bản. Dart nhập môn và app đa nền tảng.',20,1190,175,400),
('Flutter nâng cao','Biết Flutter cơ bản. App có tài khoản và dữ liệu trực tuyến.',20,1490,200,450),
('React Native','Biết JavaScript và React. App di động kết nối API.',20,1490,200,450)]),
('05 / CHUYÊN SÂU','Dự án & thuật toán','Các lớp dự án và luyện thi mở theo đầu vào, giáo viên và học liệu phù hợp.',[
('Mobile Fullstack','Biết mobile và Backend. Hoàn thiện app cùng hệ thống máy chủ.',24,1790,200,450),
('Đồ án ứng dụng','Đã hoàn thành lộ trình mobile. Làm, kiểm thử và trình bày app cá nhân.',12,None,200,450),
('C++ cơ bản','Lớp 8-12, mới học. Nền tảng code và bài tập tư duy.',16,790,150,350),
('Cấu trúc dữ liệu & thuật toán','Khóa độc lập, lớp 8-12 đã biết Python/C++. Mảng, chuỗi, tìm kiếm, sắp xếp và cấu trúc dữ liệu nền tảng.',24,1490,200,450),
('Bồi dưỡng HSG Tin','Có nền tảng thuật toán; kiểm tra đầu vào. Luyện theo kỳ thi mục tiêu.',24,None,200,450),
]) ]
sections.append(('BỔ SUNG / NỀN TẢNG & AI','Computer Science & Scratch AI','Hai khóa mới: mỗi buổi 120 phút, gồm 10 phút nghỉ. Giá mới là phương án thử nghiệm.',[
('Computer Science cơ bản','Lớp 6-9, không cần biết code. Hiểu máy tính, dữ liệu, mạng và thuật toán.',16,299,99,349),
('Scratch AI','Lớp 4-8, đã biết Scratch. Làm game tương tác với mô hình phân loại đơn giản.',12,399,119,399)
]))
# cover
add('DOLPHINX EDUCATION','H2X');gap(12)
add('Danh mục sản phẩm<br/>& bảng giá đề xuất','TitleX')
add('Dành cho học sinh tiểu học, THCS và THPT','H2X')
gap(12)
img='/Users/nhatanh/.codex/generated_images/01a0d69f-2dd2-7753-a6ef-8fe7cf0aa21e/exec-0cf18493-4987-4d76-bfd7-8b524b0eb614.png'
story.append(Image(img,width=511,height=193));gap(22)
add('Học lập trình. Kiến tạo tương lai.','H1X')
add('Danh mục gồm 34 khóa học và 4 sản phẩm trải nghiệm / duy trì. Mỗi khóa được phân theo đầu vào, kết quả học tập và hình thức học để tư vấn đúng nhu cầu.')
table(['KHÓA VIDEO','ONLINE NHÓM','ONLINE 1-1'],[['Tự học có cấu trúc<br/>299.000 - 1.790.000 đ/khóa','4-8 học sinh/lớp<br/>99.000 - 200.000 đ/buổi','Lộ trình và phản hồi cá nhân<br/>300.000 - 450.000 đ/buổi']],[170,171,170])
gap(17)
add('<b>BẢN DỰ THẢO | CẬP NHẬT BUỔI 120 PHÚT</b>','Note')
add('PDF giữ bảng giá nền v1 để tham khảo; deal mới, học thử và chi phí 120 phút nằm ở các tab 00 trong Google Sheets. Giá là phương án định giá do DolphinX xem xét, chưa phải giá đã công bố hay kết quả khảo sát thị trường. Danh mục không xác nhận các khóa đã được quay hoặc đang mở tuyển sinh.','Note')
page()
title('CÁCH ĐỌC DANH MỤC','Đúng đối tượng, rõ học phí','Toàn bộ giá trong tài liệu là VNĐ, tính cho một học sinh. Cần duyệt chính sách cuối cùng trước khi gửi phụ huynh.')
table(['Nhóm học sinh','Nhu cầu chính','Sản phẩm nên tư vấn'],[
['Lớp 3-5','Làm quen tư duy và sáng tạo','Scratch sáng tạo và Scratch làm game.'],
['Lớp 6-9','Khám phá sở thích, tự làm sản phẩm','Python, GameMaker, Roblox, App Inventor, HTML/CSS.'],
['Lớp 10-12','Xây nền tảng chuyên sâu và hồ sơ dự án','Frontend, Backend, Fullstack, Android, iOS, Flutter.'],
['Nhóm luyện thi','Củng cố thuật toán và luyện đúng mục tiêu','C++, cấu trúc dữ liệu, HSG Tin; kiểm tra đầu vào.']],[90,170,251])
gap();add('Quy cách sản phẩm đề xuất','H2X')
for x in [
'<b>Khóa video:</b> truy cập 12 tháng; video, bài tập, mã nguồn mẫu và đáp án tham khảo. Không gồm lịch học trực tiếp hay sửa riêng từng bài. Khóa dự án cá nhân và HSG Tin chưa đề xuất bản video.',
'<b>Online nhóm:</b> 4-8 học sinh cùng trình độ; 120 phút/buổi; dự kiến 2 buổi/tuần. Học phí trọn khóa = số buổi × đơn giá. Bao gồm tài liệu và phản hồi bài tập trong thời gian khóa học.',
'<b>Online 1-1:</b> 120 phút/buổi, thống nhất lịch riêng; bảng giá tính theo cùng số buổi để dễ so sánh. Điều chỉnh số buổi sau khi kiểm tra đầu vào.',
'<b>Thời lượng:</b> 12 / 16 / 20 / 24 buổi tương ứng khoảng 6 / 8 / 10 / 12 tuần. Số buổi chỉ áp dụng cho lớp trực tiếp, không phải số video.',
'<b>Thiết bị:</b> cần máy tính và Internet; học iOS cần máy Mac phù hợp. Giá chưa gồm phí phần mềm, cloud, tên miền hoặc tài khoản phát hành ứng dụng.',
'<b>Trước khi công bố:</b> chốt điều kiện học bù, bảo lưu, hoàn học phí và cách thể hiện thuế/hóa đơn. Tài liệu này chưa xác lập các chính sách đó.'
]:add(x,'Note')
page()
for idx,(k,h,d,rows) in enumerate(sections):
 title(k,h,d)
 rr=[]
 for name,target,n,v,g,p in rows:
  rr.append([name,target,str(n),'—' if v is None else money(v*1000),money(n*g*1000),money(n*p*1000)])
 table(['Khóa học','Đối tượng & đầu ra','Buổi','Video\n/khóa','Nhóm\n/khóa','1-1\n/khóa'],rr,[98,155,39,67,76,76])
 gap(14);add('Giá đề xuất • VNĐ/học sinh • Online: 120 phút/buổi • Nhóm: '+('6-8' if idx==5 else '4-8')+' học sinh','Note')
 add('Xếp lớp theo năng lực, không chỉ theo tuổi. Mỗi khóa có một dự án hoặc bài đánh giá cuối khóa; sản phẩm đầu ra là mục tiêu học tập, không phải cam kết thành tích.','Note')
 if idx==3:add('Lựa chọn một hướng Android, iOS hoặc đa nền tảng trước. Không cần mua toàn bộ nhóm mobile.','Note')
 if idx==4:add('Dấu “—”: chưa đề xuất bán dạng video.','Note')
 page()
title('06 / SẢN PHẨM BỔ SUNG','Trải nghiệm & học dài hạn','Giữ lối vào ngắn cho học sinh mới, đồng thời có sản phẩm tiếp nối sau khóa học.')
table(['Sản phẩm','Cấu hình đề xuất','Giá đề xuất'],[
['Workshop làm game đầu tiên','1 buổi 120 phút online nhóm, 4-8 học sinh; Scratch hoặc GameMaker.','149.000 đ/học sinh'],
['Trại hè lập trình','8 buổi × 120 phút online nhóm; chọn một chủ đề, hoàn thành một dự án nhỏ.','1.200.000 đ/học sinh'],
['CLB lập trình hằng tháng','4 buổi × 120 phút; nhóm 4-8 học sinh đã có nền tảng, một chủ đề/tháng.','600.000 đ/tháng'],
['Gói hỗ trợ 1-1','4 buổi × 120 phút; sửa bài và hướng dẫn, học sinh tự hoàn thành sản phẩm.','1.400.000 đ/gói']],[120,270,121])
gap(18);add('Lộ trình tư vấn mẫu','H2X')
table(['Lộ trình','Các khóa thành phần','Video / Nhóm'],[
['Khởi đầu sáng tạo','Scratch sáng tạo → Scratch làm game<br/>24 buổi online','1.080.000 / 3.000.000 đ'],
['Nhà phát triển game 2D','GameMaker cơ bản → GML<br/>36 buổi online','1.980.000 / 5.900.000 đ'],
['Web nền tảng','HTML/CSS → JavaScript → Frontend dự án<br/>44 buổi online','2.370.000 / 7.000.000 đ'],
['Ứng dụng đa nền tảng','Flutter cơ bản → Flutter nâng cao<br/>40 buổi online; yêu cầu biết lập trình','2.680.000 / 7.500.000 đ']],[111,250,150])
gap();add('Giá lộ trình bằng tổng giá từng khóa, chưa áp dụng ưu đãi. Nên cho phép đăng ký từng chặng và đánh giá trước khi chuyển cấp. Không gộp Fullstack vào khóa ngắn dành cho người mới.','Note')
page()
title('07 / KẾ HOẠCH MỞ BÁN','Chốt ít khóa, triển khai chắc','Danh mục là kế hoạch phát triển sản phẩm. Chỉ gắn nhãn “có sẵn” khi video và học liệu đã hoàn thiện, kiểm tra và có thể giao ngay.')
add('Giai đoạn 1 • Danh mục chủ lực','H2X')
add('Ưu tiên Scratch sáng tạo, Python cơ bản, GameMaker cơ bản và HTML/CSS. Mỗi khóa cần giáo trình, bài học mẫu, dự án mẫu, giáo viên phụ trách và lịch hỗ trợ rõ ràng. Mở gói kèm 1-1 cho các môn có giáo viên đủ năng lực.')
add('Giai đoạn 2 • Mở theo nhu cầu thực tế','H2X')
add('Bổ sung JavaScript, React, Backend và Flutter khi có học sinh đủ đầu vào. Android/iOS chuyên sâu và luyện thi cần giáo viên phù hợp trước khi nhận đăng ký.')
add('Kiểm tra mức giá trước khi chốt','H2X')
add('Ví dụ lớp nhóm 16 buổi ở mức 150.000 đ/buổi: học phí 2.400.000 đ/học sinh. Với 4 học sinh, doanh thu 9.600.000 đ; với 8 học sinh, doanh thu 19.200.000 đ. Đây là doanh thu, chưa trừ chi phí.')
add('Cần đối chiếu tiền công giáo viên, thời gian soạn/sửa bài, nền tảng học, chi phí tuyển sinh và nghĩa vụ thuế. Chưa có dữ liệu chi phí của DolphinX nên tài liệu chưa kết luận lợi nhuận hoặc số học sinh hòa vốn.','Note')
table(['Hạng mục phải chốt','Thông tin cần điền trước khi phát hành'],[
['Sản phẩm thực có','Khóa đã quay xong; khóa chỉ dạy trực tiếp; khóa đang phát triển.'],
['Vận hành lớp','Giáo viên, lịch khai giảng, số học sinh tối thiểu và tối đa.'],
['Học phí & thanh toán','Giá bán chính thức, kỳ thanh toán, thuế/hóa đơn, ưu đãi nếu có.'],
['Cam kết dịch vụ','Phạm vi hỗ trợ, quyền truy cập, học bù, bảo lưu và hoàn phí.'],
['Thiết bị & đầu vào','Yêu cầu máy tính, kiểm tra năng lực và khóa tiên quyết.']],[132,379])
gap(18);add('DolphinX Education • Bản đề xuất danh mục và học phí • Tháng 09/2026','Note')
# Roadmap appendix
roadmaps=json.loads(Path(ROOT+'/tmp/pdfs/roadmap_batches.json').read_text())
page()
title('08 / GIẢNG DẠY ONLINE','Cách vận hành lộ trình','Khung giảng dạy đề xuất cho cả lớp nhóm và kèm 1-1.')
for h,t in [
('Trước khóa học','Kiểm tra đầu vào bằng trao đổi ngắn và bài thực hành phù hợp; xác nhận thiết bị, lịch học và mục tiêu với học sinh/phụ huynh.'),
('Trong buổi 120 phút','10 phút ôn bài; 20 phút kiến thức mới; 30 phút thực hành; 10 phút nghỉ; 35 phút làm dự án; 10 phút sửa bài; 5 phút giao bài. Workshop dùng lịch riêng trong lộ trình.'),
('Lớp nhóm 4-8 học sinh','Dùng cùng tiến độ theo chặng, chia bài tập cơ bản và mở rộng. Cuối chặng kiểm tra sản phẩm và hỗ trợ phần học sinh chưa nắm.'),
('Lớp kèm 1-1','Có thể rút ngắn hoặc kéo dài từng chặng sau kiểm tra đầu vào. Thống nhất lại số buổi và học phí trước khi thay đổi gói.'),
('Đánh giá và chuyển chặng','Học sinh hoàn thành chức năng chính, giải thích cách làm và sửa lỗi cơ bản. Nếu chưa đạt, giao bài củng cố trước nội dung tiếp theo.'),
('Phản hồi phụ huynh','Sau mỗi chặng: gửi nội dung đã học, sản phẩm, điểm cần luyện và nhiệm vụ tiếp theo. Mục tiêu là tiến bộ thực tế, không cam kết giải thưởng.')]:
 add(h,'H2X');add(t)
add('Phụ lục sau là khung lộ trình theo sản phẩm, chưa thay thế giáo án chi tiết từng buổi. Bài tập mặc định: hoàn thiện sản phẩm và làm một biến thể theo hướng dẫn; giáo viên điều chỉnh theo trình độ.','Note')
for start in range(0,len(roadmaps),3):
 page();title('PHỤ LỤC / LỘ TRÌNH','Từ kiến thức đến sản phẩm','Buổi online 120 phút; số chặng và số buổi khớp cấu hình học phí.')
 for rm in roadmaps[start:start+3]:
  add(rm['title'],'H2X')
  table(['Buổi / thời gian','Nội dung trọng tâm','Đầu ra đánh giá'],[[r[1],r[2],r[3]] for r in rm['modules']],[85,236,190]);gap(12)

out=ROOT+'/output/pdf/DolphinX_Danh_muc_khoa_hoc_va_bang_gia_de_xuat.pdf'
def footer(c,doc):
 c.setStrokeColor(colors.HexColor('#d7e5f2'));c.line(42,40,553,40)
 c.setFont('Arial',8);c.setFillColor(muted);c.drawString(42,26,'DOLPHINX EDUCATION  |  GIÁ ĐỀ XUẤT - CHƯA CÔNG BỐ');c.drawRightString(553,26,str(doc.page))
doc=SimpleDocTemplate(out,pagesize=(595.28,841.89),rightMargin=42,leftMargin=42,topMargin=42,bottomMargin=56,title='DolphinX Education - Danh mục khóa học và bảng giá đề xuất',author='DolphinX Education')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(out)
print(out);print('Pages',len(r.pages));print('Courses',sum(len(s[3]) for s in sections))
for i,p in enumerate(r.pages):print(i+1,len(p.extract_text()))
