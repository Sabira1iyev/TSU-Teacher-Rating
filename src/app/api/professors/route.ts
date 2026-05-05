import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(){
    try{
        const db = await getDb();
    }

    catch(error){
        console.log(error);
        return NextResponse.json(
            {message: ""}
        )
    }
}