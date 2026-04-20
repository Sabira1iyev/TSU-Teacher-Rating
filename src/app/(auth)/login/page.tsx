"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        setSuccess("");

        if (!formData.email.endsWith("@hum.tsu.edu.ge") && !formData.email.endsWith("@ens.tsu.edu.ge")) {
            setError("Please use your TSU email address.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setError("");
        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    }


    return (
        <div className="min-h-screen bg-bg flex flex-col px-4">

            {/*header*/}
            <div className="flex items-center justify-between px-5 pt-8 pb-4">
                <button
                    onClick={() => router.back()}
                    className="text-text3 hover:text-text2 transition-colors cursor-pointer"
                >
                    ← Back
                </button>
                <span
                    className="text-sm text-text3"
                >
                    No account?{" "}
                    <span
                        onClick={() => router.push("/register")}
                        className="text-primary cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        Sign Up
                    </span>
                </span>
            </div>

            {/* Content */}

            <div className="flex-1 flex flex-col px-6 pb-8 gap-6 mt-20">

                {/* Title */}
                <div>
                    <h1 className="text-3xl font-bold text-text text-center">
                        Welcome back
                    </h1>
                    <p className="text-sm text-text3 mt-2 text-center">
                        Sign in with your TSU email
                    </p>
                </div>

                {/* Logo */}

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-dim border-primary-mid flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-text">TeacherRating</p>
                    <p className="text-xs text-text3">Tbilisi State University</p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">

                    {/* Email */}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-text2">TSU email address</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.name123@tsu.edu.ge"
                            className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outlone-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Password */}

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-text2">Password</label>
                            <span className="text-xs text-primary cursor-pointer hover:opacity-80 transition-opacity">Forgot password?</span>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Error */}

                    {error && (
                        <div className="bg-red/10 border border-red/20 rounded-xl px-4 py-3">
                            <p className="text-xs text-red">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                            <p className="text-xs text-primary">{success}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-primary rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer mt-2"
                    >
                        Sign in →
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-[0.5px] bg-border2" />
                        <span className="text-xs text-text3">or</span>
                        <div className="flex-1 h-[0.5px] bg-border2"></div>
                    </div>

                    {/* SSO */}
                    <button className="w-full py-4 border border-border2 rounded-xl text-sm text-text2 hover:bg-bg2 transition-colors cursor-pointer flex items-center justify-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M8 14l2 2 4-4" />
                        </svg>
                        Sign in with TSU SSO
                    </button>
                </div>

            </div>
        </div>

    )

}


