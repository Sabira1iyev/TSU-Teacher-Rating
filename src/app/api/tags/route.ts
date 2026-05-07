import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const pool = await getDb();
    const result = pool.request().query(
      `
            SELECT Name from Tags
            `,
    );

    return NextResponse.json((await result).recordset);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch tags",
      },
      { status: 500 },
    );
  }
}
