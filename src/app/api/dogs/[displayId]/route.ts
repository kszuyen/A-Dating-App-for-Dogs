// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(  req: NextRequest,
  {
    params,
  }: {
    params: {
      displayId: string;
    };
  },) {
  try {
    const session = await auth();

    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dog = await db
      .select()
      .from(dogsTable)
      .where(eq(dogsTable.displayId, params.displayId))
      .limit(1)
      .execute();

    return NextResponse.json(dog[0]);
  } catch (error) {
    console.error("Error fetching dogs data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
