export type AcademicTitle =
    | "Prof. Dr."
    | "Assoc. Dr."
    | "Dr."
    | "Res. Asst."

export type Faculty =
    | "Computer Engineering"
    | "Electrical Engineering"
    | "Mathematics"
    | "Physics"
    | "Chemistry"
    | "Biology"


export interface ProfessorCriteria {
    teaching: number,
    examDifficulty: number,
    homeWork: number,
    accesibility: number
}

export interface TrendData {
    month: string,
    rating: number,
    reviewContent: number
}

export interface Professor {
    id: string,
    firstName: string,
    lastName: string,
    title: AcademicTitle,
    faculty: Faculty,
    department: string,
    courses: string[],
    criteria: ProfessorCriteria,
    overallRating: number,
    reviewCount: number,
    recommendationRate: number,
    trendData: TrendData[],
    badges: string[],
    createdAt: string
}

export interface ProfessorSummary {
    id: string,
    firstName: string,
    lastName: string,
    title: AcademicTitle,
    faculty: Faculty,
    departament: string,
    overallRating: number,
    reviewCount: number,
    badges: string[]
}
