"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {

    const router = useRouter();
    const { setUser } = useUser();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        setSuccess("Login successful! Redirecting...");
        
        setUser(data.user);

        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    }


    return (
        <div className="min-h-screen bg-[#f2f5f7] flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-md flex items-center justify-between px-5 pt-8 pb-4">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-[#6b7c8d] hover:text-[#0060a9] transition-colors cursor-pointer font-medium"
                >
                    ← Back
                </button>
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-[#8a97a4]">
                        No account?
                    </span>
                    <span
                        onClick={() => router.push("/register")}
                        className="text-[#0060a9] font-medium cursor-pointer hover:underline transition-colors"
                    >
                        Sign Up
                    </span>
                </div>
            </div>

            {/* Main card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6 mt-8">

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#1a2a3a]">
                        Welcome back
                    </h1>
                    <p className="text-sm text-[#5a6a7a] mt-1.5">
                        Sign in with your TSU email
                    </p>
                    <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mx-auto mt-3" />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 bg-[#f8fafb] border border-[#e4eaf0] rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0060a9] flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[#1a2a3a]">TeacherRating</p>
                        <p className="text-xs text-[#8a97a4]">Tbilisi State University</p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-[#5a6a7a]">TSU email address</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name.surname@hum.tsu.edu.ge"
                            className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-[#5a6a7a]">Password</label>
                            <span className="text-xs text-[#0060a9] cursor-pointer hover:underline transition-colors font-medium">Forgot password?</span>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
                            <p className="text-xs text-[#dc2626] font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
                            <p className="text-xs text-[#16a34a] font-medium">{success}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-[#0060a9] rounded-xl text-sm font-semibold text-white hover:bg-[#004d8a] transition-colors cursor-pointer shadow-[0_2px_12px_rgba(0,96,169,0.25)]"
                    >
                        Sign in →
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-[0.5px] bg-[#d8dfe6]" />
                        <span className="text-xs text-[#8a97a4]">or</span>
                        <div className="flex-1 h-[0.5px] bg-[#d8dfe6]"></div>
                    </div>

                    {/* SSO */}
                    <button className="w-full py-4 border border-[#d8dfe6] rounded-xl text-sm text-[#5a6a7a] hover:bg-[#f0f4f7] transition-colors cursor-pointer flex items-center justify-center gap-2 font-medium">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0060a9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M8 14l2 2 4-4" />
                        </svg>
                        Sign in with TSU SSO
                    </button>
                </div>
            </div>
        </div>
    );
}
