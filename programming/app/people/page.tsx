import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import EduPublicShell, { EditorialHero } from '../edu-public-shell';
import '../edu-people.css';
import PeopleCarousel from '../edu-people-carousel';

export const metadata: Metadata = { title: 'Con người DolphinX | DolphinX Edu', description: 'Những gương mặt, khoảnh khắc và dấu ấn nhận diện của DolphinX.' };

export default function PeoplePage() {
  return <EduPublicShell>
    <EditorialHero label="CON NGƯỜI DOLPHINX" title="Mỗi cá tính. Một tinh thần chung." image="/brand/company/team-studio-no-badge-v3.png" alt="Ảnh ghép AI bốn gương mặt đại diện trong đồng phục DolphinX navy và trắng, nền studio" groupPortrait credit="Ảnh tập thể ghép bằng AI từ chân dung do đội ngũ cung cấp · Bối cảnh studio minh họa"/>
    <section className="edu-container ed-people-intro" data-reveal><span className="edu-label">CÙNG HỌC. CÙNG LÀM. CÙNG TIẾN BỘ.</span><div><h2>Phía sau công nghệ,<br/>luôn là con người.</h2><p>Những góc nhìn khác nhau làm nên một tập thể. Từ lúc trình bày một ý tưởng đến khi cùng tìm lời giải, mỗi cuộc trao đổi đều là cơ hội để học thêm điều mới.</p></div></section>
    <PeopleCarousel/>
    <section className="ed-people-moments"><div className="edu-container"><div className="edu-section-head" data-reveal><div><span className="edu-label">DẤU ẤN RIÊNG. TINH THẦN CHUNG.</span><h2>Những góc nhìn riêng.<br/>Cùng nhau kết nối.</h2></div><p>Mỗi người mang đến một góc nhìn và nguồn cảm hứng riêng. Những khoảnh khắc giản dị giúp bạn làm quen với các gương mặt phía sau DolphinX.</p></div><div className="ed-moments-grid">{[['seaside-studio-v1.png','Tự tin theo cách riêng','Chân dung mặc polo DolphinX navy trên nền studio'],['lakeside-studio-v1.png','Một góc nhìn mới','Chân dung mặc polo DolphinX trắng trên nền studio'],['street-studio-v1.png','Sẵn sàng kết nối','Chân dung mang túi mặc polo DolphinX navy trong studio']].map(([image,caption,alt])=><figure key={image} data-reveal><Image src={`/brand/company/${image}`} alt={alt} width={1024} height={1536} sizes="(max-width:600px) 90vw, (max-width:900px) 45vw, 23vw"/><figcaption>{caption}</figcaption></figure>)}</div><p className="ed-image-note">Ảnh từ đội ngũ; đồng phục và nền studio được chỉnh bằng AI.</p></div></section>
    <section className="edu-section edu-container ed-people-work" data-reveal><Image src="/brand/company/presentation-contest-v1.png" alt="Ảnh chỉnh bằng AI: người thuyết trình mặc đồng phục DolphinX trong bối cảnh cuộc thi công nghệ" width={1536} height={1024} sizes="(max-width:800px) 90vw, 50vw"/><div><span className="edu-label">TỪ Ý TƯỞNG ĐẾN THỬ THÁCH</span><h2>Tự tin trình bày.<br/>Sẵn sàng thử sức.</h2><p>Biến điều đã học thành một sản phẩm có thể demo. Trình bày cách giải quyết vấn đề, lắng nghe phản hồi và tiếp tục hoàn thiện qua mỗi thử thách.</p><Link className="edu-link" href="/contests">Khám phá các cuộc thi <ArrowUpRight size={19}/></Link><p className="ed-image-note">Đồng phục và bối cảnh cuộc thi được chỉnh bằng AI từ ảnh đội ngũ. Đây là ảnh minh họa, không phải tư liệu một cuộc thi thực tế.</p></div></section>
    <section className="edu-section edu-container ed-people-connect" data-reveal><span className="edu-label">CÙNG VIẾT CHƯƠNG TIẾP THEO</span><h2>Bắt đầu bằng<br/>một lời chào.</h2><p>Trao đổi về hành trình học của bạn hoặc khám phá hoạt động trong cộng đồng.</p><div><Link className="edu-button" href="/contact">Kết nối với DolphinX <ArrowUpRight size={18}/></Link><Link className="edu-link" href="/extracurriculars">Khám phá hoạt động <ArrowUpRight size={18}/></Link></div></section>
  </EduPublicShell>;
}
