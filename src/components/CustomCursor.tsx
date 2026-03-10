import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          cursor.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
          rafRef.current = 0;
        });
      }
    };

    document.addEventListener("mousemove", move, { passive: true });
    return () => {
      document.removeEventListener("mousemove", move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return <div ref={cursorRef} id="custom-cursor" />;
}
