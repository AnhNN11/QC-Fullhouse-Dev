import type { Metadata } from "next";
import Image from "next/image";
import StoryGrid from "../components/story-grid";
import { CTA, Eyebrow } from "../components/ui";
export const metadata: Metadata = {
  title: "Góc an tâm - Những tình huống bảo vệ",
};
export default function StoriesPage() {
  return (
    <>
      <section className="photo-page-hero">
        <Image
          src="/images/consultation.webp"
          alt="Minh họa buổi trò chuyện tư vấn bảo hiểm"
          fill
          priority
          sizes="100vw"
        />
        <div className="photo-page-overlay" />
        <div className="container">
          <Eyebrow>GÓC AN TÂM</Eyebrow>
          <h1>
            Cuộc sống muôn màu. <br />
            An tâm theo cách của bạn.
          </h1>
          <p>
            Khám phá những tình huống bảo vệ gần gũi, <br />
            để thấy bảo hiểm có thể đồng hành như thế nào.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container showcase-layout">
          <aside>
            <Eyebrow>TỪ NHỮNG ĐIỀU THÂN THUỘC</Eyebrow>
            <h2>
              Điểm tựa cho <br />
              mỗi nhịp sống.
            </h2>
            <p>
              Gia đình, hành trình hay doanh nghiệp — mỗi nhu cầu là một câu
              chuyện riêng.
            </p>
            <div className="illustration-note">
              Các câu chuyện dưới đây là tình huống minh họa để tìm hiểu nhu cầu
              bảo hiểm, không phải hồ sơ khách hàng hay kết quả bồi thường thực
              tế.
            </div>
          </aside>
          <StoryGrid />
        </div>
      </section>
      <CTA />
    </>
  );
}
