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
       AVG(CAST(OverallRating as FLOAT)) as averageRatingGiven,
       (SELECT COUNT(*) FROM ReviewInteractions ri 
       JOIN Reviews r on ri.ReviewId = r.ReviewId
       WHERE r.UserId = @userId and ri.InteractionType = 'LIKE') as totalLikesReceived
       FROM Reviews
       WHERE UserId = @userId
        `);

    const rankResult = await pool
      .request()
      .input("userId", userId)
      .query(
        `
        WITH FacultyStats AS(
        SELECT
              u.UserId,
              (SELECT COUNT(*) FROM Reviews r
              WHERE r.UserId = u.UserId) as UserReviews,
              (SELECT COUNT(*) FROM ReviewInteractions ri
              JOIN Reviews r ON ri.ReviewId = r.ReviewId
              WHERE r.UserId = u.UserId AND ri.InteractionType = 'LIKE') as UserLikes
            FROM Users u
            WHERE u.Faculty = (SELECT Faculty FROM Users WHERE UserId = @userId)
              ),
              RankedUsers AS(
                SELECT 
                UserId,
                RANK() OVER (ORDER BY UserLikes DESC, UserReviews ASC) as FacultyRank
                FROM FacultyStats)
                SELECT FacultyRank FROM RankedUsers WHERE UserId = @userId
        `,
      );

    const stats = result?.recordset[0];
    const rank = rankResult?.recordset[0];

    return NextResponse.json(
      {
        totalLikesReceived: stats?.totalLikesReceived || 0,
        totalReviews: stats?.totalReviews || 0,
        averageRatingGiven: stats?.averageRatingGiven
          ? stats?.averageRatingGiven.toFixed(1)
          : 0,
        facultyRank: rank?.FacultyRank || 0,
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
