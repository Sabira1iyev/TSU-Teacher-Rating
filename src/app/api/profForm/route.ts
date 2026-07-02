import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, faculty, department, title, courses } =
      body;

    const db = await getDb();

    const result = await db
      .request()
      .input("firstName", firstName)
      .input("lastName", lastName)
      .input("email", email)
      .input("faculty", faculty)
      .input("department", department)
      .input("title", title)
      .query(
        `
        DECLARE @facId INT;
        select @facId = FacultyId from Faculties WHERE Name = @faculty;

        DECLARE @deptId int;
        select @deptId = DepartmentId from Departments WHERE Name = @department AND facultyId = @facId;
        
        INSERT INTO Professors (
          FirstName, LastName, Email, Title, DepartmentId
        )VALUES(
        @firstName, @lastName, @email, @title, @deptId);

        SELECT SCOPE_IDENTITY() AS ProfessorId;
        `,
      );
    const professorId = result.recordset[0].ProfessorId;

    if (!professorId) {
      return NextResponse.json(
        { message: "Professor's Faculty couldn't be found!" },
        { status: 500 },
      );
    }

    for (const course of courses) {
      await db
        .request()
        .input("professorId", professorId)
        .input("courseName", course)
        .query(
          `
        INSERT INTO Courses(
          ProfessorId, 
          CourseName)
          Values(
          @professorId,
          @courseName
          )
        `,
        );
    }
    return NextResponse.json(
      {
        message: "Data inserted successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Prof form error:", error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500 },
    );
  }
}
