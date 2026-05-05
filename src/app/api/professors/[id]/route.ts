import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  try {
    const { id } = await params;

    const result = await (
      await db
    )
      .request()
      .input("Id", id)
      .query(
        `
                    Select
        p.ProfessorId as id,
        p.FirstName as firstName,
        p.LastName as lastName,
        p.Email as email,
        p.AverageRating as overallRating,
        p.reviewCount as reviewCount,
        p.Title as title,
        p.PhotoUrl as photoUrl,
        p.CreatedAt as createdAt,
        d.Name as department,
        f.Name as faculty
        FROM Professors p
        LEFT JOIN Departments d ON p.DepartmentId = d.DepartmentId
        LEFT JOIN Faculties f ON d.FacultyId = f.FacultyId
        WHERE p.ProfessorId = @Id
            `,
      );

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "Professor not found!" },
        { status: 404 },
      );
    }
    
    const p = result.recordset[0];
    
    const fullProfessor = {
        ...p,
        courses: [],
        recommendationRate: 0,
        trendData: [], 
        criteria: {
            teaching: p.overallRating || 0,
            examDifficulty: p.overallRating || 0,
            homeWork: p.overallRating || 0,
            accessibility: p.overallRating || 0,
            examControlLevel: p.overallRating || 0,
        }
    };

    return NextResponse.json(fullProfessor, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      { status: 500 },
    );
  }
}
