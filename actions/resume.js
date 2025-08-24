"use server";

import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function safeGenerateContent(model, payload, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(payload);
    } catch (err) {
      if (err.message.includes("429") && i < retries - 1) {
        await new Promise(r => setTimeout(r, (i + 1) * 1000));
        continue;
      }
      throw err;
    }
  }
}

export async function uploadResume(formData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const file = formData.get("resume");
    if (!file) throw new Error("No file uploaded");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await safeGenerateContent(model, {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: buffer.toString("base64"),
              },
            },
            {
              text: `You are a resume parser.
1. If not a resume → return {"error":"Not a resume"}.
2. Else extract JSON:
{
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    education: { type: "array", items: { type: "string" } },
    experience: { type: "array", items: { type: "string" } },
    skills: { type: "array", items: { type: "string" } },
    projects: { type: "array", items: { type: "string" } },
    languages: { type: "array", items: { type: "string" } },
    hobbies: { type: "array", items: { type: "string" } },
  },
  required: ["name", "education", "skills"], // must-have
}`
            }
          ],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    });

    let extractedData = {};
    try {
      extractedData = JSON.parse(result.response.text());
    } catch (err) {
      throw new Error("AI could not extract structured data.");
    }

    if (extractedData.error) throw new Error("The uploaded file does not look like a resume.");

    const fileUrl = "uploaded-file-url-here";

    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: {
        filename: file.name,
        fileUrl,
        content: JSON.stringify(extractedData, null, 2),
      },
      create: {
        id: uuidv4(),
        filename: file.name,
        fileUrl,
        content: JSON.stringify(extractedData, null, 2),
        user: { connect: { id: user.id } },
      },
    });
    await db.user.update({
      where: { id: user.id },
      data: { isUploaded: true },
    });

    return { success: true, resume };
  } catch (error) {
    console.error("[Resume Upload Error]:", error);
    return { success: false, error: error.message || "Upload failed" };
  }
}
