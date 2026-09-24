import Link from "next/link";
import Icon from "./ui-icon";
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
export function Breadcrumb({
  current,
  parent,
}: {
  current: string;
  parent?: { href: string; label: string };
}) {
  return (
    <nav className="breadcrumb" aria-label="Đường dẫn">
      <Link href="/">Trang chủ</Link>
      <span>/</span>
      {parent && (
        <>
          <Link href={parent.href}>{parent.label}</Link>
          <span>/</span>
        </>
      )}
      <span aria-current="page">{current}</span>
    </nav>
  );
}
export function CTA() {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-panel">
          <div className="cta-orb" aria-hidden="true">
            <Icon name="shield" size={100} />
          </div>
          <div>
            <Eyebrow>CÙNG BẠN TÌM ĐIỂM TỰA</Eyebrow>
            <h2>
              Một cuộc trò chuyện nhỏ. <br />
              <span className="gradient-text">Một sự an tâm lớn.</span>
            </h2>
            <p>Chia sẻ điều bạn quan tâm. Chúng tôi sẽ lắng nghe.</p>
          </div>
          <div className="cta-actions">
            <Link className="button" href="/lien-he">
              Bắt đầu trò chuyện <Icon name="arrow" size={18} />
            </Link>
            <a href="tel:0985775836">
              <Icon name="phone" size={17} />
              0985 775 836
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <span>+</span>
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
