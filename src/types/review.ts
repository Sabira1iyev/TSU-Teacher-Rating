export type ReviewTag =
    | "Engaging Class"
    | "Helpfull"
    | "Hard exams"
    | "Heavy Homework"
    | "Inspiring"
    | "Punctual"
    | "Clear explanation"
    | "Flexible"
    | "Confident"
    | "Friendly"
    | "Master"
    | "Funny"
    | "Hardest Teacher"


export interface ReviewCriteria {
    teaching: number
    examDifficulty: number
    homeWork: number
    accessibility: number
}

export interface Review{
    id: string
    professorId: string
    courseName: string
    semester: string
    overallRating: number
    criteria: ReviewCriteria
    comment: string,
    tags: ReviewTag[]
    wouldRecommend: boolean
    displayDate: string
    createdAt: string
}

export interface ReviewForm{
    professorId: string,
    courseName: string,
    semester: string,
    overallRating: number,
    criteria: ReviewCriteria
    comment: string,
    tags: ReviewTag[],
    wouldRecommend: boolean,
}