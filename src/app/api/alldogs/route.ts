// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const dbDogs = await db.select().from(dogsTable).execute();

    return NextResponse.json(dbDogs);
  } catch (error) {
    console.error("Error fetching dogs data 2:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
