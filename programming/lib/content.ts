import type { Course, Problem } from "./types";

export const courseSeed: Omit<Course, "progress">[] = [
  { id: "data-structures", title: "Cấu trúc dữ liệu từ số 0", description: "Array, Stack, Queue, Linked List và cách dùng trong bài toán thực tế.", icon: "◫", color: "blue", level: "Cơ bản", lessons: 32, students: "12,4K", modules: ["Mảng và chuỗi", "Stack & Queue", "Linked List", "Hash Table", "Ôn tập cuối khóa"] },
  { id: "algorithms", title: "Thuật toán cho người mới", description: "Học cách tư duy, phân tích và tối ưu lời giải từng bước.", icon: "⌁", color: "violet", level: "Cơ bản", lessons: 40, students: "9,8K", modules: ["Độ phức tạp", "Sắp xếp", "Tìm kiếm", "Đệ quy", "Two Pointers"] },
  { id: "python", title: "Python thực chiến", description: "Làm chủ Python qua 20 dự án và hơn 100 bài luyện code.", icon: "Py", color: "yellow", level: "Mọi cấp độ", lessons: 48, students: "18,2K", modules: ["Python nền tảng", "Hàm và module", "OOP", "Xử lý dữ liệu", "Dự án cuối khóa"] },
  { id: "frontend", title: "Web Frontend hiện đại", description: "HTML, CSS, JavaScript và React qua các sản phẩm hoàn chỉnh.", icon: "</>", color: "coral", level: "Cơ bản → Nâng cao", lessons: 56, students: "15,6K", modules: ["HTML Semantic", "CSS Layout", "JavaScript", "React", "Portfolio cá nhân"] },
  { id: "sql", title: "SQL & Cơ sở dữ liệu", description: "Truy vấn, thiết kế dữ liệu và giải những bài SQL phổ biến.", icon: "DB", color: "green", level: "Trung bình", lessons: 28, students: "7,3K", modules: ["SELECT cơ bản", "JOIN", "Aggregate", "Subquery", "Thiết kế database"] },
  { id: "interview", title: "Luyện phỏng vấn Big Tech", description: "150 bài trọng tâm, mock interview và chiến thuật giải bài.", icon: "★", color: "navy", level: "Nâng cao", lessons: 36, students: "6,1K", modules: ["Array patterns", "Trees & Graphs", "Dynamic Programming", "System Design", "Mock Interview"] },
];

const baseProblems = [
  [1, "two-sum", "Tổng của hai số", "Mảng", "Dễ", "62,4%"],
  [2, "valid-palindrome", "Chuỗi đối xứng hợp lệ", "Chuỗi", "Dễ", "51,8%"],
  [3, "merge-linked-lists", "Ghép hai danh sách liên kết", "Linked List", "Dễ", "66,1%"],
  [4, "longest-substring", "Chuỗi con dài nhất không lặp", "Chuỗi", "Trung bình", "38,7%"],
  [5, "valid-parentheses", "Ngoặc hợp lệ", "Stack", "Dễ", "44,5%"],
  [6, "rotated-array-search", "Tìm kiếm trong mảng xoay", "Tìm kiếm", "Trung bình", "42,1%"],
  [7, "level-order", "Duyệt cây theo tầng", "Cây", "Trung bình", "69,3%"],
  [8, "reverse-number", "Số đảo ngược", "Toán", "Trung bình", "30,1%"],
  [9, "shortest-maze", "Đường đi ngắn nhất trong mê cung", "Đồ thị", "Khó", "29,8%"],
  [10, "longest-increasing", "Dãy con tăng dài nhất", "Quy hoạch động", "Trung bình", "55,6%"],
  [11, "merge-k-lists", "Hợp nhất K danh sách", "Heap", "Khó", "52,3%"],
  [12, "inversion-count", "Đếm số đảo trong mảng", "Chia để trị", "Khó", "36,9%"],
] as const;

export const problemSeed: Omit<Problem, "status">[] = baseProblems.map(([id, slug, title, topic, difficulty, acceptance]) => ({
  id,
  slug,
  title,
  topic,
  difficulty,
  acceptance,
  statement: id === 1
    ? "Cho một mảng số nguyên nums và một số nguyên target, hãy trả về vị trí của hai phần tử sao cho tổng của chúng bằng target."
    : `Hoàn thành hàm solve để giải bài “${title}”. Hãy xử lý đúng các trường hợp biên và trả về kết quả theo yêu cầu.`,
  exampleInput: id === 1 ? "nums = [2, 7, 11, 15], target = 9" : "Dữ liệu mẫu được truyền vào hàm solve",
  exampleOutput: id === 1 ? "[0, 1]" : "Kết quả tương ứng",
  explanation: id === 1 ? "nums[0] + nums[1] = 9" : "Xem bộ kiểm thử để kiểm tra lời giải của bạn.",
  constraints: id === 1
    ? ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i], target ≤ 10⁹", "Chỉ có duy nhất một đáp án hợp lệ."]
    : ["Đầu vào luôn hợp lệ.", "Ưu tiên lời giải có độ phức tạp phù hợp.", "Không thay đổi chữ ký của hàm solve."],
  starterCode: id === 1
    ? `function solve(nums, target) {\n  // Viết lời giải của bạn tại đây\n  const seen = new Map();\n\n  for (let i = 0; i < nums.length; i++) {\n    const needed = target - nums[i];\n    if (seen.has(needed)) return [seen.get(needed), i];\n    seen.set(nums[i], i);\n  }\n}`
    : `function solve(input) {\n  // TODO: Giải bài ${title}\n  return input;\n}`,
}));
