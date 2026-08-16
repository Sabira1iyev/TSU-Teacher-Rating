export type StudyYear = "1" | "2" | "3" | "4" | "5+" | "Graduate";

export interface User {
  id: string;
  firstName: string;
  lastname: string;
  email: string;
  faculty: string;
  departament: string;
  studyYear: StudyYear;
  totalReviews: number;
  totalLikesReceived: number;
  averageRatingGiven: number;
  createdAt: string;
  isAdmin: boolean;
}

export interface DBUser {
  UserId: number;
  Email: string;
  PasswordHash: string;
  DisplayName: string;
  IsVerified: boolean;
  Faculty: string;
  AcademicLevel: string;
  CreatedAt: string;
  isAdmin: boolean;
  ProfessorId: number | null;
}
