import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { reviewLimiter } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await reviewLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      {
        message: "Too many attempts, please try again!",
      },
      {
        status: 429,
      },
    );
  }
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

    const pool = await getDb();

    const result = await pool
      .request()
      .input("userId", Number(userId))
      .query(
        `
    SELECT 
    r.*,
    p.FirstName as professorFirstName, 
    p.LastName as professorLastName, 
    p.Title as professorTitle
    FROM Reviews r
    JOIN Professors p ON r.ProfessorId = p.ProfessorId
    WHERE r.UserId = @userId
    ORDER BY r.CreatedAt DESC
    `,
      );

    const reviews = result?.recordset;

    return NextResponse.json(
      {
        reviews,
      },
      {
        status: 200,
      },
    );
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
