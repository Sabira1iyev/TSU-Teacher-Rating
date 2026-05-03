"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockProfessor } from "@/data/mockTeachers";
import { Professor } from "@/types/teacher";
import { getInitials, formatRating, getRatingColor } from "@/lib/utils";
import { Key } from "lucide-react";

const AVATAR_COLORS = [
    { bg: "bg-[#2a1e08]", text: "text-amber" },
    { bg: "bg-blue-dim", text: "text-blue" },
    { bg: "bg-[#1e1030]", text: "text-[#9d5fe8]" },
    { bg: "bg-primary-dim", text: "text-primary" },
    { bg: "bg-amber-dim", text: "text-amber" },
];

const getAvatarColor = (id: string) => {
    return AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];
}


export default function FavoritesPage() {
    const router = useRouter();

    const [favorites, setFavorites] = useState<Professor[]>(mockProfessor.slice(0, 3));

    const removeFavorite = (id: string) => {
        setFavorites((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="flex flex-col">

            {/* Desktop topbar */}
            <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg2 sticky top-[57px] z-10">
                <h1 className="
                 font-bold text-[16px] text-text                
                "
                    style={{
                        fontFamily: "Syne, sans-serif"
                    }}
                >Favorites</h1>
                <p className="text-xs text-text3">
                    {favorites.length} professor{favorites.length !== 1 ? "s" : ""} saved
                </p>
            </div>

            {/* mobile topbar */}
            <div className="flex lg:hidden items-center justify-between px-5 py-3 border-b border-border bg-bg2 sticky top-[49px] z-10">
                <span className="text-sm font-medium text-text">Favorites</span>
                <span className="text-xs text-text3">{favorites.length} saved</span>
            </div>

            {/* content */}
            <div className="mt-10 p-5 lg:p-6">
                {favorites.length === 0 ? (
                    /* empty state */
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <p className="text-5xl">♡</p>
                        <h2 className="text-xl font-bold text-text"
                            style={{
                                fontFamily: "Syne, sans-serif"
                            }}>No favorites yet
                        </h2>
                        <p className="text-sm text-text3 max-w-xs leading-relaxed">
                            Save professors you like by clicking the heart icon on their profile. Find them here anytime.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="px-6 py-2.5 bg-primary rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer mt-2"
                        >
                            Explore professors →
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop grid */}
                        <div className="hidden lg:grid grid-cols-3 gap-3">
                            {favorites.map((professor) => {
                                const colors = getAvatarColor(professor.id);
                                return (
                                    <div
                                        key={professor.id}
                                        className="bg-bg2 border border-border rounded-2xl p-4 cursor-pointer hover:bg-bg3 hover:border-border2 transition-all relative group "
                                        onClick={() => router.push(`/professor/${professor.id}`)}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFavorite(professor.id);
                                            }}
                                            className="absolute top-3 right-3 text-primary hover:text-red transition-colors cursor-pointer text-base opacity-0 group-hover:opacity-100"
                                        >
                                            ♥
                                        </button>

                                        {/* Avatar */}
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold mb-3 ${colors.bg} ${colors.text}`}>
                                            {getInitials(professor.firstName, professor.lastName)}
                                        </div>

                                        {/* info */}
                                        <p className="text-sm font-medium text-text leading-snug">
                                            {professor.title} {professor.firstName} {professor.lastName}
                                        </p>
                                        <p className="text-xs text-text2 mt-1">
                                            {professor.department} · {professor.faculty.replace("Faculty of", "")}
                                        </p>

                                        {/* Score */}
                                        <p className={`text-2xl font-semibold mt-3 ${getRatingColor(professor.overallRating)}`}>
                                            {formatRating(professor.overallRating)}
                                        </p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div
                                                    key={star}
                                                    className="w-[7px] h-[7px]"
                                                    style={{
                                                        clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                                                        background: star <= Math.round(professor.overallRating)
                                                            ? "#3b82f6"
                                                            : "#22222e",
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[10px] text-text3">
                                                {professor.reviewCount} reviews
                                            </span>
                                            {professor.badges[0] && (
                                                <span className="text-[9px] px-2 py-0.5 bg-primary-dim text-primary rounded-full">
                                                    {professor.badges[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Mobile list */}
                        <div className="flex lg:hidden flex-col gap-2">
                            {favorites.map((professor) => {
                                const colors = getAvatarColor(professor.id);
                                return (
                                    <div
                                        key={professor.id}
                                        onClick={() => router.push(`/professor/${professor.id}`)}
                                        className="bg-bg2 border border-border rounded-xl px-3 py-3 flex items-center gap-3 cursor-pointer active:bg-bg3 transition-colors relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colors.bg} ${colors.text}`}>
                                            {getInitials(professor.firstName, professor.lastName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text truncate">
                                                {professor.title} {professor.firstName} {professor.lastName}
                                            </p>
                                            <p className="text-[10px] text-text2 mt-0.5">
                                                {professor.department}
                                            </p>
                                            <p className="text-[10px] text-text3 mt-0.5">
                                                {professor.faculty.replace("Faculty of", "")}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0 mr-6">
                                            <p className={`text-base font-semibold ${getRatingColor(professor.overallRating)}`}>
                                                {formatRating(professor.overallRating)}
                                            </p>
                                            <p className="text-[10px] text-text3 mt-0.5">
                                                {professor.reviewCount} reviews
                                            </p>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFavorite(professor.id);
                                            }}
                                            className="absolute top-3 right-3 text-primary text-sm cursor-pointer"
                                        >
                                            ♥
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>


        </div >
    )
}