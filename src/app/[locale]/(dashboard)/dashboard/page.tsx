"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Professor } from "@/types/teacher";
import { FACULTIES } from "@/lib/constants";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useLocale, useTranslations } from "next-intl";

const TABS = [
  "Top rated",
  "Most reviewed",
  "Trending",
  "Best Teacher",
] as const;
type Tab = (typeof TABS)[number];

const FACULTY_ICONS: Record<string, string> = {
  All: "⭐",
  "Faculty of Exact and Natural Sciences": "🔬",
  "Faculty of Law": "⚖️",
  "Faculty of Social and Political Sciences": "🏛️",
  "Faculty of Economics and Business": "📊",
  "Faculty of Humanities": "📚",
  "Faculty of Medicine": "🏥",
  "Faculty of Psychology and Educational Sciences": "🧠",
};

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  "0": { bg: "bg-amber-dim", text: "text-amber" },
  "1": { bg: "bg-primary-dim", text: "text-primary" },
  "2": { bg: "bg-[#f3eefa]", text: "text-purple" },
  "3": { bg: "bg-primary-dim", text: "text-primary" },
  "4": { bg: "bg-amber-dim", text: "text-amber" },
  "5": { bg: "bg-primary-dim", text: "text-primary" },
};

export default function DashBoardPage() {
  const router = useRouter();
  const [selectedFaculty, setSelectedFaculty] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<Tab>("Top rated");
  const [professors, setProfessors] = useState<Professor[]>([]);
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);
  const tFac = useTranslations("Faculties");
  const tDash = useTranslations("Common");
  const tTabs = useTranslations("Tabs");
  const tTitles = useTranslations("Titles");
  const tNoResult = useTranslations("noResult");
  const tIndex = useTranslations("Index");

  const fullName = user?.firstName + " " + user?.lastName || "Unknown";
  useEffect(() => {
    fetch("/api/professors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProfessors(data);
        }
      });
  }, []);

  const filteredProfessors =
    selectedFaculty === "All"
      ? professors
      : professors.filter((p) => p.faculty === selectedFaculty);

  const sortedProfessors = [...filteredProfessors]
    .sort((a, b) => {
      if (activeTab === "Top rated") return b.overallRating - a.overallRating;
      if (activeTab === "Most reviewed") return b.reviewCount - a.reviewCount;
      return b.overallRating - a.overallRating;
    })
    .slice(0, 10);

  const ratedProfessors = filteredProfessors.filter((p) => p.reviewCount > 0);

  const avgRating = ratedProfessors.length
    ? ratedProfessors.reduce((sum, p) => sum + p.overallRating, 0) /
      ratedProfessors.length
    : 0;

  const totalReviews = filteredProfessors.reduce(
    (sum, p) => sum + p.reviewCount,
    0,
  );

  const getAvatarColor = (id: string) => {
    return AVATAR_COLORS[String(parseInt(id) % 6)] || AVATAR_COLORS["0"];
  };

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      {/* Greeting - Mobile */}
      <div className="lg:hidden">
        <p className="text-xs font-semibold text-primary mb-1">
          {tDash("greeting")} {fullName}
        </p>
        <h1
          className="text-xl font-semibold text-text leading-tight"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {tDash("question1")} <br /> {tDash("question2")}
        </h1>
      </div>

      {/* Faculty Grid */}
      <div>
        <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
          {tDash("select")}
        </p>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-2">
          {FACULTIES.map((faculty) => {
            const isActive = selectedFaculty === faculty;
            const count =
              faculty === "All"
                ? professors.length
                : professors.filter((p) => p.faculty === faculty).length;

            return (
              <button
                key={faculty}
                onClick={() => setSelectedFaculty(faculty)}
                className={`flex-shrink-0 min-w-[110px] text-left p-3 rounded-xl border transition-all cursor-pointer 
                                ${
                                  isActive
                                    ? "bg-bg border-primary-dim shadow-sm"
                                    : "bg-bg2 border-border hover:bg-bg hover:border-border"
                                }`}
              >
                <div className="text-lg mb-1.5">
                  {FACULTY_ICONS[faculty] || "🎓"}
                </div>
                <div
                  className={`text-[10px] font-medium leading-snug ${
                    isActive ? "text-primary" : "text-text"
                  }`}
                >
                  {tFac(faculty)}
                </div>

                <div
                  className={`text-[9px] mt-1 ${
                    isActive ? "text-[#5a8bbf]" : "text-text3"
                  }`}
                >
                  {count} profs
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile grid */}
        <div className="grid lg:hidden grid-cols-2 gap-2">
          {FACULTIES.map((faculty) => {
            const isActive = selectedFaculty === faculty;
            const count =
              faculty === "All"
                ? professors.length
                : professors.filter((p) => p.faculty === faculty).length;
            return (
              <button
                key={faculty}
                onClick={() => setSelectedFaculty(faculty)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer
                                ${
                                  isActive
                                    ? "bg-bg border-border2 shadow-sm"
                                    : "bg-bg2 border-border"
                                }`}
              >
                <div className="text-lg mb-1.5">
                  {FACULTY_ICONS[faculty] || "🎓"}
                </div>
                <div
                  className={`text-[10px] font-medium leading-snug ${
                    isActive ? "text-primary" : "text-text"
                  }`}
                >
                  {tFac(faculty)}
                </div>
                <div
                  className={`text-[12px] mt-1 ${
                    isActive ? "text-[#5a8bbf]" : "text-text3"
                  }`}
                >
                  {count} {tDash("prof")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-bg2 border border-border rounded-xl p-3 shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <p className="text-[9px] text-text2 mb-1.5">{tDash("profs")}</p>
          <p className="text-xl font-semibold text-primary">
            {filteredProfessors.length}
          </p>
          <p className="text-[9px] text-text2 mt-1 truncate">
            {selectedFaculty === "All"
              ? tFac("All") + " " + tDash("fac")
              : tFac(selectedFaculty).replace("Faculty of ", "")}
          </p>
        </div>
        <div className="bg-bg2 border border-border rounded-xl p-3 shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <p className="text-[9px] text-text2 mb-1.5">{tDash("avgRate")}</p>
          <p className="text-xl font-semibold text-text">
            {formatRating(avgRating)}
          </p>
          <p className="text-[9px] text-text2 mt-1">
            <span className="text-primary mr-[2px]">
              ↑ {stats?.semesterGrowth || 0}
            </span>{" "}
            {tDash("thisSem")}
          </p>
        </div>
        <div className="bg-bg2 border border-border rounded-xl p-3 shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <p className="text-[9px] text-text2 mb-1.5">{tDash("totReviews")}</p>
          <p className="text-xl font-semibold text-text">
            {totalReviews.toLocaleString()}
          </p>
          <p className="text-[9px] text-text2 mt-1">
            <span className="text-primary mr-[2px]">
              {stats?.monthGrowth > 0 ? "+" : ""}
              {stats?.monthGrowth || 0}
            </span>
            {tDash("thisMonth")}
          </p>
        </div>
      </div>

      {/* Professor List */}
      <div>
        {/* Tabs */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors
                                ${
                                  activeTab === tab
                                    ? "bg-bg2 text-primary font-medium"
                                    : "text-text hover:text-text hover:bg-bg2"
                                }`}
              >
                {tTabs(tab)}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-text3 hidden lg:block">
            {sortedProfessors.length} {tDash("favProf")}
          </span>
        </div>

        {/* Desktop: Table list */}
        <div className="hidden lg:block bg-bg2 border border-border rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,40,80,0.04)]">
          <div className="grid grid-cols-[40px_2.5fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-border bg-bg2">
            {[
              "#",
              tDash("profs"),
              tIndex("title2"),
              tDash("reviewss"),
              tDash("profStatus"),
            ].map((h, i) => (
              <span
                key={h}
                className={`text-[9px] text-text3 uppercase tracking-wider ${i === 4 ? "text-right" : ""}`}
              >
                {h}
              </span>
            ))}
          </div>

          {sortedProfessors.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text3">
              {tNoResult("dashDesc", { faculty: tFac(selectedFaculty) })}
            </div>
          ) : (
            sortedProfessors.map((professor, index) => {
              const colors = getAvatarColor(professor.id);
              return (
                <div
                  key={professor.id}
                  onClick={() => router.push(`/professor/${professor.id}`)}
                  className="grid grid-cols-[40px_2.5fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-border last:border-none hover:bg-bg cursor-pointer transition-colors items-center"
                >
                  <span className="text-[11px] text-text3">{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${colors.bg} ${colors.text}`}
                    >
                      {getInitials(professor.firstName, professor.lastName)}
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-text">
                        {tTitles(professor.title)} {professor.firstName}{" "}
                        {professor.lastName}
                      </p>
                      <p className="text-[10px] text-text3">
                        {professor.department}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-[14px] font-semibold ${getRatingColor(professor.overallRating)}`}
                    >
                      {formatRating(professor.overallRating)}
                    </p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="w-[7px] h-[7px]"
                          style={{
                            clipPath:
                              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                            background:
                              star <= Math.round(professor.overallRating)
                                ? "#0060a9"
                                : "#d8dfe6",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-text3">
                    {professor.reviewCount} {tDash("reviews")}
                  </p>
                  <div className="text-right">
                    {professor.badges[0] ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary-dim text-primary">
                        {professor.badges[0]}
                      </span>
                    ) : (
                      <span className="text-[10px] text-text3">-</span>
                    )}
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
              {tNoResult("dashDesc", { faculty: tFac(selectedFaculty) })}
            </div>
          ) : (
            sortedProfessors.map((professor, index) => {
              const colors = getAvatarColor(professor.id);
              return (
                <div
                  key={professor.id}
                  onClick={() => router.push(`/professor/${professor.id}`)}
                  className="bg-bg2 border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 cursor-pointer active:bg-bg3 transition-colors shadow-[0_1px_3px_rgba(0,40,80,0.03)]"
                >
                  <span className="text-[11px] text-text3 w-3.5">
                    {index + 1}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0 ${colors.bg} ${colors.text}`}
                  >
                    {getInitials(professor.firstName, professor.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text truncate">
                      {tTitles(professor.title)} {professor.firstName}{" "}
                      {professor.lastName}
                    </p>
                    <p className="text-[10px] text-text3 mt-0.5">
                      {professor.department}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-[15px] font-semibold ${getRatingColor(professor.overallRating)}`}
                    >
                      {formatRating(professor.overallRating)}
                    </p>
                    <p className="text-[9px] text-text3 mt-0.5">
                      {professor.reviewCount} {tDash("reviews")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
