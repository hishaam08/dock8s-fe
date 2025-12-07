"use client";

import { useLenis } from "@studio-freight/react-lenis";

export default function LenisScrollTo({
  target,
  children,
}: {
  target: string;
  children: React.ReactNode;
}) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!lenis) return;

    const el = document.querySelector(target) as HTMLElement | null;
    if (el) lenis.scrollTo(el);
  };

  return (
    <button onClick={handleClick} className="contents">
      {children}
    </button>
  );
}
