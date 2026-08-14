import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { getDb } from "@/lib/db";

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

    const db = await getDb();
    const userId = session.userId;

    const profIdResult = await db.request().input("userId", userId).query(`
      SELECT ProfessorId FROM Reviews WHERE UserId = @userId`);
    const profIds = profIdResult.recordset.map((row) => row.ProfessorId);

    await db.request().input("userId", userId).query(`
        DELETE FROM ReviewTags WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE UserId = @userId);
        DELETE FROM ReviewInteractions WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE UserId = @userId);
        DELETE FROM ReviewInteractions WHERE UserId = @userId;
        DELETE FROM Favorites WHERE UserId = @userId;
        DELETE FROM Reviews WHERE UserId = @userId;
        DELETE FROM Users WHERE UserId = @userId;
        `);

    for (const profId of profIds) {
      await db.request().input("ProfId", profId).query(`
            UPDATE Professors
            SET 
            reviewCount = (SELECT COUNT(*) FROM Reviews WHERE ProfessorId = @ProfId),
            AverageRating = ISNULL((SELECT AVG(CAST(OverallRating as FLOAT)) FROM Reviews WHERE ProfessorId = @ProfId), 0.00)
            WHERE ProfessorId = @ProfId`);
    }

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
