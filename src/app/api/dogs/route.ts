// route.ts
import { NextResponse, type NextRequest } from "next/server";

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

export async function POST(request: NextRequest, res: string) {
  const data = await request.json();

  // try {
  //     // const session = await auth();
  //     // if (!session || !session?.user?.id) {
  //     //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //     // }
  //     // const userId = session.user.id;

  //     postDogRequestSchema.parse(data);
  //     res = "success";
  // } catch (error) {
  //     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  // }

  const {
    dogname,
    breed,
    gender,
    birthday,
    description,
    imageUrl,
    thumbnailUrl,
  } = data as PostDogRequest;
  // const { dogname } = data as PostDogRequest;
  try {
    await db
      .insert(dogsTable)
      .values({
        dogname,
        breed,
        gender,
        birthday,
        description,
        imageUrl,
        thumbnailUrl,
      })
      .execute();
    // await db
    //     .insert(dogsTable)
    //     .values({ dogname })
    //     .execute();

    return NextResponse.json({ message: "Dog info created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
