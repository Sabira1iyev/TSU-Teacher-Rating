import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { loginLimiter, userEmailLimit,userLoginEmailLimit } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";


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
    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();
    const { success: ipOk } = await loginLimiter.limit(ip);
    if (!ipOk) {
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

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        {
          message: "Invalid request",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters!",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { success: emailOk } = await userLoginEmailLimit.limit(normalizedEmail);

    if (!emailOk) {
      return NextResponse.json(
        {
          message: "Too manny request please try again later.",
        },
        {
          status: 429,
        },
      );
    }

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

    if (error) {
      throw error;
    }

    const user = data as unknown as LoginUser | null;

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password.",
        },
        {
          status: 401,
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
          message: "Invalid email or password.",
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
