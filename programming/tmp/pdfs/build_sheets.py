import ast,json
from pathlib import Path
src=ast.parse(Path('tmp/pdfs/build_catalog.py').read_text())
sections=next(ast.literal_eval(n.value) for n in src.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='sections' for t in n.targets))
products=[]
for _,category,_,rows in sections:
 for name,target,n,v,g,p in rows:
  products.append(dict(name=name.replace('/','-'),category=category,target=target,n=n,v=v,g=g,p=p))
products += [
 dict(name='Workshop làm game',category='Trải nghiệm',target='Học sinh mới học; Scratch hoặc GameMaker. Hoàn thành game đầu tiên.',n=1,v=None,g=149,p=None),
 dict(name='Trại hè lập trình',category='Trải nghiệm',target='Học sinh theo nhóm tuổi và trình độ. Chọn một chủ đề, hoàn thành dự án nhỏ.',n=8,v=None,g=150,p=None),
 dict(name='CLB lập trình',category='Duy trì',target='Học sinh có nền tảng. Một chủ đề mỗi tháng.',n=4,v=None,g=150,p=None),
 dict(name='Gói hỗ trợ 1-1',category='Hỗ trợ',target='Học sinh cần sửa bài và hướng dẫn dự án; không làm bài hộ.',n=4,v=None,g=None,p=350)]
allreq=[]
for i,x in enumerate(products):
 sid=0 if i==0 else 92600+i
 title=f'{i+1:02d} {x["name"]}'
 req=[]
 if i==0:req.append({'updateSheetProperties':{'properties':{'sheetId':sid,'title':title},'fields':'title'}})
 else:req.append({'addSheet':{'properties':{'sheetId':sid,'title':title,'gridProperties':{'rowCount':50,'columnCount':6}}}})
 n=x['n'];v=x['v'];g=x['g'];p=x['p']
 rows=[
 ['DOLPHINX EDUCATION',x['name'],'','','',''],
 ['Trạng thái','Đề xuất - chưa xác nhận sẵn sàng mở bán','','','',''],
 ['Nhóm sản phẩm',x['category'],'','','',''],
 ['Đối tượng & đầu ra',x['target'],'','','',''],
 ['Số buổi online',n,'Phút/buổi',90,'Học sinh/nhóm','4-8' if g else 'Không áp dụng'],
 ['Lịch học dự kiến','2 buổi/tuần; CLB: 4 buổi/tháng. Workshop: 1 buổi.','','','',''],
 ['BẢNG GIÁ ĐỀ XUẤT','VNĐ / học sinh; chưa phải giá công bố','','','',''],
 ['Hình thức','Số buổi','Đơn giá/buổi (đ)','Trọn gói (đ)','Quyền lợi','Ghi chú'],
 ['Video có sẵn','Không áp dụng','Không áp dụng',v*1000 if v else 'Chưa đề xuất','Video + bài tập + mã nguồn mẫu; truy cập 12 tháng' if v else 'Ưu tiên dạy trực tiếp','Chưa xác nhận đã quay xong' if v else ''],
 ['Online nhóm',n if g else '',g*1000 if g else '', '=B10*C10' if g else 'Không áp dụng','Tài liệu, buổi trực tiếp và phản hồi bài tập' if g else '', '4-8 học sinh; học phí trọn khóa' if g else ''],
 ['Online 1-1',n if p else '',p*1000 if p else '', '=B11*C11' if p else 'Không áp dụng','Lịch riêng; hướng dẫn và sửa bài theo mục tiêu' if p else '', 'Học phí trọn gói; điều chỉnh sau kiểm tra đầu vào' if p else ''],
 ['Lưu ý giá','Chưa gồm thiết bị, phần mềm, cloud, tên miền và phí tài khoản phát hành.','','','',''],
 ['Thiết bị','Máy tính + Internet. iOS cần máy Mac; Micro:bit/Robotics cần bộ kit tương thích.','','','',''],
 ['Đánh giá cuối khóa','Dự án hoặc bài đánh giá theo đầu ra; không cam kết giải thưởng hay thành tích.','','','',''],
 ['Chính sách cần chốt','Lịch khai giảng, học bù, bảo lưu, hoàn phí, thuế/hóa đơn, thanh toán.','','','',''],
 ['Cơ sở định giá','Phương án đề xuất, chưa khảo sát thị trường; cần đối chiếu chi phí và năng lực giảng dạy.','','','',''],
 ['Ngày lập','25/09/2026','','','','']]
 if x['name']=='CLB lập trình':rows[9][5]='Giá theo tháng: 4 buổi'
 def cell(v):return {'userEnteredValue':{'numberValue':v} if isinstance(v,(int,float)) else {'formulaValue':v} if str(v).startswith('=') else {'stringValue':str(v)}}
 def ran(a,b,c=0,d=6):return {'sheetId':sid,'startRowIndex':a,'endRowIndex':b,'startColumnIndex':c,'endColumnIndex':d}
 req.append({'updateCells':{'range':ran(0,len(rows)),'rows':[{'values':[cell(v) for v in row]} for row in rows],'fields':'userEnteredValue'}})
 req.append({'repeatCell':{'range':ran(0,17),'cell':{'userEnteredFormat':{'textFormat':{'fontFamily':'Arial','fontSize':11},'wrapStrategy':'WRAP','verticalAlignment':'TOP'}},'fields':'userEnteredFormat'}})
 for r in [0,6,7]:req.append({'repeatCell':{'range':ran(r,r+1),'cell':{'userEnteredFormat':{'backgroundColor':{'red':.93,'green':.94,'blue':.95},'textFormat':{'bold':True}}},'fields':'userEnteredFormat(backgroundColor,textFormat.bold)'}})
 for r in [0,1,2,3,5,6,11,12,13,14,15,16]:req.append({'mergeCells':{'range':ran(r,r+1,1,6),'mergeType':'MERGE_ALL'}})
 widths=[190,140,150,165,290,285]
 for j,w in enumerate(widths):req.append({'updateDimensionProperties':{'range':{'sheetId':sid,'dimension':'COLUMNS','startIndex':j,'endIndex':j+1},'properties':{'pixelSize':w},'fields':'pixelSize'}})
 req.append({'updateDimensionProperties':{'range':{'sheetId':sid,'dimension':'ROWS','startIndex':0,'endIndex':17},'properties':{'pixelSize':46},'fields':'pixelSize'}})
 req.append({'updateDimensionProperties':{'range':{'sheetId':sid,'dimension':'ROWS','startIndex':8,'endIndex':11},'properties':{'pixelSize':76},'fields':'pixelSize'}})
 req.append({'repeatCell':{'range':ran(8,11,2,4),'cell':{'userEnteredFormat':{'numberFormat':{'type':'NUMBER','pattern':'#,##0" đ"'}}},'fields':'userEnteredFormat.numberFormat'}})
 allreq.append({'title':title,'sheetId':sid,'requests':req})
Path('tmp/pdfs/sheet_batches.json').write_text(json.dumps(allreq,ensure_ascii=False))
print(json.dumps(allreq,ensure_ascii=False))
