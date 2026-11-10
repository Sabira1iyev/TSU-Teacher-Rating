import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { chatBotIpLimiter } from "@/lib/ratelimit";
import { validateChatBody } from "@/lib/validateChatBody";

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

    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();
    const { success: chatBotSuccess } = await chatBotIpLimiter.limit(
      String(session.userId),
    );
    if (!chatBotSuccess) {
      return NextResponse.json(
        {
          message: "Too many attempts, please try again later!",
        },
        {
          status: 429,
        },
      );
    }

    const body = await req.json();

    const validationChatBodyError = validateChatBody(body);
    if (validationChatBodyError) {
      return NextResponse.json(
        {
          message: validationChatBodyError,
        },
        {
          status: 400,
        },
      );
    }

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
