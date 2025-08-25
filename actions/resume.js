"use server";

import { google } from "googleapis";
import { clerkClient, auth as clerkAuth } from "@clerk/nextjs/server";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/prisma";

// ----------------- Google Setup -----------------
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

// ----------------- Gemini Setup -----------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ----------------- Helpers -----------------
async function uploadToDrive(file, buffer) {
  const stream = Readable.from(buffer);

  const { data } = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: { mimeType: file.type, body: stream },
    fields: "id, webViewLink",
  });

  await drive.permissions.create({
    fileId: data.id,
    requestBody: { role: "reader", type: "anyone" },
  });

  return data;
}

async function parseResumeWithGemini(file, buffer) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: file.type, data: buffer.toString("base64") } },
          { text: "You are a resume parser. Extract structured data (skills, education, work experience, etc.) in JSON." },
        ],
      },
    ],
    generationConfig: { responseMimeType: "application/json" },
  });

  try {
    return JSON.parse(result.response.text());
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}

// ----------------- Main Action -----------------
export async function uploadResume(formData) {
  const { userId: clerkUserId } = await clerkAuth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId } });
  if (!user) throw new Error("User not found");

  const file = formData.get("resume");
  if (!file) throw new Error("No file uploaded");

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Drive
  const driveFile = await uploadToDrive(file, buffer);

  // Parse with Gemini
  const extractedData = await parseResumeWithGemini(file, buffer);

  // Save or update resume
  const resume = await db.resume.upsert({
    where: { userId: user.id },
    update: {
      filename: file.name,
      fileUrl: driveFile.webViewLink,
      content: JSON.stringify(extractedData, null, 2),
    },
    create: {
      id: uuidv4(),
      filename: file.name,
      fileUrl: driveFile.webViewLink,
      content: JSON.stringify(extractedData, null, 2),
      user: { connect: { id: user.id } },
    },
  });

  // Mark user as uploaded
  await db.user.update({
    where: { id: user.id },
    data: { isUploaded: true },
  });

  return { success: true, resume };
}
