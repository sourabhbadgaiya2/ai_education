import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const aiSummarize = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a helpful assistant. Summarize the following text clearly and concisely,
focusing only on the key ideas and main points. 
Return the summary as a short paragraph.

---BEGIN TEXT---
${text}
---END TEXT---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    // console.error("Gemini summarization error:", err);
    return next(err);
  }
};
