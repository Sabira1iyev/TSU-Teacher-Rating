import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
export async function POST(req: NextRequest) {
  try {
    const { reviewId, reason, userId } = await req.json();

    if (!reviewId || !reason || !userId) {
      return NextResponse.json(
        {
          error: "Fill all required fields.",
          message: "Fill all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    const pool = await getDb();

    // Check if user already reported this review
    const checkReport = await pool
      .request()
      .input("reviewId", reviewId)
      .input("userId", userId)
      .query(
        `
        SELECT * FROM Reports
        WHERE ReviewId = @reviewId AND UserId = @userId
        `,
      );

    if (checkReport.recordset.length > 0) {
      return NextResponse.json(
        {
          error: "You have already reported this review.",
          message: "You have already reported this review.",
        },
        {
          status: 400,
        },
      );
    }

    await pool
      .request()
      .input("reviewId", reviewId)
      .input("reason", reason)
      .input("userId", userId)
      .query(
        `
        INSERT INTO Reports(ReviewId, Reason, UserId)
        VALUES(
         @reviewId,
         @reason,
         @userId
      )
        `,
      );

    return NextResponse.json(
      {
        message: "Review reported!",
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.log("Report POST error:", err);

    if (
      err.number === 2627 ||
      err.number === 2601 ||
      (err.message && err.message.toLowerCase().includes("unique")) ||
      (err.message && err.message.toLowerCase().includes("duplicate"))
    ) {
      return NextResponse.json(
        {
          error: "This review has already been reported.",
          message: "This review has already been reported.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");
    const userId = searchParams.get("userId");
    const pool = await getDb();

    const result = await pool
      .request()
      .input("reviewId", reviewId)
      .input("userId", userId)
      .query(
        `
        SELECT
        r.ReportId,
        r.ReviewId,
        r.UserId,
        r.Reason,
        r.CreatedAt,
        rev.Comment as ReviewComment,
        rev.ProfessorId
        FROM Reports r
        JOIN Reviews rev ON r.ReviewId = rev.ReviewId
        ORDER BY r.CreatedAt DESC
        `,
      );
    return NextResponse.json(
      {
        reports: result.recordset,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "internal server error",
      },
      { status: 500 },
    );
  }
}
