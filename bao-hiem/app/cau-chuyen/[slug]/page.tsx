import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stories } from "../../lib/stories";
import { products } from "../../lib/products";
import Icon from "../../components/ui-icon";
import { Breadcrumb, Eyebrow } from "../../components/ui";
export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: stories.find((s) => s.slug === slug)?.title ?? "Góc an tâm" };
}
export default async function StoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = stories.find((s) => s.slug === slug);
  if (!s) notFound();
  const p = products.find((p) => p.slug === s.product)!;
  return (
    <>
      <section className="page-intro gradient-surface">
        <div className="container">
          <Breadcrumb
            current={s.category}
            parent={{ href: "/cau-chuyen", label: "Góc an tâm" }}
          />
          <Eyebrow>{s.category.toUpperCase()}</Eyebrow>
          <h1>{s.title}</h1>
          <p>{s.desc}</p>
          <span className="scenario-label">TÌNH HUỐNG MINH HỌA</span>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="story-cover">
            <Image src={s.image} alt={s.title} fill quality={85} priority sizes="(max-width: 1280px) 90vw, 1216px" />
          </div>
          <div className="story-detail-layout">
            <article className="reading-content">
              <h2>Bắt đầu từ cuộc sống.</h2>
              <p>{s.context}</p>
              <h2>Những điều cần quan tâm.</h2>
              <ul className="check-list">
                {s.needs.map((n) => (
                  <li key={n}>
                    <Icon name="check" size={18} />
                    {n}
                  </li>
                ))}
              </ul>
              <h2>Cùng tìm hướng tiếp cận.</h2>
              <p>{s.approach}</p>
              <blockquote>{s.takeaway}</blockquote>
              <p className="legal-note">
                Đây là tình huống giả định nhằm minh họa nhu cầu. Quyền lợi và
                điều kiện được xác định theo sản phẩm, hợp đồng và đánh giá của
                nhà bảo hiểm.
              </p>
            </article>
            <aside className="story-product">
              <span className="feature-icon mint">
                <Icon name={p.icon} size={27} />
              </span>
              <Eyebrow>GIẢI PHÁP LIÊN QUAN</Eyebrow>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <Link className="button" href={`/san-pham/${p.slug}`}>
                Tìm hiểu giải pháp <Icon name="arrow" size={17} />
              </Link>
              <Link className="text-link" href={`/lien-he?san-pham=${p.slug}`}>
                Trao đổi cùng chúng tôi <Icon name="arrow" size={16} />
              </Link>
            </aside>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <Eyebrow>KHÁM PHÁ THÊM</Eyebrow>
          <h2>Mỗi câu chuyện, một góc nhìn.</h2>
          <div className="related-links">
            {stories
              .filter((x) => x.slug !== slug)
              .map((x) => (
                <Link key={x.slug} href={`/cau-chuyen/${x.slug}`}>
                  {x.title}
                  <Icon name="arrow" size={17} />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
