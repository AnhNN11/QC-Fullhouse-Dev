import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/nhatanh/qc-fullhouse/outputs/01a0c74a-0153-7363-b0bc-f42f439112b4/Phieu_danh_gia_QC_26-09-2026_format-fixed.xlsx";
const previewDir = "/Users/nhatanh/qc-fullhouse/tmp/spreadsheet-edit/session-name-previews";
const teachers = [
  "C++1-1-Thanh Triết",
  "CTDLGT11-Thanh Triết",
  "Python1-1-Thanh Triết",
  "Python1-1-Minh Đạo",
  "C++1-1-Vũ Minh Duy",
  "Python51-Phạm Kiên",
  "CTDLGT10-Nguyễn Văn Mạnh",
  "BEJava10-Nguyễn Đình Mạnh",
  "Java33-Nguyễn Đình Mạnh",
];

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
await fs.mkdir(previewDir, { recursive: true });

for (const teacher of teachers) {
  const check = await workbook.inspect({
    kind: "table",
    sheetId: teacher,
    range: "C6:H10",
    maxChars: 2000,
    tableMaxRows: 5,
    tableMaxCols: 6,
    tableMaxCellChars: 500,
  });
  console.log(check.ndjson);

  const preview = await workbook.render({
    sheetName: teacher,
    range: "A1:H12",
    scale: 1.25,
    format: "png",
  });
  await fs.writeFile(
    `${previewDir}/${teacher.replaceAll(" ", "-")}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);
