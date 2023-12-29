// route.ts
import { NextResponse, type NextRequest } from "next/server";

import { and, eq, ne, or, inArray, desc } from "drizzle-orm";

import { db } from "@/db";
import { dogsTable, likedTable, messagesTable } from "@/db/schema";

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
    const displayId = params.displayId;

    // Filter the dogs that I liked
    const dogsILiked = await db
      .select({
        id: likedTable.secondId,
      })
      .from(likedTable)
      .where(
        and(eq(likedTable.firstId, displayId), eq(likedTable.likeStatus, true)),
      )
      .execute();

    const dogsILikedArray: string[] = dogsILiked.map((dog) => dog.id as string);
    if (dogsILikedArray.length === 0) {
      return NextResponse.json([]);
    }
    // check that if it liked me too
    const matchedDogs = await db
      .select({
        id: likedTable.firstId,
      })
      .from(likedTable)
      .where(
        and(
          eq(likedTable.secondId, displayId),
          inArray(likedTable.firstId, dogsILikedArray),
          eq(likedTable.likeStatus, true),
        ),
      );

    const matchedDogsArray: string[] = matchedDogs.map(
      (dog) => dog.id as string,
    );
    if (dogsILikedArray.length === 0) {
      return NextResponse.json([]);
    }
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
          inArray(dogsTable.displayId, matchedDogsArray),
        ),
      )
      .execute();

    // get the last messages
    const getLastMessage = async (myId: string, otherUserId: string | null) => {
      if (!otherUserId) {
        return;
      }

      const lastMessage = await db
        .select({
          id: messagesTable.id,
          senderId: messagesTable.senderId,
          receiverId: messagesTable.receiverId,
          content: messagesTable.content,
          sentAt: messagesTable.sentAt,
        })
        .from(messagesTable)
        .where(
          or(
            and(
              eq(messagesTable.senderId, myId),
              eq(messagesTable.receiverId, otherUserId),
            ),
            and(
              eq(messagesTable.senderId, otherUserId),
              eq(messagesTable.receiverId, myId),
            ),
          ),
        )
        .orderBy(desc(messagesTable.sentAt))
        .limit(1)
        .execute();

      return lastMessage[0];
    };
    // for each matched dogs data, i want to call getLastMessage(myId, matcheddog.id)
    // for the final list of [dog, lastmessage] pair,
    // sort the final list with descending "sentAt"

    // For each matched dog, get the last message
    const matchedDogsDataWithLastMessage = await Promise.all(
      matchedDogsData.map(async (dog) => {
        const lastMessage = await getLastMessage(displayId, dog.id);

        if (lastMessage) {
          return { dog, lastMessage };
        } else {
          return {
            dog,
            lastMessage: {
              senderId: "",
              receiverId: "",
              content: "",
              sentAt: null,
            },
          };
        }
      }),
    );

    // Sort the final list by the timestamp of the last message in descending order
    const sortedList = matchedDogsDataWithLastMessage.sort((a, b) => {
      const sentAtA = a.lastMessage?.sentAt || null;
      const sentAtB = b.lastMessage?.sentAt || null;

      // if (!sentAtA || !sentAtB) {
      //   return 0;
      // }

      if (sentAtA === null && sentAtB === null) {
        return 0; // Both dates are null, consider them equal
      } else if (sentAtA === null) {
        return 1; // Null is considered greater than any date
      } else if (sentAtB === null) {
        return -1; // Null is considered greater than any date
      } else {
        return sentAtB.getTime() - sentAtA.getTime();
      }
    });

    return NextResponse.json(sortedList);
  } catch (error) {
    console.error("Error fetching dogs data 4:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
