import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { useId } from "react";

type FacultyUsers = {
  id: number;
  created_at: string;
};

type ReviewRow = {
  id: number;
  user_id: number;
  overall_rating: number | string;
};

type InteractionRow = {
  review_id: number;
  interaction_type: string;
};

function average(values: number[]) {
  if (values.length === 0) return 0;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.nextUrl.searchParams.get("userId"));

    if (!Number.isSafeInteger(userId)) {
      return NextResponse.json(
        {
          message: "UserId is required",
        },
        {
          status: 400,
        },
      );
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, faculty")
      .eq("id", userId)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!",
        },
        {
          status: 404,
        },
      );
    }

    const { data: facultyUsersData, error: facultyUserEror } =
      await supabaseAdmin
        .from("users")
        .select("id, created_at")
        .eq("faculty", user.faculty);

    if (facultyUserEror) throw facultyUserEror;

    const facultyUsers = (facultyUsersData ?? []) as FacultyUsers[];
    const facultyUserIds = facultyUsers.map((facultyUser) => facultyUser.id);

    const { data: reviewsData, error: reviewsError } = await supabaseAdmin
      .from("reviews")
      .select("id, user_id, overall_rating")
      .in("user_id", facultyUserIds);

    if (reviewsError) throw reviewsError;

    const reviews = (reviewsData ?? []) as ReviewRow[];
    const reviewIds = reviews.map((review) => review.id);

    let interactions: InteractionRow[] = [];

    if (reviewIds.length > 0) {
      const { data: interactionsData, error: interactionsError } =
        await supabaseAdmin
          .from("review_interactions")
          .select("review_id, interaction_type")
          .in("review_id", reviewIds);

      if (interactionsError) throw interactionsError;

      interactions = (interactionsData ?? []) as InteractionRow[];
    }

    const reviewCountByUser = new Map<number, number>();
    const likebyUser = new Map<number, number>();
    const reviewOwnerById = new Map<number, number>();

    for (const facultyUser of facultyUsers) {
      reviewCountByUser.set(facultyUser.id, 0);
      likebyUser.set(facultyUser.id, 0);
    }

    for (const review of reviews) {
      reviewOwnerById.set(review.id, review.user_id);

      reviewCountByUser.set(
        review.user_id,
        (reviewCountByUser.get(review.user_id) ?? 0) + 1,
      );
    }

    for (const interaction of interactions) {
      if (interaction.interaction_type === "LIKE") continue;

      const reviewOwnerId = reviewOwnerById.get(interaction.review_id);

      if (!reviewOwnerId) continue;

      likebyUser.set(reviewOwnerId, (likebyUser.get(reviewOwnerId) ?? 0) + 1);
    }

    const ranking = facultyUsers
      .map((facultyUser) => ({
        userId: facultyUser.id,
        createdAt: new Date(facultyUser.created_at).getTime(),
        reviewCount: reviewCountByUser.get(facultyUser.id) ?? 0,
        likeCount: likebyUser.get(facultyUser.id) ?? 0,
      }))
      .sort((a, b) => {
        if (a.likeCount !== b.likeCount) {
          return b.likeCount - a.likeCount;
        }

        if (a.likeCount > 0 && a.reviewCount !== b.reviewCount) {
          return a.reviewCount - b.reviewCount;
        }
        if (a.likeCount === 0 && a.reviewCount !== b.reviewCount) {
          return b.reviewCount - a.reviewCount;
        }
        return a.createdAt - b.createdAt;
      });

    const ownReviews = reviews.filter((review) => review.user_id === userId);

    const facultyRank =
      ranking.findIndex((rankingUser) => rankingUser.userId === userId) + 1;

    return NextResponse.json({
      totalLikesReceived: likebyUser.get(userId) ?? 0,
      totalReviews: ownReviews.length,
      averageRatingGiven: ownReviews.length
        ? average(
            ownReviews.map((review) => Number(review.overall_rating)),
          ).toFixed(1)
        : 0,
      facultyRank: facultyRank || 0,
    });
  } catch (error) {
    console.error("Profile stats error: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
