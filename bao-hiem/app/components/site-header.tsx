"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "./ui-icon";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Bảo Tín An Tâm - Trang chủ">
      <Image src="/images/logo-v2.webp" alt="" width={47} height={47} />
      <span>
        Bảo Tín An Tâm<small>VỮNG NIỀM TIN. TRỌN AN TÂM.</small>
      </span>
    </Link>
  );
}
const links = [
  ["/", "Trang chủ"],
  ["/ve-chung-toi", "Về chúng tôi"],
  ["/san-pham", "Dịch vụ"],
  ["/cau-chuyen", "Góc an tâm"],
  ["/boi-thuong", "Bồi thường"],
];
export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#noi-dung">
        Đến nội dung chính
      </a>
      <div className="utility-bar">
        <div className="container">
          <span>
            <span className="status-dot" /> Điểm tựa cho những điều quan trọng
          </span>
          <a href="tel:0985775836">
            <Icon name="phone" size={13} />
            0985 775 836
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav
            className={open ? "main-nav is-open" : "main-nav"}
            aria-label="Điều hướng chính"
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={
                  (href === "/" ? path === "/" : path.startsWith(href))
                    ? "active"
                    : ""
                }
                aria-current={
                  (href === "/" ? path === "/" : path.startsWith(href))
                    ? "page"
                    : undefined
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            className="button button-small"
            href="/lien-he"
            onClick={() => setOpen(false)}
          >
            Tư vấn miễn phí <Icon name="arrow" size={16} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>
    </>
  );
}
