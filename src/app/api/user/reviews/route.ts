import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

type ProfessorForReview = {
  first_name: string;
  last_name: string;
  title: string | null;
  departments: {
    faculties: {
      name: string;
    } | null;
  } | null;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to perform to this action!",
        },
        {
          status: 401,
        },
      );
    }
    const { data: userReviews, error: userReviewsError } = await supabaseAdmin
      .from("reviews")
      .select(
        `
        id, 
        professor_id, 
        course_name, 
        overall_rating, 
        comment, 
        created_at,

         professors (
         first_name, 
         last_name, 
         title,
         departments(
         faculties(
         name
            )
          )
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (userReviewsError) throw userReviewsError;

    const reviews = (userReviews ?? []).map((review) => {
      const professor =
        review.professors as unknown as ProfessorForReview | null;

      return {
        ReviewId: review.id,
        ProfessorId: review.professor_id,
        CourseName: review.course_name,
        OverallRating: Number(review.overall_rating),
        Comment: review.comment,
        CreatedAt: review.created_at,

        professorFirstName: professor?.first_name ?? "",
        professorLastName: professor?.last_name ?? "",
        professorTitle: professor?.title ?? "",
        professorFaculty: professor?.departments?.faculties?.name ?? "",
      };
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.log("API error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
