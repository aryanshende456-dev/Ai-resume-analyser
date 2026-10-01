function calculateOverallScore({
  skillMatch,
  keywordMatch,
  projectMatch = 0,
  experienceMatch = 0,
}) {
  const overallScore = Math.round(
    skillMatch * 0.5 +
    keywordMatch * 0.2 +
    projectMatch * 0.15 +
    experienceMatch * 0.15
  );

  return {
    overallScore,
    breakdown: {
      skillMatch,
      keywordMatch,
      projectMatch,
      experienceMatch,
    },
  };
}

module.exports = {
  calculateOverallScore,
};