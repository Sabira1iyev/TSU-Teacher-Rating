import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyIpLimiter } from "@/lib/ratelimit";
import { verifyEmailLimiter } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();
    const { success: ipOk } = await verifyIpLimiter.limit(ip);

    if (!ipOk) {
      return NextResponse.json(
        {
          message: "Too many attempt. Please try again later",
        },
        {
          status: 429,
        },
      );
    }

    const { email, code } = body;

    if (typeof email !== "string" || typeof code !== "string") {
      return NextResponse.json({ error: "Invlid request" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const verificationCode = String(code).trim();

    if (!/^\d{d}/.test(normalizedEmail)) {
      return NextResponse.json(
        {
          message: "Verification code must be 6 digits!",
        },
        {
          status: 400,
        },
      );
    }

    const { success: emailOk } =
      await verifyEmailLimiter.limit(normalizedEmail);
    
      if (!emailOk) {
      return NextResponse.json(
        {
          message: "Too many request!",
        },
        {
          status: 429,
        },
      );
    }

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
