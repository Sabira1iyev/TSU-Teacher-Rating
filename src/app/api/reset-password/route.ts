import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();
    const db = await getDb();

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const result = await db
      .request()
      .input("email", email)
      .input("newPassword", hashedPassword)
      .query(
        `
      UPDATE Users 
      SET PasswordHash = @newPassword
      WHERE Email = @email
      `,
      );
    return NextResponse.json(
      {
        message: "Password changed successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log("Password reset error:", err);
    return NextResponse.json(
      {
        message: "Error occured while changing password",
      },
      {
        status: 500,
      },
    );
  }
}
