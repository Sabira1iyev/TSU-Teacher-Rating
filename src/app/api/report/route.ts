import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { get } from "http";
import { stat } from "fs";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, reason, userId } = await req.json();

    if (!reviewId || !reason || !userId) {
      return NextResponse.json(
        {
          message: "Fill all the fields",
        },
        {
          status: 400,
        },
      );
    }

    const pool = await getDb();

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
  } catch (err) {
    console.log(err);
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
