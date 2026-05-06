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
    const isPasswordTrue = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordTrue) {
      return NextResponse.json(
        { error: "Password is incorrect." },
        { status: 401 },
      );
    } else {
      const nameParts = user.DisplayName
        ? user.DisplayName.split(" ")
        : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

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
          },
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
