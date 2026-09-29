import Image from "next/image";

export default function CourseCover({ course }: { course: { id: string; title: string } }) {
  const subject = `${course.id} ${course.title}`.toLowerCase();
  const theme = /interview|phỏng vấn/.test(subject) ? "interview"
    : /algorithm|thuật toán/.test(subject) ? "algorithms"
    : /structure|cấu trúc/.test(subject) ? "structures"
    : /sql|database|cơ sở dữ liệu/.test(subject) ? "data"
    : /frontend|front.end|react|html|css|web|javascript/.test(subject) ? "web" : "coding";
  return <div className="dx-mascot-course-cover">
    <Image src={`/brand/course-${theme}-mascot-${theme === "data" || theme === "interview" ? "v3" : "v4"}.png`} alt={`Cá heo DolphinX minh họa khóa ${course.title}`} width={1672} height={941} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" style={{ display: "block", width: "100%", height: "auto" }}/>
  </div>;
}
