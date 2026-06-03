import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const { userId, reviewId, interactionType } = await req.json();

    const result = await db
      .request()
      .input("UserId", userId)
      .input("ReviewId", reviewId)
      .input("InteractionType", interactionType)
      .query(
        `
             SELECT * FROM ReviewInteractions
             WHERE UserId = @UserId and ReviewId = @ReviewId
             `,
      );
    const existingInteraction = result.recordset[0];

    if (!existingInteraction) {
      const inserInteraction = await db
        .request()
        .input("UserId", userId)
        .input("ReviewId", reviewId)
        .input("InteractionType", interactionType)
        .query(
          `
                INSERT INTO ReviewInteractions(UserId, ReviewId, InteractionType)
                VALUES (@UserId, @ReviewId, @InteractionType)                
                `,
        );
    } else {
      if (existingInteraction.InteractionType === interactionType) {
        const deleteInteraction = await db
          .request()
          .input("UserId", userId)
          .input("ReviewId", reviewId)
          .input("InteractionType", interactionType)
          .query(
            `
                    DELETE FROM ReviewInteractions
                    WHERE UserId = @UserId and ReviewId = @ReviewId and InteractionType = @InteractionType
                    `,
          );
      } else {
        const updateInteraction = await db
          .request()
          .input("UserId", userId)
          .input("ReviewId", reviewId)
          .input("InteractionType", interactionType)
          .query(
            `
                    UPDATE ReviewInteractions
                    SET InteractionType = @InteractionType
                    WHERE UserId = @UserId and ReviewId = @ReviewId                    
                    `,
          );
      }
    }
    return NextResponse.json({
      success: true,
      message: "Interaction updated successfully.",
    });
  } catch (error) {
    console.log("Interaction error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update interaction." },
      { status: 500 },
    );
  }
}
