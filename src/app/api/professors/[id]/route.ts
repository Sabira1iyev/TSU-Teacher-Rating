import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = getDb();
  try {
    const { id } = await params;
    const rawUserId = req.nextUrl.searchParams.get("userId");
    const userId = rawUserId && rawUserId !== "undefined" ? rawUserId : null;

    const result = await (
      await db
    )
      .request()
      .input("Id", id)
      .query(
        `
                    Select
        p.ProfessorId as id,
        p.FirstName as firstName,
        p.LastName as lastName,
        p.Email as email,
        p.AverageRating as overallRating,
        p.reviewCount as reviewCount,
        p.Title as title,
        p.PhotoUrl as photoUrl,
        p.CreatedAt as createdAt,
        d.Name as department,
        f.Name as faculty
        FROM Professors p
        LEFT JOIN Departments d ON p.DepartmentId = d.DepartmentId
        LEFT JOIN Faculties f ON d.FacultyId = f.FacultyId
        WHERE p.ProfessorId = @Id
            `,
      );

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "Professor not found!" },
        { status: 404 },
      );
    }

    const p = result.recordset[0];

    const trenddResult = await (await db).request().input("ProfId", id).query(`
      SELECT
      FORMAT(CreatedAt, 'MMM', 'en-US') as month,
      AVG(CAST(OverallRating as FLOAT)) as rating,
      COUNT(*) as reviewCount
      FROM Reviews
      WHERE ProfessorId = @ProfId
      AND CreatedAt >= DATEADD(MONTH, -6, GETDATE())
      GROUP BY FORMAT(CreatedAt, 'MMM', 'en-US'), MONTH(CreatedAt)
      ORDER BY MONTH(CreatedAt)
      `);

    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString("en-US", { month: "short" }));
    }

    const finalTrendData = months.map((monthName) => {
      const existingData = trenddResult.recordset.find(
        (row) => row.month === monthName,
      );
      if (existingData) {
        return {
          month: monthName,
          rating: existingData.rating,
          reviewCount: existingData.reviewCount,
        };
      } else {
        return {
          month: monthName,
          rating: 0,
          reviewCount: 0,
        };
      }
    });

    const fullCourses = await (
      await db
    )
      .request()
      .input("ProfId", id)
      .query(
        `
        SELECT CourseName FROM Courses WHERE ProfessorId = @ProfId `,
      );

    const fullProfessor = {
      ...p,
      courses: fullCourses.recordset.map((c: any) => c.CourseName) || [],
      recommendationRate: 0,
      trendData: finalTrendData,
    };

    const reviewResult = await (
      await db
    )
      .request()
      .input("ProfId", id)
      .input("ViewerId", userId)
      .query(
        `
      SELECT
      (SELECT COUNT(*) FROM ReviewInteractions WHERE ReviewId = r.ReviewId AND InteractionType = 'LIKE') as likeCount,
      (SELECT COUNT(*) FROM ReviewInteractions WHERE ReviewId = r.ReviewId AND InteractionType = 'DISLIKE') as dislikeCount,
      (SELECT InteractionType FROM ReviewInteractions WHERE ReviewId = r.ReviewId AND UserId = @ViewerId) as userInteraction,
      r.ReviewId as id,
      r.UserId as userId,
      r.ProfessorId as professorId,
      r.CourseName as courseName,
      r.Semester as semester,
      r.OverallRating as overallRating,
      r.Comment as comment,
      r.CreatedAt as createdAt,
      r.TeachingRating as teaching,
      r.ExamDifficultyRating as examDifficulty,
      r.HomeWorkRating as homeWork,
      r.AccessibilityRating as accessibility,
      r.ExamControlRating as examControlLevel,
      r.WouldRecommend as wouldRecommend,
      r.IsAnonymus as isAnonymus,
      (SELECT STRING_AGG(t.Name, ',' )
      FROM ReviewTags rt
      JOIN Tags t ON rt.TagId = t.TagId
      WHERE rt.ReviewId = r.ReviewId) as tagsString
      FROM Reviews r
      WHERE r.ProfessorId = @ProfId
      ORDER BY r.CreatedAt DESC
      `,
      );

    const reviews = reviewResult.recordset.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      professorId: r.professorId.toString(),
      courseName: r.courseName || "",
      semester: r.semester || "",
      overallRating: r.overallRating || 0,
      criteria: {
        teaching: r.teaching || 0,
        examDifficulty: r.examDifficulty || 0,
        homeWork: r.homeWork || 0,
        accessibility: r.accessibility || 0,
        examControlLevel: r.examControlLevel || 0,
      },
      comment: r.comment || "",
      tags: r.tagsString ? r.tagsString.split(",") : [],
      wouldRecommend: r.wouldRecommend || false,
      isAnonymous: r.isAnonymus || true,
      displayDate: new Date(r.createdAt).toLocaleDateString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      createdAt: r.createdAt,
      likeCount: r.likeCount || 0,
      dislikeCount: r.dislikeCount || 0,
      userInteraction: r.userInteraction || null,
    }));

    const recommendCount = reviews.filter((r) => r.wouldRecommend).length;
    const totalReviews = reviews.length;

    const breakDown = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter(
        (r) => Math.floor(r.overallRating) === star,
      ).length;

      const percent =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

      return { star, percent };
    });

    fullProfessor.ratingBreakDown = breakDown;

    fullProfessor.recommendationRate =
      totalReviews > 0 ? Math.round((recommendCount / totalReviews) * 100) : 0;

    fullProfessor.reviews = reviews;

    fullProfessor.criteria = {
      teaching: totalReviews
        ? reviews.reduce((sum, r) => sum + r.criteria.teaching, 0) /
          totalReviews
        : 0,
      examDifficulty: totalReviews
        ? reviews.reduce((sum, r) => sum + r.criteria.examDifficulty, 0) /
          totalReviews
        : 0,
      homeWork: totalReviews
        ? reviews.reduce((sum, r) => sum + r.criteria.homeWork, 0) /
          totalReviews
        : 0,
      accessibility: totalReviews
        ? reviews.reduce((sum, r) => sum + r.criteria.accessibility, 0) /
          totalReviews
        : 0,
      examControlLevel: totalReviews
        ? reviews.reduce((sum, r) => sum + r.criteria.examControlLevel, 0) /
          totalReviews
        : 0,
    };

    return NextResponse.json(fullProfessor, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error!",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await params;
    const db = getDb();

    await (
      await db
    )
      .request()
      .input("Id", id)
      .query(
        `
      DELETE FROM ReviewTags WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE ProfessorId = @Id);
      DELETE FROM ReviewInteractions WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE ProfessorID = @Id);
      DELETE FROM Favorites WHERE ProfessorId = @Id;
      DELETE FROM Reviews WHERE ProfessorId = @Id;
      DELETE FROM Professors WHERE ProfessorId = @Id;
      `,
      );

    return NextResponse.json(
      { message: "Professor has been deleted!" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Professor deletion error: ", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
