import type { ReactNode } from "react";

export default function Icon({
  name,
  size = 24,
}: {
  name: string;
  size?: number;
}) {
  const paths: Record<string, ReactNode> = {
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    car: (
      <>
        <path d="m5 6-2 7v6h3v-3h12v3h3v-6l-2-7H5Z" />
        <path d="M3 12h18M6 6l1-3h10l1 3M6 14h2m8 0h2" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    plane: <path d="m22 2-7 20-4-9-9-4L22 2ZM11 13 22 2" />,
    building: (
      <>
        <path d="M4 21V5h10v16M14 10h6v11M2 21h20M8 9h2m-2 4h2m-2 4h2m7-3h1m-1 3h1" />
      </>
    ),
    phone: (
      <path d="m7 3-4 2c0 9 7 16 16 16l2-4-5-3-2 2c-3-1-5-3-6-6l2-2-3-5Z" />
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    support: (
      <>
        <path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h4v-7H4Zm16 0h2v7h-4v-7h2ZM18 19c0 3-6 3-6 3" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h6" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.shield}
    </svg>
  );
}
