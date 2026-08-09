"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
    {
        id: 0,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0060a9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        iconBg: "bg-primary-dim",
        title: "Welcome,",
        titleAccent: "Fellow Student",
        description: "TeacherRating is a platform where you can evaluate TSU professors based on real student experiences. Make informed decisions every semester.",
    },
    {
        id: 1,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0060a9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        iconBg: "bg-primary-dim",
        title: "Find Professors",
        titleAccent: "by faculty",
        description: "Search by faculty, department or professor name. See teaching quality, exam difficulty and homework load rated separately.",
    },
    {
        id: 2,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0060a9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        iconBg: "bg-primary-dim",
        title: "Completely",
        titleAccent: "anonymous",
        description: "You are verified with your TSU email once. After that everything is completely anonymous. Your name will never be shown.",
    },
    {
        id: 3,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
        iconBg: "bg-amber-dim",
        title: "Ready to",
        titleAccent: "get started?",
        description: "Sign up with your TSU email in 30 seconds. Select your faculty and start discovering the best professors.",
    },
];

export default function OnBoardingPage() {
    const router = useRouter();
    const [current, setCurrent] = useState(0);

    const isLast = current === slides.length - 1;

    const handleNext = () => {
        if (!isLast) {
            setCurrent((prev) => prev + 1);
        } else {
            const currentLocale = document.documentElement.lang || "en";
            router.push(`/${currentLocale}/register`);
        }
    };

    const handleBack = () => {
        setCurrent((prev) => prev - 1);
    };

    const handleSkip = () => {
        const currentLocale = document.documentElement.lang || "en";
        router.push(`/${currentLocale}/login`);
    };

    const slide = slides[current];

    return (
        <div className="w-full min-h-screen bg-bg flex flex-col items-center">
            {/* Top bar with progress + skip */}
            <div className="w-full max-w-md px-5 pt-8 pb-2 flex flex-col gap-3">
                <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 h-[3px] rounded-full bg-[#d8dfe6] overflow-hidden"
                        >
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    i <= current ? "bg-primary" : "bg-transparent"
                                }`}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        className="text-sm text-[#6b7c8d] cursor-pointer hover:text-primary transition-colors flex items-center gap-1 font-medium"
                        onClick={handleSkip}
                    >
                        Skip →
                    </button>
                </div>
            </div>

            {/* Main card */}
            <div className="flex-1 flex items-center justify-center w-full px-5 pb-10">
                <div className="w-full max-w-md bg-bg2 rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] px-7 py-10 flex flex-col items-center gap-6">
                    {/* Icon */}
                    <div
                        className={`w-16 h-16 rounded-2xl ${slide.iconBg} flex items-center justify-center shadow-sm`}
                    >
                        {slide.icon}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-text leading-tight text-center">
                        {slide.title}
                        <br />
                        <span className="text-primary">{slide.titleAccent}</span>
                    </h1>

                    {/* Gold accent bar */}
                    <div className="w-10 h-[3px] rounded-full bg-[#e6b800]" />

                    {/* Description */}
                    <p className="text-text2 text-sm leading-relaxed text-center max-w-xs">
                        {slide.description}
                    </p>

                    {/* Stats (last slide) */}
                    {isLast && (
                        <div className="flex w-full justify-center items-center gap-0 bg-bg2 border border-border rounded-2xl overflow-hidden">
                            <div className="flex-1 py-4 text-center border-r border-border">
                                <div className="text-xl font-bold text-primary">12K+</div>
                                <div className="text-[11px] text-text3 mt-0.5 font-medium">Students</div>
                            </div>
                            <div className="flex-1 py-4 text-center border-r border-border">
                                <div className="text-xl font-bold text-text">48K+</div>
                                <div className="text-[11px] text-text3 mt-0.5 font-medium">Reviews</div>
                            </div>
                            <div className="flex-1 py-4 text-center">
                                <div className="text-xl font-bold text-[#d4a017]">500+</div>
                                <div className="text-[11px] text-text3 mt-0.5 font-medium">Professors</div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col items-center gap-3 w-full mt-2">
                        <button
                            onClick={handleNext}
                            className="w-[220px] h-[44px] flex items-center justify-center bg-primary rounded-xl text-sm font-semibold text-white hover:bg-[#004d8a] transition-colors cursor-pointer shadow-[0_2px_12px_rgba(0,96,169,0.25)]"
                        >
                            {isLast ? "Sign up →" : "Continue →"}
                        </button>

                        {current > 0 && (
                            <button
                                onClick={handleBack}
                                className="w-[220px] h-[44px] flex items-center justify-center border border-border rounded-xl text-sm text-text2 font-medium hover:bg-[#eef2f5] transition-colors cursor-pointer"
                            >
                                ← Back
                            </button>
                        )}

                        {/* Dots */}
                        <div className="flex gap-1.5 mt-2">
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`rounded-full transition-all duration-300 ${
                                        i === current
                                            ? "w-5 h-2 bg-primary"
                                            : "w-2 h-2 bg-[#c8d2dc]"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
