import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function FlipCard({
  front,
  back,
  index,
  onSwipe,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  index: number;
  onSwipe?: (dir: "left" | "right") => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-220, 0, 220], [0, 1, 0]);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 20;
    if (info.offset.x > threshold) onSwipe?.("right");
    else if (info.offset.x < -threshold) onSwipe?.("left");
  };

  return (
    <motion.div
      className="absolute inset-0 origin-center will-change-transform"
      style={{ zIndex: 50 - index }}
      initial={{ scale: 1 - index * 0.04, y: index * 12 }}
      animate={{ scale: 1 - index * 0.04, y: index * 12 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="h-full rounded-3xl shadow-xl bg-white dark:bg-slate-900 relative overflow-hidden"
        style={{ rotate, x, opacity, transformStyle: "preserve-3d" as any }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onTap={() => setFlipped((f) => !f)}
      >
        <motion.div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {front}
        </motion.div>
        <motion.div
          className="absolute inset-0 p-5"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          animate={{ rotateY: flipped ? 360 : 180 }}
          transition={{ duration: 0.5 }}
        >
          {back}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
