'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function PublicNavigation(){const pathname=usePathname();return <nav aria-label="Khám phá DolphinX">{[['/','Trang chủ'],['/roadmaps','Lộ trình'],['/community','Cộng đồng'],['/contests','Cuộc thi'],['/courses','Khóa học']].map(([href,label])=><Link href={href} key={href} aria-current={pathname===href||(href!=='/'&&pathname.startsWith(href+'/'))?'page':undefined}>{label}</Link>)}</nav>;}
