import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  animationNum: number;
  timelineRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
}

export function TimelineContent({
  animationNum,
  timelineRef,
  children,
  className,
}: TimelineContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 20, filter: "blur(8px)" }
      }
      transition={{ duration: 0.5, delay: animationNum * 0.15 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
