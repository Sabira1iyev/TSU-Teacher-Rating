import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { chatBotLimiter } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await chatBotLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          message: "Too many attempts, please try again later!",
        },
        {
          status: 429,
        },
      );
    }
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
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET!,
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
