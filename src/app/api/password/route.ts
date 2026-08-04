import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { userId, password, oldPassword } = await req.json();

    const db = await getDb();

    if (!userId || !password) {
      return NextResponse.json(
        {
          message: "All fields are required!",
        },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be 8 characters",
        },
        { status: 400 },
      );
    }

    if (!oldPassword) {
      return NextResponse.json(
        {
          message: "Old password is required",
        },
        {
          status: 400,
        },
      );
    }

    const dbPassword = await db
      .request()
      .input("UserId", userId)
      .query(
        `
      SELECT PasswordHash FROM Users Where UserId = @UserId
      `,
      );
    const actualHash = dbPassword.recordset[0].PasswordHash;

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, actualHash);

    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        {
          message: "Incorrect old password!",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .request()
      .input("UserId", userId)
      .input("PasswordHash", hashedPassword)
      .query(
        `
        UPDATE Users
        SET PasswordHash = @PasswordHash
        WHERE UserId = @UserId;
        `,
      );
    return NextResponse.json(
      {
        message: "Password successfully changed!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Password change error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again",
      },
      { status: 500 },
    );
  }
}
