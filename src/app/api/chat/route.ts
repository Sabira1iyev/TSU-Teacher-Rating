import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { chatBotUserLimiter } from "@/lib/ratelimit";
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


    const { success: chatBotSuccess } = await chatBotUserLimiter.limit(
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
      body: JSON.stringify({ history: body.history }),
    });
    const data = await fastApiResponse.json();
    if (!fastApiResponse.ok) {
      return NextResponse.json(
        {
          message: "Chat service is unavailable.",
        },
        {
          status: 502,
        },
      );
    }
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
