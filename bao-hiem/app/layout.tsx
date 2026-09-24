import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import "./globals.css";
import "./refinements.css";
const font = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Bảo Tín An Tâm | Đại lý bảo hiểm MIC & PVI",
    template: "%s | Bảo Tín An Tâm",
  },
  description:
    "Giải pháp bảo hiểm ô tô, sức khỏe, du lịch và doanh nghiệp từ MIC, PVI. Bảo Tín An Tâm tư vấn tận tâm, đồng hành cùng bạn. 0985 775 836.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={font.variable}>
      <body>
        <SiteHeader />
        <main id="noi-dung">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
