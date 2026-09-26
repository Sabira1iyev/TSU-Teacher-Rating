import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

type FavoritesProfessor = {
  id: number;
  first_name: string;
  last_name: string;
  average_rating: number | string;
  review_count: number;
  title: string | null;
  departments: {
    name: string;
    faculties: {
      name: string;
    } | null;
  } | null;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
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
    const userId = session.userId;

    const { data: favoriteProfessors, error: favoriteError } =
      await supabaseAdmin
        .from("favorites")
        .select(
          `
    created_at,
    professors(
    id,
    first_name,
    last_name,
    average_rating,
    review_count,
    title,
    departments(
    name,
    faculties(
    name
    )
      )
    )
    `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (favoriteError) throw favoriteError;

    const favorites = (favoriteProfessors ?? []).map((favorite) => {
      const professor =
        favorite.professors as unknown as FavoritesProfessor | null;
      return {
        id: professor?.id,
        firstName: professor?.first_name,
        lastName: professor?.last_name,
        overallRating: Number(professor?.average_rating ?? 0),
        reviewCount: professor?.review_count,
        title: professor?.title,
        department: professor?.departments?.name,
        faculty: professor?.departments?.faculties?.name,
      };
    });

    return NextResponse.json(favorites, {
      status: 200,
    });
  } catch (error) {
    console.log("Favorites fetch error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch favorites.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { professorId } = await req.json();
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    if (!session.userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to perform this acion",
        },
        {
          status: 401,
        },
      );
    }
    const userId = session.userId;

    const normalizedProfessorId = Number(professorId);

    const { data: existingFavorite, error: existingFavoriteError } =
      await supabaseAdmin
        .from("favorites")
        .select("user_id")
        .eq("user_id", userId)
        .eq("professor_id", normalizedProfessorId)
        .maybeSingle();

    if (existingFavoriteError) throw existingFavoriteError;
    let isFavorite= false;
    if (existingFavorite) {
      const { error: deleteError } = await supabaseAdmin
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("professor_id", normalizedProfessorId);

      if (deleteError) throw deleteError;
      isFavorite = false;
    } else {
     const{error: insertError} = await supabaseAdmin.from("favorites").insert({
        user_id: userId,
        professor_id: normalizedProfessorId,
      });
      if(insertError)  throw insertError;
       isFavorite = true; 
    }

    return NextResponse.json({
      message: "Favorite added or removed successfully",
      isFavorite,
    });
  } catch (error) {
    console.log("Favorite add/remove error:", error);
    return NextResponse.json(
      {
        message: "Failed to add or remove favorite.",
      },
      {
        status: 500,
      },
    );
  }
}
