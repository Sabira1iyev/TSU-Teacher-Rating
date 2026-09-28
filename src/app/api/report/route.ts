import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, reason } = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!reviewId || !reason || !userId) {
      return NextResponse.json(
        {
          message: "Fill all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingReport, error: existingError } = await supabaseAdmin
      .from("reports")
      .select("id")
      .eq("review_id", Number(reviewId))
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingReport) {
      return NextResponse.json(
        {
          message: "You have already reported this review.",
        },
        {
          status: 400,
        },
      );
    }

    const { error: reportError } = await supabaseAdmin.from("reports").insert({
      review_id: Number(reviewId),
      user_id: userId,
      reason: reason,
      is_read: false,
    });

    if (reportError) throw reportError;
    return NextResponse.json(
      {
        message: "Review reported!",
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.log("Report POST error:", err);

    if (
      err.number === 2627 ||
      err.number === 2601 ||
      (err.message && err.message.toLowerCase().includes("unique")) ||
      (err.message && err.message.toLowerCase().includes("duplicate"))
    ) {
      return NextResponse.json(
        {
          message: "This review has already been reported.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You are not authorized to perform this action!",
        },
        {
          status: 401,
        },
      );
    }

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          message: "You are not admin to perform this action",
        },
        {
          status: 403,
        },
      );
    }
    const { data: reports, error: reportsError } = await supabaseAdmin
      .from("reports")
      .select(
        `
      id,
      review_id,
      user_id,
      reason,
      created_at,
      is_read,
      reviews(
      comment,
      professor_id)
      `,
      )
      .order("created_at", { ascending: false });

    if (reportsError) throw reportsError;

    const result = (reports ?? []).map((report) => {
      const review = Array.isArray(report.reviews)
        ? report.reviews[0]
        : report.reviews;
      return {
        ReportId: report.id,
        ReviewId: report.review_id,
        UserId: report.user_id,
        Reason: report.reason,
        CreatedAt: report.created_at,
        IsRead: report.is_read,
        ReviewComment: review?.comment ?? "",
        ProfessorId: review?.professor_id ?? null,
      };
    });

    return NextResponse.json(
      {
        reports: result,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { reportId } = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          message: "You are not admin to perform this action!",
        },
        {
          status: 403,
        },
      );
    }

    if (!reportId) {
      return NextResponse.json(
        {
          message: "Something went wrong, please try again later",
        },
        {
          status: 400,
        },
      );
    }

    const { error: deleteReport } = await supabaseAdmin
      .from("reports")
      .delete()
      .eq("id", Number(reportId));

    if (deleteReport) throw deleteReport;

    return NextResponse.json(
      {
        message: "Report has been dismissed!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("reportId");
    const isRead = searchParams.get("isRead");
    const markAll = searchParams.get("markAll");
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          message: "You are not admin to perform this action!",
        },
        {
          status: 403,
        },
      );
    }
    if (markAll === "true") {
      const { error: markAllReportsError } = await supabaseAdmin
        .from("reports")
        .update({
          is_read: true,
        })
        .eq("is_read", false);

      if (markAllReportsError) throw markAllReportsError;

      return NextResponse.json(
        {
          message: "All marked as read!",
        },
        {
          status: 200,
        },
      );
    }

    if (reportId && isRead) {
      const { error: markPointReportError } = await supabaseAdmin
        .from("reports")
        .update({
          is_read: isRead === "false",
        })
        .eq("id", Number(reportId));

      if (markPointReportError) throw markPointReportError;
      return NextResponse.json(
        {
          message: "Report marked as read!",
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong, please try again later!",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.log("Report PUT error:", error);
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      {
        status: 500,
      },
    );
  }
}
