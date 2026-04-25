"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockProfessor, getProfessorById } from "@/data/mockTeachers";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { REVIEW_TAGS, SEMESTERS, CRITERIS_LABELS } from "@/lib/constants";
import { ReviewForm } from "@/types/review";
import { Key } from "lucide-react";


const STAR_COLOR = {
    teaching: "#3ecf8e",
    examDifficulty: "#e8a233",
    homeWork: "#e8a233",
    accessibility: "#3ecf8e",
    examControlLevel: "#e8a233",
} as const;

export default function RatePage() {
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
            teaching: 0,
            examDifficulty: 0,
            homeWork: 0,
            accessibility: 0,
            examControlLevel: 0,
        },

        comment: "",
        tags: [],
        wouldRecommend: true,
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleOverallRating = (rating: number) => {
        setForm((prev) => ({ ...prev, overallRating: rating }));
    };

    const handleCriteriaRating = (
        key: keyof typeof form.criteria,
        rating: number
    ) => {
        setForm((prev) => ({
            ...prev,
            criteria: {
                ...prev.criteria, [key]: rating
            }
        }));
    };

    const handleTagToggle = (tag: (typeof REVIEW_TAGS)[number]) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag],
        }))
    }

    const handleSubmit = () => {
        if (!form.professorId) {
            setError("Please select a professor.");
            return;
        }

        if (form.overallRating === 0) {
            setError("Please give an overall rating.");
            return;
        }
        if (form.comment.length < 0) {
            setError("Please write at least 10 characters in your comment.");
            return;
        }
        setError("");
        setSubmitted(true);
    };

    {/* Success state */ }
    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-6">
                <div className="w-16 h-16 rounded-full bg-primary-dim flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-text text-center" style={{ fontFamily: "Syne, sans-serif" }}>
                    Review Submitted!
                </h2>
                <p className="text-sm text-text3 text-center max-w-sm">
                    Your anonymous review has been submitted successfull. Thank you for helping other students!
                </p>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={() => router.push(`/professor/${form.professorId}`)}
                        className="px-5 py-2.5 bg-primary rounded-xl text-sm font-semibold text-bg cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const criteriaEntries = Object.entries(CRITERIS_LABELS) as [
        keyof typeof CRITERIS_LABELS,
        string,
    ][];

    const ratingBreakDown =
        professor ? [5, 4, 3, 2, 1].map((star) => ({
            star, percent: star === 5 ? 80 : star === 4 ? 14 : star === 3 ? 4 : 2
        })) : [];

    return (
        <div className="flex flex-col">

            {/* Desktop top bar */}
            <div className="hidden lg:flex items-center px-6 py-3 border-b border-border bg-bg2 sticky z-10">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-text2 hover:text-text transition-colors cursor-pointer"
                >
                    ← Back
                </button>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] min-h-screen">

                {/* Form */}
                <div className="p-5 lg:p-6 lg:border-r border-border flex flex-col gap-6">

                    {/* Professor selector */}
                    <div>
                        <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Professor</p>
                        {professor ? (
                            <div className="flex items-center gap-3 bg-bg3 border border-border rounded-xl p-3">
                                <div className="w-11 h-11 rounded-full bg-[#2a1e08] flex items-center justify-center text-sm text-amber font-semibold flex-shrink-0">
                                    {getInitials(professor.firstName, professor.lastName)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-text">
                                        {professor.title} {professor.firstName} {professor.lastName}
                                    </p>
                                    <p className="text-xs text-text3 mt-0.5">{professor.faculty}</p>
                                </div>
                                <button
                                    onClick={() => router.push("/rate")}
                                    className="text-xs text-text3 hover:text-text2 cursor-pointer">
                                    Change
                                </button>
                            </div>
                        )
                            :
                            (
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-text3 mb-1">Select a professor to rate</p>
                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                        {mockProfessor.map((p) => (
                                            <div
                                                key={p.id}
                                                onClick={() => {
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        professorId: p.id,
                                                        courseName: p.courses[0],
                                                    }))
                                                    router.push(`/rate?professorId=${p.id}`);
                                                }}
                                                className="flex items-center gap-3 bg-bg2 border border-border rounded-xl p-3 cursor-pointer hover:bg-bg3 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-primary-dim flex items-center justify-center text-xs text-primary font-semibold flex-shrink-0">
                                                    {getInitials(p.firstName, p.lastName)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text">{p.title} {p.firstName} {p.lastName}</p>
                                                    <p className="text-xs text-text3">{p.department}</p>
                                                </div>
                                                <span className={`ml-auto text-sm font-semibold ${getRatingColor(p.overallRating)}`}>
                                                    {formatRating(p.overallRating)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>

                    {professor && (
                        <>

                            {/* Course */}
                            <div>


                                <p className="text-[10px] text-text3 uppercase trancking-widest mb-3">Course</p>
                                <select
                                    value={form.courseName}
                                    onChange={(e) => setForm((prev) => ({ ...prev, semester: e.target.value }))}
                                    className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                                >
                                    {professor.courses.map((course) => (
                                        <option
                                            key={course} value={course}
                                            className="bg-bg3"
                                        >{course}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Semester</p>
                                <select
                                    value={form.semester}
                                    onChange={(e) => setForm((prev) => ({ ...prev, semester: e.target.value }))}
                                    className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                                >
                                    {SEMESTERS.map((s) => (
                                        <option
                                            key={s} value={s}
                                        >{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Overall rating */}
                            <div>
                                <p className="text-[10px] text=text3 uppercase tracking-widest mb-3">Overall rating</p>
                                <div className="flex gap-2 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleOverallRating(star)}
                                            className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <svg width="38" height="38" viewBox="0 0 24 24">
                                                <polygon
                                                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                                    fill={star <= form.overallRating ? (form.overallRating > 3 ? "#3ecf8e" : form.overallRating === 1 ? "#e22222" : "#e8a233") : "#22222e"}
                                                />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Criteria */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Detailed criteria</p>
                                <div className="flex flex-col gap-3">
                                    {criteriaEntries.map(([key, label]) => (
                                        <div
                                            key={key}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-xs text-text2 w-32 flex-shrink-0">{label}</span>
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleCriteriaRating(key, star)}
                                                        className="cursor-pointer transition-transform hover:scale-110"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                                            <polygon
                                                                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                                                fill={star <= form.criteria[key] ? (form.criteria[key] > 3 ? "#3ecf8e" : form.criteria[key] === 1 ? "#e22222" : "#e8a233") : "#22222e"}
                                                            />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Comment (anonymous)</p>
                                <div className="bg-bg3 border-border2 rounded-xl p-3 focus-within:border-primary transition-colors">
                                    <textarea
                                        value={form.comment}
                                        onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                                        placeholder="Share your experience - exam style, lecture quality, tips for future students..."
                                        maxLength={500}
                                        rows={4}
                                        className="w-full bg-transparent text-sm text-text placeholder:text-text3 outline-none resize-none"
                                    />
                                    <p className="text-[10px] text-text3 text-right mt-1">
                                        {form.comment.length}/500;
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Add Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {REVIEW_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all border ${form.tags.includes(tag)
                                                ? "bg-primary-dim border-primary-mid text-primary"
                                                : "bg-bg3 border-border2 text-text2 hover:border-border"
                                                }`}
                                        >{tag}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Would Recommend */}
                            <div>
                                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Would you recommend this professor ?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setForm((prev) => ({ ...prev, wouldRecommend: true }))}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border ${form.wouldRecommend
                                            ? "bg-primary-dim border-primary-mid text-primary"
                                            : "border-border2 text-text2 hover:bg-bg3"
                                            }`}

                                    >
                                        ✓ Yes, I would recommend
                                    </button>

                                    <button
                                        onClick={() => setForm((prev) => ({ ...prev, wouldRecommend: false }))}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border ${!form.wouldRecommend
                                            ? "bg-amber-dim border-amber text-amber"
                                            : "border-border2 text-text2 hover:bg-bg3"

                                            }`}
                                    >
                                        ✗ No
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                className="w-full py-3.5 bg-primary rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Submit review →
                            </button>
                        </>
                    )}
                </div>

                {/* Sidebar - Desktop */}
                <div className="hidden lg:flex flex-col gap-5 p-6">

                    {/* Privacy */}
                    <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Privacy & rules</p>
                    <div className="bg-bg3 rounded-xl p-4">
                        <p className="text-xs text-text2 mb-3 leading-relaxed">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                            Your review is completely anonymous. Your name or student ID will never be shown.
                        </p>
                        <div className="flex flex-col">
                            {[
                                "Only rate professors whose courses you have taken",
                                "One review per professor per semester",
                                "Personal attacks will be removed",
                                "Rating manipulation results in account suspension",
                            ].map((rule) => (
                                <div
                                    key={rule}
                                    className="flex items-start gap-2"
                                >
                                    <div className="w-1 h-1 rounded-full bg-text3 flex-shrink-0 mt-1.5" />
                                    <p className="text-[11px] text-text3 leading-relaxed">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Current Rating */}
                {professor && (
                    <div>
                        <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Current rating</p>
                        <div className="bg-bg3 rounded-xl p-4">
                            <p className={`text-4xl font-bold text-center mb-1 ${getRatingColor(professor.overallRating)}`}>
                                {formatRating(professor.overallRating)}
                            </p>
                            <p className="text-[11px] text-text3 text-center mb-4">
                                {professor.reviewCount} students rated
                            </p>
                            <div className="flex flex-col gap-2">
                                {ratingBreakDown.map(({ star, percent }) => (
                                    <div
                                        key={star}
                                        className="flex items-center gap-2 text-[10px]"
                                    >
                                        <span className="text-text3 w-12">{star} stars</span>
                                        <div className="flex-1 h-[3px] bg-bg4 rounded-full overflow-hidden">
                                            <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${percent}`,
                                                background : star >= 4 ? "#3ecf8e" : star >= 2 ? "#e8a233" : "#e25555",
                                            }}

                                            />
                                        </div>
                                        <span className="text text-2 w-7 text-right">{percent}%</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                )}
            </div>
        </div>
    )
}
