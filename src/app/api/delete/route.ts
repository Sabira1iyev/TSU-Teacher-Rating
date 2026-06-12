import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        {
          message: "Something went wrong, please try again",
        },
        {
          status: 400,
        },
      );
    }

    const db = await getDb();

    await db.request().input("userId", userId).query(`
        DELETE FROM ReviewTags WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE UserId = @userId);
        DELETE FROM ReviewInteractions WHERE ReviewId IN (SELECT ReviewId FROM Reviews WHERE UserId = @userId);
        DELETE FROM ReviewInteractions WHERE UserId = @userId;
        DELETE FROM Favorites WHERE UserId = @userId;
        DELETE FROM Reviews WHERE UserId = @userId;
        DELETE FROM Users WHERE UserId = @userId;
        `);

    return NextResponse.json(
      {
        message: "User has been deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      {
        message: "User couldn't be deleted",
      },
      {
        status: 500,
      },
    );
  }
}
