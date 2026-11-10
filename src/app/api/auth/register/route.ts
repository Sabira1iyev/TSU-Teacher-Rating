import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { registerLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";
import { registerEmailLimiter } from "@/lib/ratelimit";
import crypto from "crypto";
import { FACULTIES } from "@/lib/constants";

async function sendVerificationEmail(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"TSU Teacher Rating" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}. It will expire in 10 minutes.`,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Thank you for registering. Your verification code is:</p>
          <h1 style="color: #0060a9; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success: ipOk } = await registerLimiter.limit(ip);
    const body = await req.json();
    const { firstName, lastName, email, password, faculty, studyYear } = body;

    if (!ipOk) {
      return NextResponse.json(
        {
          message: "Too many attempts, please try again later",
        },
        {
          status: 429,
        },
      );
    }

    if (!email || !password || !faculty || !firstName || !lastName) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof faculty !== "string" ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      !FACULTIES.includes(faculty)
    ) {
      return NextResponse.json(
        {
          message: "Invalid informations!",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedEmail.endsWith("@hum.tsu.edu.ge") &&
      !normalizedEmail.endsWith("@ens.tsu.edu.ge") &&
      !normalizedEmail.endsWith("@eab.tsu.edu.ge") &&
      !normalizedEmail.endsWith("@pes.tsu.edu.ge") &&
      !normalizedEmail.endsWith("@sps.tsu.edu.ge") &&
      !normalizedEmail.endsWith("@law.tsu.edu.ge") &&
      !normalizedEmail.endsWith("@med.tsu.edu.ge")
    ) {
      return NextResponse.json(
        {
          message: "Required email must be a valid TSU email address!",
        },
        {
          status: 400,
        },
      );
    }

    const { success: emailOk } =
      await registerEmailLimiter.limit(normalizedEmail);
    if (!emailOk) {
      return NextResponse.json(
        {
          message: "Too many attempts. Please try again later!",
        },
        {
          status: 429,
        },
      );
    }

    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from("users")
      .select("id, is_verified")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }
    if (existingUser?.is_verified) {
      return NextResponse.json(
        {
          message: "This email is already registered!",
        },
        {
          status: 400,
        },
      );
    }

    const verificationCode = Math.floor(
      crypto.randomInt(100000, 1000000),
    ).toString();
    const verificationExpiry = new Date(
      Date.now() + 10 * 60 * 1000,
    ).toISOString();
    const passwordHash = await bcrypt.hash(password, 12);

    let userId: number;
    if (existingUser) {
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          password_hash: passwordHash,
          verification_code: verificationCode,
          verification_expiry: verificationExpiry,
        })
        .eq("id", existingUser.id);

      if (updateError) {
        throw updateError;
      }
      userId = existingUser.id;
    } else {
      const displayName = `${firstName} ${lastName}`;

      if (displayName.trim().length > 50) {
        return NextResponse.json(
          {
            message: "Long display name error",
          },
          {
            status: 400,
          },
        );
      }
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          email: normalizedEmail,
          password_hash: passwordHash,
          display_name: displayName,
          faculty,
          academic_level: studyYear,
          is_verified: false,
          verification_code: verificationCode,
          verification_expiry: verificationExpiry,
        })
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }

      userId = newUser.id;
    }

    try {
      await sendVerificationEmail(normalizedEmail, verificationCode);
    } catch (error) {
      console.log("Failed to send verification email:", error);

      return NextResponse.json(
        {
          message:
            "Registration succeeded, but the verification email could not be sent.",
          userId,
        },
        {
          status: 200,
        },
      );
    }
    return NextResponse.json(
      {
        message: existingUser
          ? "Verification code resent successfully."
          : "Registration successful. Check your email for the verification code.",
        userId,
      },
      {
        status: existingUser ? 200 : 201,
      },
    );
  } catch (error) {
    console.error("Register error.", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
