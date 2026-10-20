import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { loginLimiter } from "@/lib/ratelimit";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const emailResult = await loginLimiter.limit(normalizedEmail);
    const sucsess = await loginLimiter.limit(ip);
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!sucsess || !emailResult) {
      return NextResponse.json(
        {
          message: "Too many attempt, please try again later",
        },
        {
          status: 429,
        },
      );
    }
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "Unauthorized!",
        },
        {
          status: 401,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: hashedPassword,
      })
      .eq("email", email);

    if (error) throw error;

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
