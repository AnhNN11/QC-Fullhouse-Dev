import Image from "next/image";
import HeroPicture from "./components/hero-picture";
import Link from "next/link";
import Icon from "./components/ui-icon";
import ProductGrid from "./components/product-grid";
import ProtectionGraphic from "./components/protection-graphic";
import StoryGrid from "./components/story-grid";
import ContactForm from "./components/contact-form";
import { guides } from "./lib/guides";
import { CTA, Eyebrow, FAQ } from "./components/ui";
export default function Home() {
  return (
    <>
      <section className="reference-hero">
        <HeroPicture />
        <div className="hero-shade" />
        <div className="container reference-hero-inner">
          <div className="reference-hero-top">
            <div>
              <div className="hero-pill">
                <span className="status-dot" /> BẢO VỆ. THẤU HIỂU. ĐỒNG HÀNH.
              </div>
              <h1>
                Giải pháp bảo hiểm <br />
                cho <span>cuộc sống của bạn.</span>
              </h1>
              <p>
                Cùng Bảo Tín An Tâm bảo vệ những điều quý giá. <br />
                Thêm một điểm tựa, trọn một niềm tin.
              </p>
            </div>
            <Link className="button button-white" href="/san-pham">
              Khám phá giải pháp <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="glass-grid">
            {[
              [
                "shield",
                "An tâm mỗi ngày",
                "Tìm điểm tựa cho sức khỏe, tài sản và những dự định bạn đang ấp ủ.",
                "/cau-chuyen",
              ],
              [
                "heart",
                "Giải pháp dành riêng",
                "Bắt đầu từ nhu cầu thực tế để tìm lựa chọn phù hợp cùng MIC và PVI.",
                "/san-pham",
              ],
              [
                "support",
                "Tận tâm đồng hành",
                "Lắng nghe, hướng dẫn và hỗ trợ kết nối với nhà bảo hiểm khi bạn cần.",
                "/lien-he",
              ],
            ].map(([icon, title, desc, href]) => (
              <Link href={href} className="glass-card" key={title}>
                <span className="glass-icon">
                  <Icon name={icon} size={23} />
                </span>
                <h2>{title}</h2>
                <p>{desc}</p>
                <span className="glass-link">
                  Tìm hiểu thêm <Icon name="arrow" size={17} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="partner-strip">
        <div className="container partner-inner">
          <div>
            <span>ĐỐI TÁC BẢO HIỂM</span>
            <p>Uy tín tạo nên sự an tâm.</p>
          </div>
          <a href="https://www.mic.vn/" target="_blank" rel="noreferrer">
            <Image
              src="/images/mic-logo.png"
              alt="Bảo hiểm Quân đội MIC"
              width={110}
              height={48}
            />
          </a>
          <a href="https://www.pvi.com.vn/vi" target="_blank" rel="noreferrer">
            <Image
              src="/images/pvi-logo.png"
              alt="PVI Insurance"
              width={130}
              height={48}
            />
          </a>
          <div className="partner-caption">
            <Icon name="shield" size={26} />
            <span>
              Kết nối nhà bảo hiểm uy tín. <br />
              Đặt nhu cầu của bạn làm trung tâm.
            </span>
          </div>
        </div>
      </section>
      <section className="section products-section" id="giai-phap">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>GIẢI PHÁP DÀNH CHO BẠN</Eyebrow>
              <h2>
                Mỗi nhịp sống. <br />
                <span className="muted-heading">Một cách bảo vệ.</span>
              </h2>
            </div>
            <p>
              Từ những điều thân thuộc đến những dự định lớn. <br />
              Tìm giải pháp phù hợp với cuộc sống của bạn.
            </p>
          </div>
          <ProductGrid compact />
        </div>
      </section>
      <section className="section editorial-home">
        <div className="container editorial-grid">
          <div className="editorial-photo">
            <Image
              src="/images/consultation.webp"
              alt="Minh họa buổi tư vấn bảo hiểm cùng khách hàng Việt Nam"
              fill
              sizes="(max-width:700px) 100vw, 50vw"
            />
            <span className="editorial-photo-tag">
              <Icon name="shield" size={22} /> Sự an tâm bắt đầu từ thấu hiểu.
            </span>
          </div>
          <div>
            <Eyebrow>HƠN CẢ MỘT HỢP ĐỒNG</Eyebrow>
            <h2>
              Bảo hiểm là về niềm tin. <br />
              <span className="gradient-text">Và sự bình yên của bạn.</span>
            </h2>
            <p>
              Chúng tôi tin rằng bảo hiểm nên dễ hiểu và gần gũi. Mỗi lời tư vấn
              bắt đầu bằng việc lắng nghe những điều quan trọng với bạn.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" size={17} />
                Tư vấn dựa trên nhu cầu thực tế
              </li>
              <li>
                <Icon name="check" size={17} />
                Rõ ràng về quyền lợi và điều kiện
              </li>
              <li>
                <Icon name="check" size={17} />
                Kết nối giải pháp từ MIC & PVI
              </li>
            </ul>
            <Link className="button" href="/ve-chung-toi">
              Câu chuyện của chúng tôi <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section why-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>KHÁC BIỆT TỪ SỰ THẤU HIỂU</Eyebrow>
              <h2>
                Bảo hiểm dễ hiểu hơn. <br />
                <span className="gradient-text">An tâm gần hơn.</span>
              </h2>
            </div>
            <Link href="/ve-chung-toi" className="text-link">
              Tìm hiểu về chúng tôi <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="benefit-bento">
            <div className="bento-main">
              <span className="bento-kicker">BẢO TÍN AN TÂM</span>
              <h3>
                Một điểm tựa. <br />
                Cho nhiều điều quý giá.
              </h3>
              <p>
                Chúng tôi bắt đầu bằng việc lắng nghe, <br />
                để mỗi lựa chọn thực sự dành cho bạn.
              </p>
              <ProtectionGraphic />
              <span className="bento-footnote">
                <span className="status-dot" /> Đồng hành từ hôm nay
              </span>
            </div>
            <div className="bento-side">
              <article className="benefit-card">
                <span className="benefit-art benefit-art-listen" aria-hidden="true">
                  <Image src="/images/benefit-listen.webp" alt="" width={160} height={160} sizes="(max-width: 600px) 88px, 128px" />
                </span>
                <div>
                  <span className="feature-index">01 / LẮNG NGHE</span>
                  <h3>Hiểu bạn, trước khi tư vấn.</h3>
                  <p>
                    Nhu cầu, ưu tiên và ngân sách của bạn là điểm bắt đầu cho
                    mọi giải pháp.
                  </p>
                </div>
              </article>
              <article className="benefit-card">
                <span className="benefit-art benefit-art-clarity" aria-hidden="true">
                  <Image src="/images/benefit-clarity.webp" alt="" width={160} height={160} sizes="(max-width: 600px) 88px, 128px" />
                </span>
                <div>
                  <span className="feature-index">02 / MINH BẠCH</span>
                  <h3>Rõ quyền lợi. Hiểu lựa chọn.</h3>
                  <p>
                    Giải thích dễ hiểu về phạm vi, điều kiện và những điều cần
                    lưu ý trước khi tham gia.
                  </p>
                </div>
              </article>
              <article className="benefit-card">
                <span className="benefit-art benefit-art-support" aria-hidden="true">
                  <Image src="/images/benefit-support.webp" alt="" width={160} height={160} sizes="(max-width: 600px) 88px, 128px" />
                </span>
                <div>
                  <span className="feature-index">03 / ĐỒNG HÀNH</span>
                  <h3>Khi bạn cần, có chúng tôi.</h3>
                  <p>
                    Hướng dẫn thủ tục và kết nối với nhà bảo hiểm trong suốt quá
                    trình sử dụng.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="section home-stories">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>GÓC AN TÂM</Eyebrow>
              <h2>
                Bảo vệ những điều <br />
                làm nên cuộc sống.
              </h2>
            </div>
            <Link className="text-link" href="/cau-chuyen">
              Khám phá tất cả <Icon name="arrow" size={18} />
            </Link>
          </div>
          <StoryGrid limit={3} />
        </div>
      </section>
      <section className="section home-quote">
        <div className="container home-quote-grid">
          <div>
            <Eyebrow>BẮT ĐẦU THẬT ĐƠN GIẢN</Eyebrow>
            <h2>
              Một lời chia sẻ. <br />
              <span>Thêm một sự an tâm.</span>
            </h2>
            <p>
              Cho chúng tôi biết điều bạn muốn bảo vệ. <br />
              Cùng tìm một giải pháp phù hợp với bạn.
            </p>
            <div className="quote-photo">
              <Image
                src="/images/consultation.webp"
                alt="Tư vấn tận tâm, lắng nghe nhu cầu khách hàng"
                fill
                sizes="(max-width:700px) 100vw, 40vw"
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>GỠ RỐI CÙNG BẠN</Eyebrow>
            <h2>
              Bạn đang <br />
              băn khoăn?
            </h2>
            <p>Một vài điều hữu ích trước khi bắt đầu.</p>
            <Link className="text-link" href="/lien-he">
              Hỏi chúng tôi <Icon name="arrow" size={17} />
            </Link>
          </div>
          <FAQ
            items={[
              {
                q: "Tôi chưa biết nên chọn loại bảo hiểm nào?",
                a: "Hãy bắt đầu từ điều bạn muốn bảo vệ: sức khỏe, chiếc xe, chuyến đi hay doanh nghiệp. Chúng tôi sẽ trao đổi về nhu cầu và ngân sách để giúp bạn tìm hiểu lựa chọn phù hợp.",
              },
              {
                q: "Bảo Tín An Tâm có phải là công ty bảo hiểm?",
                a: "Bảo Tín An Tâm là đại lý bảo hiểm, tư vấn và kết nối bạn với các sản phẩm của MIC và PVI. Hợp đồng, điều khoản và việc giải quyết quyền lợi do nhà bảo hiểm tương ứng thực hiện.",
              },
              {
                q: "Tôi có mất phí khi nhận tư vấn không?",
                a: "Bạn có thể liên hệ Bảo Tín An Tâm để được tư vấn miễn phí. Phí bảo hiểm của sản phẩm sẽ được trao đổi rõ trước khi bạn quyết định tham gia.",
              },
            ]}
          />
        </div>
      </section>
      <section className="section guides-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>CẨM NANG BẢO HIỂM</Eyebrow>
              <h2>
                Hiểu thêm một chút. <br />
                An tâm hơn mỗi ngày.
              </h2>
            </div>
            <Link className="text-link" href="/cam-nang">
              Xem cẩm nang <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="guide-grid">
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
        </div>
      </section>
      <CTA />
    </>
  );
}
