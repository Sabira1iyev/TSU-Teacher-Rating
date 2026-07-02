import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, faculty, department, title, courses } =
      body;

    const db = await getDb();

    const checkResult = await db
      .request()
      .input("faculty", faculty)
      .input("department", department)
      .input("email", email)
      .query(
        `
        DECLARE @facId INT;
        SELECT @facId = FacultyId FROM Faculties WHERE Name = @faculty;

        DECLARE @deptId INT;
        SELECT @deptId = DepartmentId FROM Departments WHERE Name = @department AND FacultyId = @facId;

        IF @deptId IS NULL
        BEGIN
            INSERT INTO Departments (Name, FacultyId)
            VALUES(@department, @facId);
            SET @deptId = SCOPE_IDENTITY();
        END
        
        DECLARE @existingProfId INT;
        SELECT @existingProfId = ProfessorId FROM Professors WHERE Email = @email;

        SELECT @facId AS facId, @deptId AS deptId, @existingProfId AS existingProfId;
        `,
      );

    const facId = checkResult.recordset[0]?.facId;
    const deptId = checkResult.recordset[0]?.deptId;
    const existingProfId = checkResult.recordset[0]?.existingProfId;

    if (existingProfId) {
      return NextResponse.json(
        { error: "A professor with this email is already registered!" },
        { status: 409 },
      );
    }

    if (!facId) {
      return NextResponse.json(
        { error: "The selected faculty could not be found in the database!" },
        { status: 400 },
      );
    }

    const result = await db
      .request()
      .input("firstName", firstName)
      .input("lastName", lastName)
      .input("email", email)
      .input("title", title)
      .input("deptId", deptId)
      .query(
        `
        INSERT INTO Professors (
          FirstName, LastName, Email, Title, DepartmentId
        ) VALUES (
          @firstName, @lastName, @email, @title, @deptId
        );

        SELECT SCOPE_IDENTITY() AS ProfessorId;
        `,
      );

    const professorId = result.recordset[0]?.ProfessorId;

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
