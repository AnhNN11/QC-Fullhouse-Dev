import Image from 'next/image';
import EduFooter from './edu-footer';
import EduNavbar from './edu-navbar';
import EduMotion from './edu-motion';
import EduHeadline from './edu-headline';
import './edu-typography.css';
import './edu-hero-framing.css';
import './edu-landing.css';
import './edu-editorial.css';
import './edu-program-artwork.css';

export function EditorialHero({label,title,image,alt,groupPortrait=false,credit}:{label:string;title:string;image:string;alt:string;groupPortrait?:boolean;credit?:string}) {
  return <section className={`ed-page-hero${groupPortrait ? ' ed-page-hero-group' : ''}`}><Image src={image} alt={alt} width={1920} height={groupPortrait ? 1280 : 900} loading="eager" fetchPriority="high" sizes="100vw"/><div className="edu-container"><div className="ed-title-panel"><span className="edu-label">{label}</span><EduHeadline text={title}/></div>{credit && <p className="ed-hero-credit">{credit}</p>}</div></section>;
}

export default function EduPublicShell({children}:{children:React.ReactNode}) {
  return <div className="edu ed-editorial edu-public-type"><EduNavbar/><EduMotion><main id="main-content">{children}</main></EduMotion><EduFooter/></div>;
}
