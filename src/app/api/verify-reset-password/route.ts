import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, verifyCode } = await req.json();
    const db = await getDb();

    const result = await db
      .request()
      .input("Email", email)
      .input("VerifyCode", verifyCode)
      .query(
        `
        SELECT VerificationExpiry FROM Users WHERE Email = @Email AND VerificationCode = @VerifyCode
        `,
      );
    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid verification code",
        },
        {
          status: 404,
        },
      );
    }

    const expiryTime = new Date(result.recordset[0].VerificationExpiry);
    const currentTime = new Date();

    if (currentTime > expiryTime) {
      return NextResponse.json(
        {
          message: "Verification code has expired",
        },
        {
          status: 400,
        },
      );
    }
    return NextResponse.json(
      {
        message: "Verification code is valid!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Verify code control error", error);
    return NextResponse.json(
      {
        message: "Error occured while verify code",
      },
      {
        status: 500,
      },
    );
  }
}
