import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface CardImage {
  src: string;
  alt: string;
}

interface CardStackProps {
  images: CardImage[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  spacing?: {
    x?: number;
    y?: number;
  };
}

interface CardProps extends CardImage {
  index: number;
  isHovered: boolean;
  isFirstCard?: boolean;
  isMobile: boolean;
  isFront?: boolean;
  frontCardIndex: number | null;
  onClick: (index: number) => void;
  width: number;
  height: number;
  spacing: { x?: number; y?: number };
}

const Card = ({
  src,
  alt,
  index,
  isHovered,
  isMobile,
  isFront,
  frontCardIndex,
  onClick,
  width,
  height,
  spacing,
}: CardProps) => {
  const xOffset = (spacing.x ?? 50) * index;
  const yOffset = (spacing.y ?? 50) * index;

  return (
    <motion.div
      className="absolute cursor-pointer rounded-xl overflow-hidden shadow-lg"
      style={{
        width,
        height,
        zIndex: isFront ? 100 : 10 - index,
      }}
      animate={{
        x: isHovered || isFront ? xOffset * 1.2 : xOffset * 0.3,
        y: isHovered || isFront ? -yOffset * 0.5 : yOffset * 0.3,
        rotateY: isFront ? 0 : isHovered ? -15 + index * 8 : 0,
        rotateX: isFront ? 0 : isHovered ? 5 : 0,
        scale: isFront ? 1.1 : isHovered ? 1 - index * 0.03 : 1 - index * 0.05,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={() => onClick(index)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />
    </motion.div>
  );
};

export function CardStack3D({
  images,
  className,
  cardWidth = 320,
  cardHeight = 192,
  spacing = { x: 50, y: 50 },
}: CardStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [frontCardIndex, setFrontCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className="relative"
        style={{
          width: cardWidth + (spacing.x ?? 50) * images.length,
          height: cardHeight + (spacing.y ?? 50) * images.length,
          perspective: 1000,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((image, index) => (
          <Card
            key={index}
            {...image}
            index={index}
            isHovered={isHovered}
            isMobile={isMobile}
            isFront={frontCardIndex === index}
            frontCardIndex={frontCardIndex}
            onClick={(idx) => setFrontCardIndex((prev) => (prev === idx ? null : idx))}
            width={cardWidth}
            height={cardHeight}
            spacing={spacing}
          />
        ))}
      </div>
    </div>
  );
}
