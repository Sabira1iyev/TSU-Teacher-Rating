"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockProfessor } from "@/data/mockTeachers";
import { FACULTIES, ACADEMIC_TITLES } from "@/lib/constants";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { Professor } from "@/types/teacher";
import { userAgent } from "next/server";

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

            {/* Search bar */}
            <div className="px-5 lg:px-6 py-4 border-b border-border bg-bg2 sticky top-[48px] lg:top-[57px] z-10">
                <div className="flex items-center gap-3 bg-bg3 border border-border2 rounded-xl px-4 py-3 focus-within:border-primary transition">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Professor, course or department..."
                        className="flex-1 bg-transparent text-sm text-text placeholder:text-text3 outline-none" autoFocus
                    />
                </div>
            </div>
        </div>
    )
}
