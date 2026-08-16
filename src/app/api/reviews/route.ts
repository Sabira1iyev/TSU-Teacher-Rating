import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;
    const professorId = session.professorId;

    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You have to be logged in to submit a review",
        },
        { status: 401 },
      );
    }
    

    const pool = await getDb();

    const result = await pool
      .request()
      .input("ProfessorId", professorId)
      .input("UserId", userId)
      .input("CourseName", body.courseName)
      .input("Semester", body.semester)
      .input("TeacherRating", body.criteria.teaching)
      .input("ExamDifficultyRating", body.criteria.examDifficulty)
      .input("HomeWorkRating", body.criteria.homeWork)
      .input("AccessibilityRating", body.criteria.accessibility)
      .input("ExamControlRating", body.criteria.examControlLevel)
      .input("WouldRecommend", body.wouldRecommend ? 1 : 0)
      .input("OverallRating", body.overallRating)
      .input("Comment", body.comment)
      .input("IsAnonymus", 1)
      .query(
        `
        INSERT INTO Reviews(
        ProfessorId,
        UserId,
        OverallRating,
        Comment,
        IsAnonymus,
        CourseName,
        Semester,
        TeachingRating,
        ExamDifficultyRating,
        HomeWorkRating,
        AccessibilityRating,
        ExamControlRating,
        WouldRecommend
        )
        OUTPUT INSERTED.ReviewId
        VALUES(
        @ProfessorId,
        @UserId,
        @OverallRating,
        @Comment,
        @IsAnonymus,
        @CourseName,
        @Semester,
        @TeacherRating,
        @ExamDifficultyRating,
        @HomeWorkRating,
        @AccessibilityRating,
        @ExamControlRating,
        @WouldRecommend
        )
        `,
      );

    const newReviewId = result.recordset[0].ReviewId;

    if (body.tags && body.tags.length > 0) {
      for (const tagName of body.tags) {
        const tagResult = await pool
          .request()
          .input("TagName", tagName)
          .query("Select TagId from Tags where Name=@TagName");

        if (tagResult.recordset.length > 0) {
          const tagId = tagResult.recordset[0].TagId;

          await pool
            .request()
            .input("ReviewId", newReviewId)
            .input("TagId", tagId)
            .query(
              `
                INSERT INTO ReviewTags(ReviewId, TagId) values (
                @ReviewId, 
                @TagId
                )
                `,
            );
        }
      }
    }

    await pool
      .request()
      .input("ProfessorId", body.professorId)
      .query(
        `
      UPDATE Professors
      SET
      reviewCount = (SELECT COUNT(*) FROM Reviews WHERE ProfessorId = @ProfessorId),
      AverageRating = (SELECT AVG(CAST(OverallRating as FLOAT)) FROM Reviews
      WHERE ProfessorId = @ProfessorId)
      WHERE ProfessorId = @ProfessorId      
      `,
      );

    return NextResponse.json({ message: "REVIEWS received" }, { status: 200 });
  } catch (error: any) {
    console.log("API ERROR", error);
    return NextResponse.json(
      {
        message:
          "An unknown error occurred while saving the review. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const reviewId = req.nextUrl.searchParams.get("reviewId");
    const body = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!reviewId || !session.userId) {
      return NextResponse.json(
        {
          message: "Missing information",
        },
        {
          status: 400,
        },
      );
    }
    const pool = await getDb();

    const ownerCheck = await pool
      .request()
      .input("ReviewId", reviewId)
      .input("UserId", userId)
      .query(
        `
      SELECT * FROM Reviews
      WHERE ReviewId = @ReviewId AND UserId = @UserId;
      `,
      );
    if (ownerCheck.recordset.length === 0) {
      return NextResponse.json(
        {
          message: "Not authorized!",
        },
        {
          status: 403,
        },
      );
    }

    await pool
      .request()
      .input("UserId", userId)
      .input("ReviewId", reviewId)
      .input("CourseName", body.courseName)
      .input("Semester", body.semester)
      .input("TeacherRating", body.criteria.teaching)
      .input("ExamDifficultyRating", body.criteria.examDifficulty)
      .input("HomeWorkRating", body.criteria.homeWork)
      .input("AccessibilityRating", body.criteria.accessibility)
      .input("ExamControlRating", body.criteria.examControlLevel)
      .input("WouldRecommend", body.wouldRecommend ? 1 : 0)
      .input("OverallRating", body.overallRating)
      .input("Comment", body.comment)
      .query(
        `
      UPDATE Reviews
      SET 
      CourseName = @CourseName,
      Semester = @Semester,
      TeachingRating = @TeacherRating,
      ExamDifficultyRating = @ExamDifficultyRating,
      HomeWorkRating = @HomeWorkRating,
      AccessibilityRating = @AccessibilityRating,
      ExamControlRating = @ExamControlRating,
      WouldRecommend = @WouldRecommend,
      OverallRating = @OverallRating,
      Comment = @Comment
      WHERE ReviewId = @ReviewId
      `,
      );

    await pool
      .request()
      .input("ReviewId", reviewId)
      .query(
        `
      DELETE FROM ReviewTags
      WHERE ReviewId = @ReviewId
      `,
      );
    if (body.tags && body.tags.length > 0) {
      for (const tagName of body.tags) {
        const tagResult = await pool
          .request()
          .input("TagName", tagName)
          .query("SELECT TagId FROM Tags WHERE Name = @TagName");

        if (tagResult.recordset.length > 0) {
          const tagId = tagResult.recordset[0].TagId;
          await pool
            .request()
            .input("ReviewId", reviewId)
            .input("TagId", tagId)
            .query(
              `
            INSERT INTO ReviewTags(ReviewId, TagId)
            VALUES(
              @ReviewId,
              @TagId)
            `,
            );
        }
      }
    }

    await pool
      .request()
      .input("ProfessorId", body.professorId)
      .query(
        `
     UPDATE Professors
     SET
     AverageRating = (
     SELECT AVG(CAST(OverallRating as FLOAT)) FROM Reviews WHERE ProfessorId = @ProfessorId)
     WHERE ProfessorId = @ProfessorId;
      `,
      );

    return NextResponse.json(
      {
        message: "Review updated successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.log("PUT api error", err);
    return NextResponse.json(
      {
        message: "An error occurred while updating the review.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const reviewId = req.nextUrl.searchParams.get("reviewId");
    const body = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!reviewId || !body.professorId) {
      return NextResponse.json(
        {
          message: "Missing information!",
        },
        { status: 400 },
      );
    }

    const pool = await getDb();

    const ownerCheck = await pool
      .request()
      .input("ReviewId", reviewId)
      .input("UserId", userId)
      .query(
        `
      SELECT ReviewId FROM Reviews
      WHERE ReviewId = @ReviewId AND UserId = @UserId
      `,
      );

    if (ownerCheck.recordset.length === 0) {
      return NextResponse.json(
        {
          message: "Not found or not authorized",
        },
        {
          status: 403,
        },
      );
    }

    await pool
      .request()
      .input("ReviewId", reviewId)
      .input("UserId", userId)
      .input("ProfessorId", body.professorId)
      .query(
        `
      DELETE FROM ReviewTags
      WHERE ReviewId= @ReviewId;
      
      DELETE FROM Reviews
      WHERE ReviewId= @ReviewId;

      UPDATE Professors
      SET 
      reviewCount = (SELECT COUNT(*) FROM Reviews WHERE ProfessorId = @ProfessorId),
      AverageRating = (SELECT AVG(CAST(OverallRating as FLOAT)) FROM Reviews WHERE ProfessorID = @ProfessorId)
      WHERE ProfessorId = @ProfessorId;
      `,
      );

    return NextResponse.json(
      {
        message: "Review deleted successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Review Delete api error", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the review.",
      },
      {
        status: 500,
      },
    );
  }
}
