export const courseLevels = [
  { value: "Cơ bản", tone: "beginner", description: "Bắt đầu từ số 0" },
  { value: "Trung cấp", tone: "intermediate", description: "Đã nắm kiến thức nền tảng" },
  { value: "Nâng cao", tone: "advanced", description: "Đào sâu và giải quyết bài toán phức tạp" },
  { value: "Mọi cấp độ", tone: "all", description: "Có nội dung cho nhiều trình độ" },
  { value: "Cơ bản → Nâng cao", tone: "path", description: "Lộ trình xuyên suốt từ đầu" },
] as const;
export const courseColors = [
  {value:"blue",label:"Xanh dương",hex:"#377fcb"},
  {value:"green",label:"Ngọc lục bảo",hex:"#22957d"},
  {value:"violet",label:"Tím lavender",hex:"#8965c7"},
  {value:"coral",label:"Cam san hô",hex:"#d47d58"},
  {value:"yellow",label:"Xanh cyan",hex:"#20a4b9"},
  {value:"navy",label:"Xanh navy",hex:"#243f60"},
] as const;
export function normalizeCourseLevel(value: string) { return value === "Trung bình" ? "Trung cấp" : value; }
export function courseLevelTone(value: string) { return courseLevels.find(level=>level.value===normalizeCourseLevel(value))?.tone ?? "all"; }
