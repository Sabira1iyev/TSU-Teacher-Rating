import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

type ProfessorWithRelations = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  average_rating: number | string;
  review_count: number;
  title: string | null;
  photo_url: string | null;
  created_at: string;
  departments: {
    name: string;
    faculties: {
      name: string;
    } | null;
  } | null;
  courses: Array<{ name: string }>;
};

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!session.isLoggedIn) {
      return NextResponse.json(
        {
          message: "You must be logged in to view professors",
        },
        {
          status: 401,
        },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("professors")
      .select(
        `
      id,
      first_name,
      last_name,
      email,
      average_rating,
      review_count,
      title,
      photo_url,
      created_at,
      departments(
      name, 
      faculties(name)
      ),
      courses(name)

      `,
      )
      .order("last_name", { ascending: true });

    if (error) {
      console.log("Error to fetch professors from supabase:", error);
      return NextResponse.json(
        {
          message: "Failed to fetch professors",
        },
        {
          status: 500,
        },
      );
    }
    const professorRows = (data ?? []) as unknown as ProfessorWithRelations[];
    const professors = professorRows.map((professor) => ({
      id: professor.id,
      firstName: professor.first_name,
      lastName: professor.last_name,
      email: professor.email,
      overallRating: professor.average_rating,
      reviewCount: professor.review_count,
      title: professor.title,
      photoUrl: professor.photo_url,
      createdAt: professor.created_at,
      department: professor.departments?.name ?? "",
      faculty: professor.departments?.faculties?.name ?? "",
      courses: (professor.courses ?? []).map((course) => course.name),
      recommendationRate: 0,
      trendData: [],
      badges: [],
      criteria: {
        teachingQuality: Number(professor.average_rating),
        examDifficulty: Number(professor.average_rating),
        homeworkLoad: Number(professor.average_rating),
        accessibility: Number(professor.average_rating),
        examControlLevel: Number(professor.average_rating),
      },
    }));

    return NextResponse.json(professors);
  } catch (error) {
    console.log("Unexpexted professors endpoint error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
