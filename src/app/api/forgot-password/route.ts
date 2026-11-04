import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  forgotPasswordLimiter,
  forgotPasswordEmailLimiter,
} from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();
    const { success: ipOk } = await forgotPasswordLimiter.limit(ip);
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
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          message: "Invalid request",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { success: emailOk } =
      await forgotPasswordEmailLimiter.limit(normalizedEmail);

    if (!emailOk) {
      return NextResponse.json(
        {
          message: "Too many attempts! Please try again later.",
        },
        {
          status: 429,
        },
      );
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return NextResponse.json(
        {
          message: "If this email address is registered, a code has been sent.",
        },
        {
          status: 200,
        },
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);

    const { error: updatePasswordError } = await supabaseAdmin
      .from("users")
      .update({
        verification_code: verificationCode,
        verification_expiry: expiryDate.toISOString(),
      })
      .eq("email", normalizedEmail);

    if (updatePasswordError) throw updatePasswordError;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TSU Teacher Rating" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Password Reset",
      text: `Your password reset code is: ${verificationCode}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #0060a9; letter-spacing: 5px;">${verificationCode}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Email sent successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Error sending mail", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
