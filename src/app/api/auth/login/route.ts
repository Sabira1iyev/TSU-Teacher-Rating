import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { DBUser } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = await getDb();

    const result = await db
      .request()
      .input("Email", email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          message: "No account is registered with this email.",
        },
        { status: 404 },
      );
    }

    const user: DBUser = result.recordset[0];
    const isPasswordTrue = await bcrypt.compare(password, user.PasswordHash);
    if (!isPasswordTrue) {
      return NextResponse.json(
        { message: "Password is incorrect." },
        { status: 401 },
      );
    } else {
      const nameParts = user.DisplayName
        ? user.DisplayName.split(" ")
        : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const isVerifiedTrue = user.IsVerified ? true : false;

      if (!isVerifiedTrue) {
        return NextResponse.json(
          {
            message:
              "You are not verified yet! Enter your personal code for verification.",
          },
          { status: 401 },
        );
      } else {
        const session = await getIronSession<SessionData>(
          await cookies(),
          sessionOptions,
        );

        session.userId = user.UserId;
        session.isAdmin = user.IsAdmin;
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json(
          {
            message: "Login successful",
            user: {
              firstName: firstName,
              lastName: lastName,
              email: user.Email,
              faculty: user.Faculty,
              studyYear: user.AcademicLevel,
              userId: user.UserId,
              createdAt: user.CreatedAt,
              isAdmin: user.IsAdmin,
            },
          },
          { status: 200 },
        );
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
