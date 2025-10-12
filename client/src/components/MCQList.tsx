"use client";
import { useState } from "react";

export default function MCQList({
  items,
}: {
  items: { question: string; options: string[]; correct_answer: string }[];
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  return (
    <div className='space-y-3 max-h-[500px] overflow-y-auto pr-2'>
      {items.map((q, idx) => {
        const selected = answers[idx];
        const correct = selected && selected === q.correct_answer;
        return (
          <div key={idx} className='rounded-md border p-3'>
            <p className='font-medium'>{q.question}</p>
            <div className='mt-2 grid gap-2 sm:grid-cols-2'>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers((a) => ({ ...a, [idx]: opt }))}
                  className={
                    "rounded-md border px-3 py-2 text-left transition-colors " +
                    (selected
                      ? opt === q.correct_answer
                        ? "bg-green-50 border-green-300"
                        : opt === selected
                        ? "bg-red-50 border-red-300"
                        : "bg-white"
                      : "hover:bg-muted")
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
            {selected && (
              <p
                className={
                  "mt-2 text-sm " +
                  (correct ? "text-green-600" : "text-red-600")
                }
              >
                {correct ? "Correct" : `Incorrect. Answer: ${q.correct_answer}`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
