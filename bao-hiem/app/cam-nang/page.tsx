import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "../components/ui-icon";
import { Breadcrumb, CTA, Eyebrow } from "../components/ui";
import { guides } from "../lib/guides";
export const metadata: Metadata = { title: "Cẩm nang bảo hiểm" };
export default function GuidesPage() {
  return (
    <>
      <section className="page-intro gradient-surface">
        <div className="container">
          <Breadcrumb current="Cẩm nang bảo hiểm" />
          <Eyebrow>KIẾN THỨC GẦN GŨI</Eyebrow>
          <h1>
            Hiểu bảo hiểm. <br />
            <span className="gradient-text">Chủ động lựa chọn.</span>
          </h1>
          <p>Những nội dung ngắn, dễ hiểu để bạn bắt đầu.</p>
        </div>
      </section>
      <section className="section">
        <div className="container guide-grid">
          {guides.map((g) => (
            <Link
              className="guide-card"
              href={`/cam-nang/${g.slug}`}
              key={g.slug}
            >
              <div className="guide-photo">
                <Image
                  src={g.image}
                  alt=""
                  fill
                  sizes="(max-width:700px) 100vw, 33vw"
                />
              </div>
              <span>
                {g.category} · {g.readTime} phút đọc
              </span>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
              <span className="text-link">
                Đọc bài viết <Icon name="arrow" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
