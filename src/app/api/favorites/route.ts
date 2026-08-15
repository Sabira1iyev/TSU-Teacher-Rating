import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);
    // const userId = searchParams.get("userId");
    const db = await getDb();

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to perform this action!",
        },
        {
          status: 401,
        },
      );
    }
    const userId = session.userId;

    const result = await db
      .request()
      .input("UserId", userId)
      .query(
        `
        SELECT 
        p.ProfessorId as id,
        p.FirstName as firstName,
        p.LastName as lastName,
        p.AverageRating as overallRating,
        p.reviewCount as reviewCount,
        p.Title as title,
        d.Name as department,
        f.Name as faculty
        From Favorites fav
        INNER JOIN Professors p on fav.ProfessorId = p.ProfessorId
        LEFT  JOIN Departments d on p.DepartmentId = d.DepartmentId
        LEFT JOIN Faculties f on d.FacultyId = f.FacultyId
        WHERE fav.UserId = @UserId
        ORDER BY fav.CreatedAt DESC
        `,
      );

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.log("Favorites fetch error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch favorites.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const { professorId } = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to perform this acion",
        },
        {
          status: 401,
        },
      );
    }
    const userId = session.userId;
    const existingFavorite = await db
      .request()
      .input("UserId", userId)
      .input("ProfessorId", professorId)
      .query(
        `
        SELECT * from Favorites
        WHERE UserId = @UserId AND ProfessorId = @ProfessorId;
        `,
      );

    let isFav = false;

    if (existingFavorite.recordset.length === 0) {
      const addFavorite = await db
        .request()
        .input("UserId", userId)
        .input("ProfessorId", professorId)
        .query(
          `
            INSERT INTO Favorites(UserId, ProfessorId, CreatedAt)
            VALUES (@UserId, @ProfessorId, GETDATE())
            `,
        );
      isFav = true;
    } else {
      const removeFavorite = await db
        .request()
        .input("UserId", userId)
        .input("ProfessorId", professorId)
        .query(
          `
            DELETE FROM Favorites
            WHERE UserId = @UserId AND ProfessorId = @ProfessorId
            `,
        );
      isFav = false;
    }
    return NextResponse.json(
      {
        message: "Favorite added or removed successfully",
        isFavorite: isFav,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Favorite add/remove error:", error);
    return NextResponse.json(
      {
        message: "Failed to add or remove favorite.",
      },
      {
        status: 500,
      },
    );
  }
}
