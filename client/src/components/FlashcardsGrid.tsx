import FlipCard from "./FlipCard";

export default function FlashcardsGrid({
  cards,
}: {
  cards: { question: string; answer: string }[];
}) {
  if (!cards.length)
    return (
      <p className='text-sm text-muted-foreground'>
        Generate a summary first to create flashcards.
      </p>
    );
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      {cards.map((c, i) => (
        <FlipCard key={i} front={c.question} back={c.answer} />
      ))}
    </div>
  );
}
