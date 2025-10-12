const Api = process.env.NEXT_PUBLIC_API_URL;

export const getFlashcards = async (noteId: string) => {
  const response = await fetch(`${Api}/api/v1/ai/flashcards?noteId=${noteId}`, {
    method: "GET",
    credentials: "include",
  });
  return response;
};

export const generateFlashcards = async (noteId: string) => {
  const response = await fetch(`${Api}/api/v1/ai/flashcards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ noteId }),
  });
  return response;
};
