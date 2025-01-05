import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, resume, jobDescription, jobSpecificEmphasis } = body;

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Please write a cover letter body (no greeting or sign-off) using the following details ${company ? `for a job at ${company}` : ""}:

      1. My resume: ${resume}
      2. Job description: ${jobDescription}
      3. Key points to emphasize: ${jobSpecificEmphasis}

      Guidelines:
        - Tone: friendly, enthusiastic, and professional.
        - Do not mention anything as advertised, leave any placeholders, or mention how my experience directly aligns with the job description.
        - Highlight how my values align with the company’s mission, but do not explicitly restate their mission from the job posting.
        - Structure: around 4 short paragraphs
        - First paragraph: a quick intro of the role I'm interested in, my background, and how it aligns with the role.
        - Second paragraph: an example or anecdote illustrating my skills related to ${jobSpecificEmphasis}. Make sure it is related to the job description.
        - Third paragraph: express excitement about this opportunity and how I can contribute.
        - Fourth paragraph: closing statement that says you are looking forward hearing from them and discussing how you could help their company.
        - Do not copy or closely paraphrase the job description or my resume. Instead, highlight only the most relevant parts.
        - Avoid long, wordy sentences. Keep paragraphs concise and focused.
        - Show, don't just tell. Demonstrate my strengths with a brief example rather than listing them plainly.
        - Make it sound genuine and human, without being too formulaic.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ coverLetter: response });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
