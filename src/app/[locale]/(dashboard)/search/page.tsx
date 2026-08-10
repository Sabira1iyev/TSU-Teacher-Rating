"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FACULTIES, ACADEMIC_TITLES } from "@/lib/constants";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { Professor } from "@/types/teacher";
import { useTranslations } from "next-intl";
import { title } from "process";

type SortOption = "rating" | "reviews";

const MIN_REVIEW_OPTIONS = [
  { label: "All", value: 0 },
  { label: "10+ reviews", value: 10 },
  { label: "50+ reviews", value: 50 },
  { label: "100+ reviews", value: 100 },
  { label: "150+ reviews", value: 150 },
  { label: "200+ reviews", value: 200 },
];

export default function SearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");

  const [selectedFaculty, setSelectedFaculty] = useState<string>("All");
  const [selectedTitles, setSelectedTitles] = useState<string[]>([
    ...ACADEMIC_TITLES,
  ]);
  const [minRating, setMinRating] = useState(0);
  const [minReviews, setMinReviews] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const tFac = useTranslations("Faculties");
  const tDash = useTranslations("Common");
  const tTitles = useTranslations("Titles");
  const tNoResult = useTranslations("noResult");

  useEffect(() => {
    fetch("/api/professors")
      .then((res) => res.json())
      .then((data) => setProfessors(data))
      .then(() => setLoading(false));
  }, []);

  const toglleTittle = (title: string) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const results = useMemo(() => {
    let filtered = professors.filter((p: Professor) => {
      const fullName = `${p.firstName} ${p.lastName} ${p.title}`.toLowerCase();
      const matchesQuery =
        query === "" ||
        fullName.includes(query.toLowerCase()) ||
        (p.department &&
          p.department.toLowerCase().includes(query.toLowerCase())) ||
        (p.courses || []).some((c) =>
          c.toLowerCase().includes(query.toLowerCase()),
        );

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
        : b.reviewCount - a.reviewCount,
    );
    return filtered;
  }, [query, selectedFaculty, selectedTitles, minRating, minReviews, sortBy]);

  const AVATAR_COLORS = [
    { bg: "bg-amber-dim", text: "text-amber" },
    { bg: "bg-primary-dim", text: "text-primary" },
    { bg: "bg-[#f3eefa]", text: "text-purple" },
    { bg: "bg-primary-dim", text: "text-primary" },
    { bg: "bg-amber-dim", text: "text-amber" },
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
          <div className="flex items-center gap-3 bg-bg2 border border-border rounded-xl px-4 py-3 focus-within:border-primary transition">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tDash("searchBar")}
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text3 outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-text3 hover:text-text2 cursor-pointer text-sm"
              >
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
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] cursor-pointer transition-all border ${
                selectedFaculty === faculty
                  ? "bg-primary-dim border-primary-mid text-primary"
                  : "border-border text-text2 hover:border-border"
              }`}
            >
              {faculty === "All"
                ? tFac("All")
                : tFac(faculty).replace("Faculty of ", "")}
            </button>
          ))}
          <div className="w-[0.5px] h-4 bg-border2 flex-shrink-0 mx-1" />
          <button
            onClick={() =>
              setSortBy(sortBy === "rating" ? "reviews" : "rating")
            }
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] cursor-pointer border border-border text-text2 hover:border-border whitespace-nowrap"
          >
            {tDash("sort")}:{" "}
            {sortBy === "rating" ? tDash("sortRating") : tDash("sortReviews")}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex lg:hidden flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] cursor-pointer border transition-all 
                        ${
                          showFilters
                            ? "bg-primary-dim border-primary-mid text-primary"
                            : "border-border text-text2 hover:border-border"
                        }`}
          >
            {tDash("searchFilter")}
          </button>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden px-5 py-4 border-b border-border bg-bg2 flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-text3 uppercase tracking-widest mb-2">
                {tDash("acTitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {ACADEMIC_TITLES.map((title) => (
                  <button
                    key={title}
                    onClick={() => toglleTittle(title)}
                    className={`px-3 py-1.5 rounded-full text-[11px] cursor-pointer border transition-all ${
                      selectedTitles.includes(title)
                        ? "bg-primary-dim border-primary-mid text-primary"
                        : "border-border2 text-text2"
                    }`}
                  >
                    {tTitles(title.replace(/\./g, ""))}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-text3 uppercase tracking-widest mb-2">
                {tDash("searchMinRating")}
              </p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-1.5 rounded-full text-[11px] cursor-pointer border transition-all ${
                      minRating === rating
                        ? "bg-primary-dim border-primary-mid text-primary"
                        : "border-border2 text-text2"
                    }`}
                  >
                    {rating === 0 ? tFac("All") : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content area: Results + Desktop sidebar */}
      <div className="flex flex-1">
        {/* Results */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 lg:px-6 py-3 border-b border-border">
            <p className="text-[11px] text-text3">
              <span className="text-text font-medium">{results.length}</span>
              {query && ` for "${query}`}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-4xl">🔍</p>
              <p className="text-sm font-medium text-text">
                {tNoResult("searchTitle")}
              </p>
              <p className="text-xs text-text3">{tNoResult("searchDesc")}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {results.map((profesor) => {
                const colors = getAvatarColor(profesor.id);
                return (
                  <div
                    key={profesor.id}
                    onClick={() => router.push(`/professor/${profesor.id}`)}
                    className="flex items-center bg-bg2 gap-3 lg:gap-4 px-5 lg:px-6 py-4 border-b border-border cursor-pointer hover:bg-bg transition-colors"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colors.bg} ${colors.text}`}
                    >
                      {getInitials(profesor.firstName, profesor.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">
                        {tTitles(profesor.title.replace(/\./g, ""))}{" "}
                        {profesor.firstName} {profesor.lastName}
                      </p>
                      <p className="text-xs text-text2 mt-0.5">
                        {tFac(profesor.faculty).replace("Faculty of ", "")} ·{" "}
                        {profesor.department}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(profesor.badges || []).map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-0.5 bg-primary-dim text-primary text-[9px] rounded-lg"
                          >
                            {badge}
                          </span>
                        ))}
                        {(profesor.courses || []).slice(0, 2).map((course) => (
                          <span
                            key={course}
                            className="px-2 py-0.5 bg-bg4 text-text3 text-[9px] rounded-lg"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-lg font-semibold ${getRatingColor(profesor.overallRating)}`}
                      >
                        {formatRating(profesor.overallRating)}
                      </p>
                      <div className="flex gap-0.5 justify-end mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="w-[7px] h-[7px]"
                            style={{
                              clipPath:
                                "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                              background:
                                star <= Math.round(profesor.overallRating)
                                  ? "#0060a9"
                                  : "#222222",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-text3 mt-1">
                        {profesor.reviewCount} {tDash("reviews")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop filter sidebar */}
        <div className="hidden lg:flex lg:flex-col w-[260px] flex-shrink-0 border-l border-border p-5 gap-2">
          <p className="text-[10px] text-text3 uppercase tracking-widest">
            {tDash("searchFilter")}
          </p>

          {/* Min rating */}
          <div className="mt-8">
            <p className="text-xs text-text2 mb-2">
              {tDash("searchMinRating")}
            </p>
            <div className="flex flex-col gap-1.5">
              {[0, 1, 2, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`text-left px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                    minRating === rating
                      ? "bg-primary-dim text-primary"
                      : "text-text2 hover:bg-bg3"
                  }`}
                >
                  {rating === 0 ? tDash("allRatings") : `${rating}+ ${tDash("stars")}`}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Titles */}
          <div className="mt-4">
            <p className="text-xs text-text2 mb-2">{tDash("acTitle")}</p>
            <div className="flex flex-col gap-2">
              {ACADEMIC_TITLES.map((title) => (
                <label
                  key={title}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    onClick={() => toglleTittle(title)}
                    className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center cursor-pointer transition-color ${
                      selectedTitles.includes(title)
                        ? "bg-primary border-primary"
                        : "border-border2"
                    }`}
                  >
                    {selectedTitles.includes(title) && (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <polyline
                          points="2,5 4,7 8,3"
                          stroke="#0a1f14"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] text-text2">
                    {tTitles(title.replace(/\./g, ""))}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Min reviews */}
          <div className="mt-5">
            <p className="text-xs text-text2 mb-2">{tDash("minReviews")}</p>
            <div className="flex flex-col gap-1.5">
              {MIN_REVIEW_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMinReviews(opt.value)}
                  className={`text-left px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                    minReviews === opt.value
                      ? "bg-primary-dim text-primary"
                      : "text-text2 hover:bg-bg3"
                  }`}
                >
                  {opt.label === "All" ? tFac("All") : `${opt.value}+ ${tDash("reviews")}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
