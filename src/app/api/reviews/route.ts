import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Reviews from FRONTEND", body);

    const pool = await getDb();

    const result = await pool
      .request()
      .input("ProfessorId", body.professorId)
      .input("UserId", 1)
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
      `
    );

    return NextResponse.json({ message: "REVIEWS received" }, { status: 200 });
  } catch (error: any) {
    console.log("API ERROR", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
