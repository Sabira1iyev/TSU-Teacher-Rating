import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, faculty, studyYear } = await req.json();

    const displayName = firstName + " " + lastName;

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

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
    // await db
    //   .request()
    //   .input("DisplayName", displayName)
    //   .input("Faculty", faculty)
    //   .input("AcademicLevel", studyYear)
    //   .input("UserId", userId)
    //   .query(
    //     `
    //     UPDATE Users SET
    //     DisplayName = @DisplayName,
    //     Faculty = @Faculty,
    //     AcademicLevel = @AcademicLevel
    //     Where UserId = @UserId
    //     `,
    //   );

    const { error: editProfileError } = await supabaseAdmin
      .from("users")
      .update({
        display_name: displayName,
        faculty: faculty,
        academic_level: studyYear,
      })
      .eq("id", userId);

    if (editProfileError) throw editProfileError;

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
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
