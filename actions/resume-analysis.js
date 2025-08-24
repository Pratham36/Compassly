"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateResumeAnalysis = async (resumeData) => {
  const prompt = `
    You are an advanced AI Resume Analyzer Agent.
    Analyze the following resume and return ONLY a JSON object in this format:

    Resume Content: ${resumeData}

    {
      "overall_score": number (0–100),
      "overall_feedback": "string",
      "summary_comment": "string",
      "sections": {
        "contact_info": {
          "score": number,
          "comment": "string"
        },
        "experience": {
          "score": number,
          "comment": "string"
        },
        "education": {
          "score": number,
          "comment": "string"
        },
        "skills": {
          "score": number,
          "comment": "string"
        }
      },
      "tips_for_improvement": ["string", "string", "string"],
      "whats_good": ["string", "string", "string"],
      "needs_improvement": ["string", "string", "string"],
      "ats_analysis": {
        "ats_score": number (0–100),
        "ats_comment": "string",
        "keyword_matches": ["string", "string"],
        "keyword_gaps": ["string", "string"]
      }
    }

    RULES:
    - Provide at least 3 tips_for_improvement, 3 whats_good, and 3 needs_improvement.
    - ats_score must be between 0 and 100.
    - JSON only. No extra text.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
  console.log("Cleaned JSON:", cleaned);

  return JSON.parse(cleaned);
};

export async function getResumeAnalysis() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { resume: true, resumeAnalysis: true },
  });

  if (!user) throw new Error("User not found");
  if (!user.resume) throw new Error("Resume not uploaded yet");

  // If analysis exists, return it
  if (user.resumeAnalysis) {
    return user.resumeAnalysis;
  }

  // Otherwise, generate fresh
  const analysis = await generateResumeAnalysis(user.resume.content);

  const saved = await db.resumeAnalysis.create({
    data: {
      userId: user.id,
      overallScore: analysis.overall_score,
      overallFeedback: analysis.overall_feedback,
      summaryComment: analysis.summary_comment,
      contactScore: analysis.sections.contact_info.score,
      experienceScore: analysis.sections.experience.score,
      educationScore: analysis.sections.education.score,
      skillsScore: analysis.sections.skills.score,
      tipsForImprovement: analysis.tips_for_improvement,
      whatsGood: analysis.whats_good,
      needsImprovement: analysis.needs_improvement,
      atsScore: analysis.ats_analysis.ats_score,
      atsComment: analysis.ats_analysis.ats_comment,
      keywordMatches: analysis.ats_analysis.keyword_matches,
      keywordGaps: analysis.ats_analysis.keyword_gaps,
    },
  });

  return saved;
}
