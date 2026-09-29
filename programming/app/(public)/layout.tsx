import Link from 'next/link';
import Brand from '@/app/brand';
import PublicAccount from '@/app/public-account';
import PublicSession from '@/app/public-session';
import PublicNavigation from '@/app/public-navigation';
import { getSessionUser } from '@/lib/user-auth';
import '@/app/academy.css';
import '@/app/public-hub.css';
export const dynamic = 'force-dynamic';
export default async function Layout({children}:{children:React.ReactNode}) {
  const user=await getSessionUser();
  return <PublicSession initialUser={user}><div className="public-hub"><header className="hub-nav"><Brand/><PublicNavigation/><PublicAccount user={user}/></header>{children}<footer className="hub-footer"><Brand/><p>Học cùng nhau. Tiến xa hơn.</p><Link href="/consultation">Tư vấn học 1:1 ↗</Link><Link href="/dashboard">Không gian học ↗</Link></footer></div></PublicSession>;
}
