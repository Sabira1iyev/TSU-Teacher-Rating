"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
        titleAccent: "fellow student",
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
        iconBg: "bg-[0f2035]",
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

export default function onBoardingPage() {
        const router = useRouter();
        const [current, setCurrent] = useState(0);

        const isLast = current === slides.length - 1;

        
}