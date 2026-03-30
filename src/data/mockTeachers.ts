import { Professor } from "@/types/teacher";

export const mockProfessor: Professor[] = [
  {
    id: "1",
    firstName: "Giorgi",
    lastName: "Kitchmarishvili",
    title: "Instructor",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Computer Science",
    courses: [
      "Basics of C++",
      "Object Oriented Programming in C++",
      "Data Structures",
    ],
    criteria: {
      teaching: 4.5,
      examDifficulty: 4.0,
      homeWork: 3.2,
      accessibility: 5.0,
    },
    overallRating: 4.8,
    reviewCount: 142,
    recommendationRate: 96,
    trendData: [
      { month: "Jan", rating: 4.5, reviewCount: 10 },
      { month: "Feb", rating: 4.6, reviewCount: 12 },
      { month: "Mar", rating: 4.7, reviewCount: 15 },
      { month: "Apr", rating: 4.8, reviewCount: 18 },
      { month: "May", rating: 4.9, reviewCount: 20 },
      { month: "Jun", rating: 5.0, reviewCount: 22 },
    ],
    badges: ["Top Rated", "Most Helpful", "Great Teacher"],
    createdAt: "2026-01-01",
  },

  {
    id: "2",
    firstName: "Aleksandre",
    lastName: "Aplakovi",
    title: "Assistant Professor",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Mathematics",
    courses: ["Mathematical Analysis", "Calculus 1", "Calculus 2"],
    criteria: {
      teaching: 4.8,
      examDifficulty: 4.0,
      homeWork: 3.5,
      accessibility: 4.9,
    },
    overallRating: 4.9,
    reviewCount: 139,
    recommendationRate: 86,
    trendData: [
      { month: "Jan", rating: 3.5, reviewCount: 15 },
      { month: "Feb", rating: 4.8, reviewCount: 17 },
      { month: "Mar", rating: 5.0, reviewCount: 20 },
      { month: "Apr", rating: 5.0, reviewCount: 22 },
      { month: "May", rating: 5.0, reviewCount: 25 },
      { month: "Jun", rating: 5.0, reviewCount: 28 },
    ],
    badges: ["Top Rated", "Most Helpful", "Great Teacher", "Hardest Working"],
    createdAt: "2026-01-01",
  },

  {
    id: "3",
    firstName: "Irina",
    lastName: "Xutsishvili",
    title: "Associate Professor",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Computer Science",
    courses: ["C", "Object Oriented Programming in C++"],
    criteria: {
      teaching: 4.2,
      examDifficulty: 4.5,
      homeWork: 4.0,
      accessibility: 4.0,
    },
    overallRating: 4.4,
    reviewCount: 124,
    recommendationRate: 82,
    trendData: [
      { month: "Jan", rating: 4.0, reviewCount: 15 },
      { month: "Feb", rating: 4.2, reviewCount: 17 },
      { month: "Mar", rating: 4.4, reviewCount: 20 },
      { month: "Apr", rating: 4.6, reviewCount: 22 },
      { month: "May", rating: 4.8, reviewCount: 25 },
      { month: "Jun", rating: 4.4, reviewCount: 28 },
    ],
    badges: ["Great Teacher", "Hardest Working"],
    createdAt: "2026-01-01",
  },

  {
    id: "4",
    firstName: "Papuna",
    lastName: "Karchava",
    title: "Associate Professor",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Computer Science",
    courses: [
      "Operating Systems",
      "Computer Architecture and organization",
      "Network technologies and communications",
      "Python",
    ],
    criteria: {
      teaching: 4.28,
      examDifficulty: 4.3,
      homeWork: 4.5,
      accessibility: 4.9,
    },
    overallRating: 4.6,
    reviewCount: 144,
    recommendationRate: 102,
    trendData: [
      { month: "Jan", rating: 3.2, reviewCount: 13 },
      { month: "Feb", rating: 4.0, reviewCount: 20 },
      { month: "Mar", rating: 4.4, reviewCount: 20 },
      { month: "Apr", rating: 3.6, reviewCount: 22 },
      { month: "May", rating: 4.8, reviewCount: 25 },
      { month: "Jun", rating: 4.9, reviewCount: 28 },
    ],
    badges: ["Great Teacher", "Hardest Working"],
    createdAt: "2026-01-01",
  },


    {
    id: "5",
    firstName: "Teimuraz",
    lastName: "Akhobadze",
    title: "Associate Professor",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Mathematics",
    courses: [
      "Mathematical Analysis",
    ],
    criteria: {
      teaching: 4.9,
      examDifficulty: 4.3,
      homeWork: 4.5,
      accessibility: 4.9,
    },
    overallRating: 4.7,
    reviewCount: 144,
    recommendationRate: 102,
    trendData: [
      { month: "Jan", rating: 3.2, reviewCount: 13 },
      { month: "Feb", rating: 4.0, reviewCount: 20 },
      { month: "Mar", rating: 4.4, reviewCount: 20 },
      { month: "Apr", rating: 3.6, reviewCount: 22 },
      { month: "May", rating: 4.8, reviewCount: 25 },
      { month: "Jun", rating: 4.9, reviewCount: 28 },
    ],
    badges: ["Great Teacher", "Hardest Working", "Helpful"],
    createdAt: "2026-01-01",
  },

    {
    id: "6",
    firstName: "Oleg",
    lastName: "Kharshiladze ",
    title: "Associate Professor",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Physics",
    courses: [
      "Radiophysics & Simulation of Physical Processes","Introduction to Physics"
    ],
    criteria: {
      teaching: 3.0,
      examDifficulty: 2.8,
      homeWork: 2.5,
      accessibility: 1,
    },
    overallRating: 2.5,
    reviewCount: 50,
    recommendationRate: 42,
    trendData: [
      { month: "Jan", rating: 2.2, reviewCount: 5 },
      { month: "Feb", rating: 3.0, reviewCount: 7 },
      { month: "Mar", rating: 2.4, reviewCount: 10 },
      { month: "Apr", rating: 2.6, reviewCount: 12 },
      { month: "May", rating: 2.8, reviewCount: 15 },
      { month: "Jun", rating: 2.9, reviewCount: 18 },
    ],
    badges: ["Hardest Teacher"],
    createdAt: "2026-01-01",
  },

];

export const getProfessorById = (id: string): Professor | undefined => {
  return mockProfessor.find((p) => p.id === id);
};

export const getProfessorsByFaculty = (faculty: string): Professor[] => {
  return mockProfessor.filter((p) => p.faculty === faculty);
};

export const getTopProfessors = (limit: number = 3): Professor[] => {
  return [...mockProfessor]
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, limit);
};
