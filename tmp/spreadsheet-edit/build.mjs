import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/nhatanh/qc-fullhouse/tmp/spreadsheet-edit/Phieu_danh_gia_QC.xlsx";
const outputDir = "/Users/nhatanh/qc-fullhouse/outputs/01a0c74a-0153-7363-b0bc-f42f439112b4";
const outputPath = `${outputDir}/Phieu_danh_gia_QC_26-09-2026.xlsx`;
const previewDir = "/Users/nhatanh/qc-fullhouse/tmp/spreadsheet-edit/previews";

const rowByCriterion = { 1: 6, 2: 7, 3: 8, 4: 10, 5: 11, 6: 12, 7: 14, 8: 15, 9: 16, 10: 18, 11: 19, 12: 21, 13: 22, 14: 23, 15: 24, 16: 26, 17: 27 };
const scoreColumns = { 1: "C", 2: "D", 3: "E", 4: "F", 5: "G" };
const mergeRanges = ["A1:H1", "A2:H2", "A5:H5", "A9:H9", "A13:H13", "A17:H17", "A20:H20", "A25:H25", "A29:H29", "A30:H30", "A31:H31", "A33:D33", "E33:H33", "A35:D35", "E35:H35"];

const noCamera = "Bản ghi âm không đủ bằng chứng để xác định trạng thái camera.";
const noPunctuality = "Chưa đủ bằng chứng từ audio để kết luận giờ vào/kết thúc lớp.";
const noChat = "Không đủ bằng chứng để xác định mức tương tác qua khung chat.";
const noTest = "Buổi được phân tích không có hoạt động kiểm tra định kỳ để chấm mục này.";

const teachers = [
  {
    sheetName: "Thanh Triết",
    title: "PHIẾU ĐÁNH GIÁ QC - THANH TRIẾT",
    classes: "C++ 1:1, CTDLGT 11, Python 1:1 SQL/FastAPI",
    sources: "cpptriet1on1092026 buổi 3; ctdlgt11 buổi 7; pytriet1on1062026 buổi 26",
    serious: false,
    overall: "Chuyên môn sâu, phân tích thuật toán và chuẩn code tốt. Cần giảm nhịp ở phần nâng cao để tránh quá tải; có một lần gián đoạn giữa giờ.",
    ratings: {
      1: [null, noCamera], 2: [4, "Âm thanh đủ rõ để theo dõi ba buổi; có một lần gián đoạn giữa giờ."], 3: [null, noPunctuality],
      4: [5, "Nội dung khớp chủ đề C++, CTDLGT và Python SQL/FastAPI."], 5: [5, "Bài giảng đi từ tư duy toán học đến thuật toán, code và độ phức tạp."], 6: [5, "Nắm vững thuật toán, SQL/FastAPI, xử lý ngoại lệ và bảo mật code."],
      7: [5, "Liên tục hỏi kiểm tra mức độ hiểu bài."], 8: [5, "Chủ động yêu cầu học viên trả lời và kiểm tra code trực tiếp."], 9: [4, "Xử lý tình huống tốt; nên hạn chế gián đoạn cá nhân giữa giờ."],
      10: [null, noChat], 11: [5, "Đối thoại 1:1 liên tục, học viên phản hồi bằng mic."], 12: [null, noTest], 13: [null, noTest], 14: [null, noTest], 15: [null, noTest],
      16: [4, "Không khí tích cực nhưng phần thuật toán nâng cao có nhịp khá dồn."], 17: [4, "Học viên tham gia và làm code; cần thêm điểm dừng kiểm tra hiểu bài ở phần khó."],
    },
  },
  {
    sheetName: "Minh Đạo",
    title: "PHIẾU ĐÁNH GIÁ QC - MINH ĐẠO",
    classes: "Python 1:1 - vòng lặp, hàm và tham số",
    sources: "pydao1on1032026 buổi 28",
    serious: false,
    overall: "Giảng tỉ mỉ, kiên nhẫn và đặt câu hỏi gợi mở tốt. Cần kiểm soát thời lượng trao đổi ngoài nội dung chính.",
    ratings: {
      1: [null, noCamera], 2: [5, "Âm thanh rõ, đối thoại 1:1 liền mạch."], 3: [null, noPunctuality],
      4: [5, "Nội dung đúng chủ đề vòng lặp, range, enumerate, zip và function."], 5: [5, "Ôn cũ, ví dụ mẫu, học viên tự làm và dặn dò buổi sau."], 6: [5, "Giải thích chính xác các tham số, vòng lặp vô tận, *args và **kwargs."],
      7: [5, "Đặt câu hỏi gợi mở để học viên tự nhận ra quy luật."], 8: [5, "Chủ động gọi học viên trả lời trong suốt buổi 1:1."], 9: [5, "Kiên nhẫn tháo gỡ từng vướng mắc của học viên."],
      10: [null, noChat], 11: [5, "Học viên trả lời thường xuyên qua mic."], 12: [null, "Có nhắc bài kiểm tra nhưng không đủ bằng chứng về một lượt kiểm tra diễn ra trong buổi."], 13: [null, noTest], 14: [null, noTest], 15: [null, noTest],
      16: [4, "Không khí thân thiện; một phần thời lượng dành cho chuyện ngoài lề."], 17: [5, "Học viên phản hồi và tham gia liên tục."],
    },
  },
  {
    sheetName: "Vũ Minh Duy",
    title: "PHIẾU ĐÁNH GIÁ QC - VŨ MINH DUY",
    classes: "C++ 1:1 - Stack, Queue và Deque",
    sources: "cppduy1on1062026t1 buổi 22",
    serious: false,
    overall: "Tương tác tốt, ẩn dụ đời sống dễ hiểu và bám sát mục tiêu học viên. Cần hỗ trợ webcam, micro và kết nối mạng.",
    ratings: {
      1: [2, "Webcam bị lag trong buổi học."], 2: [2, "Mạng báo đỏ, micro lúc to lúc nhỏ và phải đổi mạng giữa chừng."], 3: [null, noPunctuality],
      4: [5, "Nội dung đúng Stack, Queue, Deque và nguyên lý LIFO/FIFO."], 5: [5, "Cấu trúc bài bám sát mục tiêu thi và thực hành C++."], 6: [5, "Giải thích đúng khái niệm và thao tác dữ liệu."],
      7: [5, "Liên tục yêu cầu học viên suy luận kết quả trước khi chạy code."], 8: [5, "Tương tác 1:1 và điều chỉnh theo tình trạng học viên."], 9: [5, "Kiên nhẫn sửa nhầm lẫn LIFO/FIFO và quan tâm sức khỏe học viên."],
      10: [null, noChat], 11: [5, "Đối thoại bằng mic xuyên suốt buổi học."], 12: [null, noTest], 13: [null, noTest], 14: [null, noTest], 15: [null, noTest],
      16: [5, "Không khí thân thiện, ví dụ đời sống sinh động."], 17: [4, "Học viên tham gia tốt; có lúc nhầm khái niệm ở phần đầu."],
    },
  },
  {
    sheetName: "Phạm Kiên",
    title: "PHIẾU ĐÁNH GIÁ QC - PHẠM KIÊN",
    classes: "Python 51 - xử lý file",
    sources: "py51 buổi 13",
    serious: false,
    overall: "Nội dung có cấu trúc tốt, nhiều cảnh báo lỗi thực tế và có bài tập tại lớp. Cần khắc phục camera và đường truyền.",
    ratings: {
      1: [1, "Giáo viên báo camera bị hỏng và không bật được."], 2: [2, "Có tình trạng mất/rớt mạng giữa giờ."], 3: [null, noPunctuality],
      4: [5, "Nội dung đúng chủ đề File I/O, đường dẫn, encoding và working directory."], 5: [5, "Bài giảng đi từ ứng dụng đến cú pháp, lỗi thường gặp và thực hành."], 6: [5, "Giải thích sâu các mode đọc/ghi, đóng file và rủi ro mất dữ liệu."],
      7: [4, "Có đặt câu hỏi và giao bài tập ngắn để kiểm tra hiểu bài."], 8: [5, "Gọi tên học viên và chữa bài gửi lên chat."], 9: [4, "Duy trì lớp dù gặp lỗi camera/mạng; cần chuẩn bị thiết bị dự phòng."],
      10: [5, "Học viên gửi đáp án và tương tác qua khung chat."], 11: [4, "Có gọi tên và trao đổi với học viên; bằng chứng audio cho thấy mức tương tác tốt."], 12: [null, noTest], 13: [null, noTest], 14: [null, noTest], 15: [null, noTest],
      16: [4, "Không khí học tập tích cực nhưng bị ảnh hưởng bởi sự cố kỹ thuật."], 17: [4, "Học viên làm bài và gửi đáp án để được chữa trực tiếp."],
    },
  },
  {
    sheetName: "Nguyễn Văn Mạnh",
    title: "PHIẾU ĐÁNH GIÁ QC - NGUYỄN VĂN MẠNH",
    classes: "CTDLGT 10 - thuật toán sinh",
    sources: "ctdlgt10 buổi 16",
    serious: true,
    overall: "Chuyên môn giải thuật tốt và phân tích tối ưu rõ. Cần QC làm việc trực tiếp về ngôn từ gay gắt, thái độ thiếu kiên nhẫn và không khí lớp căng thẳng.",
    ratings: {
      1: [null, noCamera], 2: [4, "Âm thanh đủ rõ để theo dõi nội dung và tương tác."], 3: [null, noPunctuality],
      4: [5, "Nội dung đúng các bài sinh nhị phân, tập con, hoán vị và chỉnh hợp lặp."], 5: [5, "Chữa bài cũ, tối ưu thuật toán, lý thuyết mới và thực hành."], 6: [5, "Phân tích TLE và tối ưu độ phức tạp rõ ràng, chính xác."],
      7: [4, "Có đặt câu hỏi và gọi học viên giải thích bài."], 8: [4, "Gọi tên nhiều học viên tham gia nhưng cách thúc ép tạo áp lực."], 9: [2, "Ngôn từ trách mắng và thiếu kiên nhẫn khi học viên làm sai hoặc nghỉ học."],
      10: [null, noChat], 11: [4, "Có tương tác trực tiếp với nhiều học viên qua mic."], 12: [null, noTest], 13: [null, noTest], 14: [null, noTest], 15: [null, noTest],
      16: [2, "Không khí lớp căng thẳng do cách giao tiếp chỉ trích."], 17: [3, "Học viên vẫn tham gia nhưng áp lực giao tiếp có thể ảnh hưởng mức tập trung."],
    },
  },
  {
    sheetName: "Nguyễn Đình Mạnh",
    title: "PHIẾU ĐÁNH GIÁ QC - NGUYỄN ĐÌNH MẠNH",
    classes: "BE Java 10 và Java 33 - OOP, đồ án Java Swing",
    sources: "bejava10 buổi 8; java33 buổi 34",
    serious: false,
    overall: "Ví dụ thực tế phong phú và khung đồ án bài bản. Cần chuẩn bị trước code demo, cơ sở dữ liệu và thiết bị để giảm lỗi live-code.",
    ratings: {
      1: [null, noCamera], 2: [4, "Âm thanh đủ rõ để theo dõi hai buổi học."], 3: [null, noPunctuality],
      4: [5, "Nội dung đúng OOP trừu tượng và đồ án Java Swing/JDBC/MySQL."], 5: [4, "Theo giáo trình và có khung dự án; một số phần giao diện giao lại cho học viên."], 6: [4, "Kiến thức tốt nhưng live-code có nhiều lỗi cú pháp/logic phải sửa tại lớp."],
      7: [4, "Thường xuyên hỏi kiểm tra mức độ hiểu bài."], 8: [4, "Gọi học viên phát biểu và trao đổi khi có thắc mắc."], 9: [3, "Xử lý được lỗi phát sinh nhưng chuẩn bị code/CSDL và thiết bị chưa kỹ."],
      10: [null, noChat], 11: [4, "Học viên trao đổi và đặt câu hỏi qua mic."], 12: [null, noTest], 13: [null, noTest], 14: [null, noTest], 15: [null, noTest],
      16: [4, "Không khí trao đổi khá tốt; lỗi live-code làm gián đoạn nhịp học."], 17: [4, "Học viên tham gia thảo luận logic, đặc biệt ở phần đăng nhập."],
    },
  },
];

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const template = workbook.worksheets.getItem("Mau danh gia QC");
const templateRange = template.getRange("A1:H35");

for (const teacher of teachers) {
  const sheet = workbook.worksheets.add(teacher.sheetName);
  sheet.getRange("A1:H35").copyFrom(templateRange, "all");
  for (const range of mergeRanges) sheet.mergeCells(range);
  sheet.showGridLines = false;

  sheet.getRange("A:A").format.columnWidth = 6;
  sheet.getRange("B:B").format.columnWidth = 60;
  sheet.getRange("C:G").format.columnWidth = 6;
  sheet.getRange("H:H").format.columnWidth = 32;
  sheet.getRange("1:35").format.rowHeight = 14.25;
  sheet.getRange("6:8").format.rowHeight = 27.75;
  sheet.getRange("10:12").format.rowHeight = 27.75;
  sheet.getRange("14:19").format.rowHeight = 27.75;
  sheet.getRange("21:24").format.rowHeight = 27;
  sheet.getRange("26:27").format.rowHeight = 27.75;
  sheet.getRange("30:31").format.rowHeight = 54;

  sheet.getRange("A1").values = [[teacher.title]];
  sheet.getRange("A2").values = [[`Ngày 26/09/2026 · ${teacher.classes} · Thang điểm 1-5; ô trống là chưa đủ bằng chứng.`]];
  sheet.getRange("C6:G27").clear({ applyTo: "contents" });
  for (const [criterion, [score, comment]] of Object.entries(teacher.ratings)) {
    const row = rowByCriterion[criterion];
    if (score) sheet.getRange(`${scoreColumns[score]}${row}`).values = [["X"]];
    sheet.getRange(`H${row}`).values = [[comment]];
  }
  sheet.getRange("A30").values = [[teacher.overall]];
  sheet.getRange("A31").values = [[`Nguồn NotebookLM: ${teacher.sources}. Phân tích ngày 27/09/2026.`]];
  sheet.getRange("A33").values = [[teacher.serious ? "☒ Có vấn đề nghiêm trọng cần báo cáo ngay" : "☐ Có vấn đề nghiêm trọng cần báo cáo ngay"]];
  sheet.getRange("E33").values = [["Ngày kiểm tra: 27/09/2026"]];
  sheet.getRange("A35").values = [["Người QC: QC Fullhouse"]];
  sheet.getRange("E35").values = [["Quản lý xác nhận"]];
  sheet.getRange("A1:H35").format.verticalAlignment = "center";
  sheet.getRange("B6:B27").format.verticalAlignment = "center";
  sheet.getRange("H6:H27").format.wrapText = true;
  sheet.getRange("A30:H31").format.wrapText = true;
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
for (const teacher of teachers) {
  const preview = await workbook.render({ sheetName: teacher.sheetName, range: "A1:H35", scale: 1.2, format: "png" });
  await fs.writeFile(`${previewDir}/${teacher.sheetName.replaceAll(" ", "-")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const verification = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 30000,
  tableMaxRows: 35,
  tableMaxCols: 8,
  tableMaxCellChars: 160,
});
console.log(verification.ndjson);
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, sheets: teachers.map((teacher) => teacher.sheetName) }));
