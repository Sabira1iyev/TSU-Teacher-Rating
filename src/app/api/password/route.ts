import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { password, oldPassword } = await req.json();

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

    const { data: dbPassword, error: dbPasswordError } = await supabaseAdmin
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .maybeSingle();

    if (dbPasswordError) throw dbPasswordError;

    const actualHash = dbPassword?.password_hash;
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

    const { error: updatePasswordError } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: hashedPassword,
      })
      .eq("id", userId);

    if (updatePasswordError) throw updatePasswordError;
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
