import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../lib/products";
import Icon from "../../components/ui-icon";
import { Breadcrumb, Eyebrow, FAQ } from "../../components/ui";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  return { title: p?.name ?? "Không tìm thấy sản phẩm", description: p?.desc };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <section className={`detail-hero tone-${p.tone}`}>
        <div className="container">
          <Breadcrumb
            current={p.name}
            parent={{ href: "/san-pham", label: "Giải pháp bảo hiểm" }}
          />
          <div className="detail-hero-grid">
            <div>
              <div className="detail-label">
                <Icon name={p.icon} size={20} />
                {p.name}
              </div>
              <h1>
                {p.headline.split("\n").map((line, i) => (
                  <span key={line} className={i ? "gradient-text" : ""}>
                    {line} <br />
                  </span>
                ))}
              </h1>
              <p>{p.desc}</p>
              <Link className="button" href={`/lien-he?san-pham=${p.slug}`}>
                Tư vấn giải pháp này <Icon name="arrow" size={18} />
              </Link>
              <div className="detail-assurance">
                <Icon name="check" size={16} /> Tư vấn miễn phí · Không bắt buộc
                tham gia
              </div>
            </div>
            <div className="detail-photo">
              <Image
                src={p.image}
                alt={p.name}
                fill
          quality={85}
                priority
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <div className="detail-photo-badge">
                <Icon name="shield" size={23} />
                <span>
                  Cùng MIC & PVI <br />
                  <strong>Thêm vững tâm mỗi ngày</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="detail-tabs">
        <div className="container">
          <a href="#tong-quan">Tổng quan</a>
          <a href="#quyen-loi">Nội dung tư vấn</a>
          <a href="#chuan-bi">Thông tin cần chuẩn bị</a>
          <a href="#cau-hoi">Câu hỏi thường gặp</a>
        </div>
      </div>
      <section className="section" id="tong-quan">
        <div className="container detail-overview">
          <Eyebrow>GIẢI PHÁP PHÙ HỢP BẮT ĐẦU TỪ BẠN</Eyebrow>
          <h2>{p.intro}</h2>
        </div>
      </section>
      <section className="section detail-benefits" id="quyen-loi">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>HIỂU RÕ TRƯỚC KHI LỰA CHỌN</Eyebrow>
              <h2>Chúng tôi cùng bạn tìm hiểu.</h2>
            </div>
          </div>
          <div className="three-grid">
            {p.benefits.map((b, i) => (
              <article className="info-card" key={b.title}>
                <span
                  className={`feature-icon ${["mint", "blue", "lavender"][i]}`}
                >
                  <Icon name={["shield", "file", "support"][i]} size={26} />
                </span>
                <span className="info-number">0{i + 1}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
          <p className="legal-note">
            Quyền lợi cụ thể, các trường hợp loại trừ và giới hạn bảo hiểm được
            quy định trong hợp đồng. Nội dung trên không thay thế quy tắc, điều
            khoản của nhà bảo hiểm.
          </p>
          <a
            className="text-link"
            href={p.source}
            target="_blank"
            rel="noreferrer"
          >
            Tham khảo thông tin từ nhà bảo hiểm <Icon name="arrow" size={17} />
          </a>
        </div>
      </section>
      <section className="section" id="chuan-bi">
        <div className="container preparation-panel">
          <div>
            <Eyebrow>BẮT ĐẦU THẬT ĐƠN GIẢN</Eyebrow>
            <h2>
              Chuẩn bị một chút. <br />
              Tư vấn đúng hơn.
            </h2>
            <p>Thông tin ban đầu giúp chúng tôi hiểu nhu cầu của bạn.</p>
          </div>
          <ol>
            {p.prepare.map((t, i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section" id="cau-hoi">
        <div className="container faq-layout">
          <div>
            <Eyebrow>GIẢI ĐÁP CÙNG BẠN</Eyebrow>
            <h2>Câu hỏi thường gặp.</h2>
          </div>
          <FAQ items={p.faqs} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="product-cta">
            <div>
              <Eyebrow>CHÚNG TÔI SẴN SÀNG LẮNG NGHE</Eyebrow>
              <h2>Cùng tìm lựa chọn dành cho bạn.</h2>
            </div>
            <Link className="button" href={`/lien-he?san-pham=${p.slug}`}>
              Nhận tư vấn {p.short.toLowerCase()}{" "}
              <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="related-links">
            <span>Khám phá thêm</span>
            {products
              .filter((x) => x.slug !== p.slug)
              .map((x) => (
                <Link key={x.slug} href={`/san-pham/${x.slug}`}>
                  {x.name}
                  <Icon name="arrow" size={16} />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
