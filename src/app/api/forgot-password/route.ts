import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { forgotPasswordLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await forgotPasswordLimiter.limit(ip);
    if (!success) {
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

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        },
      );
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return NextResponse.json(
        {
          message: "No user found with this email",
        },
        {
          status: 404,
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
      .eq("email", email);

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
      to: email,
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
