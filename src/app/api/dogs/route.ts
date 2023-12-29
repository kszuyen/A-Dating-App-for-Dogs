// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 定義 PUT 請求的結構
const putDogRequestSchema = z.object({
  dogname: z.string().min(1).max(100),
  breed: z.string().min(1).max(100),
  gender: z.enum(["male", "female"]),
  birthday: z.string().optional(),
  description: z.string().min(1).max(280),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

type PutDogRequest = z.infer<typeof putDogRequestSchema>;

export async function PUT(request: NextRequest) {
  const data = await request.json();

  const session = await auth();
  if (!session || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const displayId = session.user.id;

  putDogRequestSchema.parse(data);

  const {
    dogname,
    breed,
    gender,
    birthday,
    description,
    imageUrl,
    thumbnailUrl,
  } = data as PutDogRequest;

  try {
    // 檢查是否存在對應的狗狗資料
    const existingDog = await db
      .select()
      .from(dogsTable)
      .where(eq(dogsTable.displayId, displayId))
      .execute();

    if (existingDog.length > 0) {
      // 更新已存在的狗狗資料
      await db
        .update(dogsTable)
        .set({
          dogname,
          breed,
          gender,
          birthday,
          description,
          imageUrl,
          thumbnailUrl,
        })
        .where(eq(dogsTable.displayId, displayId))
        .execute();
      return NextResponse.json({ message: "Dog info updated successfully" });
    } else {
      // 創建新的狗狗資料
      await db
        .insert(dogsTable)
        .values({
          dogname,
          displayId,
          breed,
          gender,
          birthday,
          description,
          imageUrl,
          thumbnailUrl,
        })
        .execute();
      return NextResponse.json({ message: "Dog info created successfully" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const displayId = session.user.id;

    if (!displayId) {
      return new Response(JSON.stringify({ error: "Display ID is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const dbDogs = await db
      .select()
      .from(dogsTable)
      .where(and(eq(dogsTable.displayId, displayId)))
      .execute();

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
