import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, interactionType } = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    const userId = session.userId;

    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to perform this action!",
        },
        {
          status: 401,
        },
      );
    }

    if (!reviewId || !["LIKE", "DISLIKE"].includes(interactionType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid interaction data.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingInteraction, error: existingError } =
      await supabaseAdmin
        .from("review_interactions")
        .select("interaction_type")
        .eq("user_id", userId)
        .eq("review_id", Number(reviewId))
        .maybeSingle();

    if (existingError) throw existingError;

    if (!existingInteraction) {
      const { error: insertInteractionError } = await supabaseAdmin
        .from("review_interactions")
        .insert({
          user_id: userId,
          review_id: Number(reviewId),
          interaction_type: interactionType,
        });
      if (insertInteractionError) throw insertInteractionError;
    } else {
      if (existingInteraction.interaction_type === interactionType) {
        const { error: deleteInteractionError } = await supabaseAdmin
          .from("review_interactions")
          .delete()
          .eq("user_id", userId)
          .eq("review_id", Number(reviewId));

        if (deleteInteractionError) throw deleteInteractionError;
      } else {
        const { error: updateInteractionsError } = await supabaseAdmin
          .from("review_interactions")
          .update({
            interaction_type: interactionType,
          })
          .eq("user_id", userId)
          .eq("review_id", Number(reviewId));
        if (updateInteractionsError) throw updateInteractionsError;
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
