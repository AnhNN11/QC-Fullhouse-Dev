import Image from "next/image";
import Link from "next/link";
import Icon from "./ui-icon";
import { stories } from "../lib/stories";
export default function StoryGrid({ limit }: { limit?: number }) {
  return (
    <div
      className={limit ? "story-card-grid preview-stories" : "story-card-grid"}
    >
      {stories.slice(0, limit ?? stories.length).map((s) => (
        <Link
          href={`/cau-chuyen/${s.slug}`}
          key={s.slug}
          className="story-card"
        >
          <div className="story-card-photo">
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="(max-width:700px) 100vw, 40vw"
            />
            <span className="story-view">
              Khám phá <Icon name="arrow" size={18} />
            </span>
            <span className="story-photo-category">{s.category}</span>
          </div>
          <div className="story-card-copy">
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <span>Tình huống minh họa</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
