import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const result = await db.query(`
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
        `,
    )

    return NextResponse.json(result.recordset, { status: 200 });   
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
