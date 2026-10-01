const skillsDatabase = [
  "JavaScript",
  "React",
  "ReactJS",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Redux",
  "Git",
  "GitHub",
  "Java",
  "C++",
  "Python",
  "TypeScript",
  "REST API",
  "JWT",
  "Firebase",
  "MySQL",
  "PostgreSQL",
  "Machine Learning",
  "Artificial Intelligence",
];

function analyzeJobDescription(jobDescription) {
  const text = jobDescription.toLowerCase();

  const requiredSkills = [];

  for (const skill of skillsDatabase) {
    const normalizedSkill = skill.toLowerCase();

    if (text.includes(normalizedSkill)) {
      requiredSkills.push(skill);
    }
  }

  return {
    requiredSkills: [...new Set(requiredSkills)],
    totalRequiredSkills: requiredSkills.length,
  };
}

module.exports = {
  analyzeJobDescription,
};