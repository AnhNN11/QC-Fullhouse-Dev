import type { Metadata } from "next";
import Image from "next/image";
import Icon from "../components/ui-icon";
import ProtectionGraphic from "../components/protection-graphic";
import { Breadcrumb, CTA, Eyebrow } from "../components/ui";
export const metadata: Metadata = { title: "Về chúng tôi" };
export default function AboutPage() {
  return (
    <>
      <section className="page-intro about-intro gradient-surface">
        <div className="container">
          <Breadcrumb current="Về chúng tôi" />
          <Eyebrow>CHÀO BẠN, CHÚNG TÔI LÀ BẢO TÍN AN TÂM</Eyebrow>
          <h1>
            Bảo hiểm là lựa chọn. <br />
            <span className="gradient-text">
              Tận tâm là cách chúng tôi làm.
            </span>
          </h1>
          <p>
            Mỗi người đều có những điều muốn gìn giữ. <br />
            Chúng tôi ở đây để cùng bạn bảo vệ những điều ấy.
          </p>
        </div>
      </section>
      <section className="container about-editorial">
        <div className="about-photo">
          <Image
            src="/images/family.webp"
            alt="Khoảnh khắc bình yên của gia đình Việt Nam"
            fill
            priority
            sizes="(max-width:700px) 100vw, 65vw"
          />
          <span>BÌNH YÊN BẮT ĐẦU TỪ SỰ QUAN TÂM.</span>
        </div>
        <div className="about-quote">
          <span aria-hidden="true">“</span>
          <p>
            Niềm tin bắt đầu <br />
            từ sự lắng nghe. <br />
            <strong>
              An tâm đến từ <br />
              sự thấu hiểu.
            </strong>
          </p>
          <span className="quote-spark" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
      <section className="section">
        <div className="container story-grid">
          <div>
            <Eyebrow>CÂU CHUYỆN CỦA CHÚNG TÔI</Eyebrow>
            <h2>
              Gần gũi trong tư vấn. <br />
              Rõ ràng trong lựa chọn.
            </h2>
            <ProtectionGraphic />
          </div>
          <div className="story-copy">
            <p>
              Bảo Tín An Tâm được thành lập với mong muốn giúp khách hàng tiếp
              cận bảo hiểm một cách dễ hiểu và gần gũi hơn. Chúng tôi tin rằng
              một giải pháp phù hợp phải bắt đầu từ chính cuộc sống của bạn.
            </p>
            <p>
              Là đại lý bảo hiểm MIC và PVI, chúng tôi kết nối khách hàng cá
              nhân, gia đình và doanh nghiệp với các lựa chọn bảo vệ sức khỏe,
              xe, hành trình và tài sản.
            </p>
            <p>
              Vai trò của chúng tôi là lắng nghe, giải thích và hỗ trợ kết nối.
              Việc cung cấp hợp đồng và giải quyết quyền lợi được thực hiện bởi
              nhà bảo hiểm theo quy tắc, điều khoản tương ứng.
            </p>
            <div className="story-signature">
              <Icon name="shield" size={24} />
              <span>
                Bảo Tín An Tâm<small>Vững niềm tin. Trọn an tâm.</small>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <Eyebrow>BA ĐIỀU CHÚNG TÔI GÌN GIỮ</Eyebrow>
          <h2>Tận tâm trong từng bước nhỏ.</h2>
          <div className="three-grid">
            {[
              [
                "heart",
                "Lắng nghe trước tiên",
                "Hiểu điều bạn quan tâm, thay vì bắt đầu bằng một sản phẩm.",
              ],
              [
                "file",
                "Nói rõ, nói dễ hiểu",
                "Giúp bạn nắm được quyền lợi, điều kiện và giới hạn của lựa chọn.",
              ],
              [
                "support",
                "Đồng hành khi cần",
                "Hỗ trợ thủ tục và kết nối với nhà bảo hiểm trong quá trình sử dụng.",
              ],
            ].map(([icon, title, desc]) => (
              <article className="info-card" key={title}>
                <span className="feature-icon mint">
                  <Icon name={icon} size={26} />
                </span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container company-info">
          <div>
            <Eyebrow>THÔNG TIN DOANH NGHIỆP</Eyebrow>
            <h2>
              Minh bạch để bạn <br />
              thêm vững tin.
            </h2>
          </div>
          <dl>
            <div>
              <dt>Tên doanh nghiệp</dt>
              <dd>CÔNG TY TNHH BẢO TÍN AN TÂM</dd>
            </div>
            <div>
              <dt>Mã số doanh nghiệp</dt>
              <dd>0319574619</dd>
            </div>
            <div>
              <dt>Ngày đăng ký lần đầu</dt>
              <dd>29/05/2026</dd>
            </div>
            <div>
              <dt>Địa chỉ trụ sở</dt>
              <dd>
                750/9/9A Nguyễn Kiệm, Phường Đức Nhuận, Thành phố Hồ Chí Minh,
                Việt Nam
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <CTA />
    </>
  );
}
