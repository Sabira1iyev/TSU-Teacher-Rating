"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockProfessor } from "@/data/mockTeachers";
import { FACULTIES, ACADEMIC_TITLES } from "@/lib/constants";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { Professor } from "@/types/teacher";


type SortOption = "rating" | "reviews";

const MIN_REVIEW_OPTIONS = [
    { label: "All", value: 0 },
    { label: "10+ reviews", value: 10 },
    { label: "50+ reviews", value: 50 },
];


export default function SearchPage() {

    const router = useRouter();

    const [query, setQuery] = useState("");

    const [selectedFaculty, setSelectedFaculty] = useState<string>("All");
    const [selectedTitles, setSelectedTitles] = useState<string[]>([...ACADEMIC_TITLES]);
    const [minRating, setMinRating] = useState(0);
    const [minReviews, setMinReviews] = useState(0);
    const [sortBy, setSortBy] = useState<SortOption>("rating");
    const [showFilters, setShowFilters] = useState(false);

    const toglleTittle = (title: string) => {
        setSelectedTitles((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
        );
    };

    const results = useMemo(() => {
        let filtered = mockProfessor.filter((p: Professor) => {
            const fullName = `${p.firstName} ${p.lastName} ${p.title}`.toLowerCase();
            const matchesQuery = query === "" ||
                fullName.includes(query.toLowerCase()) ||
                p.department.toLowerCase().includes(query.toLowerCase()) ||
                p.courses.some((c) => c.toLowerCase().includes(query.toLowerCase()));

            const matchesFaculty =
                selectedFaculty === "All" || p.faculty === selectedFaculty;

            const matchesTitle = selectedTitles.includes(p.title);
            const matchesRating = p.overallRating >= minRating;
            const matchesReviews = p.reviewCount >= minReviews;

            return (
                matchesQuery &&
                matchesFaculty &&
                matchesTitle &&
                matchesRating &&
                matchesReviews
            );
        });

        filtered.sort((a, b) =>
            sortBy === "rating"
                ? b.overallRating - a.overallRating
                : b.reviewCount - a.reviewCount
        )
        return filtered;
    },
        [query, selectedFaculty, selectedTitles, minRating, minReviews, sortBy]);


    const AVATAR_COLORS = [
        { bg: "bg-[#fdf6e3]", text: "text-[#b8860b]" },
        { bg: "bg-[#e8f1fa]", text: "text-[#0060a9]" },
        { bg: "bg-[#f3eefa]", text: "text-[#6f42c1]" },
        { bg: "bg-[#e8f1fa]", text: "text-[#0060a9]" },
        { bg: "bg-[#fdf6e3]", text: "text-[#b8860b]" },
    ];

    const getAvatarColor = (id: string) => {
        return AVATAR_COLORS[Number(id) % AVATAR_COLORS.length];
    };

    return (
        <div className="flex flex-col">

            {/* Search bar + Filter pills — single sticky block */}
            <div className="sticky top-[48px] lg:top-[57px] z-20 bg-bg2">
                {/* Search bar */}
                <div className="px-5 lg:px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3 bg-bg3 border border-border2 rounded-xl px-4 py-3 focus-within:border-primary transition">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Professor, course or department..."
                            className="flex-1 bg-transparent text-sm text-text placeholder:text-text3 outline-none" autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="text-text3 hover:text-text2 cursor-pointer text-sm">
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-2 px-5 lg:px-6 py-3 border-b border-border overflow-x-auto">
                    {FACULTIES.map((faculty) => (
                        <button
                            key={faculty}
                            onClick={() => setSelectedFaculty(faculty)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] cursor-pointer transition-all border ${selectedFaculty === faculty
                                ? "bg-primary-dim border-primary-mid text-primary"
                                : "border-border2 text-text2 hover:border-border"
                                }`}
                        >
                            {faculty === "All" ?
                                "All" :
                                faculty.replace("Faculty of ", "")}
                        </button>
                    ))}
                    <div className="w-[0.5px] h-4 bg-border2 flex-shrink-0 mx-1" />
                    <button
                        onClick={() => setSortBy(sortBy === "rating" ? "reviews" : "rating")}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] cursor-pointer border border-border2 text-text2 hover:border-border whitespace-nowrap"
                    >
                        Sort: {sortBy === "rating" ? "Rating ↓" : "Reviews ↓"}
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex lg:hidden flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] cursor-pointer border transition-all 
                        ${showFilters ?
                                "bg-primary-dim border-primary-mid text-primary"
                                : "border-border2 text-text2 hover:border-border"
                            }`}
                    >
                        Filters
                    </button>
                </div>

                {/* Mobile filters */}
                {showFilters && (
                    <div className="lg:hidden px-5 py-4 border-b border-border bg-bg2 flex flex-col gap-4">
                        <div>
                            <p className="text-[10px] text-text3 uppercase tracking-widest mb-2">Academic title</p>
                            <div className="flex flex-wrap gap-2">
                                {ACADEMIC_TITLES.map((title) => (
                                    <button
                                        key={title}
                                        onClick={() => toglleTittle(title)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] cursor-pointer border transition-all ${selectedTitles.includes(title)
                                            ? "bg-primary-dim border-primary-mid text-primary"
                                            : "border-border2 text-text2"
                                            }`}
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] text-text3 uppercase tracking-widest mb-2">Minimum rating</p>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3, 4.5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setMinRating(rating)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] cursor-pointer border transition-all ${minRating === rating
                                            ? "bg-primary-dim border-primary-mid text-primary"
                                            : "border-border2 text-text2"
                                            }`}
                                    >
                                        {rating === 0 ? "All" : `${rating}+`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-1">
                    {/* Results */}
                    <div className="flex-1 flex flex-col">
                        <div className="px-5 lg:px-6 py-3 border-b border-border">
                            <p className="text-[11px] text-text3">
                                <span className="text-text font-medium">{results.length}</span>
                                {query && ` for "${query}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
