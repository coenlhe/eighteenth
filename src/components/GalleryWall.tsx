"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Memory {
  id: number;
  src: string;
  title: string;
  caption: string;
}


const MEMORIES: Memory[] = [
{   id: 1,
    src: "/images/memory-bl.png",
    title: "Quiet Moments",
    caption: "Lost in stories during cozy afternoons.",
  },
  {
    id: 2,
    src: "/images/memory-tl.png",
    title: "Sisters",
    caption: "Growing up surrounded by love and sisterly bonds.",
  },
  {
    id: 3,
    src: "/images/memory-tr.png",
    title: "With Dad",
    caption: "Always guided by his steady support and strength.",
  },
  {
    id: 4,
    src: "/images/memory-br.png",
    title: "With Mom",
    caption: "Grateful for her endless warmth and gentle heart.",
  },
  {
    id: 5,
    src: "/images/memory-center.png",
    title: "Eighteen",
    caption: "Ready for everything this next chapter brings.",
  },
];

// Slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

export function GalleryWall() {
  const [[page, direction], setPage] = useState([0, 0]);

  const currentIndex = ((page % MEMORIES.length) + MEMORIES.length) % MEMORIES.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const current = MEMORIES[currentIndex];

  return (
    <div className="relative w-full py-10 my-6 rounded-2xl bg-[#081225]/80 backdrop-blur-md border border-amber-200/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="text-center px-4 mb-6">
        <h2 className="font-display text-2xl sm:text-3xl text-[#fef08a] drop-shadow-md">
          Glimpses of My Journey
        </h2>
        <p className="mt-1 text-sm text-[#d6c7b2]">
          Cherished memories leading up to my 18th chapter.
        </p>
      </div>

      {/* Main Slideshow Display */}
      <div className="relative mx-auto max-w-lg px-4 flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center min-h-[380px] sm:min-h-[460px] overflow-hidden">
          {/* Previous Button */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous Memory"
            className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-[#fef08a] border border-amber-200/30 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
          >
            ❮
          </button>

          {/* Animated Slide Frame */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute p-2 flex flex-col items-center justify-center"
            >
              <img
                src={current.src}
                alt={current.title}
                className="max-h-[340px] sm:max-h-[420px] w-auto object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] rounded-lg"
              />
            </motion.div>
          </AnimatePresence>

          {/* Next Button */}
          <button
            onClick={() => paginate(1)}
            aria-label="Next Memory"
            className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-[#fef08a] border border-amber-200/30 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
          >
            ❯
          </button>
        </div>

        {/* Caption & Counter */}
        <div className="mt-4 text-center px-6">
          <p className="font-display text-lg text-[#fef08a]">{current.title}</p>
          <p className="text-sm text-[#fcfaed]/80 italic mt-1">{current.caption}</p>
          <p className="text-xs text-[#d6c7b2] tracking-widest mt-3 uppercase">
            {currentIndex + 1} of {MEMORIES.length}
          </p>
        </div>

        {/* Thumbnail Dots */}
        <div className="flex gap-2 mt-4">
          {MEMORIES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                const diff = idx - currentIndex;
                if (diff !== 0) paginate(diff);
              }}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-8 bg-[#fef08a]"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}