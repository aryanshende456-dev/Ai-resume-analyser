function calculateMatch(
  resumeSkills,
  requiredSkills
) {
  const matchedSkills = [];
  const missingSkills = [];

  for (const requiredSkill of requiredSkills) {

    const matched =
      resumeSkills.some(
        (resumeSkill) =>
          resumeSkill.toLowerCase() ===
          requiredSkill.toLowerCase()
      );

    if (matched) {
      matchedSkills.push(requiredSkill);
    } else {
      missingSkills.push(requiredSkill);
    }
  }

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            requiredSkills.length) *
            100
        );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
  };
}

module.exports = {
  calculateMatch,
};