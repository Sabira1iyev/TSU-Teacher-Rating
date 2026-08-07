"use client";
import { useState, useEffect } from "react";
import { FACULTIES } from "@/lib/constants";
import { ACADEMIC_TITLES } from "@/lib/constants";

export default function AddProfessorForm() {
  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    faculty: "",
    department: "",
    title: "",
    courses: [] as string[],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [courseInputValue, setCourseInputValue] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (loading) return;
    setSuccess("");
    if (!formdata.firstName || !formdata.lastName) {
      setError("Enter professor's firstname an lastname!");
      return;
    }
    if (!formdata.email) {
      setError("Please enter professor's email");
      return;
    }
    if (!formdata.email.endsWith("@tsu.ge")) {
      setError("Please enter professor's TSU email correctly!");
      return;
    }
    if (!formdata.faculty) {
      setError("Choose professor's faculty");
      return;
    }
    if (!formdata.department) {
      setError("Choose professor's department");
      return;
    }
    if (formdata.courses.length === 0) {
      setError("At least add one course");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/profForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (res.ok) {
        setSuccess("Professor added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          faculty: "",
          department: "",
          title: "",
          courses: [],
        });
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong!");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center">
      {/* Header */}

      {/* Main card */}
      <div className="w-full max-w-md bg-bg2 rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-text">Add Professor</h1>
          <p className="text-sm text-text2 mt-1.5">
            Enter professor's information to add them to the site
          </p>
          <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mt-3" />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* First name and last name */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text2">
                First Name
              </label>
              <input
                name="firstName"
                value={formdata.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-xs font-medium text-text2"
              >
                Last Name
              </label>
              <input
                name="lastName"
                value={formdata.lastName}
                onChange={handleChange}
                placeholder="Last Name"
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
              Email
            </label>
            <input
              name="email"
              value={formdata.email}
              onChange={handleChange}
              placeholder="name.surname@tsu.ge"
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
            <p className="text-xs text-text3 px-1">
              Enter professor's email adress
            </p>
          </div>

          {/* Faculty */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text2">
              Faculty
            </label>

            <select
              name="faculty"
              value={formdata.faculty}
              onChange={handleChange}
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
            >
              <option value="" disabled>
                Select professor's faculty...
              </option>
              {FACULTIES.filter((f) => f !== "All").map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>

            <p className="text-xs text-primary pt-0.5 font-medium">
              Select the faculty where the instructor serves.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="department"
              className="text-xs font-medium text-text2"
            >
              Department
            </label>
            <input
              name="department"
              value={formdata.department}
              onChange={handleChange}
              placeholder="e.g. Mathematics, Psychology..."
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
            <p className="text-xs text-text3 px-1">
              Enter professor's department
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text2">Title</label>

            <select
              name="title"
              value={formdata.title}
              onChange={handleChange}
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
            >
              <option value="" disabled>
                Select professor's title...
              </option>
              {ACADEMIC_TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            <p className="text-xs text-primary pt-0.5 font-medium">
              Select the instructor's official academic title.
            </p>
          </div>

          {/* Courses */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="courses"
              className="text-xs font-medium text-text2"
            >
              Courses
            </label>
            <input
              name="courses"
              value={courseInputValue}
              onChange={(e) => setCourseInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (courseInputValue.trim() !== "") {
                    setFormData((prev) => ({
                      ...prev,
                      courses: [...prev.courses, courseInputValue.trim()],
                    }));
                    setCourseInputValue("");
                  }
                }
              }}
              placeholder="Analysis, History, Economic, Law..."
              className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
            />
            <div className="flex flex-wrap gap-2">
              {formdata.courses.map((courseItem, index) => (
                <div
                  key={index}
                  className="bg-[#e6f0f9] text-primary px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                >
                  <span>{courseItem}</span>

                  {/* remove button */}

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        courses: prev.courses.filter((_, i) => i !== index),
                      }));
                    }}
                    className="text-primary hover:text-red-500 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-text3 px-1">
              Enter all the courses the professos teaches
            </p>
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
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
            <p className="text-xs text-green font-medium">{success}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 bg-primary rounded-xl text-sm font-semibold text-white hover:bg-[#004d8a] transition-colors cursor-pointer shadow-[0_2px_12px_rgba(0,96,169,0.25)]
                            ${
                              loading
                                ? "bg-primary/50 text-bg cursor-not-allowed"
                                : "bg-primary text-bg hover:opacity-90"
                            }`}
        >
          {loading ? "Saving professor..." : "Save professor"}
        </button>
      </div>
    </div>
  );
}
