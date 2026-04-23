"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockProfessor, getProfessorById } from "@/data/mockTeachers";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { REVIEW_TAGS, SEMESTERS, CRITERIS_LABELS } from "@/lib/constants";
import { ReviewForm } from "@/types/review";


const STAR_COLOR = {
    teaching: "#3ecf8e",
    examDifficulty: "#e8a233",
    homeWork: "#e8a233",
    accessibility: "#3ecf8e",
} as const;

export default function RatePage(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const professorId = searchParams.get("professorId");
    const professor = professorId ? getProfessorById(professorId) : null;

    const [form, setForm] = useState<ReviewForm>({
        professorId: professorId || "",
        courseName: professor?.courses[0] || "",
        semester: SEMESTERS[0],
        overallRating: 0,
        criteria: {
            teaching:0,
            examDifficulty: 0,
            homeWork: 0,
            accessibility: 0,
        },

        comment: "",
        tags: [],
        wouldRecommend: true,
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    
    
}