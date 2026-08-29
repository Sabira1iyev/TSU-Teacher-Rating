import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { loginLimiter } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const { password, oldPassword } = await req.json();

    const db = await getDb();
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await loginLimiter.limit(ip);
    if (!success) {
      return NextResponse.json({
        message: "Too many attempts, please try again later.",
      });
    }
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;
    if (!session.userId || !password) {
      return NextResponse.json(
        {
          message: "All fields are required!",
        },
        { status: 401 },
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
