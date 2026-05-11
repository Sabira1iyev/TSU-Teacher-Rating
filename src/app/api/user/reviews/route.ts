import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {

  try{
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      {
        message: "User is required",
      },
      { status: 400 },
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
    `
  );

  const reviews = result?.recordset;

  return NextResponse.json(
    {
       reviews
    },
    {
        status: 200
    }
  )


  }
  
   catch (error) {
    console.log("API error:", error);
    return NextResponse.json(
        {
            message: "Internal Server Error"
        },
        {
            status: 500
        }
    );
   }
}
