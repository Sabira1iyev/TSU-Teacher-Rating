"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mockProfessor } from "@/data/mockTeachers"
import { Professor } from "@/types/teacher"
import { FACULTIES } from "@/lib/constants"
import { getInitials, formatRating, getRatingColor } from "@/lib/utils"



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
    "1": { bg: "bg-[#0e1832]", text: "text-[#4984e3]" },
    "2": { bg: "bg-[#1e1030]", text: "text-[#9d5fe8]" },
    "3": { bg: "bg-primary-dim", text: "text-primary" },
    "4": { bg: "bg-[#1c1c24]", text: "text-amber" },
    "5": { bg: "bg-[#0e1832]", text: "text-[#4984e3]" },
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

    const getAvatarColor = (id: string) => {
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
                <div className="hidden lg:grid grid-cols-4 gap-2">
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
                <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-5 px-5">
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-bg2 border-border rounded-xl p-3">
                    <p className="text-[9px] text-text3 mb-1.5">Professors</p>
                    <p className="text-xl font-semibold text-primary">{filteredProfessors.length}</p>
                    <p className="text-[9px] text-text3 mt-1 truncate">
                        {selectedFaculty === "All"
                            ? "All faculties"
                            : selectedFaculty.replace("Faculty of ", "")
                        }
                    </p>
                </div>
                <div className="bg-bg2 border border-border rounded-xl p-3">
                    <p className="text-[9px] text-text3 mb-1.5">Average Rating</p>
                    <p className="text-xl font-semibold text-text">
                        {formatRating(avgRating)}</p>
                    <p className="text-[9px] text-text3 mt-1">
                        <span className="text-primary mr-[2px]">↑ 0.3</span> this semester
                    </p>
                </div>
                <div className="bg-bg2 border border-border rounded-xl p-3">
                    <p className="text-[9px] text-text3 mb-1.5">Total reviews</p>
                    <p className="text-xl font-semibold text-text">{totalReviews.toLocaleString()}</p>
                    <p className="text-[9px] text-text3 mt-1">
                        <span className="text-primary mr-[2px]">+18%</span>this month
                    </p>
                </div>
            </div>

            {/* Professor List */}
            <div>
                {/* Tabs */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors
                                ${activeTab === tab
                                        ? "bg-bg3 text-text font-medium"
                                        : "text-text2 hover:text-text"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <span className="text-[10px] text-text3 hidden lg:block">
                        {sortedProfessors.length} professors
                    </span>
                </div>

                {/* Desktop: Table list */}
                <div className="hidden lg:block bg-bg2 border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[40px_2.5fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-border">
                        {["#", "Professor", "Rating", "Reviews", "Status"].map((h, i) => (
                            <span key={h} className={`text-[9px] text-text3 uppercase tracking-wider ${i === 4 ? "text-right" : ""}`}>
                                {h}
                            </span>
                        ))}
                    </div>

                    {sortedProfessors.length === 0 ?
                        (
                            <div className="px-4 py-8 text-center text-sm text-text3">
                                No professors found in {selectedFaculty} yet.
                            </div>
                        )
                        :
                        (
                            sortedProfessors.map((professor, index) => {
                                const colors = getAvatarColor(professor.id);
                                return (
                                    <div
                                        key={professor.id}
                                        onClick={() => router.push(`/professor/${professor.id}`)}
                                        className="grid grid-cols-[40px_2.5fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-border last:border-none hover:bg-bg3 cursor-pointer transition-colors items-center"
                                    >
                                        <span className="text-[11px] text-text3">{index + 1}</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${colors.bg} ${colors.text}`}>
                                                {getInitials(professor.firstName, professor.lastName)}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-medium text-text">
                                                    {professor.title} {professor.firstName} {professor.lastName}
                                                </p>
                                                <p className="text-[10px] text-text3">{professor.department}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className={`text-[14px] font-semibold ${getRatingColor(professor.overallRating)}`}>
                                                {formatRating(professor.overallRating)}
                                            </p>
                                            <div className="flex gap-0.5 mt-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <div
                                                        key={star}
                                                        className="w-[7px] h-[7px]"
                                                        style={{
                                                            clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                                                            background: star <= Math.round(professor.overallRating) ? "#3ecf8e" : "#22222e"
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-text3">{professor.reviewCount} reviews</p>
                                        <div className="text-right">
                                            {professor.badges[0] ? (
                                                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary-dim text-primary">
                                                    {professor.badges[0]}
                                                </span>
                                            )
                                                :
                                                (
                                                    <span className="text-[10px] text-text3">-</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        )}
                </div>

                {/* Mobile: Card List */}
                <div className="flex lg:hidden flex-col gap-2">
                    {sortedProfessors.length === 0 ? (
                        <div className="py-8 text-center text-sm text-text3">
                            No professors found in {selectedFaculty} yet.
                        </div>
                    )
                        :
                        sortedProfessors.map((professor, index) => {
                            const colors = getAvatarColor(professor.id);
                            return (
                                <div
                                    key={professor.id}
                                    onClick={() => router.push(`/professor/${professor.id}`)}
                                    className="bg-bg2 border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 cursor-pointer active:bg-bg3 transition-colors"
                                >
                                    <span className="text-[11px] text-text3 w-3.5">{index + 1}</span>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0 ${colors.bg} ${colors.bg}`}>
                                        {getInitials(professor.firstName, professor.lastName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-medium text-text truncate">
                                            {professor.title} {professor.firstName} {professor.lastName}
                                        </p>
                                        <p className="text-[10px] text-text3 mt-0.5">{professor.department}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-[15px] font-semibold ${getRatingColor(professor.overallRating)}`}>
                                            {formatRating(professor.overallRating)}
                                        </p>
                                        <p className="text-[9px] text-text3 mt-0.5">{professor.reviewCount} reviews</p>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}