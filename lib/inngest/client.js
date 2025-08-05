import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "compassly", // Unique app ID
  name: "Compassly",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});