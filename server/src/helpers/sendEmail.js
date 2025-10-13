import fetch from "node-fetch"; // Node 18+ me "undici" ya global fetch bhi use kar sakte ho

export const sendEmailViaVercelAPI = async ({ to, subject, text }) => {
  try {
    const response = await fetch(
      "https://mail-send-weld.vercel.app/api/send-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email via Vercel API:", error.message);
    throw error;
  }
};
