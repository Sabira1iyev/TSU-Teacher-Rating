import { Review } from "@/types/review";

export const mockReviews: Review[] = [
  {
    id: "1",
    professorId: "1",
    courseName: "Basics of C++",
    semester: "2024-2025",
    overallRating: 5,
    criteria: {
      teaching: 4.5,
      examDifficulty: 4.5,
      homeWork: 4.0,
      accessibility: 5,
      examControlLevel: 4.0,
    },
    comment:
      "He’s an absolute expert in his field. Since he’s young and a bit over-enthusiastic, he sometimes gets ahead of himself trying to teach everything at once, which can be a little confusing. He has a great rapport with his students; he’s more like a friend to them.",
    tags: ["Engaging Class", "Helpfull", "Clear explanation", "Master"],
    wouldRecommend: true,
    displayDate: "Two Month Ago",
    createdAt: "2026-01-01",
  },

  {
    id: "2",
    professorId: "2",
    courseName: "Mathematical Analysis",
    semester: "2024-2025 Fall",
    overallRating: 5,
    criteria: {
      teaching: 4.5,
      examDifficulty: 4.5,
      homeWork: 4.0,
      accessibility: 5,
      examControlLevel: 4.2,
    },
    comment:
      "He’s a highly confident teacher who really knows his stuff. He has a way of passing that confidence onto his students, and because of that, he’s genuinely loved by almost everyone in the class.",
    tags: ["Engaging Class", "Confident", "Clear explanation"],
    wouldRecommend: true,
    displayDate: "8 Days Ago",
    createdAt: "2026-02-13",
  },

  {
    id: "3",
    professorId: "3",
    courseName: "Basics of C++",
    semester: "2024-2025 Fall",
    overallRating: 4,
    criteria: {
      teaching: 4.5,
      examDifficulty: 4.5,
      homeWork: 3.5,
      accessibility: 4.5,
      examControlLevel: 3.8,
    },
    comment:
      "He is highly respected by most students; he bridges the gap between years of experience and a deep familiarity with the latest trends.",
    tags: ["Hard exams", "Friendly"],
    wouldRecommend: true,
    displayDate: "3 Week Ago",
    createdAt: "2026-01-16",
  },

  {
    id: "4",
    professorId: "4",
    courseName: "Operating Systems",
    semester: "2024-2025 Fall",
    overallRating: 4.5,
    criteria: {
      teaching: 4.5,
      examDifficulty: 4.8,
      homeWork: 4.6,
      accessibility: 4.2,
      examControlLevel: 4.0,
    },
    comment:
      "He’s an emotional and witty teacher who has the rare ability to build complex algorithms from scratch. He’s got a great bond with his students and especially favors the hard-working ones.",
    tags: ["Hard exams", "Heavy Homework", "Funny", "Master"],
    wouldRecommend: true,
    displayDate: "5 Days Ago",
    createdAt: "2026-03- 26",
  },

  {
    id: "5",
    professorId: "5",
    courseName: "Mathematical Analysis",
    semester: "2024-2025 Fall",
    overallRating: 4.4,
    criteria: {
      teaching: 4.7,
      examDifficulty: 4.8,
      homeWork: 4.2,
      accessibility: 4.0,
      examControlLevel: 4.1,
    },
    comment:
      "He has years of accumulated experience and is a powerhouse in his field. He loves being challenged with questions and never hands out 'free' points, yet he’s a true ally to hardworking students. He’s most famous for his signature phrase, 'Ki Batono' (Yes, sir/ma'am).",
    tags: ["Hard exams", "Confident", "Master"],
    wouldRecommend: true,
    displayDate: "1 Week Ago",
    createdAt: "2026-01-04",
  },

  {
    id: "6",
    professorId: "6",
    courseName: "MRadiophysics",
    semester: "2024-2025 Fall",
    overallRating: 2.5,
    criteria: {
      teaching: 2.0,
      examDifficulty: 4.5,
      homeWork: 4.5,
      accessibility: 3.0,
      examControlLevel: 2.5,
    },
    comment: "He doesn't like being challenged or argued with.",
    tags: ["Hard exams", "Hardest Teacher"],
    wouldRecommend: false,
    displayDate: "1 Month Ago",
    createdAt: "2026-03-15",
  },

  {
    id: "7",
    professorId: "7",
    courseName: "History of Georgia",
    semester: "2024-2025 Fall",
    overallRating: 5,
    criteria: {
      teaching: 5,
      examDifficulty: 5,
      homeWork: 5,
      accessibility: 5,
      examControlLevel: 5,
    },
    comment: "Best Professor I ever seen",
    tags: ["Hard exams", "Hardest Teacher"],
    wouldRecommend: false,
    displayDate: "1 Month Ago",
    createdAt: "2026-03-15",
  },
];

export const getReviewsByProfessorId = (professorId: string): Review[] => {
  return mockReviews.filter((r) => r.professorId === professorId);
};

export const getRecentReview = (limit: number = 5): Review[] => {
  return [...mockReviews]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
};
