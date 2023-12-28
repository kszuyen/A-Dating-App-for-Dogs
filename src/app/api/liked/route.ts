// route.ts
import { NextResponse, type NextRequest } from "next/server";

// import { first } from "cheerio/lib/api/traversing";
import { and, desc, eq, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dogsTable, likedTable, messagesTable } from "@/db/schema";
import Pusher from "pusher";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
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
    async function applypusher() {
//pusher for main page: channel: my Id
const [otherpersonLiked] = await db
.select()
.from(likedTable)
.where(
  and(
    eq(likedTable.firstId, parsedData.secondId),
    eq(likedTable.secondId, parsedData.firstId),
    eq(likedTable.likeStatus, true)
  )
);
  //     // Trigger pusher event
const pusher = new Pusher({
  appId: privateEnv.PUSHER_ID,
  key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
  secret: privateEnv.PUSHER_SECRET,
  cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

if (parsedData.likeStatus && otherpersonLiked) {
    // Private channels are in the format: private-...
  const channelName_1 =`private-${parsedData.firstId}`;
  await pusher.trigger(channelName_1, "liked:mainpage", {
    // newMessage: inputMessage
    currentMatched: true
  });

  //pusher for match page: channel: otherUserId

  // get my dog's info
  const [myDogInfo] = await db
  .select()
  .from(dogsTable)
  .where(eq(dogsTable.displayId, parsedData.firstId));
  
  const channelName_2 =`private-${parsedData.secondId}`;
  await pusher.trigger(channelName_2, "liked:matchpage", {
    dog: myDogInfo,
    lastMessage: {
      content: null,
      senderId: null,
      sentAt: null,
    }
  });
}

    }

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

        applypusher();

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

      applypusher();

      

    return NextResponse.json(
      { message: "Like added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
