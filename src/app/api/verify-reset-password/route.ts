import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { verifyResetLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    const { success } = await verifyResetLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          message: "Too many attemps. Please try again later",
        },
        {
          status: 429,
        },
      );
    }

    const { email, verifyCode } = await req.json();
    const { data: result, error } = await supabaseAdmin
      .from("users")
      .select("verification_expiry")
      .eq("verification_code", verifyCode)
      .eq("email", email);

    if (error) throw error;

    if (result.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid verification code",
        },
        {
          status: 404,
        },
      );
    }

    const expiryTime = new Date(result[0].verification_expiry);
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
