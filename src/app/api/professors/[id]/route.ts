import { NextResponse, NextRequest, userAgent } from "next/server";
import { getDb } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { FACULTIES } from "@/lib/constants";

type ProfessorDetailBase = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  average_rating: number | string;
  review_count: number;
  title: string | null;
  photo_url: string | null;
  created_at: string;
  departments: {
    name: string;
    faculties: { name: string | null };
  } | null;
  courses: Array<{
    name: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("professors")
      .select(
        `
      id,
      first_name,
      last_name,
      email,
      average_rating,
      review_count,
      title,
      photo_url,
      created_at,
      departments(
      name,
      faculties(
      name)),
      courses(
      name
      )
      `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.log("Failed to fetch professor detail:", error);

      return NextResponse.json(
        {
          message: "Internal server error",
        },
        {
          status: 500,
        },
      );
    }
    const professor = data as unknown as ProfessorDetailBase | null;

    if (!professor) {
      return NextResponse.json(
        {
          message: "Professor not found!",
        },
        {
          status: 404,
        },
      );
    }

    const rawUserId = req.nextUrl.searchParams.get("userId");

    const viewerId =
      rawUserId && Number.isSafeInteger(Number(rawUserId))
        ? Number(rawUserId)
        : null;

    const [reviewsResult, tagsResult] = await Promise.all([
      supabaseAdmin
        .from("reviews")
        .select(
          `
        id,
        user_id,
        professor_id,
        course_name,
        semester,
        overall_rating,
        comment,
        created_at,
        teaching_rating,
        exam_difficulty_rating,
        homework_rating,
        accessibility_rating,
        exam_control_rating,
        would_recommend,
        is_anonymous
        `,
        )
        .eq("professor_id", id)
        .order("created_at", { ascending: false }),

      supabaseAdmin.from("tags").select("id, name"),
    ]);

    if (reviewsResult.error || tagsResult.error) {
      console.log("Failed to fetch professor reviews: ", {
        reviewsError: reviewsResult.error,
        tagsError: tagsResult.error,
      });
      return NextResponse.json(
        {
          message: "Internal server error",
        },
        {
          status: 500,
        },
      );
    }

    const rawReviews = reviewsResult.data ?? [];
    const reviewIds = rawReviews.map((review) => review.id);

    let reviewTagRows: Array<{ review_id: number; tag_id: number }> = [];
    let interactionRows: Array<{
      review_id: number;
      user_id: number;
      interaction_type: string;
    }> = [];

    if (reviewIds.length > 0) {
      const [reviewTagsResult, interactionsResult] = await Promise.all([
        supabaseAdmin
          .from("review_tags")
          .select("review_id, tag_id")
          .in("review_id", reviewIds),

        supabaseAdmin
          .from("review_interactions")
          .select("review_id, user_id, interaction_type")
          .in("review_id", reviewIds),
      ]);

      if (reviewTagsResult.error || interactionsResult.error) {
        console.log("Failed to fetch review relations: ", {
          reviewTagsEror: reviewTagsResult.error,
          interactionsError: interactionsResult.error,
        });
        return NextResponse.json(
          {
            message: "Internal server error!",
          },
          {
            status: 500,
          },
        );
      }
      reviewTagRows = reviewTagsResult.data ?? [];
      interactionRows = interactionsResult.data ?? [];

      const tagsById = new Map(
        (tagsResult.data ?? []).map((tag) => [tag.id, tag.name]),
      );

      const tagsByReviewId = new Map<Number, string[]>();

      for (const reviewTag of reviewTagRows) {
        const tagName = tagsById.get(reviewTag.tag_id);

        if (!tagName) continue;

        const currentTags = tagsByReviewId.get(reviewTag.review_id) ?? [];
        currentTags.push(tagName);
        tagsByReviewId.set(reviewTag.review_id, currentTags);
      }

      const interactionsByReviewId = new Map<
        number,
        Array<{ user_id: number; interaction_type: string }>
      >();

      for (const interaction of interactionRows) {
        const currentInteractions =
          interactionsByReviewId.get(interaction.review_id) ?? [];

        currentInteractions.push({
          user_id: interaction.user_id,
          interaction_type: interaction.interaction_type,
        });

        interactionsByReviewId.set(interaction.review_id, currentInteractions);
      }

      const reviews = rawReviews.map((review) => {
        const reviewInteractions = interactionsByReviewId.get(review.id) ?? [];

        return {
          id: review.id,
          userid: review.user_id,
          professorId: review.professor_id,
          courseName: review.course_name,
          semester: review.semester,
          overallRating: review.overall_rating,
          criteria: {
            teaching: Number(review.teaching_rating),
            examDifficulty: Number(review.exam_difficulty_rating),
            homeWork: Number(review.homework_rating),
            accessibility: Number(review.accessibility_rating),
            examControlLevel: Number(review.exam_control_rating),
          },
          comment: review.comment ?? "",
          tags: tagsByReviewId.get(review.id) ?? [],
          wouldRecommend: review.would_recommend,
          isAnonymous: review.is_anonymous,
          displayDate: new Date(review.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          createdAt: review.created_at,
          likeCount: reviewInteractions.filter(
            (interaction) => interaction.interaction_type === "LIKE",
          ).length,
          dislikeCount: reviewInteractions.filter(
            (interaction) => interaction.interaction_type === "DISLIKE",
          ).length,
          userInteraction:
            viewerId === null
              ? null
              : (reviewInteractions.find(
                  (interaction) => interaction.user_id === viewerId,
                )?.interaction_type ?? null),
        };
      });
      const totalReviews = reviews.length;
      const recommendCount = reviews.filter(
        (review) => review.wouldRecommend,
      ).length;

      const ratingBreakDown = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter(
          (review) => Math.floor(review.overallRating) === star,
        ).length;
        return {
          star,
          percent:
            totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
        };
      });
      const now = new Date();
      const trendMonths = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - (5 - index),
          1,
        );

        return {
          key: `${date.getFullYear()}-${date.getMonth()}`,
          month: date.toLocaleString("en-US", { month: "short" }),
        };
      });

      const trendTotals = new Map<
        string,
        { ratingTotal: number; reviewCount: number }
      >();

      for (const review of reviews) {
        const date = new Date(review.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const current = trendTotals.get(key);

        if (current) {
          current.ratingTotal += review.overallRating;
          current.reviewCount += 1;
        } else {
          trendTotals.set(key, {
            ratingTotal: review.overallRating,
            reviewCount: 1,
          });
        }
      }

      const trendData = trendMonths.map(({ key, month }) => {
        const totals = trendTotals.get(key);

        return {
          month,
          rating: totals ? totals.ratingTotal / totals.reviewCount : 0,
          reviewCount: totals?.reviewCount ?? 0,
        };
      });

      return NextResponse.json({
        id: professor.id,
        firstName: professor.first_name,
        lastName: professor.last_name,
        email: professor.email,
        overallRating: Number(professor.average_rating),
        reviewCount: professor.review_count,
        title: professor.title,
        photoUrl: professor.photo_url,
        createdAt: professor.created_at,
        department: professor.departments?.name ?? "",
        faculty: professor.departments?.faculties?.name ?? "",
        courses: professor.courses.map((course) => course.name),
        recommendationRate:
          totalReviews > 0
            ? Math.round((recommendCount / totalReviews) * 100)
            : 0,
        trendData,
        ratingBreakDown,
        reviews,
        criteria: {
          teaching: totalReviews
            ? reviews.reduce(
                (sum, review) => sum + review.criteria.teaching,
                0,
              ) / totalReviews
            : 0,
          examDifficulty: totalReviews
            ? reviews.reduce(
                (sum, review) => sum + review.criteria.examDifficulty,
                0,
              ) / totalReviews
            : 0,
          homeWork: totalReviews
            ? reviews.reduce(
                (sum, review) => sum + review.criteria.homeWork,
                0,
              ) / totalReviews
            : 0,
          accessibility: totalReviews
            ? reviews.reduce(
                (sum, review) => sum + review.criteria.accessibility,
                0,
              ) / totalReviews
            : 0,
          examControlLevel: totalReviews
            ? reviews.reduce(
                (sum, review) => sum + review.criteria.examControlLevel,
                0,
              ) / totalReviews
            : 0,
        },
      });
    }
  } catch (error) {
    console.log("Unexpected professor detail endpoint error:", error);
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await params;
    const db = getDb();

    await (
      await db
    )
      .request()
      .input("Id", id)
      .query(
        `
      DELETE FROM ReviewTags WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE ProfessorId = @Id);
      DELETE FROM ReviewInteractions WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE ProfessorID = @Id);
      DELETE FROM Favorites WHERE ProfessorId = @Id;
      DELETE FROM Reviews WHERE ProfessorId = @Id;
      DELETE FROM Professors WHERE ProfessorId = @Id;
      `,
      );

    return NextResponse.json(
      { message: "Professor has been deleted!" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Professor deletion error: ", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
