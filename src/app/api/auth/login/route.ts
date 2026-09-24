import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { DBUser } from "@/types/user";
import { loginLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";
import { use } from "react";

type LoginUser = {
  id: number;
  email: string;
  password_hash: string;
  display_name: string;
  is_verified: boolean;
  faculty: string;
  academic_level: string | null;
  created_at: string;
  is_admin: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await loginLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          message: "Too many attempt, please try again later.",
        },
        {
          status: 429,
        },
      );
    }
    const { email, password } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("users")
      .select(
        `
      id,
      email,
      password_hash,
      display_name,
      is_verified,
      faculty,
      academic_level,
      created_at,
      is_admin
`,
      )
      .eq("email", normalizedEmail)
      .maybeSingle();

    const user = data as unknown as LoginUser | null;

    if (!user) {
      return NextResponse.json(
        {
          message: "No account is registered with this email.",
        },
        {
          status: 404,
        },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          message: "Password is incorrect.",
        },
        {
          status: 401,
        },
      );
    }

    if (!user.is_verified) {
      return NextResponse.json(
        {
          message:
            "You are not verified yet! Enter you personal code for verification.",
        },
        {
          status: 401,
        },
      );
    }

    const nameParts = user.display_name.split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts[1] ?? "";

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    session.userId = user.id;
    session.isAdmin = user.is_admin;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json(
      {
        message: "Login successfull",
        user: {
          firstName,
          lastName,
          email: user.email,
          faculty: user.faculty,
          studyYear: user.academic_level,
          userId: user.id,
          createdAt: user.created_at,
          isAdmin: user.is_admin,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
