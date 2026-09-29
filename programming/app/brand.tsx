import Image from "next/image";
import Link from "next/link";

export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`dx-brand${compact ? " dx-brand-compact" : ""}`} href="/" aria-label="DolphinX Education — Trang chủ">
      <Image src="/brand/dolphinx-studio-mark.webp" alt="" width={48} height={48} />
      <span className="dx-brand-copy"><strong>Dolphin<b>X</b></strong><small>EDUCATION</small></span>
    </Link>
  );
}
