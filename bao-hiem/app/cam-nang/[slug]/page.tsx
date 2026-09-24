import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "../../lib/guides";
import { Breadcrumb, CTA, Eyebrow } from "../../components/ui";
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: guides.find((g) => g.slug === slug)?.title ?? "Cẩm nang" };
}
export default async function GuideDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((g) => g.slug === slug);
  if (!g) notFound();
  return (
    <>
      <section className="page-intro gradient-surface">
        <div className="container">
          <Breadcrumb
            current={g.category}
            parent={{ href: "/cam-nang", label: "Cẩm nang" }}
          />
          <Eyebrow>
            {g.category.toUpperCase()} · {g.readTime} PHÚT ĐỌC
          </Eyebrow>
          <h1>{g.title}</h1>
          <p>{g.desc}</p>
        </div>
      </section>
      <article className="section article-container">
        <div className="article-image">
          <Image
            src={g.image}
            alt="Hình minh họa nội dung bảo hiểm"
            fill
            priority
            sizes="(max-width:900px) 100vw, 850px"
          />
        </div>
        <div className="reading-content">
          {g.sections.map((s, i) => (
            <section key={s.title}>
              <h2>
                {i + 1}. {s.title}
              </h2>
              <p>{s.text}</p>
            </section>
          ))}
          <div className="article-source">
            Nội dung mang tính hướng dẫn tổng quan, không thay thế điều khoản
            sản phẩm. Tham khảo{" "}
            <a href={g.source} target="_blank" rel="noreferrer">
              thông tin chính thức của nhà bảo hiểm
            </a>{" "}
            và hỏi tư vấn viên về trường hợp cụ thể.
          </div>
          <Link className="button" href="/lien-he">
            Trao đổi cùng Bảo Tín An Tâm
          </Link>
        </div>
      </article>
      <CTA />
    </>
  );
}
