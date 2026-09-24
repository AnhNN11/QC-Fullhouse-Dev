import { getImageProps } from "next/image";

// Art direction keeps the family in frame without stretching a landscape crop.
export default function HeroPicture() {
  const common = {
    alt: "Minh họa gia đình Việt Nam tận hưởng thời gian bên nhau trong công viên",
    quality: 85,
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  const { props: desktop } = getImageProps({
    ...common,
    src: "/images/family-hero-v2.webp",
    width: 1536,
    height: 1024,
    sizes: "100vw",
  });
  const { props: mobile } = getImageProps({
    ...common,
    src: "/images/family-mobile.webp",
    width: 1024,
    height: 1536,
    sizes: "600px",
  });

  return (
    <picture className="hero-picture">
      <source media="(max-width: 600px)" srcSet={mobile.srcSet} sizes={mobile.sizes} />
      {/* The native image uses Next's optimized props and responsive sources. */}
      <img {...desktop} alt={common.alt} />
    </picture>
  );
}
