import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, Code2, MessagesSquare } from 'lucide-react';
import Brand from './brand';
import LandingMenu from './landing-menu';

export default function LandingNavbar() {
  return <div className="landing-nav-wrap"><header className="bp-nav bp-container landing-nav"><Brand/><nav aria-label="Điều hướng chính">{[{href:'/#roadmaps',label:'Lộ trình',Icon:Compass},{href:'/#programs',label:'Khóa học',Icon:BookOpen},{href:'/contests',label:'Cuộc thi',Icon:Code2},{href:'/community',label:'Cộng đồng',Icon:MessagesSquare},{href:'/#mentoring',label:'Mentor 1:1',Icon:MessagesSquare}].map(({href,label,Icon})=><a key={href} href={href}><Icon size={16}/><span>{label}</span></a>)}</nav><Link className="landing-nav-start" href="/dashboard"><span><small>KHÔNG GIAN CỦA BẠN</small>Bắt đầu học</span><ArrowUpRight size={20}/></Link><LandingMenu/></header><div className="landing-nav-caption" aria-hidden="true"><span>LEARN AT YOUR OWN PACE</span><span>HỌC · THỰC HÀNH · SÁNG TẠO</span></div></div>;
}
