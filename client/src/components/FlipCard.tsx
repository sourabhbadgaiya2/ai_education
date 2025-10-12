"use client";
import { useState } from "react";

export default function FlipCard({
  front,
  back,
}: {
  front: string;
  back: string;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((v) => !v)}
      className='group relative h-36 w-full [perspective:1000px]'
      aria-label='Flip card'
    >
      <div
        className='absolute inset-0 rounded-lg border bg-white p-3 shadow-sm transition-transform duration-500 [transform-style:preserve-3d] group-hover:shadow-md'
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className='absolute inset-0 flex items-center justify-center p-3 text-center text-sm [backface-visibility:hidden]'>
          {front}
        </div>
        <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-blue-600 p-3 text-center text-sm text-white [backface-visibility:hidden] [transform:rotateY(180deg)]'>
          {back}
        </div>
      </div>
    </button>
  );
}
