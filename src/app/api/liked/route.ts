// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { first } from "cheerio/lib/api/traversing";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { likedTable } from "@/db/schema";

// 更新為您的 likedTable
// import { auth } from "@/lib/auth";

// 定義 POST 請求的結構
const postLikedRequestSchema = z.object({
  firstId: z.string().uuid(),
  secondId: z.string().uuid(),
  likeStatus: z.boolean(),
});

type PostLikedRequest = z.infer<typeof postLikedRequestSchema>;

export async function GET(request: NextRequest) {
  try {
    // Awaiting the database query to complete
    const dbliked = await db.select().from(likedTable).execute();
    return NextResponse.json(dbliked);
  } catch (error) {
    console.error("Error fetching liked data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as PostLikedRequest;
    const parsedData = postLikedRequestSchema.parse(data);

    // 檢查是否已存在相同的 like
    const existingLike = await db
      .select()
      .from(likedTable)
      .where(
        and(
          eq(likedTable.firstId, parsedData.firstId),
          eq(likedTable.secondId, parsedData.secondId),
        ),
      )
      .execute();

    if (existingLike.length > 0) {
      // 更新現有的 like
      await db
        .update(likedTable)
        .set({ likeStatus: parsedData.likeStatus })
        .where(eq(likedTable.id, existingLike[0].id))
        .execute();

      return NextResponse.json(
        { message: "Like updated successfully" },
        { status: 200 },
      );
    }

    // 插入新的 like
    await db
      .insert(likedTable)
      .values({
        firstId: parsedData.firstId,
        secondId: parsedData.secondId,
        likeStatus: parsedData.likeStatus,
      })
      .execute();

    return NextResponse.json(
      { message: "Like added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
