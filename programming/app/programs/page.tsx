import Link from 'next/link';
import Image from 'next/image';
import {eduProgramMedia} from '@/lib/edu-program-media';
import '@/app/edu-program-media.css';
import { ArrowUpRight } from 'lucide-react';
import EduPublicShell,{EditorialHero} from '../edu-public-shell';
import {eduPrograms} from '@/lib/edu-programs';
import EduAssessment from '../edu-assessment';
export const metadata={title:'Chương trình học — DolphinX Edu'};
export default function Programs(){return <EduPublicShell><EditorialHero label="CHƯƠNG TRÌNH HỌC" title="Chọn một hướng. Tạo nên điều mới." image="/brand/company/presentation-original.png" alt="Ảnh thuyết trình thực tế do đội ngũ cung cấp"/><section className="edu-container ed-program-index" data-reveal><div className="edu-section-head"><h2>Nền tảng vững.<br/>Khả năng rộng mở.</h2><p>Mỗi chương trình giới thiệu mục tiêu, nền tảng cần có và các chủ đề chính. Thông tin bài học và quyền truy cập nằm trong trang khóa học tương ứng.</p></div><p className="ed-program-image-note">Hình minh họa chỉnh bằng AI từ ảnh đại diện do đội ngũ cung cấp.</p><div className="ed-program-grid">{eduPrograms.map(p=><Link href={`/programs/${p.slug}`} key={p.slug} className="ed-program-card"><div><Image src={eduProgramMedia[p.slug]} alt={`Ảnh đại diện chỉnh bằng AI cho ${p.title}`} width={1672} height={941} sizes="(max-width:650px) 90vw, 42vw"/></div><span className="edu-label">{p.tag}</span><h3>{p.title}<ArrowUpRight size={23}/></h3><p>{p.intro}</p><span className="ed-card-bottom">Khám phá chương trình <span>06 chủ đề</span></span></Link>)}</div></section><EduAssessment/><section className="edu-cta"><div className="edu-container"><span className="edu-label">CHƯA CHẮC NÊN BẮT ĐẦU Ở ĐÂU?</span><h2>Mục tiêu của bạn.<br/>Một hướng đi phù hợp.</h2><p>Khám phá lộ trình hoặc trao đổi cùng đội ngũ trước khi chọn khóa.</p><Link className="edu-button" href="/consultation">Nhận tư vấn <ArrowUpRight size={19}/></Link></div></section></EduPublicShell>}
