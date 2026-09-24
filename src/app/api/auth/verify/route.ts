import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const verificationCode = String(code).trim();

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, verification_code, verification_expiry, is_verified")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (user.is_verified) {
      return NextResponse.json(
        {
          message: "Email is already registered.",
        },
        {
          status: 400,
        },
      );
    }

    if (user.verification_code !== verificationCode) {
      return NextResponse.json(
        {
          message: "Invalid verification code!",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !user.verification_expiry ||
      new Date() > new Date(user.verification_expiry)
    ) {
      return NextResponse.json(
        {
          message: "Verification code has expired. Please request a new one.",
        },
        {
          status: 400,
        },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        is_verified: true,
        verification_code: null,
        verification_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        message: "Email successfully verified.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
