import Link from "next/link";
import { notFound } from "next/navigation";
import { getResources } from "@/lib/managed-content";
export const dynamic = "force-dynamic";
import "@/app/resources.css";
import "@/app/resource-detail.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const practiceResources = await getResources();
  const item = practiceResources.find(item => item.id === slug);
  if (!item) notFound();
  return { title: `${item.title} | Thực hành DolphinX`, description: item.description };
}

export default async function ResourceDetail({ params }: Props) {
  const { slug } = await params;
  const practiceResources = await getResources();
  const item = practiceResources.find(item => item.id === slug);
  if (!item) notFound();
  const related = practiceResources.filter(other => other.id !== item.id && (other.topic === item.topic || other.kind === item.kind)).slice(0, 3);
  return <main className="resources-page resource-detail"><nav className="rd-breadcrumb" aria-label="Đường dẫn"><Link href="/resources">Tài nguyên & thực hành</Link><span>/</span><span>{item.title}</span></nav><header className="resources-hero"><span>{item.topic.toUpperCase()} · {item.kind.toUpperCase()}</span><h1>{item.title}</h1><p>{item.description}</p><div className="resource-tags"><span>{item.level}</span><span>Khoảng {item.minutes} phút</span><span>Tự luyện · Không cộng XP</span></div></header><div className="rd-layout"><article className="rd-article"><section id="setup"><span className="rd-step">01 / CHUẨN BỊ</span><h2>Dữ liệu & điểm bắt đầu</h2><p>Thực hiện trong editor hoặc môi trường học riêng của bạn. Không chạy câu lệnh thử nghiệm trên dữ liệu thật.</p><pre><code>{item.setup}</code></pre></section><section id="tasks"><span className="rd-step">02 / THỰC HIỆN</span><h2>Yêu cầu bài tập</h2><ol>{item.tasks.map(task => <li key={task}>{task}</li>)}</ol></section><section id="checks"><span className="rd-step">03 / KIỂM TRA</span><h2>Khi nào bài làm đạt yêu cầu?</h2><p>Tự chạy từng trường hợp dưới đây và đối chiếu đầu ra. Trang này chưa có trình chạy code hoặc máy chấm.</p><ul>{item.checks.map(check => <li key={check}>{check}</li>)}</ul></section><section id="hint"><span className="rd-step">04 / GỠ RỐI</span><h2>Thử trước, xem gợi ý sau</h2><details className="resource-hint"><summary>Mở gợi ý</summary><p>{item.hint}</p></details></section><footer className="rd-footer"><Link href="/resources">← Quay lại danh sách bài</Link><Link href="/dashboard#practice">Luyện bài có máy chấm →</Link></footer></article><aside className="rd-aside"><section><h2>Trong bài này</h2><nav aria-label="Mục lục bài tập"><a href="#setup">01 · Dữ liệu đầu vào</a><a href="#tasks">02 · Yêu cầu</a><a href="#checks">03 · Tiêu chí kiểm tra</a><a href="#hint">04 · Gợi ý</a></nav></section><section><h2>Tài liệu đồng hành</h2><p>Tra cứu kiến thức liên quan tại nguồn chính thức. Nội dung tiếng Anh.</p><a href={item.source} target="_blank" rel="noopener noreferrer">Mở tài liệu ↗</a></section>{related.length > 0 && <section><h2>Thực hành tiếp</h2>{related.map(other => <Link className="rd-related" key={other.id} href={`/resources/${other.id}`}><strong>{other.title}</strong><small>{other.topic} · {other.minutes} phút</small></Link>)}</section>}</aside></div></main>;
}
