import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { chatBotUserLimiter } from "@/lib/ratelimit";
import { validateChatBody } from "@/lib/validateChatBody";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Use the authenticated session and database as the source of truth. Never
    // trust profile details sent by the browser for personalized answers.
    const [{ data: profile, error: profileError }, { data: professors, error: professorsError }] =
      await Promise.all([
        supabaseAdmin
          .from("users")
          .select("display_name, faculty, academic_level")
          .eq("id", session.userId)
          .maybeSingle(),
        supabaseAdmin
          .from("professors")
          .select("id, first_name, last_name, title, average_rating, review_count, departments(name, faculties(name)), courses(name)"),
      ]);

    if (profileError || professorsError) {
      console.error("Chat context lookup failed", profileError ?? professorsError);
      return NextResponse.json({ message: "Chat context is unavailable." }, { status: 502 });
    }

    const nameParts = (profile?.display_name ?? "").trim().split(/\s+/);
    const user = {
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      faculty: profile?.faculty ?? "",
      studyYear: profile?.academic_level ?? "",
    };

    const fastApiResponse = await fetch(process.env.AI_SERVICE_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET!,
      },
      body: JSON.stringify({ history: body.history, user, professors: professors ?? [] }),
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
