"use client";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { subscribeLocation, getLocationHash, getServerHash, isLearningLinkActive } from './navigation-location';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { House, Library, Code2, MessageCircle, Trophy, Users, Search, X, FolderOpen, UserRound } from 'lucide-react';
import Brand from './brand';
import AccountDropdown from './account-dropdown';
import AuthDialog from './auth-dialog';
import { LearningContext } from './learning-context';
import type { SessionUser } from '@/lib/user-auth';
import './dashboard-updates.css';
import './learning-shell.css';
import './problemset-layout.css';
import './student-dashboard.css';
import './learning-theme.css';

export default function LearningShell({ initialUser, children }: { initialUser: SessionUser | null; children: ReactNode }) {
  const [user, setUser] = useState(initialUser);
  const [previousUser, setPreviousUser] = useState(initialUser);
  if (previousUser !== initialUser) { setPreviousUser(initialUser); setUser(initialUser); }
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const [logoutVersion, setLogoutVersion] = useState(0);
  const [auth, setAuth] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeLocation, getLocationHash, getServerHash);
  const router = useRouter();
  const search = useRef<HTMLInputElement>(null);
  const name = user?.name ?? 'Khách';
  const initials = user ? name.split(/\s+/).slice(-2).map(s => s[0]).join('').toUpperCase() : 'KH';
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.current?.focus(); }
      if (event.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  async function logout() {
    setPending(true); setError('');
    try {
      const response = await fetch('/api/auth', { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setUser(null); setQuery(''); setMenu(false); setLogoutVersion(version => version + 1);
      router.replace('/dashboard'); router.refresh();
    } catch { setError('Chưa đăng xuất được. Vui lòng thử lại.'); }
    finally { setPending(false); }
  }
  const links = [
    { href: '/dashboard', label: 'Tổng quan', Icon: House },
    { href: '/courses', label: 'Khóa học', Icon: Library },
    { href: '/dashboard#practice', label: 'Bài tập', Icon: Code2 },
    { href: '/resources', label: 'Tài nguyên', Icon: FolderOpen },

    { href: '/consultation', label: 'Mentor 1:1', Icon: MessageCircle },
    { href: '/contests', label: 'Cuộc thi', Icon: Trophy },
    { href: '/community', label: 'Cộng đồng', Icon: Users },
    { href: '/profile', label: 'Hồ sơ cá nhân', Icon: UserRound },
  ];
  return <LearningContext.Provider value={{ user, setUser, query, setQuery }}><div className={`app-shell dx-dashboard-v2 dx-learning-shell dx-problemset-shell ${pathname === "/dashboard" ? "dx-problemset sd-student" : ""}`}>
    <aside className={`sidebar ${menu ? 'open' : ''}`} aria-label="Menu học tập"><div className="brand-wrap"><Brand/></div><button className="mobile-close" onClick={()=>setMenu(false)} aria-label="Đóng menu"><X/></button><nav id="learning-navigation" className="side-nav" aria-label="Điều hướng nền tảng">{links.map(({href,label,Icon}, index) => { const active = isLearningLinkActive(href, pathname, hash); return <Fragment key={href}>{(index === 0 || index === 4 || index === 7) && <span className="nav-label">{index === 0 ? "KHÔNG GIAN HỌC" : index === 4 ? "KHÁM PHÁ & KẾT NỐI" : "CÁ NHÂN"}</span>}<Link href={href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={()=>setMenu(false)}><span className="nav-icon"><Icon/></span><span>{label}</span>{active && <i className="nav-active-dot"/>}</Link></Fragment>; })}</nav><div className="sidebar-upgrade"><span>✦</span><h4>Học thêm mỗi ngày</h4><p>Tiếp tục khóa học và luyện tập kiến thức vừa học.</p><Link href="/courses" onClick={()=>setMenu(false)}>Khám phá khóa học →</Link></div><div className="sidebar-profile"><div className="profile-avatar">{initials}</div><div><strong>{name}</strong><small>{user ? 'Tài khoản học viên' : 'Đang xem với tư cách khách'}</small></div></div></aside>
    {menu && <button className="sidebar-scrim" onClick={()=>setMenu(false)} aria-label="Đóng menu"/>}
    <div className="workspace"><header className="topbar">{<><div className="problemset-brand"><Brand compact/></div><nav className="problemset-top-nav" aria-label="Điều hướng chính">{[{ href: '/dashboard#practice', label: 'Bài tập' }, { href: '/courses', label: 'Khóa học' }, { href: '/contests', label: 'Cuộc thi' }, { href: '/community', label: 'Cộng đồng' }].map(item => <Link key={item.href} href={item.href} aria-current={isLearningLinkActive(item.href, pathname, hash) ? 'page' : undefined}>{item.label}</Link>)}</nav></>}<button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Mở menu" aria-expanded={menu} aria-controls="learning-navigation">☰</button><form className="global-search" role="search" onSubmit={event=>{event.preventDefault();router.push('/dashboard');setMenu(false);}}><Search/><input ref={search} aria-label="Tìm khóa học và bài tập" value={query} onChange={event=>setQuery(event.target.value)} placeholder={pathname === '/dashboard' ? 'Tìm khóa học, bài tập…' : 'Tìm kiếm · nhấn Enter'}/><kbd>⌘ K</kbd></form><div className="top-actions">{user ? <AccountDropdown user={user} pending={pending} logout={()=>void logout()}/> : <button className="dx-account-button" onClick={()=>setAuth(true)}>Đăng nhập / Đăng ký</button>}</div></header>{error && <p role="alert" className="dx-dashboard-notice">{error}</p>}<div className="learning-content" key={logoutVersion}>{children}</div></div>
    <AuthDialog open={auth} onOpenChange={setAuth} onSuccess={()=>router.refresh()}/>
  </div></LearningContext.Provider>;
}
