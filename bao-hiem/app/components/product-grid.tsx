"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "../lib/products";
import Icon from "./ui-icon";

export default function ProductGrid({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [filter, setFilter] = useState("Tất cả");
  const shown = products.filter(
    (p) => filter === "Tất cả" || p.group === filter,
  );
  return (
    <>
      <div className="product-toolbar">
        <div
          className="filter-tabs"
          role="group"
          aria-label="Lọc nhóm bảo hiểm"
        >
          {["Tất cả", "Cá nhân & gia đình", "Doanh nghiệp"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={filter === t}
              className={filter === t ? "selected" : ""}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {compact ? (
          <Link className="text-link" href="/san-pham">
            Xem tất cả <Icon name="arrow" size={16} />
          </Link>
        ) : (
          <span className="product-count" role="status">
            {shown.length} giải pháp phù hợp
          </span>
        )}
      </div>
      <div
        className={compact ? "product-grid" : "product-grid product-grid-large"}
      >
        {shown.map((p) => (
          <Link
            href={`/san-pham/${p.slug}`}
            key={p.slug}
            className={`product-card tone-${p.tone}`}
          >
            <div className="product-photo">
              <Image
                src={p.image}
                alt=""
                fill
                sizes={
                  compact
                    ? "(max-width: 600px) 240px, (max-width: 850px) 45vw, 25vw"
                    : "(max-width: 600px) 240px, (max-width: 850px) 280px, 360px"
                }
              />
            </div>
            <div className="product-content">
              <div className="product-title">
                <h3>{p.name}</h3>
              </div>
              <p>{p.desc}</p>
              <span className="product-explore">
                Tìm hiểu thêm <Icon name="arrow" size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
