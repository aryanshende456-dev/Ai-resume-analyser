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
  "REST APIs",
  "JWT",
  "Firebase",
  "MySQL",
  "PostgreSQL",
  "Machine Learning",
  "Artificial Intelligence",
];

function extractSkills(text) {
  const foundSkills = [];

  for (const skill of skillsDatabase) {
    const pattern = new RegExp(
      `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i"
    );

    if (pattern.test(text)) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills)];
}

module.exports = {
  extractSkills,
};