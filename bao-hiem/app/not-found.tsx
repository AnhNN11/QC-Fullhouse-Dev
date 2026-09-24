import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section not-found container">
      <span className="gradient-text">404</span>
      <h1>Trang này chưa có ở đây.</h1>
      <p>Hãy quay lại để tìm giải pháp bảo hiểm phù hợp với bạn.</p>
      <Link href="/san-pham" className="button">
        Khám phá giải pháp
      </Link>
    </section>
  );
}
