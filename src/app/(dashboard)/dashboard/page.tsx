"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mockProfessor } from "@/data/mockTeachers"
import { Professor } from "@/types/teacher"
import { FACULTIES } from "@/lib/constants"
import { getInitials, formatRating, getRatingColor } from "@/lib/utils"
import { isatty } from "tty"



const TABS = ["Top rated", "Most reviewed", "Trending", "Best Teacher"] as const;
type Tab = (typeof TABS)[number];


const FACULTY_ICONS: Record<string, string> = {
    "All": "⭐",
    "Faculty of Exact and Natural Sciences": "🔬",
    "Faculty of Law": "⚖️",
    "Faculty of Social and Political Sciences": "🏛️",
    "Faculty of Economics and Business": "📊",
    "Faculty of Humanities": "📚",
    "Faculty of Medicine": "🏥",
    "Faculty of Psychology and Educational Sciences": "🧠",
}

const AVATAR_COLORS: Record<string, { bg: string, text: string }> = {
    "0": { bg: "bg-[#2a1e08]", text: "text-amber" },
    "1": { bg: "bg-blue-dim", text: "text-blue" },
    "2": { bg: "bg-[#1e1030]", text: "text-[#9d5fe8]" },
    "3": { bg: "bg-primary-dim", text: "text-primary" },
    "4": { bg: "bg-amber-dim", text: "text-amber" },
    "5": { bg: "bg-blue-dim", text: "text-blue" },
};


export default function DashBoardPage() {
    const router = useRouter();
    const [selectedFaculty, setSelectedFaculty] = useState<string>("All");
    const [activeTab, setActiveTab] = useState<Tab>("Top rated");


    const filteredProfessors = selectedFaculty === "All"
        ? mockProfessor
        : mockProfessor.filter((p) => p.faculty === selectedFaculty);

    const sortedProfessors = [...filteredProfessors].sort((a, b) => {
        if (activeTab === "Top rated") return b.overallRating - a.overallRating;
        if (activeTab === "Most reviewed") return b.reviewCount - a.reviewCount;
        return b.overallRating - a.overallRating;
    })

    const avgRating = filteredProfessors.length
        ? filteredProfessors.reduce((sum, p) => sum + p.overallRating, 0) / filteredProfessors.length
        : 0;
    const totalReviews = filteredProfessors.reduce((sum, p) => sum + p.reviewCount, 0);

    const getAvtColor = (id: string) => {
        return AVATAR_COLORS[String(parseInt(id) % 6)] || AVATAR_COLORS["0"];
    };




    return (
        <div className="flex flex-col gap-5 p-5 lg:p-6">


            {/* Greeting - Mobile */}
            <div className="lg:hidden">
                <p className="text-xs text-primary mb-1">Good morning Sabir</p>
                <h1 className="text-xl font-bold text-text leading-tight"
                    style={{ fontFamily: "Syne, sans-serif" }}>
                    Which faculty <br /> are you looking for?
                </h1>
            </div>

            {/* Faculty Grid */}
            <div>
                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
                    Select Faculty
                </p>

                {/* Desktop Grid */}
                <div className="hidden lg: grid grid-cols-4 gap-2">
                    {FACULTIES.map((faculty) => {
                        const isActive = selectedFaculty === faculty;
                        const count = faculty === "All"
                            ? mockProfessor.length
                            : mockProfessor.filter((p) => p.faculty === faculty).length;

                        return (
                            <button
                                key={faculty}
                                onClick={() => setSelectedFaculty(faculty)}
                                className={`flex-shrink-0 min-w-[110px] text-left p-3 rounded-xl border transition-all cursor-pointer 
                                ${isActive
                                        ? "bg-primary-dim border-primary-dim"
                                        : "bg-bg2 border-border hover:bg-bg3 hover:border-border2"
                                    }`}
                            >
                                <div className="text-lg mb-1.5">{FACULTY_ICONS[faculty] || "🎓"}</div>
                                <div className={`text-[10px] font-medium leading-snug ${isActive
                                    ? "text-primary"
                                    : "text-text"
                                    }`}>{faculty}</div>

                                <div className={`text-[9px] mt-1 ${isActive
                                    ? "text-primary-mid"
                                    : "text-text3"
                                    }`}>{count} profs
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Mobile scroll */}
                <div className="flex lg-hidden gap-2 overflow-x-auto pb-1 -mx-5 px-5">
                    {FACULTIES.map((faculty) => {
                        const isActive = selectedFaculty === faculty;
                        const count = faculty === "All"
                            ? mockProfessor.length
                            : mockProfessor.filter((p) => p.faculty === faculty).length;
                        return (
                            <button
                                key={faculty}
                                onClick={() => setSelectedFaculty(faculty)}
                                className={`flex-shrink-0 min-w-[110px] text-left p-3 rounded-xl border transition-all cursor-pointer
                                ${isActive ?
                                        "bg-primary-dim border-primary-dim" :
                                        "bg-bg2 border-boder"
                                    }`}
                            >
                                <div className="text-lg mb-1.5">{FACULTY_ICONS[faculty] || "🎓"}</div>
                                <div className={`text-[10px] font-medium leading-snug ${isActive ?
                                    "text-primary"
                                    : "text-text"
                                    }`}>{faculty}</div>
                                <div className={`text-[9px] mt-1 ${isActive ?
                                    "text-primary-mid"
                                    : "text-text3"
                                    }`}>{count} profs
                                </div>


                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}