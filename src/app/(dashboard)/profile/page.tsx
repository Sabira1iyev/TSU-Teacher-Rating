"use client";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Rainbow,
  ShieldAlert,
  Sprout,
  Clock,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import EditProfileModal from "./components/EditProfileModal";
import { FACULTY_COLORS, DEFAULT_FACULTY_COLOR } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

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

const NumberedMedal = ({
  className,
  num,
}: {
  className?: string;
  num: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2" />
    <path d="m13 12 5.88-10" />
    <circle cx="12" cy="15" r="5" />
    <text
      x="12"
      y="15.2"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="8.5"
      fontWeight="900"
      fill="currentColor"
      stroke="none"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {num}
    </text>
  </svg>
);

const getRankIcon = (rank: number | string) => {
  const numRank = Number(rank);
  if (numRank === 1) {
    return (
      <Trophy className="w-5 h-5 text-amber-400 drop-shadow-md animate-bounce" />
    );
  }
  if (numRank === 2) {
    return (
      <NumberedMedal
        className="w-5 h-5 text-slate-300 drop-shadow-md animate-pulse"
        num={2}
      />
    );
  }
  if (numRank === 3) {
    return (
      <NumberedMedal
        className="w-5 h-5 text-amber-700 drop-shadow-md animate-pulse"
        num={3}
      />
    );
  }
  if (numRank <= 10) {
    return <Award className="w-5 h-5 text-blue-500" />;
  }
  return <TrendingUp className="w-5 h-5 text-text3" />;
};

const getRankDetails = (likes: number) => {
  if (likes < 3) {
    return {
      current: "Rookie",
      next: "Protector",
      remaining: 3 - likes,
    };
  } else if (likes < 7) {
    return {
      current: "Protector",
      next: "Legend",
      remaining: 7 - likes,
    };
  } else {
    return {
      current: "Legend",
      next: null,
      remaining: 0,
    };
  }
};

const getMemberDuration = (createdAt: string | undefined) => {
  if (!createdAt) return "1 day";

  const regDate = new Date(createdAt);
  const now = new Date();

  if (isNaN(regDate.getDate())) return "1day";

  const diffMs = now.getTime() - regDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "1 day";

  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? "year" : "years"}`;
};

const getFormattedRegistrationDate = (createdAt: string | undefined) => {
  if (!createdAt) return "Since 2026";

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "since 2026";

  return `since ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
};

const getRankDisplayIcon = (currentRank: string) => {
  if (currentRank === "Rookie") {
    return <Sprout className="w-4 h-4 text-amber-400 animate-pulse" />;
  }
  if (currentRank === "Protector") {
    return (
      <ShieldAlert className="w-4 h-4 text-sky-400 drop-shadow-sm animate-pulse" />
    );
  }
  if (currentRank === "Legend") {
    return <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />;
  }
};

const getCurrentSemester = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month >= 8 || month === 0) {
    const semesterYear = month === 0 ? year - 1 : year;
    return `Fall ${semesterYear}`;
  } else {
    return `Spring ${year}`;
  }
};

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reviews" | "stats">("reviews");
  const [reviewsHistory, setReviewsHistory] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRatingGiven: 0,
    totalLikesReceived: 0,
    facultyRank: 0,
  });

  useEffect(() => {
    if (user?.userId) {
      fetch(`/api/stats?userId=${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setStats({
            totalReviews: data.totalReviews,
            averageRatingGiven: data.averageRatingGiven,
            totalLikesReceived: data.totalLikesReceived,
            facultyRank: data.facultyRank,
          });
        })
        .catch((error) => {
          console.log("Stats fetch error:", error);
        });
    }
    fetch(`/api/user/reviews?userId=${user?.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviewsHistory(data.reviews || []);
      });
  }, [user?.userId]);

  const rankInfo = getRankDetails(stats?.totalLikesReceived);

  const fc = user?.faculty
    ? FACULTY_COLORS[user.faculty] || DEFAULT_FACULTY_COLOR
    : DEFAULT_FACULTY_COLOR;

  return (
    <div className="flex flex-col pt-20 bg-[#f0f2f0]">
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
          onClick={() => setIsEditModalOpen(true)}
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
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit profile
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Left col */}
        <div className="lg:border-r border-border p-5 lg:p-6 flex flex-col gap-4">
          {/* Profile card */}
          <div
            className="bg-bg2 border border-border rounded-2xl p-5 text-center"
            style={{
              border: `1px solid ${fc.light}`,
              background: `linear-gradient(125deg, ${fc.light} 50%, transparent 120%)`,
            }}
          >
            <div
              className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full flex items-center justify-center text-xl lg:text-2xl font-semibold mt-6 mx-auto mb-3 border-2 border-border2"
              style={{
                background: `linear-gradient(135deg, ${fc.light} 50%, #fdf6e3 100%)`,
                border: `2px solid ${fc.mid}`,
                color: fc.primary,
              }}
            >
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
            <p
              className="text-xs mt-0.5"
              style={{
                color: fc.primary,
              }}
            >
              {user?.faculty
                ? user.faculty.replace("Faculty of ", "")
                : "Faculty"}{" "}
              · {user?.studyYear}rd year
            </p>

            <div className="h-[0.5px] bg-border my-4" />
            <div className="flex justify-around">
              <div className="text-center">
                <p
                  className="text-lg font-semibold"
                  style={{
                    color: fc.primary,
                  }}
                >
                  {stats.totalReviews}
                </p>
                <p className="text-[9px] text-text3 mt-0.5">Reviews</p>
              </div>

              <div className="text-center">
                <p
                  className="text-lg font-semibold"
                  style={{
                    color: fc.primary,
                  }}
                >
                  {stats.averageRatingGiven}
                </p>
                <p className="text-[9px] text-text3 mt-0.5">Avg given</p>
              </div>

              <div className="text-center">
                <p
                  className="text-lg font-semibold text-text"
                  style={{
                    color: fc.primary,
                  }}
                >
                  {stats.totalLikesReceived}
                </p>
                <p className="text-[9px] text-text3 mt-0.5">Likes</p>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Current Semester",
                value: (
                  <div className="flex items-center gap-1.5">
                    <Rainbow className="w-4 h-4 text-primary animate-pulse" />
                    <span>{getCurrentSemester()}</span>
                  </div>
                ),
                sub: "active period",
                green: true,
              },
              {
                label: "Title",
                value: (
                  <div className="flex items-center gap-1.5">
                    {getRankDisplayIcon(rankInfo.current)}
                    <span>{rankInfo.current}</span>
                  </div>
                ),
                sub: rankInfo.next
                  ? `${rankInfo.remaining} likes to ${rankInfo.next}`
                  : "You are a Legend!",
              },
              {
                label: "Faculty Rank",
                value: (
                  <div className="flex items-center gap-2">
                    {getRankIcon(stats.facultyRank)}
                    <span>#{stats.facultyRank}</span>
                  </div>
                ),
                sub: "by likes",
              },
              {
                label: "Member for",
                value: (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary animate-pulse" />
                    {getMemberDuration(user?.createdAt || MOCK_USER.createdAt)}
                  </div>
                ),
                sub: getFormattedRegistrationDate(
                  user?.createdAt || MOCK_USER.createdAt,
                ),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-bg2 border rounded-xl p-3"
                style={{
                  border: `1px solid ${fc.light}`,
                  background: `linear-gradient(15deg, ${fc.primary} 0%, transparent 100%)`,
                }}
              >
                <p className="text-[9px] text-white mb-1">{item.label}</p>
                <p
                  className={`text-lg font-semibold`}
                  style={{
                    color: "white",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Account info */}
          <div
            className="bg-bg2 border border-border rounded-xl p-4"
            style={{
              border: `1px solid ${fc.light}`,
              background: `linear-gradient(125deg, ${fc.light} 80%, transparent  100%)`,
            }}
          >
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
                  <span
                    className="text-text truncate ml-4 text-right max-w-[160px]"
                    style={
                      item.label === "Faculty" ? { color: fc.primary } : {}
                    }
                  >
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
                  const count = reviewsHistory.filter(
                    (r) => Math.round(r.OverallRating) === star,
                  ).length;
                  const percent = reviewsHistory.length
                    ? Math.round((count / reviewsHistory.length) * 100)
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
            </div>
          </div>

          {/* Review history */}
          <div className={activeTab === "stats" ? "hidden lg:block" : ""}>
            <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
              Review history
            </p>
            <div className="flex flex-col gap-3">
              {reviewsHistory?.map((review) => {
                const colors = getAvatarColor(review.ProfessorId);
                const reviewFc =
                  FACULTY_COLORS[review.professorFaculty] ||
                  DEFAULT_FACULTY_COLOR;
                return (
                  <div
                    key={review.ReviewId}
                    onClick={() =>
                      router.push(`/professor/${review.ProfessorId}`)
                    }
                    className="bg-bg2 border border-border rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-bg3 transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {getInitials(
                        review.professorFirstName,
                        review.professorLastName,
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">
                        {review.professorTitle} {review.professorFirstName}{" "}
                        {review.professorLastName}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: reviewFc.primary }}
                      >
                        {review.CourseName}
                      </p>
                      <p className="text-xs text-text2 mt-1.5 leading-relaxed line-clamp-2">
                        {review.Comment}
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
                                  star <= review.OverallRating
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

      {/* edit profile modal */}

      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}
