"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FACULTIES } from "@/lib/constants";
import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();

  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    faculty: "",
    studyYear: "",
  });

  const { setUser } = useUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const buttons = useTranslations("Buttons");
  const noAccount = useTranslations("noResult");
  const tIndex = useTranslations("Index");
  const sidebar = useTranslations("Sidebar");
  const common = useTranslations("Common");
  const inputs = useTranslations("Inputs");
  const facultyYear = useTranslations("facultyYear");
  const faculties = useTranslations("Faculties");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSuccess("");
    if (!formdata.firstName || !formdata.lastName) {
      setError("Please enter your full name");
      return;
    }
    if (
      !formdata.email.endsWith("@hum.tsu.edu.ge") &&
      !formdata.email.endsWith("@ens.tsu.edu.ge")
    ) {
      setError(
        "Please use your TSU email addres(@hum.tsu.edu.ge or @ens.tsu.edu.ge).",
      );
      return;
    }
    if (formdata.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!formdata.faculty) {
      setError("Please select your faculty");
      return;
    }
    if (!formdata.studyYear) {
      setError("Please enter your study year");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setUser({
        firstName: formdata.firstName,
        lastName: formdata.lastName,
        email: formdata.email,
        faculty: formdata.faculty,
        studyYear: formdata.studyYear,
        userId: data.userId,
        createdAt: data.createdAt,
        isAdmin: false,
      });

      setSuccess("Registration successful! Redirecting to verification...");

      setTimeout(() => {
        router.push("/verify");
      }, 1500);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <span className="text-text3">{noAccount("already")}</span>
          <span
            onClick={() => router.push("/login")}
            className="text-primary font-medium cursor-pointer hover:underline transition-colors"
          >
            {buttons("sigin")}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-bg2 rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-text">{tIndex("create")}</h1>
          <p className="text-sm text-text2 mt-1.5">
            {tIndex("signup")}
          </p>
          <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mt-3" />
        </div>

        {/* TSU email notice */}
        <div className="flex items-center gap-3 bg-bg2 border border-border rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">
              {sidebar("required")}
            </p>
            <p className="text-xs text-text2 mt-0.5">
              {sidebar("only")}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* First name and last name */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text2">
                {inputs("firstname")}
              </label>
              <input
                name="frstName"
                value={formdata.firstName}
                onChange={handleChange}
                placeholder={inputs("firstname")}
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-xs font-medium text-text2"
              >
                {inputs("lastname")}
              </label>
              <input
                name="lastName"
                value={formdata.lastName}
                onChange={handleChange}
                placeholder={inputs("lastname")}
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-text2"
            >
              {inputs("email")}
            </label>
            <input
              name="email"
              value={formdata.email}
              onChange={handleChange}
              placeholder="name.surname@hum.tsu.edu.ge"
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
            <p className="text-xs text-text3 px-1">
              {inputs("verification")}
            </p>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-text2"
            >
              {inputs("password")}
            </label>
            <input
              name="password"
              type="password"
              value={formdata.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
          </div>

          {/* Faculty */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text2">
              {inputs("faculty")}
            </label>
            <select
              name="faculty"
              value={formdata.faculty}
              onChange={handleChange}
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
            >
              <option value="" disabled>
                {inputs("select")}
              </option>
              {FACULTIES.filter((f) => f !== "All").map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculties(faculty)}
                </option>
              ))}
            </select>
            <p className="text-xs text-primary pt-0.5 font-medium">
              {inputs("facultyDesc")}
            </p>
          </div>

          {/* Study year */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text2">
              {inputs("studyYear")}
            </label>
            <select
              name="studyYear"
              value={formdata.studyYear}
              onChange={handleChange}
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
            >
              <option value="" disabled>
                {inputs("selectYear")}
              </option>
              <option value="1">{facultyYear("1")}</option>
              <option value="2">{facultyYear("2")}</option>
              <option value="3">{facultyYear("3")}</option>
              <option value="4">{facultyYear("4")}</option>
              <option value="5">{facultyYear("5")}</option>
              <option value="5+">{facultyYear("5+")}</option>
              <option value="graduate">{facultyYear("graduate")}</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
            <p className="text-xs text-red font-medium">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-[#cfffe5] border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-green font-medium">{success}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 bg-primary rounded-xl text-sm font-semibold text-white hover:bg-[#004d8a] transition-colors cursor-pointer shadow-[0_2px_12px_rgba(0,96,169,0.25)]
                        ${loading
              ? "bg-primary/50 text-bg cursor-not-allowed"
              : "bg-primary text-bg hover:opacity-90"
            }`}
        >
          {loading ? buttons("creatingAccount") : buttons("verificationCode")}
        </button>
      </div>
    </div>
  );
}
