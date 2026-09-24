import Link from "next/link";
import CookiePreferences from "./cookie-preferences";
import Icon from "./ui-icon";
import { Brand } from "./site-header";
export default function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-ornament" aria-hidden="true">
          <svg viewBox="0 0 700 480" fill="none">
            <path d="M370 540C190 360 240 140 610 50C670 300 600 440 370 540Z" />
            <path d="M370 540C400 345 475 210 610 50M408 389L278 252M450 289L340 177M490 219L566 337M540 137L607 246" />
            <circle cx="610" cy="50" r="210" />
            <circle cx="610" cy="50" r="260" />
            <circle cx="610" cy="50" r="310" />
          </svg>
        </div>
        <div className="container">
          <div className="footer-grid">
            <div>
              <Brand />
              <p>
                Một lựa chọn phù hợp hôm nay. <br />
                Một tương lai an tâm hơn.
              </p>
              <small>
                CÔNG TY TNHH BẢO TÍN AN TÂM <br />
                Mã số doanh nghiệp: 0319574619
              </small>
            </div>
            <div>
              <h3>Khám phá</h3>
              <Link href="/ve-chung-toi">Về Bảo Tín An Tâm</Link>
              <Link href="/san-pham">Giải pháp bảo hiểm</Link>
              <Link href="/cau-chuyen">Góc an tâm</Link>
              <Link href="/cam-nang">Cẩm nang bảo hiểm</Link>
              <Link href="/boi-thuong">Hỗ trợ bồi thường</Link>
              <Link href="/lien-he">Liên hệ tư vấn</Link>
            </div>
            <div>
              <h3>Kết nối với chúng tôi</h3>
              <a href="tel:0985775836">0985 775 836</a>
              <a href="mailto:baotinantam@gmail.com">baotinantam@gmail.com</a>
              <p>
                750/9/9A Nguyễn Kiệm, Phường Đức Nhuận, <br />
                Thành phố Hồ Chí Minh, Việt Nam
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Bảo Tín An Tâm</span>
            <span>Đại lý bảo hiểm MIC & PVI</span>
            <Link href="/chinh-sach-cookie">Chính sách cookie</Link>
            <CookiePreferences />
          </div>
        </div>
      </footer>
      <a
        className="floating-call"
        href="tel:0985775836"
        aria-label="Gọi Bảo Tín An Tâm"
      >
        <Icon name="phone" size={21} />
      </a>
    </>
  );
}
