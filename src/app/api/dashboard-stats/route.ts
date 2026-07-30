import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { stat } from "fs";

export async function GET(req: NextRequest) {
  try {
    const pool = await getDb();

    const result = await pool.query(
      `
        SELECT
        COUNT (*) as TotalReviews,
        SUM(CASE WHEN DATEDIFF(day, CreatedAt, GETDATE()) <= 30 THEN 1 ELSE 0 END) as ThisMonthReviews,
        SUM(CASE WHEN DATEDIFF(day, CreatedAt, GETDATE()) > 30 AND DATEDIFF(day, CreatedAt, GETDATE()) <= 60 THEN 1 ELSE 0 END) as LastMonthReviews,

        AVG(CAST(OverallRating as FLOAT)) as TotalAvgRating,
        AVG(CASE WHEN DATEDIFF(month, CreatedAt, GETDATE()) <= 6 THEN
        CAST(OverallRating as FLOAT) ELSE NULL END) as ThisSemesterAvgRating,
        AVG(CASE WHEN DATEDIFF(month, CreatedAt, GETDATE()) > 6 AND DATEDIFF(month,
        CreatedAt, GETDATE()) <= 12 THEN CAST(OverallRating as FLOAT)ELSE NULL END) as LastSemesterRating

        FROM Reviews
        `,
    );

    const stats = result.recordset[0];

    const lastMonth = stats.LastMonthReviews || 1;
    const monthGrowth =
      ((stats.ThisMonthReviews - stats.LastMonthReviews) / lastMonth) * 100;

    const semesterGrowth =
      (stats.ThisSemesterAvgRating || 0) - (stats.LastSemesterRating || 0);

    return NextResponse.json(
      {
        totalReviews: stats.TotalReviews || 0,
        monthGrowth: Math.round(monthGrowth),
        avgRating: stats.TotalAvgRating || 0,
        semesterGrowth: semesterGrowth.toFixed(1),
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
        {
            message: "Internal server error",
        },
        {
            status: 500,
        }
    )
  }
}
