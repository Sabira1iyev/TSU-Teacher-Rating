"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { mockReviews } from "@/data/mockReviews";
import { useUser } from "@/context/UserContext";
import { FACULTY_COLORS, DEFAULT_FACULTY_COLOR } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { getProfessorById } from "@/data/mockTeachers";


// Profile stats that would come from a backend in the future
const MOCK_USER = {
    firstName: "FirstName",
    lastName: "LastName",
    email: "[EMAIL_ADDRESS]",
    faculty: "Faculty of Exact and Natural Sciences",
    department: "Computer Science",
    studyYear: "3",
    totalReviews: 18,
    averageRatingGiven: 4.1,
    totalLikesReceived: 142,
    createdAt: "2026-05-02",
};

const AVATAR_COLORS = [
    { bg: "bg-[#2a1e08]", text: "text-amber" },
    { bg: "bg-blue-dim", text: "text-blue" },
    { bg: "bg-[#1e1030]", text: "text-[#9d5fe8]" },
    { bg: "bg-primary-dim", text: "text-primary" },
    { bg: "bg-amber-dim", text: "text-amber" },
];

const getAvatarColor = (id: string) => {
    AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];
}


export default function ProfilePage() {
    const { user } = useUser();
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"reviews" | "stats">("reviews");
    const professor = getProfessorById(params.ID as string);
    const userReviews = mockReviews.slice(0, 5);

    const fc = professor
        ? FACULTY_COLORS[professor.faculty] || DEFAULT_FACULTY_COLOR
        : DEFAULT_FACULTY_COLOR;

    const contributions = [
        { label: "Computer Science", count: 14, percent: 78, color: fc.primary },
        { label: "Mathematics", count: 3, percent: 16, color: fc.primary },
        { label: "Physics", count: 6, percent: 12, color: fc.primary },
        { label: "Mathematics", count: 9, percent: 9, color: fc.primary },
    ]





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
                            {getInitials(MOCK_USER.firstName, MOCK_USER.lastName)}
                        </div>
                        <h2 className="font-bold text-base lg:text-lg text-text"
                            style={{
                                fontFamily: "Syne, sans-serif"
                            }}>
                            {MOCK_USER.firstName} {MOCK_USER.lastName}
                        </h2>
                        <p className="text-xs text-primary mt-1">Tbilisi State University</p>
                        <p className="text-xs text-text3 mt-0.5">
                            {MOCK_USER.faculty.replace("Faculty of ", "")} · {MOCK_USER.studyYear}rd year
                        </p>

                        <div className="h-[0.5px] bg-border my-4" />
                        <div className="flex justify-around">
                            <div className="text-center">
                                <p className="text-lg font-semibold text-primary">{MOCK_USER.totalReviews}</p>
                                <p className="text-[9px] text-text3 mt-0.5">Reviews</p>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-semibold text-text">{MOCK_USER.averageRatingGiven}</p>
                                <p className="text-[9px] text-text3 mt-0.5">Avg given</p>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-semibold text-text">{MOCK_USER.totalLikesReceived}</p>
                                <p className="text-[9px] text-text3 mt-0.5">Likes</p>
                            </div>

                        </div>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols2 gap-2">
                        {[
                            { label: "This semester", value: "4", sub: "reviews written", green: true },
                            { label: "Remaining", value: "3", sub: "this semester" },
                            { label: "Ranking", value: "#42", sub: "most active" },
                            { label: "Member for", value: "2 yrs", sub: "since 2025" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-bg2 border border-border rounded-xl p-3"
                            >
                                <p className="text-[9px] text-text3 mb-1">{item.label}</p>
                                <p className={`text-lg font-semibold 
                                    ${item.green ? "text-primary" : "text-text1"}`}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Account info */}
                    <div className="bg-bg2 border border-border rounded-xl p-4">
                        <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">Account</p>
                        <div className="flex flex-col">
                            {[
                                { label: "Email", value: MOCK_USER.email },
                                { label: "Faculty", value: MOCK_USER.faculty },
                                { label: "Year", value: `${MOCK_USER.studyYear}rd year` }
                            ].map((item, i, arr) => (
                                <div
                                    key={item.label}
                                    className={`flex justify-between py-2 text-[11px] ${i < arr.length - 1 ? "border-b border-border"
                                        : ""
                                        }`}
                                >
                                    <span className="text-text3">{item.label}</span>
                                    <span className="text-text truncate ml-4 text-right max-w-[160px]">
                                        {item.value}
                                    </span>

                                </div>
                            ))
                            }
                        </div>
                    </div>
                </div>

                {/* Right col */}
                <div className="p-5 lg:p-6 flex flex-col gap-5">

                    {/* Tabs mobile */}
                    <div className="flex lg:hidden gap-1 border-b border-border pb-3">
                        {(["reviews", "stats"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs cursor-pointer transition-colors capitalize ${activeTab === tab
                                        ? "bg-bg3 text-text font-medium"
                                        : "text-text3"
                                    }`}
                            >
                                {tab === "reviews" ? "My Reviews" : "Stats"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
