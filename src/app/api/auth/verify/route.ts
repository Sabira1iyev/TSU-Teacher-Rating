import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Find the user and their verification code
    const existing = await db
      .request()
      .input("Email", email)
      .query(
        "SELECT UserId, VerificationCode, VerificationExpiry, IsVerified FROM Users WHERE Email = @Email"
      );

    if (existing.recordset.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const user = existing.recordset[0];

    if (user.IsVerified) {
      return NextResponse.json(
        { error: "Email is already verified." },
        { status: 400 }
      );
    }

    if (user.VerificationCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.VerificationExpiry)) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update user to verified and clear code
    await db
      .request()
      .input("Email", email)
      .query(
        "UPDATE Users SET IsVerified = 1, VerificationCode = NULL, VerificationExpiry = NULL WHERE Email = @Email"
      );

    return NextResponse.json(
      { message: "Email successfully verified." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
