import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

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
          error: "Fill all required fields.",
          message: "Fill all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    const pool = await getDb();

    const checkReport = await pool
      .request()
      .input("reviewId", reviewId)
      .input("userId", userId)
      .query(
        `
        SELECT * FROM Reports
        WHERE ReviewId = @reviewId AND UserId = @userId
        `,
      );

    if (checkReport.recordset.length > 0) {
      return NextResponse.json(
        {
          error: "You have already reported this review.",
          message: "You have already reported this review.",
        },
        {
          status: 400,
        },
      );
    }

    await pool
      .request()
      .input("reviewId", reviewId)
      .input("reason", reason)
      .input("userId", userId)
      .query(
        `
        INSERT INTO Reports(ReviewId, Reason, UserId)
        VALUES(
         @reviewId,
         @reason,
         @userId
      )
        `,
      );

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
          error: "This review has already been reported.",
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
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");
    const pool = await getDb();
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
    const userId = session.userId;

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          message: "You are not admin to perform this action",
        },
        {
          status: 403,
        },
      );
    } else {
      const result = await pool
        .request()
        .input("reviewId", reviewId)
        .input("userId", userId)
        .query(
          `
        SELECT
        r.ReportId,
        r.ReviewId,
        r.UserId,
        r.Reason,
        r.CreatedAt,
        r.IsRead,
        rev.Comment as ReviewComment,
        rev.ProfessorId
        FROM Reports r
        JOIN Reviews rev ON r.ReviewId = rev.ReviewId
        ORDER BY r.CreatedAt DESC
        `,
        );
      return NextResponse.json(
        {
          reports: result.recordset,
        },
        { status: 200 },
      );
    }
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
          error: "Something went wrong, please try again later",
          message: "Something went wrong, please try again later",
        },
        {
          status: 400,
        },
      );
    }

    const pool = await getDb();

    await pool
      .request()
      .input("reportId", reportId)
      .query(
        `
      DELETE FROM Reports
      WHERE ReportId = @reportId
      `,
      );
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

    const pool = await getDb();

    if (markAll === "true") {
      await pool.request().query(
        `
        UPDATE Reports
        SET IsRead = 1
        `,
      );
      return NextResponse.json(
        {
          message: "All marked as read!",
        },
        {
          status: 200,
        },
      );
    } else if (reportId && isRead) {
      await pool
        .request()
        .input("reportId", reportId)
        .input("isRead", isRead === "true" ? 1 : 0)
        .query(
          `
      UPDATE Reports 
      SET IsRead = @isRead
      WHERE ReportId = @reportId 
            
      `,
        );
      return NextResponse.json(
        {
          message: "Report marked as read!",
        },
        {
          status: 200,
        },
      );
    } else {
      return NextResponse.json(
        {
          message: "Something went wrong, please try again later!",
          error: "Something went wrong, please try again later!",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.log("Report PUT error:", error);
    return NextResponse.json(
      {
        error: "Internal server error!",
      },
      {
        status: 500,
      },
    );
  }
}
