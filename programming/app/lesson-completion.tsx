"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function LessonCompletion({ courseId, lessonId, completed }: { courseId: string; lessonId: string; completed: boolean }) {
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  const router = useRouter();
  async function save() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/progress", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId, lessonId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Chưa lưu được tiến độ.");
      router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Lỗi kết nối. Vui lòng thử lại."); }
    finally { setPending(false); }
  }
  return <section className="lesson-completion"><p>Hoàn thành video và bài thực hành rồi xác nhận bên dưới. Đây là tiến độ tự đánh giá, không phải kết quả máy chấm.</p><Button disabled={pending || completed} onClick={save}>{completed ? "✓ Đã hoàn thành bài" : pending ? "Đang lưu…" : "Đánh dấu hoàn thành"}</Button>{error && <p role="alert">{error}</p>}</section>;
}
