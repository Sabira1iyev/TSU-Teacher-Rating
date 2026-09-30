import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { emit } from "process";

export async function POST(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );
    if (!session.isAdmin) {
      return NextResponse.json(
        {
          message: "You are not authorized to perform this action",
        },
        {
          status: 401,
        },
      );
    } else {
      const body = await req.json();
      const {
        firstName,
        lastName,
        email,
        faculty,
        department,
        title,
        courses,
      } = body;

      const { data: facultyData, error: facultyError } = await supabaseAdmin
        .from("faculties")
        .select("id")
        .eq("name", faculty)
        .maybeSingle();

      if (facultyError) throw facultyError;

      const facId = facultyData?.id;
      if (!facId) {
        return NextResponse.json(
          {
            message: "The selected faculty could not be found in the database!",
          },
          { status: 400 },
        );
      }

      const { data: existingProf, error: existingProfError } =
        await supabaseAdmin
          .from("professors")
          .select("id")
          .eq("email", email)
          .maybeSingle();

      if (existingProfError) throw existingProfError;
      const existingProfId = existingProf?.id ?? null;

      if (existingProfId) {
        return NextResponse.json(
          { message: "A professor with this email is already registered!" },
          { status: 409 },
        );
      }

      const { data: departmentData, error: departmentError } =
        await supabaseAdmin
          .from("departments")
          .select("id")
          .eq("name", department)
          .eq("faculty_id", facId)
          .maybeSingle();

      if (departmentError) throw departmentError;

      let deptId = departmentData?.id;

      if (!deptId) {
        const { data: newDepartmentData, error: newDepartmentError } =
          await supabaseAdmin
            .from("departments")
            .insert({
              name: department,
              faculty_id: facId,
            })
            .select("id")
            .single();

        if (newDepartmentError) throw newDepartmentError;
        deptId = newDepartmentData?.id;
      }

      const { data: insertResultData, error: insertProfError } =
        await supabaseAdmin
          .from("professors")
          .insert({
            first_name: firstName,
            last_name: lastName,
            email: email,
            title: title,
            department_id: deptId,
          })
          .select("id")
          .single();

      if (insertProfError) throw insertProfError;
      const professorId = insertResultData?.id;

      if (courses && Array.isArray(courses) && courses.length > 0) {
        const coursesToInsert = courses.map((courseName: string) => ({
          professor_id: professorId,
          name: courseName,
        }));

        const { error: coursesError } = await supabaseAdmin
          .from("courses")
          .insert(
            coursesToInsert,
          );
        if (coursesError) throw coursesError;
      }

      return NextResponse.json(
        {
          message: "Data inserted successfully!",
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.log("Prof form error:", error);
    return NextResponse.json(
      {
        message: "Error",
      },
      { status: 500 },
    );
  }
}
