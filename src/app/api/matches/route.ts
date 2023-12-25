// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq, ne, or, notInArray, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dogsTable, likedTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 定義 POST 請求的結構
// const postDogRequestSchema = z.object({
//   dogname: z.string().min(1).max(100),
//   breed: z.string().min(1).max(100),
//   gender: z.enum(["male", "female"]),
//   birthday: z.string().optional(),
//   description: z.string().min(1).max(280),
//   imageUrl: z.string().optional(),
//   thumbnailUrl: z.string().optional(),
// });

// type PostDogRequest = z.infer<typeof postDogRequestSchema>;

export async function GET(
    request: NextRequest,
  ) {
  try {
    const session = await auth();

    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const displayId = session.user.id;
    
    // Filter the dogs that i liked
    const dogsILiked = await db
      .select({
        id: likedTable.secondId,
      })
      .from(likedTable)
      .where(eq(likedTable.firstId, displayId))
      .execute();

    const dogsILikedArray: string[] = dogsILiked.map((dog) => dog.id as string);

    // check that if it likes me too
    const matchedDogs = await db
      .select({
        id: likedTable.firstId,
      })
      .from(likedTable)
      .where(and(
        eq(likedTable.secondId, displayId),
        inArray(likedTable.firstId, dogsILikedArray)
      ));

      const matchedDogsArray: string[] = matchedDogs.map((dog) => dog.id as string);

      // get the dogs' data
      const matchedDogsData = await db
      .select({
        id: dogsTable.displayId,
        dogname: dogsTable.dogname,
        breed: dogsTable.breed,
        gender: dogsTable.gender,
        birthday: dogsTable.birthday,
        description: dogsTable.description,
        image_url: dogsTable.imageUrl,
        thumbnail_url: dogsTable.thumbnailUrl,
      })
      .from(dogsTable)
      .where(
        and(
          ne(dogsTable.displayId, displayId),
          inArray(dogsTable.displayId, matchedDogsArray)
        )
      )
      .execute();

    return NextResponse.json(matchedDogsData);
  } 
  catch (error) 
  {
    console.error("Error fetching dogs data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
