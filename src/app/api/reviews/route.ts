import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { reviewLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";
/* ---------------POST---------------- */

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await reviewLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      {
        message: "Too many reviews. Please try again later",
      },
      {
        status: 429,
      },
    );
  }
  try {
    const body = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You have to be logged in to submit a review",
        },
        { status: 401 },
      );
    }

    const { data: newReview, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        professor_id: Number(body.professorId),
        user_id: userId,
        course_name: body.courseName,
        semester: body.semester,
        overall_rating: body.overallRating,
        comment: body.comment,
        is_anonymous: true,
        teaching_rating: body.criteria.teaching,
        exam_difficulty_rating: body.criteria.examDifficulty,
        homework_rating: body.criteria.homeWork,
        accessibility_rating: body.criteria.accessibility,
        exam_control_rating: body.criteria.examControlLevel,
        would_recommend: body.wouldRecommend,
      })
      .select("id")
      .single();

    if (reviewError || !newReview) {
      throw reviewError ?? new Error("Review could not be created.");
    }

    const newReviewId = newReview.id;

    if (body.tags?.length > 0) {
      const { data: selectedTags, error: tagsError } = await supabaseAdmin
        .from("tags")
        .select("id")
        .in("name", body.tags);

      if (tagsError) throw tagsError;

      const reviewTags = selectedTags.map((tag) => ({
        review_id: newReviewId,
        tag_id: tag.id,
      }));

      const { error: reviewTagsError } = await supabaseAdmin
        .from("review_tags")
        .insert(reviewTags);

      if (reviewTagsError) throw reviewTagsError;
    }

    const { data: professorReviews, error: professorReviewsError } =
      await supabaseAdmin
        .from("reviews")
        .select("overall_rating")
        .eq("professor_id", Number(body.professorId));

    if (professorReviewsError) throw professorReviewsError;
    const reviewCount = professorReviews.length;
    const averageRating =
      reviewCount > 0
        ? professorReviews.reduce(
            (sum, review) => sum + Number(review.overall_rating),
            0,
          ) / reviewCount
        : 0;

    const { error: updateReviewsError } = await supabaseAdmin
      .from("professors")
      .update({
        review_count: reviewCount,
        average_rating: averageRating,
      })
      .eq("id", Number(body.professorId));

    if (!updateReviewsError) throw updateReviewsError;

    return NextResponse.json(
      { message: "Review saved successfully." },
      { status: 201 },
    );
  } catch (error: any) {
    console.log("API ERROR", error);
    return NextResponse.json(
      {
        message:
          "An unknown error occurred while saving the review. Please try again later.",
      },
      { status: 500 },
    );
  }
}

/* ---------------PUT---------------- */

export async function PUT(req: NextRequest) {
  try {
    const reviewId = req.nextUrl.searchParams.get("reviewId");
    const body = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!reviewId || !session.userId) {
      return NextResponse.json(
        {
          message: "Missing information",
        },
        {
          status: 400,
        },
      );
    }
  } catch (err: any) {
    console.log("PUT api error", err);
    return NextResponse.json(
      {
        message: "An error occurred while updating the review.",
      },
      {
        status: 500,
      },
    );
  }
}

/* ---------------DELETE---------------- */

export async function DELETE(req: NextRequest) {
  try {
    const reviewId = req.nextUrl.searchParams.get("reviewId");
    const body = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!reviewId || !body.professorId) {
      return NextResponse.json(
        {
          message: "Missing information!",
        },
        { status: 400 },
      );
    }

    const pool = await getDb();

    if (!session.isAdmin) {
      const ownerCheck = await pool
        .request()
        .input("ReviewId", reviewId)
        .input("UserId", userId)
        .query(
          `
        SELECT ReviewId FROM Reviews
        WHERE ReviewId = @ReviewId AND UserId = @UserId
        `,
        );

      if (ownerCheck.recordset.length === 0) {
        return NextResponse.json(
          {
            message: "Not found or not authorized",
          },
          {
            status: 403,
          },
        );
      }
    }

    await pool
      .request()
      .input("ReviewId", reviewId)
      .input("UserId", userId)
      .input("ProfessorId", body.professorId)
      .query(
        `
      DELETE FROM ReviewInteractions
      WHERE ReviewId = @ReviewId;

      DELETE FROM Reports
      WHERE ReviewId = @ReviewId;

      DELETE FROM ReviewTags
      WHERE ReviewId = @ReviewId;
      
      DELETE FROM Reviews
      WHERE ReviewId = @ReviewId;

      UPDATE Professors
      SET 
      reviewCount = (SELECT COUNT(*) FROM Reviews WHERE ProfessorId = @ProfessorId),
      AverageRating = (SELECT AVG(CAST(OverallRating as FLOAT)) FROM Reviews WHERE ProfessorID = @ProfessorId)
      WHERE ProfessorId = @ProfessorId;
      `,
      );

    return NextResponse.json(
      {
        message: "Review deleted successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Review Delete api error", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the review.",
      },
      {
        status: 500,
      },
    );
  }
}
