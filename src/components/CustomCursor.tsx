import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const addHover = () => cursor.classList.add("cursor-hover");
    const removeHover = () => cursor.classList.remove("cursor-hover");

    document.addEventListener("mousemove", move);

    const observe = () => {
      const interactives = document.querySelectorAll("a, button, input, textarea, select, [role='button'], .glass-card-hover, .btn-premium");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };

    observe();
    const observer = new MutationObserver(observe);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} id="custom-cursor" />;
}
