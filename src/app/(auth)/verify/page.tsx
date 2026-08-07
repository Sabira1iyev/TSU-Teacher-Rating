"use client";

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"


export default function VerifyPage() {

    const router = useRouter();
    const { user } = useUser();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);


    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {

        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d*$/.test(pasted)) return;

        const newCode = [...code];
        pasted.split("").forEach((char, i) => {
            newCode[i] = char;
        });
        setCode(newCode);
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    }

    const handleSubmit = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }

        if (!user?.email) {
            setError("Email address is missing. Please register again.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, code: fullCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Verification failed.");
                setLoading(false);
                return;
            }

            // Success
            router.push("/dashboard");
        } catch (err) {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    }

    const handleResend = () => {
        setCode(["", "", "", "", "", ""]);
        setError("");
        inputs.current[0]?.focus();
    }

    const isComplete = code.every((d) => d !== "");

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-md flex items-center px-5 pt-8 pb-4">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-[#6b7c8d] hover:text-primary transition-colors cursor-pointer font-medium"
                >← Back</button>
            </div>

            {/* Main card */}
            <div className="w-full max-w-md bg-bg2 rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6">

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-dim flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0060a9" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div className="w-8 h-[1px] bg-[#d8dfe6]" />
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div className="w-8 h-[1px] bg-[#d8dfe6]" />
                    <div className="w-6 h-6 rounded-full bg-[#e4eaf0] flex items-center justify-center">
                        <span className="text-xs text-text3">3</span>
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary-dim flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0060a9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text">Verify your email</h1>
                    <p className="text-sm text-text2 mt-2">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-sm text-primary font-medium mt-1">
                        {user?.email || "your email address"}
                    </p>
                    <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mx-auto mt-3" />
                </div>

                {/* Code inputs */}
                <div className="flex gap-2 justify-center">
                    {code.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputs.current[i] = el; }}
                            type="text"
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border outline-none transition-all duration-200 bg-bg3 text-text2
                                ${digit
                                    ? "border-[#0060a9] bg-primary-dim"
                                    : "border-border2 focus:border-[#0060a9]"
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
                        <p className="text-xs text-red text-center font-medium">{error}</p>
                    </div>
                )}


                <button
                    onClick={handleSubmit}
                    disabled={!isComplete || loading}
                    className={`
                    w-full py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer
                    ${isComplete && !loading
                            ? "bg-primary text-white hover:bg-[#004d8a] shadow-[0_2px_12px_rgba(0,96,169,0.25)]"
                            : "bg-[#e4eaf0] text-text3 cursor-not-allowed"
                        }
                    `}
                >
                    {loading ? "Verifying..." : "Verify and continue →"}
                </button>

                {/* Resend*/}
                <div className="text-center">
                    <p className="text-xs text-text3">
                        Didn't receive the code? {" "}
                        <span
                            onClick={handleResend}
                            className="text-primary cursor-pointer hover:underline transition-colors font-medium">
                            Resend code
                        </span>
                    </p>
                    <p className="text-xs text-text3 mt-2">
                        Check your spam folder · Code valid for 10 minutes
                    </p>
                </div>
            </div>
        </div>
    )
}