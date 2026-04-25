"use client"

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getProfessorById } from "@/data/mockTeachers";
import { getReviewsByProfessorId } from "@/data/mockReviews";
import { getInitials, formatRating, getRatingColor, getRatingBarColor } from "@/lib/utils";
import { CRITERIS_LABELS } from "@/lib/constants";
import { styleText } from "util";

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
        const count = reviews.filter((r) => Math.floor(r.overallRating) === star).length;
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
            <div className="flex items-start gap-4 flex-1">
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

            {/* Tabs */}
            <div className="flex border-b border-border">
                {(["Overview", "Reviews", "Courses"] as Tab[]).map((tab) => (
                    <button
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-xs cursor-pointer border-b-2 transition-colors ${activeTab === tab
                            ? "text-primary border-primary font-medium"
                            : "text-text3 border-transparent hover:text-text2"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-5 lg:p-6">

                {/* Overview Tab */}
                {activeTab === "Overview" && (
                    <div className="flex flex-col lg:grid-cols-[1fr_300px] gap-5 lg:gap-6">

                        {/* Criteria */}
                        <div className="flex flex-col gap-5">
                            {/* Left */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Criteria Ratings</p>
                                <div className="flex flex-col gap-3">
                                    {criteriaEntries.map(([key, label]) => {
                                        const value = professor.criteria[key];
                                        return (
                                            <div key={key} className="flex items-center gap-3">
                                                <span className="text-[11px] text-text2 w-32 flex-shrink-0">{label}</span>
                                                <div className="flex-1 h-[5px] bg-bg4 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${(value / 5) * 100}%`,
                                                            background: getRatingBarColor(value),
                                                        }}
                                                    />
                                                </div>
                                                <span className={`text-[12px] font-medium w-7 text-right ${getRatingColor(value)}`}>
                                                    {formatRating(value)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Trend */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Monthly rating trend</p>
                                <div className="flex items-end gap-1.5 h-16">
                                    {professor.trendData.map((t, i) => {
                                        const isLast = i === professor.trendData.length - 1;
                                        const height = `${((t.rating - 3) / 2) * 100}`;
                                        return (
                                            <div
                                                key={t.month}
                                                className="flex flex-col items-center gap-1 flex-1"
                                            >
                                                <div className="w-full rounded-t-sm"
                                                    style={{
                                                        height,
                                                        background: "#3ecf8e",
                                                        opacity: isLast ? 1 : 0.4,
                                                        minHeight: "6px",
                                                    }}
                                                />
                                                <span className="text-[9px] text-text3">{t.month}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* latest reviews */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Latest Reviews</p>
                                <div className="flex flex-col gap-3">
                                    {reviews.slice(0, 2).map((review) => (
                                        <div
                                            key={review.id} className="bg-bg3 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <div
                                                            key={star}
                                                            className="w-[10px] h-[10px]"
                                                            style={{
                                                                clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                                                                background: star <= review.overallRating ? "#3ecf8e" : "#22222e",
                                                            }}
                                                        />
                                                    ))}
                                                </div>

                                                <span className="text-[10px] text-text3">{review.displayDate}</span>
                                            </div>
                                            <p className="text-[11px] text-primary mb-1.5">{review.courseName}</p>
                                            <p className="text-[12px] text-text2 leading-relaxed">{review.comment}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                {review.tags.map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 bg-primary-dim text-primary text-[9px] rounded-lg">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/* Right */}
                        <div className="flex flex-col gap-5">

                            {/* Rating Breakdown */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase trancking-widest mb-3 ">Rating breakdown</p>
                                <div className="flex flex-col gap-2">
                                    {ratingBreakDown.map(({ star, percent }) => (
                                        <div
                                            key={star}
                                            className="flex items-center gap-2 text-[11px]">
                                            <span className="text-text3 w-10">{star} stars</span>
                                            <div className="flex-1 h-[4px] bg-bg4 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${percent}`,
                                                        background: star >= 4 ? "#3ecf8e" : star === 3 ? "#e8a233" : "#e22222",
                                                    }}
                                                />
                                            </div>
                                            <span className="text-text2 w-8 text-right">{percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Quick info</p>
                                <div className="flex flex-col">
                                    {[
                                        { label: "Title", value: professor.title },
                                        { label: "Department", value: professor.department },
                                        { label: "Faculty", value: professor.faculty.replace("Faculty of", "") },
                                        { label: "Total reviews", value: professor.reviewCount },
                                    ].map((item, i, arr) => (
                                        <div
                                            key={item.label}
                                            className={`flex justify-between py-2 text-[11px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                                        >
                                            <span className="text-text3">{item.label}</span>
                                            <span className="text-text">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Reviews tab */}
                {activeTab === "Reviews" && (
                    <div className="flex flex-col gap-3 max-w-2xl">
                        {reviews.length === 0 ? (
                            <div className="text-center py-10 text-sm text-text3">
                                No reviews ye for this professor.
                            </div>
                        )
                            :
                            (
                                reviews.map((review) => (
                                    <div key={review.id}
                                        className="bg-bg2 border-border rounded-xl p-4"
                                    >
                                        <div className="flex justify-between items-center mb-1.5">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <div
                                                        key={star}
                                                        className="w-[11px] h-[11px]"
                                                        style={{
                                                            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                                                            background: star <= review.overallRating ? "#3ecf8e" : "#22222e",
                                                        }} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-text3">{review.displayDate}</span>
                                        </div>
                                        <p className="text-[11px] text-primary mb-2">{review.courseName}</p>
                                        <p className="text-[12px] text-text2 leading-relaxed">{review.comment}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {review.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-primary-dim text-primary text-[9px] rounded-lg"
                                                >{tag}</span>
                                            ))}
                                        </div>
                                        {review.wouldRecommend && (
                                            <p className="text-[10px] text-primary mt-2">✓ Would recommend</p>
                                        )}
                                    </div>
                                ))
                            )
                        }
                    </div>
                )}

                {/* Course tab */}
                {activeTab === "Courses" && (
                    <div className="flex flex-col gap-2 max-w-lg">
                        {professor.courses.map((course) => (
                            <div
                                key={course}
                                className="flex items-center justify-between bg-bg2 border border-border rounded-xl px-4 py-3"
                            >
                                <span className="text-sm text-text font-semibold">{course}</span>
                                <span className="text-sm font-semibold text-primary">
                                    {formatRating(professor.overallRating)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile rate button */}
            <div className="lg:hidden bottom-[57px] left-0 right-0 px-4 py-3 bg-bg border-border z-10 ">
                <button
                onClick={() => router.push(`/rate?professorId=${professor.id}`)}
                className="w-full py-3.5 bg-primary rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer"
                >
                    Rate this professor →
                </button>
            </div>
                   </div>

    )
}
