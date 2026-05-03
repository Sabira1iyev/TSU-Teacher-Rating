import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, faculty, studyYear } = body;

    {
      /* validation */
    }
    if (!email || !password || !faculty || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const db = await getDb();

    const existing = await db
      .request()
      .input("Email", email)
      .query("SELECT UserId FROM Users WHERE Email = @Email");

    if (existing.recordset.length > 0) {
      return NextResponse.json(
        { eror: "This email is already registered." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await db
      .request()
      .input("Email", email)
      .input("PasswordHash", passwordHash)
      .input("DiplayName", `${firstName} ${lastName}`)
      .input("AcademicLevel", studyYear)
      .input("Faculty", faculty)
      .input("IsVerified", 0)
      .query(
        `INSERT INTO Users(
        Email, PasswordHash, DisplayName, AcademicLevel, Faculty, IsVerified, CreatedAt)
        OUTPUT INSERTED.UserId
        VALUES(@Email, @PasswordHash, @DisplayName, @AcademicLevel, @Faculty @IsVerified, GETDATE())`,
      );

    const userId = result.recordset[0].UserId;

    return NextResponse.json(
      { message: "Registration successful", userId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error.", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
