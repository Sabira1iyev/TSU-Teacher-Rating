import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, faculty, studyYear } = body;

    {
      /* validation */
    }
    if (!email || !password || !faculty || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const db = await getDb();

    const existing = await db
      .request()
      .input("Email", email)
      .query("SELECT UserId FROM Users WHERE Email = @Email");

    if (existing.recordset.length > 0) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 },
      );
    }

    // create hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);

    const result = await db
      .request()
      .input("Email", email)
      .input("PasswordHash", passwordHash)
      .input("DisplayName", `${firstName} ${lastName}`)
      .input("AcademicLevel", studyYear)
      .input("Faculty", faculty)
      .input("IsVerified", 0)
      .input("VerificationCode", verificationCode)
      .input("VerificationExpiry", expiryDate)
      .query(
        `INSERT INTO Users(
        Email, PasswordHash, DisplayName, AcademicLevel, Faculty, IsVerified, CreatedAt, VerificationCode, VerificationExpiry)
        OUTPUT INSERTED.UserId
        VALUES(@Email, @PasswordHash, @DisplayName, @AcademicLevel, @Faculty, @IsVerified, GETDATE(), @VerificationCode, @VerificationExpiry)`,
      );

    const userId = result.recordset[0].UserId;

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Adjust if using another service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TSU Teacher Rating" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${verificationCode}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Thank you for registering. Your verification code is:</p>
          <h1 style="color: #0060a9; letter-spacing: 5px;">${verificationCode}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Failed to send verification email:", mailError);
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        userId,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error.", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
