import type { Metadata } from "next";
import Image from "next/image";
import ProductGrid from "../components/product-grid";
import { CTA, Eyebrow, FAQ } from "../components/ui";
export const metadata: Metadata = { title: "Giải pháp bảo hiểm" };
export default function ProductsPage() {
  return (
    <>
      <section className="photo-page-hero services-hero">
        <Image
          src="/images/consultation.webp"
          alt="Tư vấn giải pháp bảo hiểm phù hợp với khách hàng"
          fill
          priority
          sizes="100vw"
        />
        <div className="photo-page-overlay" />
        <div className="container">
          <Eyebrow>GIẢI PHÁP BẢO HIỂM MIC & PVI</Eyebrow>
          <h1>
            Đa dạng giải pháp. <br />
            Trọn vẹn sự quan tâm.
          </h1>
          <p>
            Từ những điều thân thuộc đến các dự định lớn, <br />
            cùng tìm lựa chọn bảo vệ phù hợp với bạn.
          </p>
        </div>
      </section>
      <section className="section services-catalog">
        <div className="container">
          <div className="center-heading">
            <Eyebrow>DỊCH VỤ CỦA CHÚNG TÔI</Eyebrow>
            <h2>Bạn cần bảo vệ điều gì?</h2>
            <p>Khám phá từng giải pháp, hiểu rõ từng lựa chọn.</p>
          </div>
          <ProductGrid />
          <p className="legal-note">
            Thông tin giới thiệu mang tính tổng quan. Phạm vi, quyền lợi, điều
            kiện và mức phí áp dụng theo quy tắc, điều khoản của từng sản phẩm.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container service-facts">
          <div>
            <Eyebrow>ĐIỂM TỰA CHO TƯƠNG LAI</Eyebrow>
            <h2>
              Chọn đúng nhu cầu. <br />
              <span className="gradient-text">An tâm đúng cách.</span>
            </h2>
            <p>
              Chúng tôi giúp bạn kết nối với nhà bảo hiểm, <br />
              bằng thông tin dễ hiểu và sự tư vấn tận tâm.
            </p>
          </div>
          <div className="fact-grid">
            <div>
              <strong>MIC</strong>
              <span>Bảo hiểm Quân đội</span>
            </div>
            <div>
              <strong>PVI</strong>
              <span>Bảo hiểm PVI</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Nhóm giải pháp</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Đầu mối tư vấn tận tâm</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>CÂU HỎI THƯỜNG GẶP</Eyebrow>
            <h2>
              Hiểu rõ hơn <br />
              trước khi bắt đầu.
            </h2>
            <div className="faq-photo">
              <Image
                src="/images/consultation.webp"
                alt="Lắng nghe và giải đáp nhu cầu bảo hiểm"
                fill
                sizes="(max-width:700px) 100vw, 40vw"
              />
            </div>
          </div>
          <FAQ
            items={[
              {
                q: "Tôi nên bắt đầu từ sản phẩm nào?",
                a: "Hãy xác định điều muốn bảo vệ và ngân sách dự kiến. Bạn có thể chia sẻ nhu cầu với tư vấn viên để tìm hiểu nhóm sản phẩm phù hợp trước khi quyết định.",
              },
              {
                q: "Tôi có thể so sánh các phương án không?",
                a: "Có. Khi trao đổi, bạn nên so sánh phạm vi, giới hạn quyền lợi, mức khấu trừ, điều kiện và mức phí trên cùng nhu cầu bảo vệ.",
              },
              {
                q: "Báo phí trên website có phải mức phí cuối cùng?",
                a: "Website không đưa ra mức phí cố định. Phí chính thức phụ thuộc thông tin thực tế, sản phẩm và đánh giá của nhà bảo hiểm, sẽ được trao đổi trước khi bạn tham gia.",
              },
              {
                q: "Sau khi tham gia, tôi cần hỗ trợ thì liên hệ ai?",
                a: "Bạn có thể gọi Bảo Tín An Tâm theo số 0985 775 836 để được hướng dẫn kết nối. Với sự kiện bảo hiểm, đồng thời thực hiện thông báo theo kênh và thời hạn ghi trong hợp đồng.",
              },
            ]}
          />
        </div>
      </section>
      <CTA />
    </>
  );
}
