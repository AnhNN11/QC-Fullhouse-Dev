"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import Brand from './brand';
import './edu-navigation.css';
const groups = [
  { title: 'Khám phá', links: [['/', 'Trang chủ'], ['/about', 'Về DolphinX'], ['/people', 'Con người'], ['/contact', 'Liên hệ']] },
  { title: 'Học & thực hành', links: [['/programs', 'Chương trình học'], ['/courses', 'Thư viện khóa học'], ['/#roadmaps', 'Lộ trình mở'], ['/dashboard#practice', 'Luyện code']] },
  { title: 'Cùng kết nối', links: [['/extracurriculars', 'Hoạt động'], ['/community', 'Cộng đồng'], ['/contests', 'Cuộc thi'], ['/blog', 'Góc chia sẻ']] },
];
const programs = [['frontend', 'Frontend Web'], ['python', 'Python'], ['algorithms', 'Thuật toán'], ['data-structures', 'Cấu trúc dữ liệu'], ['sql', 'SQL & dữ liệu'], ['interview', 'Luyện phỏng vấn']];
export default function EduNavbar() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => { dialog.current?.close(); setOpen(false); trigger.current?.focus(); };
  const current = (href: string) => !href.includes('#') && (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));
  return <header className="edu-nav edu-expanded-navigation">
    <div className="edu-container"><Brand/>
      <nav className="edu-inline-navigation" aria-label="Các trang chính">
        <Link href="/about" aria-current={current('/about') ? 'page' : undefined}>Về DolphinX</Link>
        <details className="edu-program-navigation" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false; }}>
          <summary className={current('/programs') ? 'is-current' : undefined}>Chương trình <ChevronDown size={14} aria-hidden="true"/></summary>
          <div className="edu-program-dropdown"><Link href="/programs" aria-current={pathname === '/programs' ? 'page' : undefined}>Tất cả chương trình <ArrowUpRight size={15} aria-hidden="true"/></Link>{programs.map(([slug,label]) => <Link key={slug} href={`/programs/${slug}`} aria-current={current(`/programs/${slug}`) ? 'page' : undefined}>{label}</Link>)}</div>
        </details>
        {[['/extracurriculars','Hoạt động'],['/people','Con người'],['/blog','Góc chia sẻ'],['/contact','Liên hệ']].map(([href,label]) => <Link key={href} href={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>)}
      </nav>
      <Link href="/dashboard" className="edu-button edu-nav-cta">Bắt đầu học <ArrowUpRight size={16}/></Link><button ref={trigger} className="edu-menu-toggle" aria-label="Mở menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="edu-site-navigation" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><span>Khám phá</span><Menu size={22}/></button></div>
    <dialog ref={dialog} id="edu-site-navigation" className="edu-navigation-dialog" aria-label="Điều hướng DolphinX" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const targets = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="edu-navigation-panel">
        <div className="edu-navigation-top"><Link href="/" onClick={close} className="edu-navigation-wordmark">Dolphin<span>X</span> <small>EDU</small></Link><button type="button" onClick={close} aria-label="Đóng menu" autoFocus><X size={24}/></button></div>
        <nav className="edu-navigation-columns" aria-label="Điều hướng chính">{groups.map(group => <div key={group.title}><span className="edu-navigation-label">{group.title}</span>{group.links.map(([href, label]) => <Link key={href} href={href} onClick={close} aria-current={current(href) ? 'page' : undefined}>{label}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}</div>)}</nav>
        <div className="edu-navigation-bottom"><span>Công nghệ tạo nên những giá trị thật.</span><Link href="/dashboard" onClick={close}>Vào không gian học tập <ArrowUpRight size={17}/></Link></div>
      </div>
    </dialog>
  </header>;
}
