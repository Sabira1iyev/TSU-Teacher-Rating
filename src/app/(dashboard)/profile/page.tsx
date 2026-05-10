"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { mockReviews } from "@/data/mockReviews";
import { useUser } from "@/context/UserContext";
import { FACULTY_COLORS, DEFAULT_FACULTY_COLOR } from "@/lib/constants";
import { formatRating, getInitials } from "@/lib/utils";
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
  { bg: "#2a1e08", text: "#f59e0b" },
  { bg: "#0c1a2e", text: "#3b82f6" },
  { bg: "#1e1030", text: "#9d5fe8" },
  { bg: "#0a1f1a", text: "#0060a9" },
  { bg: "#2a1e08", text: "#f59e0b" },
];

const getAvatarColor = (id: string) => {
  return AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];
};

export default function ProfilePage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reviews" | "stats">("reviews");
  const professor = getProfessorById(params.ID as string);
  const userReviews = mockReviews.slice(0, 5);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRatingGiven: 0,
  });

  useEffect(() => {
    if (user?.userId) {
      fetch(`/api/stats?userId=${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setStats({
            totalReviews: data.totalReviews,
            averageRatingGiven: data.averageRatingGiven,
          });
        })
        .catch((error) => {
          console.log("Stats fetch error:", error);
        });
    }
  }, [user?.userId]);

  const fc = professor
    ? FACULTY_COLORS[professor.faculty] || DEFAULT_FACULTY_COLOR
    : DEFAULT_FACULTY_COLOR;

  const contributions = [
    { label: "Computer Science", count: 14, percent: 78, color: fc.primary },
    { label: "Mathematics", count: 3, percent: 16, color: fc.primary },
    { label: "Physics", count: 6, percent: 12, color: fc.primary },
    { label: "Mathematics", count: 9, percent: 9, color: fc.primary },
  ];

  return (
    <div className="flex flex-col pt-20">
      {/* Desktop topbar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-border bg-bg2 sticky top-[57px] z-10">
        <h1
          className="font-bold text-[16px] text-text"
          style={{
            fontFamily: "Syne, sans-serif",
          }}
        >
          My Profile
        </h1>
        <button
          className="px-4 py-2 border border-border2 rounded-lg text-xs text-text2 font-bold hover:bg-bg3 transition-colors cursor-pointer"
          style={{
            background: `${fc.primary}`,
            color: "white",
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* Mobile topbar */}
      <div className="flex lg:hidden items-center justify-between px-5 py-3 border-b border-border bg-bg2 sticky top-[49px] z-10">
        <span className="text-sm font-bold text-text">My Profile</span>
        <button
          className="px-4 py-2 border border-border2 rounded-lg text-xs text-primary font-bold cursor-pointer"
          style={{
            background: `${fc.primary}`,
            color: "white",
          }}
        >
          Edit profile
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Left col */}
        <div className="lg:border-r border-border p-5 lg:p-6 flex flex-col gap-4">
          {/* Profile card */}
          <div className="bg-bg2 border border-border rounded-2xl p-5 text-center">
            <div className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-blue-dim flex items-center justify-center text-xl lg:text-2xl text-blue font-semibold mt-6 mx-auto mb-3 border-2 border-border2">
              {getInitials(
                user?.firstName || MOCK_USER.firstName,
                user?.lastName || MOCK_USER.lastName,
              )}
            </div>
            <h2
              className="font-bold text-base lg:text-lg text-text"
              style={{
                fontFamily: "Syne, sans-serif",
              }}
            >
              {user?.firstName || "FirstName"} {user?.lastName || "LastName"}
            </h2>
            <p className="text-xs text-primary mt-1">
              {user?.email || "Email is loading..."}
            </p>
            <p className="text-xs text-text3 mt-0.5">
              {user?.faculty
                ? user.faculty.replace("Faculty of ", "")
                : "Faculty"}{" "}
              · {user?.studyYear}rd year
            </p>

            <div className="h-[0.5px] bg-border my-4" />
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary">
                  {stats.totalReviews}
                </p>
                <p className="text-[9px] text-text3 mt-0.5">Reviews</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-text">
                  {stats.averageRatingGiven}
                </p>
                <p className="text-[9px] text-text3 mt-0.5">Avg given</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-text">
                  {MOCK_USER.totalLikesReceived}
                </p>
                <p className="text-[9px] text-text3 mt-0.5">Likes</p>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "This semester",
                value: "4",
                sub: "reviews written",
                green: true,
              },
              { label: "Remaining", value: "3", sub: "this semester" },
              { label: "Ranking", value: "#42", sub: "most active" },
              { label: "Member for", value: "2 yrs", sub: "since 2025" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-bg2 border border-border rounded-xl p-3"
              >
                <p className="text-[9px] text-text3 mb-1">{item.label}</p>
                <p
                  className={`text-lg font-semibold 
                                    ${item.green ? "text-primary" : "text-text1"}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Account info */}
          <div className="bg-bg2 border border-border rounded-xl p-4">
            <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
              Account
            </p>
            <div className="flex flex-col">
              {[
                { label: "Email", value: user?.email },
                { label: "Faculty", value: user?.faculty },
                { label: "Year", value: `${user?.studyYear}rd year` },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  className={`flex justify-between py-2 text-[11px] ${
                    i < arr.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-text3">{item.label}</span>
                  <span className="text-text truncate ml-4 text-right max-w-[160px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="p-5 lg:p-6 flex flex-col gap-5">
          {/* Tabs mobile */}
          <div className="flex lg:hidden gap-1 pb-3">
            {(["reviews", "stats"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs cursor-pointer transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-bg3 text-text font-medium"
                    : "text-text3"
                }`}
              >
                {tab === "reviews" ? "My Reviews" : "Stats"}
              </button>
            ))}
          </div>

          {/* Stat on mobile */}
          <div className={activeTab === "reviews" ? "hidden lg:block" : ""}>
            <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
              Rating distribution
            </p>
            <div className="bg-bg2 border border-border rounded-xl p-4">
              <div className="flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = userReviews.filter(
                    (r) => Math.round(r.overallRating) === star,
                  ).length;
                  const percent = userReviews.length
                    ? Math.round((count / userReviews.length) * 100)
                    : 0;
                  return (
                    <div
                      key={star}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <span className="text-text3 w-11">{star} stars</span>
                      <div className="flex-1 h-[4px] bg-bg4 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percent}%`,
                            background:
                              star >= 3
                                ? "#0060a9"
                                : star > 1
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        />
                      </div>
                      <span className="text-text2 w-8 text-right">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="h-[0.5px] bg-border my-4" />
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary">
                    {formatRating(MOCK_USER.averageRatingGiven)}
                  </p>
                  <p className="text-[9px] text-text3 mt-3">Avg rating given</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-text">
                    {userReviews.length}
                  </p>
                  <p className="text-[9px] text-text3 mt-1">Total reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-text">
                    {MOCK_USER.totalLikesReceived}
                  </p>
                  <p className="text-[9px] text-text3 mt-1">Likes received</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review history */}
          <div className={activeTab === "stats" ? "hidden lg:block" : ""}>
            <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
              Review history
            </p>
            <div className="flex flex-col gap-3">
              {userReviews.map((review) => {
                const professor = getProfessorById(review.professorId);
                if (!professor) return null;
                const colors = getAvatarColor(professor.id);
                const reviewFc =
                  FACULTY_COLORS[professor.faculty] || DEFAULT_FACULTY_COLOR;
                return (
                  <div
                    key={review.id}
                    onClick={() => router.push(`/professor/${professor.id}`)}
                    className="bg-bg2 border border-border rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-bg3 transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {getInitials(professor.firstName, professor.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">
                        {professor.title} {professor.firstName}{" "}
                        {professor.lastName}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: reviewFc.primary }}
                      >
                        {review.courseName}
                      </p>
                      <p className="text-xs text-text2 mt-1.5 leading-relaxed line-clamp-2">
                        {review.comment}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-text3">
                          {review.displayDate}
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className="w-[8px] h-[8px]"
                              style={{
                                clipPath:
                                  "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                                background:
                                  star <= review.overallRating
                                    ? reviewFc.primary
                                    : reviewFc.mid,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
