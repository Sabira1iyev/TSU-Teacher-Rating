import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    const hashedPassword = await bcrypt.hash(newPassword, 12);


    const { error } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: hashedPassword,
      })
      .eq("email", email);

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Password changed successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.log("Password reset error:", err);
    return NextResponse.json(
      {
        message: "Error occured while changing password",
      },
      {
        status: 500,
      },
    );
  }
}
