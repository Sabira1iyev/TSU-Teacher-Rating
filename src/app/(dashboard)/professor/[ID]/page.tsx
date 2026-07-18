"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Professor } from "@/types/teacher";
import { useUser } from "@/context/UserContext";

import {
  getInitials,
  formatRating,
  getRatingColor,
  getRatingBarColor,
} from "@/lib/utils";
import {
  CRITERIS_LABELS,
  FACULTY_COLORS,
  DEFAULT_FACULTY_COLOR,
} from "@/lib/constants";
import DeleteProfessorModal from "./DeleteProfessorModal";

type Tab = "Overview" | "Reviews" | "Courses";

export default function ProfessorProfilePage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [dislike, setDislike] = useState<Record<string, boolean>>({});

  const handleLike = async (id: string) => {
    if (!user) return;
    const isLiked = !!likedReviews[id];
    setLikedReviews({
      ...likedReviews,
      [id]: !isLiked,
    });
    setProfessor((prev) => {
      if (!prev || !prev.reviews) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id.toString() === id
            ? {
                ...r,
                likeCount: isLiked
                  ? (r.likeCount || 0) - 1
                  : (r.likeCount || 0) + 1,
                dislikeCount:
                  !isLiked && dislike[id]
                    ? (r.dislikeCount || 0) - 1
                    : r.dislikeCount || 0,
              }
            : r,
        ),
      };
    });

    if (!isLiked) {
      setDislike({ ...dislike, [id]: false });
    }
    try {
      await fetch("/api/interact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.userId,
          reviewId: id,
          interactionType: "LIKE",
        }),
      });
    } catch (error) {
      console.log("Error while sending like:", error);
    }
  };

  const handleDislike = async (id: string) => {
    const isDisliked = !!dislike[id];
    setDislike({ ...dislike, [id]: !isDisliked });
    if (!isDisliked) {
      setLikedReviews({ ...likedReviews, [id]: false });
    }
    setProfessor((prev) => {
      if (!prev || !prev.reviews) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id.toString() === id
            ? {
                ...r,
                dislikeCount: isDisliked
                  ? (r.dislikeCount || 0) - 1
                  : (r.dislikeCount || 0) + 1,
                likeCount:
                  !isDisliked && likedReviews[id]
                    ? (r.likeCount || 0) - 1
                    : r.likeCount || 0,
              }
            : r,
        ),
      };
    });

    try {
      await fetch("/api/interact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.userId,
          reviewId: id,
          interactionType: "DISLIKE",
        }),
      });
    } catch (error) {
      console.log("Error while sending dislike", error);
    }
  };

  useEffect(() => {
    fetch(`/api/professors/${params.ID}?userId=${user?.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProfessor(data);
          const initialLikes: Record<string, boolean> = {};
          const initialDislikes: Record<string, boolean> = {};
          (data.reviews || []).forEach((rev: any) => {
            if (rev.userInteraction === "LIKE") {
              initialLikes[rev.id] = true;
            }
            if (rev.userInteraction === "DISLIKE") {
              initialDislikes[rev.id] = true;
            }
          });
          setLikedReviews(initialLikes);
          setDislike(initialDislikes);
        }
        setLoading(false);
      });
  }, [params.ID, user]);

  useEffect(() => {
    fetch(`/api/favorites?userId=${user?.userId}`)
      .then((res) => res.json())
      .then((data) => {
        const isFav = data.some((f: any) => f.id.toString() === params.ID);
        setIsFavorite(isFav);
      });
  }, [params.ID, user]);

  const reviews = professor?.reviews || [];

  // Get faculty-specific color palette
  const fc = professor
    ? FACULTY_COLORS[professor.faculty] || DEFAULT_FACULTY_COLOR
    : DEFAULT_FACULTY_COLOR;

  if (loading) {
    return (
      <div className="p-20 text-center text-lg">
        Professor informations are loading...
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-4xl">🎓</p>
        <h2
          className="text-xl font-bold text-[#1a2a3a]"
          style={{
            fontFamily: "Syne, sans-serif",
          }}
        >
          Professor not found
        </h2>
        <p className="text-sm text-[#8a97a4]">
          This professor does not exist or has been removed
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2.5 bg-[#0060a9] rounded-xl text-sm font-semibold text-white cursor-pointer hover:bg-[#004d8a] transition-colors shadow-[0_2px_12px_rgba(0,96,169,0.25)]"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const ratingBreakDown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (r) => Math.floor(r.overallRating) === star,
    ).length;
    const percent =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return {
      star,
      percent,
    };
  });

  const criteriaEntries = Object.entries(CRITERIS_LABELS) as [
    keyof typeof CRITERIS_LABELS,
    string,
  ][];

  return (
    <div className="flex flex-col">
      {/* Desktop topBar */}
      <div
        className="hidden lg:flex items-center justify-between px-6 py-3 sticky top-[-57px] z-10"
        style={{
          background: `linear-gradient(135deg, ${fc.light} 0%, transparent 100%)`,
        }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#5a6a7a] hover:text-[#1a2a3a] transition-colors cursor-pointer"
        >
          ← Back
        </button>

        <button
          onClick={() => router.push(`/rate?professorId=${professor.id}`)}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
          style={{
            backgroundColor: fc.primary,
            boxShadow: `0 2px 8px ${fc.mid}`,
          }}
        >
          Rate this professor →
        </button>
      </div>

      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${fc.light} 0%, transparent 50%, rgba(212,160,23,0.03) 100%)`,
          borderBottom: "1px solid #e4eaf0",
        }}
      >
        {/* Subtle glow orbs */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${fc.primary} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${fc.primary} 0%, transparent 70%)`,
          }}
        />

        <div className="relative p-5 lg:p-6">
          {/* Avatar + Info */}
          <div className="flex items-start gap-4 lg:gap-5">
            {/* Avatar with glow ring */}
            <div className="relative flex-shrink-0">
              <div
                className="absolute  inset-3 rounded-full opacity-40 blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${fc.primary}, ${fc.primary})`,
                }}
              />
              <div
                className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${fc.light} 0%, #fdf6e3 100%)`,
                  border: `2px solid ${fc.mid}`,
                  color: fc.primary,
                }}
              >
                {getInitials(professor.firstName, professor.lastName)}
              </div>
            </div>

            {/* Name & details */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-text3 mb-1">
                {professor.title}
              </p>
              <h1
                className="text-xl lg:text-[28px] font-bold text-text leading-tight tracking-tight"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {professor.firstName} {professor.lastName}
              </h1>
              <div className="flex flex-wrap w-full lg:flex-row items-center gap-x-2 gap-y-1.5 mt-2">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: fc.primary }}
                >
                  {professor.faculty}
                </span>
                <span className="w-1 h-1 rounded-full bg-text3" />
                <span className="text-[11px] text-text3">
                  Tbilisi State University
                </span>

                {/* favorite & delete buttons */}
                <div className="flex flex-col lg:flex-row w-full lg:w-auto items-center justify-center gap-2 mt-2 lg:mt-0 lg:ml-2">
                  <button
                    onClick={async () => {
                      setIsFavorite(!isFavorite);
                      try {
                        await fetch("/api/favorites", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: user?.userId,
                            professorId: params.ID,
                          }),
                        });
                      } catch (error) {
                        console.log(error);
                        setIsFavorite(isFavorite);
                      }
                    }}
                    className={`flex justify-center items-center px-3 lg:py-1.5 py-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer hover:opacity-90 active:scale-95 w-full
                  lg:w-auto lg:ml-2`}
                    style={{
                      backgroundColor: fc.primary,
                      boxShadow: `0 4px 16px ${fc.mid}60%`,
                    }}
                  >
                    <div className="flex justify-center items-center gap-1 text-[11px] text-white">
                      {isFavorite ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                        </svg>
                      )}
                      {isFavorite ? "Added to Favorites" : "Add to Favorites"}
                    </div>
                  </button>

                  {/* delete professor button */}

                  {user?.isAdmin && (
                    <div className="flex w-full lg:w-auto items-center justify-center">
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className={`flex justify-center items-center px-3 lg:py-1.5 py-2 rounded-lg text-[11px] font-bold text-white transition-all cursor-pointer hover:opacity-90 active:scale-95 w-full
                  lg:w-auto lg:ml-2`}
                        style={{
                          backgroundColor: "#ef4444",
                          boxShadow: `0 4px 16px ${fc.mid}60%`,
                        }}
                      >
                        <div className="flex justify-center items-center gap-1 text-[11px] text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                          Delete Professor
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {(professor.courses || []).map((course) => (
                  <span
                    key={course}
                    className="px-2.5 py-1 rounded-lg text-[10px] text-text2 font-medium"
                    style={{
                      background: fc.light,
                      border: `1px solid ${fc.mid}`,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Score Cards */}
          <div className="flex gap-3 mt-5">
            {/* Overall Rating Card */}
            <div
              className="flex-1 relative rounded-xl overflow-hidden p-4"
              style={{
                background: `linear-gradient(145deg, ${fc.light} 0%, transparent 100%)`,
                border: `1px solid ${fc.mid}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text3 mb-1.5">
                    Overall Rating
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-3xl lg:text-4xl font-bold tracking-tight"
                      style={{ color: fc.primary }}
                    >
                      {formatRating(professor.overallRating)}
                    </span>
                    <span className="text-[11px] text-text3 font-medium">
                      / 5.0
                    </span>
                  </div>
                </div>
                {/* Mini circular indicator */}
                <div className="relative w-12 h-12 lg:w-14 lg:h-14">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke="#e4eaf0"
                      strokeWidth="3"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke={fc.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(professor.overallRating / 5) * 113.1} 113.1`}
                      style={{ transition: "stroke-dasharray 0.8s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: fc.primary }}
                    >
                      {Math.round((professor.overallRating / 5) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px] text-text3">
                  {professor.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Recommend Card */}
            <div
              className="flex-1 relative rounded-xl overflow-hidden p-4"
              style={{
                background: `linear-gradient(145deg, ${fc.light} 0%, transparent 100%)`,
                border: `1px solid ${fc.mid}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-text3 mb-1.5">
                    Would Recommend
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-3xl lg:text-4xl font-bold tracking-tight"
                      style={{ color: fc.primary }}
                    >
                      {professor.recommendationRate}
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: fc.primary }}
                    >
                      %
                    </span>
                  </div>
                </div>
                {/* Mini circular indicator */}
                <div className="relative w-12 h-12 lg:w-14 lg:h-14">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke="#e4eaf0"
                      strokeWidth="3"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      fill="none"
                      stroke={fc.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(professor.recommendationRate / 100) * 113.1} 113.1`}
                      style={{ transition: "stroke-dasharray 0.8s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-aqua">👍</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px]" style={{ color: fc.primary }}>
                  ✓
                </span>
                <span className="text-[10px] text-text3">
                  of students recommend
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["Overview", "Reviews", "Courses"] as Tab[]).map((tab) => (
          <button
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs cursor-pointer border-b-2 transition-colors ${
              activeTab === tab
                ? "font-medium"
                : "text-text3 border-transparent hover:text-text2"
            }`}
            style={
              activeTab === tab
                ? { color: fc.primary, borderColor: fc.primary }
                : {}
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6">
        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="flex flex-col lg:grid-cols-[1fr_300px] gap-5 lg:gap-6">
            {/* Criteria */}
            <div className="flex flex-col gap-5">
              {/* Left */}
              <div>
                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
                  Criteria Ratings
                </p>
                <div className="flex flex-col gap-3">
                  {criteriaEntries.map(([key, label]) => {
                    const value = professor.criteria[key];
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[11px] text-text2 w-32 flex-shrink-0">
                          {label}
                        </span>
                        <div className="flex-1 h-[5px] bg-bg4 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(value / 5) * 100}%`,
                              background: getRatingBarColor(value),
                            }}
                          />
                        </div>
                        <span
                          className={`text-[12px] font-medium w-7 text-right ${getRatingColor(value)}`}
                        >
                          {formatRating(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trend */}
              <div>
                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
                  Monthly rating trend
                </p>
                <div className="flex items-end gap-1.5 h-16">
                  {professor.trendData.map((t, i) => {
                    const isLast = i === professor.trendData.length - 1;
                    const height = `${((t.rating - 3) / 2) * 100}%`;
                    return (
                      <div
                        key={t.month}
                        className="flex flex-col items-center justify-end gap-1 flex-1 h-full"
                      >
                        <div
                          className="w-full rounded-t-sm"
                          style={{
                            height,
                            background: `${fc.primary}`,
                            opacity: isLast ? 1 : 0.4,
                            minHeight: "6px",
                          }}
                        />
                        <span className="text-[9px] text-text3">{t.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* latest reviews */}
              <div>
                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
                  Latest Reviews
                </p>
                <div className="flex flex-col gap-3">
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="bg-bg3 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className="w-[10px] h-[10px]"
                              style={{
                                clipPath:
                                  "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                                background:
                                  star <= review.overallRating
                                    ? `${fc.primary}`
                                    : "#d8dfe6",
                              }}
                            />
                          ))}
                        </div>

                        <span className="text-[10px] text-text3">
                          {review.displayDate}
                        </span>
                      </div>
                      <p
                        className="text-[11px] mb-1.5"
                        style={{ color: fc.primary }}
                      >
                        {review.courseName}
                      </p>
                      <p className="text-[12px] text-text2 leading-relaxed">
                        {review.comment}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[9px] rounded-lg"
                            style={{
                              background: `${fc.light}`,
                              color: fc.primary,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-5">
              {/* Rating Breakdown */}
              <div>
                <p className="text-[10px] text-text3 uppercase trancking-widest mb-3 ">
                  Rating breakdown
                </p>
                <div className="flex flex-col gap-2">
                  {ratingBreakDown.map(({ star, percent }) => (
                    <div
                      key={star}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <span className="text-text3 w-10">{star} stars</span>
                      <div className="flex-1 h-[4px] bg-bg4 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percent}`,
                            background:
                              star >= 4
                                ? `${fc.primary}`
                                : star === 3
                                  ? "#d4a017"
                                  : "#dc2626",
                          }}
                        />
                      </div>
                      <span className="text-text2 w-8 text-right">
                        {percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-text3 uppercase tracking-widest mb-3">
                  Quick info
                </p>
                <div className="flex flex-col">
                  {[
                    { label: "Title", value: professor.title },
                    { label: "Department", value: professor.department },
                    {
                      label: "Faculty",
                      value: professor.faculty.replace("Faculty of", ""),
                    },
                    { label: "Total reviews", value: professor.reviewCount },
                  ].map((item, i, arr) => (
                    <div
                      key={item.label}
                      className={`flex justify-between py-2 text-[11px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <span className="text-text3">{item.label}</span>
                      <span className="text-text">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === "Reviews" && (
          <div className="flex flex-col gap-3 max-w-2xl">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-sm text-text3">
                No reviews yet for this professor.
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-bg2 border-border rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="w-[11px] h-[11px]"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                            background:
                              star <= review.overallRating
                                ? fc.primary
                                : "#22222e",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                      <span className="text-[10px] text-text3">
                        {review.displayDate}
                      </span>
                      {(user?.userId === review.userId || user?.isAdmin) && (
                        <button className="text-text3 hover:text-white transition-colors cursor-pointer">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="5" r="2" fill="currentColor" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <circle cx="12" cy="19" r="2" fill="currentColor" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-primary mb-2">
                    {review.courseName}
                  </p>
                  <p className="text-[12px] text-text2 leading-relaxed">
                    {review.comment}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-primary-dim text-primary text-[9px] rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {review.wouldRecommend && (
                      <p className="text-[10px] text-primary mt-2">
                        ✓ Would recommend
                      </p>
                    )}
                    {!review.wouldRecommend && (
                      <p className="text-[10px] text-red-500 mt-2">
                        ✗ Would not recommend
                      </p>
                    )}
                    <div className="flex flex-row justify-center items-center gap-2">
                      <div className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors">
                        <button
                          onClick={() => {
                            handleLike(review.id.toString());
                          }}
                        >
                          {likedReviews[review.id.toString()] ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              cursor="pointer"
                            >
                              <path
                                d="M7 22V11M2 13v7a2 2 0 002 2h11.4a2 2 0 001.97-1.67l1.1-7A2 2 0 0016.5 11H13V6a3 3 0 00-3-3L7 11"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              cursor="pointer"
                            >
                              <path
                                d="M7 22V11M2 13v7a2 2 0 002 2h11.4a2 2 0 001.97-1.67l1.1-7A2 2 0 0016.5 11H13V6a3 3 0 00-3-3L7 11"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-medium text-text2 ml-1.5">
                          {review.likeCount}
                        </span>
                        <p className="w-[1px] h-3 bg-black mx-2"></p>

                        <button
                          onClick={() => handleDislike(review.id.toString())}
                        >
                          {dislike[review.id.toString()] ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              cursor="pointer"
                            >
                              <path
                                d="M17 2v11M22 11v-7a2 2 0 00-2-2H8.6a2 2 0 00-1.97 1.67l-1.1 7A2 2 0 007.5 13H11v5a3 3 0 003 3l3-8"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              cursor="pointer"
                            >
                              <path
                                d="M17 2v11M22 11v-7a2 2 0 00-2-2H8.6a2 2 0 00-1.97 1.67l-1.1 7A2 2 0 007.5 13H11v5a3 3 0 003 3l3-8"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] font-medium text-text2 ml-1.5">
                          {review.dislikeCount}
                        </span>
                      </div>
                      {(user?.userId !== review.userId || !user?.isAdmin) && (
                      <button className="flex justify-center items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 21V4C6 3.44772 6.44772 3 7 3H17.5858C18.4767 3 18.9229 4.07714 18.2929 4.70711L15 8L18.2929 11.2929C18.9229 11.8229 18.4767 13 17.5858 13H7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <span className="text-xs text-primary">Report</span>
                      </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Course tab */}
        {activeTab === "Courses" && (
          <div className="flex flex-col gap-2 max-w-lg">
            {professor.courses.map((course) => (
              <div
                key={course}
                className="flex items-center justify-between bg-bg2 border border-border rounded-xl px-4 py-3"
              >
                <span className="text-sm text-text font-semibold">
                  {course}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {formatRating(professor.overallRating)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile rate button */}
      <div className="lg:hidden bottom-[57px] left-0 right-0 px-4 py-3 bg-[#f2f5f7] z-10">
        <button
          onClick={() => router.push(`/rate?professorId=${professor.id}`)}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer"
          style={{
            backgroundColor: fc.primary,
            boxShadow: `0 2px 12px ${fc.mid}`,
          }}
        >
          Rate this professor →
        </button>
      </div>

      {showDeleteModal && (
        <DeleteProfessorModal
          professorName={`${professor.firstName} ${professor.lastName}`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await fetch(`/api/professors/${params.ID}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });
            router.push("/dashboard");
          }}
        />
      )}
    </div>
  );
}
