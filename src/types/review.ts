export type ReviewTag = string;

export interface ReviewCriteria {
  teaching: number;
  examDifficulty: number;
  homeWork: number;
  accessibility: number;
  examControlLevel: number;
}

export interface ReviewForm {
  professorId: string;
  courseName: string;
  semester: string;
  overallRating: number;
  criteria: ReviewCriteria;
  comment: string;
  tags: ReviewTag[];
  wouldRecommend: boolean;
}

export interface Review {
  id: string;
  professorId: string;
  userId: number; 
  courseName: string;
  semester: string;
  overallRating: number;
  criteria: ReviewCriteria;
  comment: string;
  tags: ReviewTag[];
  wouldRecommend: boolean;
  displayDate: string;
  createdAt: string;
  likeCount?: number;
  dislikeCount?: number;
  userInteraction?: string | null;
}
