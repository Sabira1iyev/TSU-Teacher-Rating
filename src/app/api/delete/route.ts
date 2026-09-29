import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to perform this action",
        },
        {
          status: 401,
        },
      );
    }

    const userId = session.userId;

    // const profIdResult = await db.request().input("userId", userId).query(`
    //   SELECT ProfessorId FROM Reviews WHERE UserId = @userId`);
    // const profIds = profIdResult.recordset.map((row) => row.ProfessorId);

    // await db.request().input("userId", userId).query(`
    //     DELETE FROM ReviewTags WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE UserId = @userId);
    //     DELETE FROM ReviewInteractions WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE UserId = @userId);
    //     DELETE FROM ReviewInteractions WHERE UserId = @userId;
    //     DELETE FROM Favorites WHERE UserId = @userId;
    //     DELETE FROM Reviews WHERE UserId = @userId;
    //     DELETE FROM Users WHERE UserId = @userId;
    //     `);

    // for (const profId of profIds) {
    //   await db.request().input("ProfId", profId).query(`
    //         UPDATE Professors
    //         SET
    //         reviewCount = (SELECT COUNT(*) FROM Reviews WHERE ProfessorId = @ProfId),
    //         AverageRating = ISNULL((SELECT AVG(CAST(OverallRating as FLOAT)) FROM Reviews WHERE ProfessorId = @ProfId), 0.00)
    //         WHERE ProfessorId = @ProfId`);
    // }

    const { data: profIdResult, error: profIdError } = await supabaseAdmin
      .from("reviews")
      .select("professor_id")
      .eq("user_id", Number(userId));

    if (profIdError) throw profIdError;

    const professorIds = [
      ...new Set(profIdResult.map((row) => row.professor_id)),
    ];

    const { error: deleteProfileError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (deleteProfileError) throw deleteProfileError;

    for (const profId of professorIds) {
      const { data: remainingReviews, error } = await supabaseAdmin
        .from("reviews")
        .select("overall_rating")
        .eq("professor_id", profId);

      if (error) throw error;

      const reviewCount = remainingReviews.length;
      const averageRating =
        reviewCount > 0
          ? remainingReviews.reduce(
              (sum, review) => sum + review.overall_rating,
              0,
            ) / reviewCount
          : 0;

      const { error: updateError } = await supabaseAdmin
        .from("professors")
        .update({
          review_count: reviewCount,
          average_rating: averageRating,
        })
        .eq("id", profId);
      if (updateError) throw updateError;
    }

    session.destroy();

    return NextResponse.json(
      {
        message: "User has been deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      {
        message: "User couldn't be deleted",
      },
      {
        status: 500,
      },
    );
  }
}
