// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 定義 POST 請求的結構
const postDogRequestSchema = z.object({
  dogname: z.string().min(1).max(100),
  breed: z.string().min(1).max(100),
  gender: z.enum(["male", "female"]),
  birthday: z.string().optional(),
  description: z.string().min(1).max(280),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

type PostDogRequest = z.infer<typeof postDogRequestSchema>;

export async function GET(request: NextRequest) {
  try {
    //   const session = await auth();

    //   if (!session || !session?.user?.id) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //   }

    //   const displayId = session.user.id;

    //   if (!displayId) {
    //     return new Response(JSON.stringify({ error: "Display ID is required" }), {
    //       status: 400,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //   }

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
