"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
    {
        id: 0,
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        iconBg: "bg-[#1a3de2]",
        title: "Welcome, ",
        titleAccent: "Fellow Student",
        description: "TeacherRating is a platform where you can evaluate TSU professors based on real student experiences. Make informed decisions every semester.",
    },
    {
        id: 1,
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4a9edd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        iconBg: "bg-[#0f2035]",
        title: "Find Professors",
        titleAccent: "by faculty",
        description: "Search by faculty, department or professor name. See teaching quality, exam difficulty and homework load rated separately.",
    },

    {
        id: 2,
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9d5fe8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        iconBg: "bg-[#1e1030]",
        title: "Completely",
        titleAccent: "anonymous",
        description: "You are verified with your TSU email once. After that everything is completely anonymous. Your name will never be shown.",
    },

    {
        id: 3,
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
        iconBg: "bg-[#1a3d2e]",
        title: "Ready to",
        titleAccent: "get started?",
        description: "Sign up with your TSU email in 30 seconds. Select your faculty and start discovering the best professors.",
    },
]

export default function OnBoardingPage() {
    const router = useRouter();
    const [current, setCurrent] = useState(0);

    const isLast = current === slides.length - 1;

    const handleNext = () => {
        if (!isLast) {
            setCurrent((prev) => prev + 1);
        }
        else {
            router.push("/register");
        }
    };

    const handleBack = () => {
        setCurrent((prev) => prev - 1);
    };

    const handleSkip = () => {
        router.push("/login");
    };

    const slide = slides[current];

    return (
        <div className="w-full h-screen bg-[#0c0c0f] flex flex-col">
            <div className="flex gap-1 p-5 pt-8">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 h-[2px] rounded-full bg-[#22222e] overflow-hidden"
                    >
                        <div className=
                            {`h-full rounded-full transition-all duration-500 ${i <= current ? "bg-[#3ecf8e]" : "bg-transparent"
                                }`}
                        />
                    </div>
                ))}
            </div>

            <div className="w-full flex justify-end px-5">
                <button
                    className="text-lg text-[#55555f] cursor-pointer hover:text-[#888898] transition-colors flex items-center gap-1"
                    onClick={handleSkip}>
                    Skip →
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-6 px-6">
                <div className={`w-14 h-14 rounded-2xl ${slide.iconBg} flex items-center justify-center`}>
                    {slide.icon}
                </div>

                <h1 className="w-full text-3xl font-bold text-white leading-tight text-center">
                    {slide.title}
                    <br />
                    <span className="text-[#3ecf8e]">{slide.titleAccent}</span>
                </h1>

                <p className="text-[#888898] text-sm leading-relaxed text-center max-w-sm mb-4">
                    {slide.description}
                </p>

                {isLast && (
                    <div className="flex w-[300px] h-[100px] justify-center text-center items-center gap-10 bg-[#13131a] border border-[#ffffff0f] rounded-2xl overflow-hidden">
                        <div className="flex-1 p-4 text-center border-r border-[#ffffff0f]">
                            <div className="text-2xl font-bold text-[#39BC81]">12K+</div>
                            <div className="text-xs text-[#55555f] mt-1">Students</div>
                        </div>
                        <div className="flex-1 p-4 text-center border-r border-[#ffffff0f]">
                            <div className="text-2xl font-bold text-white">48K+</div>
                            <div className="text-[#55555f] text-xs mt-1">Reviews</div>
                        </div>

                        <div className="flex-1 p-4 text-center">
                            <div className="text-2xl font-bold text-[#e8a233]">500+</div>
                            <div className="text-[#55555f] text-xs mt-1">Professors</div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center gap-3 w-full">
                    <button
                        onClick={handleNext}
                        className="w-[200px] h-[40px] flex items-center justify-center  bg-[#3ecf8e] rounded-xl text-sm font-semibold text-[#0a1f14] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        {isLast ? "Sign up →" : "Continue →"}
                    </button>

                    {current > 0 && (
                        <button
                            onClick={handleBack}
                            className="w-[200px] h-[40px] flex items-center justify-center py-4 border border-[#ffffff18] rounded-xl text-sm text-[#888898] hover:bg-[#13131a] transition-colors cursor-pointer"
                        >
                            <i className="ri-arrow-left-line mr-2"></i> Back
                        </button>
                    )}

                    <div className="flex gap-1 mt-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-300 
                                ${i === current ? "w-4 h-2 bg-[#3ecf8e]"
                                        : "w-2 h-2 bg-[#22222e]"
                                    }
                                `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


