"use client";

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"


export default function VerifyPage() {

    const router = useRouter();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
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
        if(!/^\d*$/.test(pasted))return;

        const newCode = [...code];
        pasted.split("").forEach((char, i) => {
            newCode[i] = char;
        });
        setCode(newCode);
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    }

    const handleSubmit = () => {
        const fullCode = code.join("");
        if(fullCode.length < 6){
            setError("Please enter the full 6-digit code.");
            return;
        }
        setError("");
        router.push("/dashboard");
    }

    const handleResend = () =>{
        setCode(["", "", "", "", "", ""]);
        setError("");
        inputs.current[0]?.focus();
    }

    const isComplete = code.every((d) => d !== ""); 

    return (

        <div className="min-h-screen bg-bg flex flex-col">

            <div className="flex items-center px-5 pt-8 pb-4">
                <button
                    onClick={() => router.back()}
                    className="text-text3 hover:text-text2 transition-colors cursor-pointer"
                >← Back</button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col px-6 pb-8 gap-6">

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-dim flex items-center justify-center ">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div className="w-8 h-[1px] bg-border2" />
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-bg">2</span>
                    </div>
                    <div className="w-8 h-[1px] bg-border2" />
                    <div className="w-6 h-6 rounded-full bg-bg4 flex items-center justify-center">
                        <span className="text-xs text-text3">3</span>
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary-dim flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text">Verify your email</h1>
                    <p className="text-sm text-text3 mt-2">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-sm text-primary font-medium mt-1">
                        name.surname123@hum.tsu.edu.ge
                    </p>
                </div>

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
                            className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border outline-none transition-all duration-200 bg-bg3 text-text
                                ${digit
                                    ? "border-primary bg-primary-dim"
                                    : "border-boder2 focus:border-primary"
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red/10 border border-red/20 rounded-xl px-4 py-3">
                        <p className="text-xs text-red text-center">{error}</p>
                    </div>
                )}


                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className={`
                    w-full py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer
                    ${isComplete
                            ? "bg-primary text-lg hover:opacity-90"
                            : "bg-bg3 text-text3 cursor-not-allowed"
                        }
                    `}
                >
                    Verify and continue →
                </button>

                {/* Resend*/}
                <div className="text-center">
                    <p className="text-xs text-text3">
                        Didn't receive the code? {" "}
                        <span
                            onClick={handleResend}
                            className="text-primary cursor-pointer hover:opacity-80 transition-opacity">
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