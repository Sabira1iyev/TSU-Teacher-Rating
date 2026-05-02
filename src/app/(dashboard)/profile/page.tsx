"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockReviews } from "@/data/mockReviews";
import { useUser } from "@/context/UserContext";
import { FACULTY_COLORS, DEFAULT_FACULTY_COLOR } from "@/lib/constants";
import { getInitials } from "@/lib/utils";


// Profile stats that would come from a backend in the future
const MOCK_STATS = {
    department: "Computer Science",
    totalReviews: 18,
    averageRatingGiven: 4.1,
    totalLikesReceived: 142,
    createdAt: "2026-05-02",
};


export default function ProfilePage() {
    const { user } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"reviews" | "stats">("reviews");

    const userReviews = mockReviews.slice(0, 5);


    const profileData = user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            faculty: user.faculty,
            studyYear: user.studyYear,
            ...MOCK_STATS,
        }
        : null;


    const fc = profileData
        ? FACULTY_COLORS[profileData.faculty] || DEFAULT_FACULTY_COLOR
        : DEFAULT_FACULTY_COLOR;


    const contributions = profileData
        ? [
            { label: "Faculty", value: profileData.faculty },
            { label: "Department", value: profileData.department },
            { label: "Study Year", value: profileData.studyYear },
            { label: "Total Reviews", value: profileData.totalReviews },
            { label: "Avg Rating Given", value: profileData.averageRatingGiven },
            { label: "Likes Received", value: profileData.totalLikesReceived },
        ]
        : [];


    return (
        <div className="flex flex-col">

            {/* Desktop topbar */}
            <div className="hidden lg:flex items-center justify-between px-6 py-3.5 borer-b border-border bg-bg2 sticky top-[57px] z-10">
                <h1 className="font-bold text-[16px] text-text"
                    style={{
                        fontFamily: "Syne, sans-serif"
                    }}>
                    My Profile
                </h1>
                <button
                    className="px-4 py-2 border border-border2 rounded-lg text-xs text-text2 hover:bg-bg3 transition-colors cursor-pointer"
                >
                    Edit Profile
                </button>
            </div>

            {/* Mobile topbar */}
            <div className="flex lg:hidden items-center justify-between px-5 py-3 border-b border-border bg-bg2 sticky top-[49px] z-10">
                 <span className="text-sm font-medium text-text">My Profile</span>
                 <button className="text-xs text-primary cursor-pointer">Edit</button>
            </div>

            <div className="flex flex-cold lg:grid lg:grid-cols-[280px_1fr] min-h-screen">

                {/* Left col */}
                <div className="lg:border-r border-border p-5 lg:p-6 flex flex-col gap-4">

                    {/* Profile card */}
                    <div className="bg-bg2 border border-border rounded-2xl p-5 text-center">
                        <div className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-blue-dim flex items-center justify-center text-xl lg:text-2xl text-blue font-semibold mt-6 mx-auto mb-3 border-2 border-border2">
                            {getInitials(profileData?.firstName ?? "", profileData?.lastName ?? "")}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
