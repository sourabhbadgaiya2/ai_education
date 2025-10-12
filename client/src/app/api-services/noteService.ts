const Api = process.env.NEXT_PUBLIC_API_URL;

export const fetchNotesService = async () => {
  const response = await fetch(`${Api}/api/v1/notes`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok)
    throw new Error(`Failed to fetch notes: ${response.status}`);
  return response.json();
};

export const uploadNoteService = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${Api}/api/v1/notes/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
};

export const generateSummaryService = async (noteId: string) => {
  const response = await fetch(`${Api}/api/v1/ai/summary`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ noteId }),
  });

  if (!response.ok) throw new Error("Failed to generate summary");
  return response.json();
};
