import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, userId, faculty, studyYear } =
      await req.json();

    const db = await getDb();
    const displayName = firstName + " " + lastName;

    await db
      .request()
      .input("DisplayName", displayName)
      .input("Faculty", faculty)
      .input("AcademicLevel", studyYear)
      .input("UserId", userId)
      .query(
        `
        UPDATE Users SET 
        DisplayName = @DisplayName,
        Faculty = @Faculty,
        AcademicLevel = @AcademicLevel
        Where UserId = @UserId
        `,
      );

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        userId,
        createdAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
