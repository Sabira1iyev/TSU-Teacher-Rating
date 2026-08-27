import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!session.isLoggedIn) {
      return NextResponse.json(
        {
          message: "You must be logged in to use this feature",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();

    const fastApiResponse = await fetch(process.env.AI_SERVICE_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await fastApiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log("Chat proxy error", error);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      {
        status: 500,
      },
    );
  }
}
