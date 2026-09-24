import type { Metadata } from "next";
import Icon from "../components/ui-icon";
import { Breadcrumb, CTA, Eyebrow, FAQ } from "../components/ui";
export const metadata: Metadata = { title: "Hỗ trợ bồi thường" };
export default function ClaimsPage() {
  return (
    <>
      <section className="page-intro gradient-surface">
        <div className="container">
          <Breadcrumb current="Hỗ trợ bồi thường" />
          <Eyebrow>ĐIỂM TỰA KHI BẠN CẦN</Eyebrow>
          <h1>
            Có những lúc, <br />
            <span className="gradient-text">bạn cần một người đồng hành.</span>
          </h1>
          <p>
            Chúng tôi giúp bạn hiểu bước tiếp theo, <br />
            chuẩn bị hồ sơ và kết nối với nhà bảo hiểm.
          </p>
          <a className="button" href="tel:0985775836">
            <Icon name="phone" size={18} />
            Gọi hỗ trợ: 0985 775 836
          </a>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Eyebrow>TỪNG BƯỚC RÕ RÀNG</Eyebrow>
          <h2>Hướng dẫn để bạn chủ động hơn.</h2>
          <div className="claims-timeline">
            {[
              {
                icon: "phone",
                title: "Thông báo sự kiện",
                text: "Thông báo cho nhà bảo hiểm theo thời hạn và kênh được ghi trong hợp đồng. Liên hệ Bảo Tín An Tâm nếu bạn cần hỗ trợ xác định đầu mối.",
                tip: "Chuẩn bị số hợp đồng hoặc giấy chứng nhận bảo hiểm.",
              },
              {
                icon: "file",
                title: "Chuẩn bị hồ sơ",
                text: "Lưu giữ chứng từ, hình ảnh và các thông tin liên quan. Hồ sơ cụ thể phụ thuộc loại sản phẩm và yêu cầu của nhà bảo hiểm.",
                tip: "Giữ bản gốc chứng từ và bản sao để thuận tiện theo dõi.",
              },
              {
                icon: "support",
                title: "Nộp và theo dõi",
                text: "Nộp hồ sơ qua kênh được nhà bảo hiểm hướng dẫn, ghi lại mã tiếp nhận và bổ sung tài liệu nếu được yêu cầu.",
                tip: "Chúng tôi hỗ trợ kết nối; nhà bảo hiểm thẩm định và quyết định quyền lợi.",
              },
            ].map((s, i) => (
              <article key={s.title}>
                <div className="timeline-number">0{i + 1}</div>
                <span className="feature-icon mint">
                  <Icon name={s.icon} size={27} />
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="timeline-tip">
                    <Icon name="check" size={17} />
                    {s.tip}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>THÔNG TIN TỪ NHÀ BẢO HIỂM</Eyebrow>
              <h2>Đúng kênh. Đúng hướng dẫn.</h2>
            </div>
            <p>
              Tham khảo hướng dẫn chính thức <br />
              và thông tin ghi trên hợp đồng của bạn.
            </p>
          </div>
          <div className="insurer-help">
            <a href="https://www.mic.vn/" target="_blank" rel="noreferrer">
              <span className="insurer-name">MIC</span>
              <h3>Bảo hiểm Quân đội</h3>
              <p>
                Truy cập website MIC để tra cứu kênh liên hệ và hướng dẫn theo
                sản phẩm.
              </p>
              <span className="text-link">
                Đến website MIC <Icon name="arrow" size={18} />
              </span>
            </a>
            <a
              href="https://online.pvi.com.vn/huong-dan-boi-thuong"
              target="_blank"
              rel="noreferrer"
            >
              <span className="insurer-name">PVI</span>
              <h3>Bảo hiểm PVI</h3>
              <p>
                Xem hướng dẫn thông báo tổn thất, chuẩn bị và gửi hồ sơ yêu cầu
                bồi thường.
              </p>
              <span className="text-link">
                Xem hướng dẫn PVI <Icon name="arrow" size={18} />
              </span>
            </a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>NHỮNG ĐIỀU CẦN BIẾT</Eyebrow>
            <h2>Giải đáp về hồ sơ.</h2>
          </div>
          <FAQ
            items={[
              {
                q: "Bảo Tín An Tâm có quyết định bồi thường không?",
                a: "Không. Bảo Tín An Tâm hỗ trợ hướng dẫn và kết nối. Việc tiếp nhận, thẩm định và quyết định chi trả thuộc nhà bảo hiểm theo hợp đồng và hồ sơ của từng trường hợp.",
              },
              {
                q: "Mất bao lâu để được giải quyết?",
                a: "Thời gian phụ thuộc quy định trong hợp đồng, loại sự kiện và tính đầy đủ của hồ sơ. Bạn nên xác nhận mốc thời gian và tình trạng xử lý trực tiếp với nhà bảo hiểm.",
              },
              {
                q: "Tôi chưa có đủ giấy tờ thì cần làm gì?",
                a: "Hãy thông báo sự kiện đúng thời hạn trước và trao đổi với nhà bảo hiểm về tài liệu cần bổ sung. Đừng đợi đủ giấy tờ mới thông báo nếu hợp đồng có quy định thời hạn.",
              },
            ]}
          />
        </div>
      </section>
      <CTA />
    </>
  );
}
