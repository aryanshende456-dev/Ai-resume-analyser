function calculateProjectMatch(resumeText, jobDescription) {
  const resume = resumeText.toLowerCase();
  const job = jobDescription.toLowerCase();

  const projectKeywords = [
    "project",
    "application",
    "website",
    "system",
    "platform",
    "developed",
    "built",
    "implemented",
  ];

  const jobKeywords = [
    "frontend",
    "backend",
    "full stack",
    "web",
    "application",
    "api",
    "database",
    "react",
    "javascript",
    "node",
  ];

  const relevantJobKeywords = jobKeywords.filter((keyword) =>
    job.includes(keyword)
  );

  if (relevantJobKeywords.length === 0) {
    return 0;
  }

  const matchedKeywords = relevantJobKeywords.filter((keyword) =>
    resume.includes(keyword)
  );

  return Math.round(
    (matchedKeywords.length / relevantJobKeywords.length) * 100
  );
}

function calculateExperienceMatch(resumeText, jobDescription) {
  const resume = resumeText.toLowerCase();
  const job = jobDescription.toLowerCase();

  const experienceKeywords = [
    "experience",
    "internship",
    "developer",
    "software",
    "engineer",
    "worked",
    "developed",
    "implemented",
  ];

  const jobKeywords = experienceKeywords.filter((keyword) =>
    job.includes(keyword)
  );

  if (jobKeywords.length === 0) {
    return 0;
  }

  const matchedKeywords = jobKeywords.filter((keyword) =>
    resume.includes(keyword)
  );

  return Math.round(
    (matchedKeywords.length / jobKeywords.length) * 100
  );
}

module.exports = {
  calculateProjectMatch,
  calculateExperienceMatch,
};