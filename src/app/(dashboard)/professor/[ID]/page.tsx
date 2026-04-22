"use client"

import { useParams, useRouter } from "next/navigation";
import { use, useState } from "react";
import { getProfessorById } from "@/data/mockTeachers";
import { getReviewsByProfessorId } from "@/data/mockReviews";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { CRITERIS_LABELS } from "@/lib/constants";

type Tab = "Overview" | "Reviews" | "Courses";


export default function ProfessorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("Overview");

    const professor = getProfessorById(params.id as string);
    const reviews = getReviewsByProfessorId(params.id as string);

    if (!professor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-4xl">🎓</p>
                <h2 className="text-xl font-bold text-text" style={{
                    fontFamily: "Syne, sans-serif"
                }}>
                    Professor not found
                </h2>
                <p className="text-sm text-text3">This professor does not exist or has been removed</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-5 py-2.5 bg-primary rounded-xl text-sm font-semibold text-bg cursor-pointer hover:opacity-90 transition-opacity"
                >
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    const ratingBreakDown = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.overallRating) === star).length;
        const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
        return {
            star, percent
        };
    });

    const criteriaEntries = Object.entries(CRITERIS_LABELS) as [
        keyof typeof CRITERIS_LABELS,
        string
    ][];


    return (

        <div className="flex flex-col">

            {/* Desktop topBar */}
            <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border bg-bg2 sticky top-[-57px] z-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-text2 hover:text-text transition-colors cursor-pointer">
                    ← Back
                </button>

                <button
                    onClick={() => router.push(`/rate?professorId=${professor.id}`)}
                    className="px-4 py-2 bg-primary rounded-lg text-xs font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Rate this professor →
                </button>
            </div>

            {/* Avatar info */}
            <div className="flex items-star gap-4 flex-1">
                <div className="w-14 h-14 lg:w-[72px] lg:h-[72px] rounded-full bg-[#2a1e08] flex items-center justify-center text-xl lg:text-2xl text-amber font-semibold flex-shrink-0 border-2 border-border2">
                    {getInitials(professor.firstName, professor.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg lg:text-2xl font-bold text-text leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                        {professor.title} {professor.firstName} {professor.lastName}
                    </h1>
                    <p className="text-xs text-primary mt-1">{professor.faculty}</p>
                    <p className="text-xs text-text3 mt-0.5">Tbilisi State University</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {professor.courses.map((course) => (
                            <span key={course}
                                className="px-2 py-1 bg-bg3 border border-border2 rounded-lg text-[10px] text-text2">
                                {course}
                            </span>
                        ))}
                    </div>
                </div>
            </div>


            {/* Score 3 */}
            <div className="flex gap-2 lg:gap-3 flex-shrink-0 mt-2">
                <div className="flex-1 lg:flex-none text-center bg-bg3 border border-border rounded-xl px-4 py-3">
                    <p className={`text-xl lg:text-2xl font-semibold ${getRatingColor(professor.overallRating)}`}>
                        {formatRating(professor.overallRating)}
                    </p>
                    <p className="text-[9px] text-text3 mt-1">Overall</p>
                </div>
                <div className="flex-1 lg:flex-none text-center bg-bg3 border border-border rounded-xl px-4 py-3">
                    <p className="text-xl lg:text-2xl font-semibold text-text">{professor.recommendationRate}%</p>
                    <p className="text-[9px] text-text3 mt-1">Recommend</p>
                </div>
            </div>

            <div className="flex border-b border-border">
                {(["Overview", "Reviews", "Courses"] as Tab[]).map((tab) => (
                    <button
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-xs cursor-pointer border-b-2 transition-color ${activeTab === tab
                            ? "text-primary border-primary font-medium"
                            : "text-text3 border-transparent hover:text-text2"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

        </div>

    )
}
