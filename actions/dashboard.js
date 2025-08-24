"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate AI industry insights based on resume content (skills, projects, experience)
 */
export const generateAIInsights = async (resumeData) => {
  const prompt = `
    Based on the following resume data, identify the MOST relevant industry 
    and provide insights in ONLY the following JSON format:

    Resume Data: ${JSON.stringify(resumeData)}

    {
      "industry": "string",
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    RULES:
    - Return ONLY the JSON. No markdown, no notes.
    - Include at least 5 common roles for salary ranges.
    - Growth rate must be a percentage.
    - Include at least 5 skills and 5 trends.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

/**
 * Get or generate industry insights for logged-in user
 */
export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      resume: true,
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!user.resume) throw new Error("Resume not uploaded yet");

  const now = new Date();

  // ✅ If no insights yet OR past refresh date → regenerate
  if (
    !user.industryInsight ||
    new Date(user.industryInsight.nextUpdate) < now
  ) {
    const insights = await generateAIInsights(user.resume);

    let industryInsight;

    if (user.industryInsight) {
      // ✅ Update existing record
      industryInsight = await db.industryInsight.update({
        where: { id: user.industryInsight.id },
        data: {
          industry: insights.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // refresh in 7 days
        },
      });
    } else {
      // ✅ Create and link to user
      industryInsight = await db.industryInsight.create({
        data: {
          industry: insights.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          users: {
            connect: { id: user.id },
          },
        },
      });
    }

    return industryInsight;
  }

  // ✅ Return existing insights if still valid
  return user.industryInsight;
}
