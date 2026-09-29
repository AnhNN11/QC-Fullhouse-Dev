import Link from 'next/link';
import Image from 'next/image';
import {activityMedia} from '@/lib/edu-activity-media';
import '../edu-activity-index.css';
import {ArrowUpRight} from 'lucide-react';
import EduPublicShell,{EditorialHero} from '../edu-public-shell';
import {eduActivities} from '@/lib/edu-activities';
import EduLearningSpaces from '../edu-learning-spaces';
export const metadata={title:'Hoạt động học tập — DolphinX Edu'};
export default function Activities(){return <EduPublicShell><EditorialHero groupPortrait label="HOẠT ĐỘNG & KẾT NỐI" title="Học cùng nhau. Thử điều mới." image="/brand/company/presentation-original.png" alt="Ảnh gốc thành viên đội ngũ đang thuyết trình"/><section className="edu-container ed-program-index"><div className="edu-section-head" data-reveal><h2>Không chỉ<br/>là một bài giảng.</h2><p>Những gợi ý để thực hành, sáng tạo và kết nối trong không gian DolphinX. Đây là các hình thức học tập, không phải lịch sự kiện đã được xác nhận.</p></div><div className="ed-activity-photo-grid">{eduActivities.map(a=>{const media=activityMedia[a.slug];return <article key={a.slug} data-reveal><Link className="ed-activity-card" href={`/extracurriculars/${a.slug}`}><div className="ed-activity-card-image"><Image src={media.src} alt={media.alt} width={1536} height={1024} sizes="(max-width:650px) 90vw, 46vw"/><span>{a.category}</span></div><h3>{a.title}<ArrowUpRight size={24} aria-hidden="true"/></h3><p>{a.intro}</p><span className="ed-activity-card-more">Khám phá hoạt động ↗</span></Link><small className="ed-activity-card-note">{media.note}</small></article>;})}</div></section><EduLearningSpaces/></EduPublicShell>}
