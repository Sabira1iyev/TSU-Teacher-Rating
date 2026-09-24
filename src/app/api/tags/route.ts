import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tags")
      .select("name")
      .order("name", { ascending: true });

    if (error) {
      console.log("Error to fetch tags from supabase:", error);
      return NextResponse.json(
        {
          message: "Failed to fetch tags",
        },
        {
          status: 500,
        },
      );
    }
    return NextResponse.json((data ?? []).map((tag) => ({ Name: tag.name })));
  } catch (error) {
    console.error("Unexpected error while fetching tags:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch tags",
      },
      { status: 500 },
    );
  }
}
