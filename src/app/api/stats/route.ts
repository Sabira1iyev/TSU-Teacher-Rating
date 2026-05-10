import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "UserId is required",
        },
        { status: 400 },
      );
    }
    const pool = await getDb();

    const result = await pool.request().input("userId", userId).query(`
       SELECT  
       COUNT(*) as totalReviews,
       AVG(CAST(OverallRating as FLOAT)) as averageRatingGiven
       FROM Reviews
       Where UserId = @userId        
        `);

    const stats = result?.recordset[0];

    return NextResponse.json(
      {
        totalReviews: stats?.totalReviews || 0,
        averageRatingGiven: stats?.averageRatingGiven
          ? stats?.averageRatingGiven.toFixed(1)
          : 0,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("API ERROR: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

