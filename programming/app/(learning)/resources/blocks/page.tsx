import Link from "next/link";
import { getBlockChallenges, challengeRevision, type BlockResult } from "@/lib/block-store";
import { getMongoDatabase } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/user-auth";
import "@/app/blocks.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Phòng khối lệnh | DolphinX" };
export default async function BlocksPage() {
  const entries = await getBlockChallenges(), user = await getSessionUser();
  const results = user ? await (await getMongoDatabase()).collection<BlockResult>("block_results").find({ userId: user.id }).toArray() : [];
  return <main className="blocks-page"><Link href="/resources">← Tất cả tài nguyên</Link><header className="blocks-hero"><span>DOLPHINX BLOCK LAB</span><h1>Kéo một khối.<br/>Mở một cách nghĩ.</h1><p>Điều khiển cá heo, nhặt sao và giải mê cung bằng trình tự, vòng lặp và điều kiện. Chạy thử tự do; đăng nhập để nộp bài và lưu điểm.</p><small>Công cụ học khối lệnh do DolphinX xây dựng, lấy cảm hứng từ Scratch. Không phải trình Scratch chính thức và không nhập tệp .sb3.</small></header><div className="block-challenge-grid">{entries.map(({ challenge: c }) => {
    const saved = results.find(r => r.slug === c.slug && r.revision === challengeRevision(c));
    return <Link href={`/resources/blocks/${c.slug}`} key={c.slug}><span>{c.level} · {c.worlds.length} bản đồ</span><h2>{c.title}</h2><p>{c.description}</p><strong>{saved ? `Điểm tốt nhất ${saved.bestScore}/100` : "Bắt đầu thử thách →"}</strong></Link>;
  })}</div>{!entries.length && <p>Chưa có thử thách được xuất bản.</p>}</main>;
}
