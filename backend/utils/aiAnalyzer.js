const OpenAI = require("openai");

async function analyzeResumeWithAI(
  resumeText,
  jobDescription
) {
  // Check API key before creating OpenAI client
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not configured"
    );
  }

  // Create client only when API key exists
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response =
    await client.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are an expert technical recruiter
and resume analyst.

Analyze the candidate's resume
against the provided job description.

Return ONLY valid JSON with this structure:

{
  "summary": "short summary",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "missingSkills": [
    "skill 1",
    "skill 2"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2"
  ]
}

Do not invent experience,
skills, projects, education,
or achievements that are not present
in the resume.
`,

      input: `
RESUME:

${resumeText}


JOB DESCRIPTION:

${jobDescription}
`,
    });

  return JSON.parse(
    response.output_text
  );
}

module.exports = {
  analyzeResumeWithAI,
};