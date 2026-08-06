"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import SetNewPassword from "./SetNewPassword";

export default function ResetPasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isComplete = verifyCode.every((digit) => digit !== "");

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeVerifyCode = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verifyCode];
    newCode[index] = value.slice(-1);
    setVerifyCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d*$/.test(pasted)) return;

    const newCode = [...verifyCode];
    pasted.split("").forEach((char, i) => {
      newCode[i] = char;
    });
    setVerifyCode(newCode);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSent = async () => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setStep(2);
        setSuccess(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verify-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          verifyCode: verifyCode.join(""),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        setStep(3);
      }
    } catch (err) {
      console.log("Connection error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-modal bg-bg2 border border-border w-[90%] max-w-md p-6 rounded-3xl shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          {step === 1 && (
            <h2 className="text-xl font-bold text-text">
              Email will be sent this email
            </h2>
          )}
          {step === 2 && (
            <h2 className="text-xl font-bold text-text">
              Enter verification code
            </h2>
          )}

          <button
            onClick={onClose}
            className="text-text3 hover:text-text cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {step === 1 && (
          <>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#5a6a7a]"
              >
                Email
              </label>
              <input
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="TSU Student Email"
                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-[#dc2626] font-medium">{error}</p>
            )}
            {success && (
              <p className="text-xs text-[#26dc26] font-medium">{success}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text2 hover:bg-bg3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
                onClick={handleSent}
              >
                Sent Code
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col items-center">
              {/* Main card */}
              <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6">
                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#e8f1fa] flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0060a9"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="w-8 h-[1px] bg-[#d8dfe6]" />
                  <div className="w-6 h-6 rounded-full bg-[#0060a9] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <div className="w-8 h-[1px] bg-[#d8dfe6]" />
                  <div className="w-6 h-6 rounded-full bg-[#e4eaf0] flex items-center justify-center">
                    <span className="text-xs text-[#8a97a4]">3</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#e8f1fa] flex items-center justify-center">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0060a9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-[#1a2a3a]">
                    Verify your email
                  </h1>
                  <p className="text-sm text-[#5a6a7a] mt-2">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm text-[#0060a9] font-medium mt-1">
                    {user?.email || "your email address"}
                  </p>
                  <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mx-auto mt-3" />
                </div>

                {/* Code inputs */}
                <div className="flex gap-2 justify-center">
                  {verifyCode.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputs.current[i] = el;
                      }}
                      type="text"
                      value={digit}
                      maxLength={1}
                      onChange={(e) =>
                        handleChangeVerifyCode(i, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border outline-none transition-all duration-200 bg-[#f8fafb] text-[#1a2a3a]
                                ${
                                  digit
                                    ? "border-[#0060a9] bg-[#e8f1fa]"
                                    : "border-[#d8dfe6] focus:border-[#0060a9]"
                                }
                            `}
                    />
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
                    <p className="text-xs text-[#dc2626] text-center font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={!isComplete || loading}
                  className={`
                 w-full py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer
                 ${
                   isComplete && !loading
                     ? "bg-[#0060a9] text-white hover:bg-[#004d8a] shadow-[0_2px_12px_rgba(0,96,169,0.25)]"
                     : "bg-[#e4eaf0] text-[#8a97a4] cursor-not-allowed"
                 }
                 `}
                >
                  {loading ? "Verifying..." : "Verify and continue →"}
                </button>

                {/* Resend*/}
                <div className="text-center">
                  <p className="text-xs text-[#8a97a4]">
                    Didn't receive the code?{" "}
                    <span
                      // onClick={handleResend}
                      className="text-[#0060a9] cursor-pointer hover:underline transition-colors font-medium"
                    >
                      Resend code
                    </span>
                  </p>
                  <p className="text-xs text-[#8a97a4] mt-2">
                    Check your spam folder · Code valid for 10 minutes
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <SetNewPassword onClose={onClose} email={formData.email} />
        )}
      </div>
    </div>
  );
}
