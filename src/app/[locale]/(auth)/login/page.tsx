"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import ResetPasswordModal from "./newLogin/ResetPasswordModal";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const buttons = useTranslations("Buttons");
  const noAccount = useTranslations("noResult");
  const tIndex = useTranslations("Index");
  const sidebar = useTranslations("Sidebar");
  const common = useTranslations("Common");

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
      setError(data.message);
      return;
    }

    setSuccess("Login successful! Redirecting...");

    setUser(data.user);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between px-5 pt-8 pb-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-[#6b7c8d] hover:text-primary transition-colors cursor-pointer font-medium"
        >
          {buttons("backk")}
        </button>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-text3">{noAccount("noAccount")}</span>
          <span
            onClick={() => router.push("/register")}
            className="text-primary font-medium cursor-pointer hover:underline transition-colors"
          >
            {buttons("signup")}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-bg2 rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6 mt-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">{tIndex("welcome")}</h1>
          <p className="text-sm text-text2 mt-1.5">
            {tIndex("sign")}
          </p>
          <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mx-auto mt-3" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 bg-bg2 border border-border rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">TeacherRating</p>
            <p className="text-xs text-text3">{sidebar("tsu")}</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text2">
              {common("emailAddress")}
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name.surname@hum.tsu.edu.ge"
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text2">{common("password")}</label>
              <span
                className="text-xs text-primary cursor-pointer hover:underline transition-colors font-medium"
                onClick={() => setIsResetPasswordModalOpen(true)}
              >
                {common("forgotPassword")}
              </span>
            </div>
            <input
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
              <p className="text-xs text-red font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-[#cfffe5] border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-green font-medium">{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-primary rounded-xl text-sm font-semibold text-white hover:bg-[#004d8a] transition-colors cursor-pointer shadow-[0_2px_12px_rgba(0,96,169,0.25)]"
          >
            {buttons("sigin")}
          </button>
        </div>
      </div>

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
