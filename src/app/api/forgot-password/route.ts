import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import nodemailer from "nodemailer";
import { forgotPasswordLimiter } from "@/lib/ratelimit";

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
    const db = await getDb();

    const user = await db
      .request()
      .input("Email", email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    if (user.recordset.length === 0) {
      return NextResponse.json(
        {
          message: "Email not found",
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

    await db
      .request()
      .input("Email", email)
      .input("Code", verificationCode)
      .input("Expiry", expiryDate)
      .query(
        `
        UPDATE Users
        set VerificationCode = @Code,
        VerificationExpiry = @Expiry
        WHERE Email = @Email;
        `,
      );

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
