import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DolphinX Edu — Học lập trình & mentor online 1:1",
  icons: { icon: "/brand/dolphinx-studio-mark.webp", apple: "/brand/dolphinx-studio-mark.webp" },
  description:
    "Học lập trình qua khóa học video tiếng Việt và lộ trình online 1:1 cùng mentor, phù hợp với mục tiêu cá nhân.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
