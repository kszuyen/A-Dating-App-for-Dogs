// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      displayId: string;
    };
  },
) {
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
    console.error("Error fetching dogs data 3:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const UpdateDogSchema = z.object({
  dogname: z.string().optional(),
  breed: z.string().optional(),
  // Add other fields you want to be updatable here
});

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      displayId: string;
    };
  },
) {
  try {
    const session = await auth();

    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const parsedBody = UpdateDogSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Update the dog information in the database
    await db
      .update(dogsTable)
      .set(parsedBody.data)
      .where(eq(dogsTable.displayId, params.displayId))
      .execute();

    return NextResponse.json({ message: "Dog updated successfully" });
  } catch (error) {
    console.error("Error updating dog data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
