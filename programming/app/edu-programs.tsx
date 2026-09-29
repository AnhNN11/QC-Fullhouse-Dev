"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { eduPrograms } from '../lib/edu-programs';
import { eduProgramMedia } from '../lib/edu-program-media';
import './edu-program-representative.css';
export default function EduPrograms() {
  const [selected, setSelected] = useState(0);
  const p = eduPrograms[selected];
  return (
    <div className="edu-program-layout">
      <div className="edu-program-list" aria-label="Nhóm chương trình học">
        {eduPrograms.map((program, i) => (
          <button key={program.title} aria-pressed={selected === i} aria-controls="edu-program-detail" onClick={() => setSelected(i)}>
            <small>0{i + 1}</small><span>{program.title}</span><ArrowUpRight size={20}/>
          </button>
        ))}
        <Link href="/programs">Xem toàn bộ chương trình <ArrowUpRight size={17}/></Link>
      </div>
      <div className="edu-program-detail edu-program-representative" id="edu-program-detail">
        <figure>
          <Image key={p.slug} src={eduProgramMedia[p.slug]} alt={`Ảnh minh họa AI: người đại diện mặc đồng phục DolphinX cùng logo công nghệ cho ${p.title}`} width={1672} height={941} sizes="(max-width:850px) 90vw, 48vw"/>
          <figcaption>Hình minh họa AI từ ảnh đại diện của đội ngũ</figcaption>
        </figure>
        <div>
          <span className="edu-label">CHƯƠNG TRÌNH / 0{selected + 1}</span>
          <h3>{p.title}</h3><p>{p.intro}</p>
          <ul>{p.outcomes.slice(0, 3).map(point => <li key={point}><Check size={16}/>{point}</li>)}</ul>
          <Link className="edu-link" href={`/programs/${p.slug}`}>Khám phá chương trình <ArrowUpRight size={18}/></Link>
        </div>
      </div>
    </div>
  );
}
