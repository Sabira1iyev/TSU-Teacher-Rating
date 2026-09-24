import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function average(values: number[]) {
  if (values.length === 0) return 0;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("created_at, overall_rating");

    if (error) {
      throw error;
    }

    const reviews = data ?? [];
    const now = new Date();

    const thirsdyDaysAgo = new Date(now);
    thirsdyDaysAgo.setDate(now.getDate() - 30);

    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const sixMonthAgo = new Date(now);
    sixMonthAgo.setDate(now.getMonth() - 6);

    const twelveMonthAgo = new Date(now);
    twelveMonthAgo.setDate(now.getMonth() - 12);

    const thisMonthReviews = reviews.filter(
      (review) => new Date(review.created_at) >= thirsdyDaysAgo,
    );

    const lastMonthReviews = reviews.filter((review) => {
      const createdAt = new Date(review.created_at);

      return createdAt < thirsdyDaysAgo && createdAt >= sixtyDaysAgo;
    });

    const thisSemesterRatings = reviews
      .filter((review) => new Date(review.created_at) >= sixMonthAgo)
      .map((review) => Number(review.overall_rating));

    const lastSemesterRatings = reviews
      .filter((review) => {
        const createdAt = new Date(review.created_at);

        return createdAt < sixMonthAgo && createdAt >= twelveMonthAgo;
      })
      .map((review) => Number(review.overall_rating));

    const lastMonthCount = lastMonthReviews.length;
    const monthGrowth =
      ((thisMonthReviews.length - lastMonthCount) / (lastMonthCount || 1)) *
      100;

    const semesterGrowth =
      average(thisSemesterRatings) - average(lastSemesterRatings);

    return NextResponse.json({
      totalReviews: reviews.length,
      monthGrowth: Math.round(monthGrowth),
      avgRating: average(
        reviews.map((review) => Number(review.overall_rating)),
      ),
      semesterGrowth: semesterGrowth.toFixed(1),
    });
  } catch (error) {
    console.log("Dashboard stats error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
