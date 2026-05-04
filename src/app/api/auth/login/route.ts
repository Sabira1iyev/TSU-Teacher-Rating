import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

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
          error: "No account is registered with this email.",
        },
        { status: 404 },
      );
    }

    const user = result.recordset[0];
    const isPasswordTrue = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordTrue) {
      return NextResponse.json(
        { error: "Password is incorrect." },
        { status: 401 },
      );
    } else {
      return NextResponse.json(
        {
          message: "Login successful",
          user: {
            firstName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
            faculty: user.Faculty,
            isVerified: user.IsVerified,
            studyYear: user.StudyYear,
          },
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
