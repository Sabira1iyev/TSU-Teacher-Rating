import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { userResetPasswordLimiter, resetPasswordLimiter } from "@/lib/ratelimit";


export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();

    const { success: ipOk } = await resetPasswordLimiter.limit(ip);

    if (!ipOk) {
      return NextResponse.json(
        {
          message: "Too many attempts",
        },
        {
          status: 429,
        },
      );
    }

    const { email, verifyCode, newPassword } = await req.json();
    if (
      typeof email !== "string" ||
      typeof verifyCode !== "string" ||
      typeof newPassword !== "string"
    ) {
      return NextResponse.json(
        {
          message: "Invalid request!",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { success: emailOk } = await userResetPasswordLimiter.limit(normalizedEmail);

    if (!emailOk) {
      return NextResponse.json(
        {
          message: "Too many attempts",
        },
        {
          status: 429,
        },
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: hashedPassword,
        verification_code: null,
        verification_expiry: null,
      })
      .eq("email", email)
      .eq("verification_code", verifyCode)
      .gt("verification_expiry", new Date().toISOString())
      .select("id");
    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid or expired code",
        },
        {
          status: 400,
        },
      );
    }
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
