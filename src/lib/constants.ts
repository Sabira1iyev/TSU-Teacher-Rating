export const FACULTIES = [
  "All",
  "Faculty of Law",
  "Faculty of Exact and Natural Sciences",
  "Faculty of Psychology and Educational Sciences",
  "Faculty of Economics and Business",
  "Faculty of Humanities",
  "Faculty of Medicine",
  "Faculty of Law and Political Sciences",
];

export const ACADEMIC_TITLES = [
  "Instructor",
  "Prof. Dr.",
  "Associate Professor",
  "Dr.",
  "Res. Asst.",
  "Assistant Professor",
  "Professor",
];

export const REVIEW_TAGS = [
  "Engaging Class",
  "Helpfull",
  "Hard exams",
  "Heavy Homework",
  "Inspiring",
  "Punctual",
  "Clear explanation",
  "Flexible",
  "Confident",
  "Friendly",
  "Master",
  "Funny",
  "Hardest Teacher",
] as const;

export const CRITERIS_LABELS = {
  teaching: "Teaching Quality",
  examDifficulty: "Exam Difficulty",
  homeWork: "Homework Load",
  accessibility: "Accessibility",
  examControlLevel: "Exam Control Level",
};

export const SEMESTERS = [
  "2024-2025 Spring",
  "2024-2025 Fall",
  "2025-2026 Spring",
  "2025-2026 Fall",
];

export const UNIVERSITY_NAME = "Tbilisi State University";
export const UNIVERSITY_EMAIL_DOMAIN = "@hum.tsu.edu.ge";

// faculty color
export const FACULTY_COLORS: Record<
  string,
  { primary: string; light: string; mid: string }
> = {
  "Faculty of Law": {
    primary: "#C72E31",
    light: "rgba(199,46,49,0.08)",
    mid: "rgba(199,46,49,0.18)",
  },
  "Faculty of Exact and Natural Sciences": {
    primary: "#2e8b57",
    light: "rgba(46,139,87,0.08)",
    mid: "rgba(46,139,87,0.18)",
  },
  "Faculty of Humanities": {
    primary: "#d4a017",
    light: "rgba(212,160,23,0.08)",
    mid: "rgba(212,160,23,0.18)",
  },
  "Faculty of Social and Political Sciences": {
    primary: "#e07020",
    light: "rgba(224,112,32,0.08)",
    mid: "rgba(224,112,32,0.18)",
  },
  "Faculty of Psychology and Education": {
    primary: "#1a3a6b",
    light: "rgba(26,58,107,0.08)",
    mid: "rgba(26,58,107,0.18)",
  },
  "Faculty of Medicine": {
    primary: "#3a9ec7",
    light: "rgba(58,158,199,0.08)",
    mid: "rgba(58,158,199,0.18)",
  },
  "Faculty of Economics and Business": {
    primary: "#5a9999",
    light: "rgba(179,204,204,0.15)",
    mid: "rgba(179,204,204,0.35)",
  },
};

// Default color if faculty not found
export const DEFAULT_FACULTY_COLOR = {
  primary: "#0060a9",
  light: "rgba(0,96,169,0.06)",
  mid: "rgba(0,96,169,0.15)",
};
