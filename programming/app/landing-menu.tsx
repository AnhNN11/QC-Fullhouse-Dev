"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function LandingMenu() {
  const [open, setOpen] = useState(false);
  return <div className="bp-mobile-menu" onKeyDown={event => {
    if (event.key === "Escape") {
      setOpen(false);
      event.currentTarget.querySelector("button")?.focus();
    }
  }}>
    <button type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="landing-mobile-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <nav id="landing-mobile-nav" aria-label="Điều hướng mobile" hidden={!open}>
      {[["/#programs", "Khóa học"], ["/#roadmaps", "Roadmap"], ["/#approach", "Cách học"], ["/#mentoring", "Mentor 1:1"], ["/community", "Cộng đồng"], ["/contests", "Cuộc thi"], ["/dashboard", "Vào dashboard"]].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
    </nav>
  </div>;
}
