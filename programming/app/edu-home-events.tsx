import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowUpRight, Trophy } from 'lucide-react';
import { getMongoDatabase } from '@/lib/mongodb';
import { contestState, dateLabel, type Contest } from '@/lib/hub';
import './edu-home-events.css';

export default async function EduHomeEvents() {
  await connection();
  let events;
  try {
    const db = await getMongoDatabase();
    events = await db.collection<Contest>('contests').find({status:'published',endsAt:{$gt:new Date()}},{projection:{title:1,startsAt:1,endsAt:1,status:1}}).sort({startsAt:1}).limit(3).toArray();
  } catch { events = null; }
  return <section className="edu-section ed-home-events"><div className="edu-container"><div className="edu-section-head"><div><span className="edu-label">LỊCH THI & THỬ THÁCH</span><h2>Một thử thách mới.<br/>Một bước tiến mới.</h2></div><Link className="edu-link" href="/contests">Xem đấu trường <ArrowUpRight size={18}/></Link></div><div className="ed-home-event-list">{events?.length ? events.map(event=><Link href={`/contests/${event._id}`} key={event._id.toString()}><div className="ed-event-date"><strong>{new Intl.DateTimeFormat('vi-VN',{day:'2-digit',timeZone:'Asia/Ho_Chi_Minh'}).format(event.startsAt)}</strong><span>{new Intl.DateTimeFormat('vi-VN',{month:'short',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(event.startsAt)}</span></div><div><span className="edu-label">{contestState(event)}</span><h3>{event.title}</h3><p>{dateLabel(event.startsAt)}</p></div><ArrowUpRight size={25}/></Link>) : <div className="ed-event-empty"><Trophy size={42} aria-hidden="true"/><div><h3>{events === null ? 'Lịch thi tạm thời chưa tải được' : 'Sẵn sàng cho thử thách tiếp theo'}</h3><p>{events === null ? 'Bạn có thể mở đấu trường để kiểm tra lại. Trong lúc chờ, tiếp tục luyện những bài đã có.' : 'Chưa có cuộc thi sắp tới được công bố. Lịch sẽ xuất hiện tại đây khi đội ngũ đăng cuộc thi mới.'}</p><Link className="edu-link" href="/dashboard#practice">Luyện code trong lúc chờ <ArrowUpRight size={17}/></Link></div></div>}</div></div></section>;
}
