export type AcademicTitle =
  | "Instructor"
  | "Prof. Dr."
  | "Associate Professor"
  | "Dr."
  | "Res. Asst."
  | "Assistant Professor"
  | "Professor";

export type Faculty =
  | "Faculty of Exact and Natural Sciences"
  | "Faculty of Humanities"
  | "Faculty of Social and Political Sciences"
  | "Faculty of Psychology and Educational Sciences"
  | "Faculty of Economics and Business"
  | "Faculty of Law"
  | "Faculty of Medicine";

export interface ProfessorCriteria {
  teaching: number;
  examDifficulty: number;
  homeWork: number;
  accessibility: number;
  examControlLevel: number;
}

export interface TrendData {
  month: string;
  rating: number;
  reviewCount: number;
}

export interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  title: AcademicTitle;
  faculty: Faculty;
  department: string;
  courses: string[];
  criteria: ProfessorCriteria;
  overallRating: number;
  reviewCount: number;
  recommendationRate: number;
  trendData: TrendData[];
  badges: string[];
  createdAt: string;
}

export interface ProfessorSummary {
  id: string;
  firstName: string;
  lastName: string;
  title: AcademicTitle;
  faculty: Faculty;
  department: string;
  overallRating: number;
  reviewCount: number;
  badges: string[];
}
