'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import CourseCover from './course-cover';
import { courseIntroId } from '@/lib/course-intro';

export default function CourseIntro({ id, title, url }: { id: string; title: string; url?: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = courseIntroId(url);
  return <section className="course-intro" aria-label={`Video giới thiệu ${title}`}>
    {playing && videoId ? <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} title={`Giới thiệu khóa học: ${title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <div className="course-intro-poster"><CourseCover course={{ id, title }}/>{videoId && <button type="button" onClick={() => setPlaying(true)}><Play size={20} fill="currentColor"/>Xem video giới thiệu</button>}</div>}
    <p>{videoId ? 'Giới thiệu khóa học · Xem miễn phí, không cần đăng nhập' : 'Video giới thiệu khóa học đang được cập nhật.'}</p>
  </section>;
}
