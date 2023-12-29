import { NextResponse, type NextRequest } from "next/server";

import { and, asc, eq, or } from "drizzle-orm";
import Pusher from "pusher";
import { type z } from "zod";

import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import { type newMessage } from "@/lib/types/db";
import { messageSchema } from "@/validators/message";

// POST /api/messages/:chatroomId (otherUserId)
type PostMessageRequest = z.infer<typeof messageSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    messageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { senderId, receiverId, content } = data as PostMessageRequest;
  const sentAt = new Date();
  const newMessage: newMessage = {
    senderId,
    receiverId,
    content,
    sentAt,
  };
  // db.messages.push(newMessage);
  const [inputMessage] = await db
    .insert(messagesTable)
    .values(newMessage)
    .returning();

  //     // Trigger pusher event
  const pusher = new Pusher({
    appId: privateEnv.PUSHER_ID,
    key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
    secret: privateEnv.PUSHER_SECRET,
    cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });

  // Private channels are in the format: private-...
  const channelName =
    newMessage.senderId > newMessage.receiverId
      ? `private-${newMessage.senderId}_${newMessage.receiverId}`
      : `private-${newMessage.receiverId}_${newMessage.senderId}`;
  await pusher.trigger(channelName, "message:post", {
    // messages: messages,
    newMessage: inputMessage,
  });
  return NextResponse.json({ status: 200 });
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      otherUserId: string;
    };
  },
) {
  try {
    // console.log("start GET");
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    // Get the document
    const dbMessage = await db
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
            eq(messagesTable.senderId, userId),
            eq(messagesTable.receiverId, params.otherUserId),
          ),
          and(
            eq(messagesTable.senderId, params.otherUserId),
            eq(messagesTable.receiverId, userId),
          ),
        ),
      )
      .orderBy(asc(messagesTable.sentAt))
      .execute();

    // console.log(dbMessage);

    if (!dbMessage) {
      return NextResponse.json({ error: "Message Not Found" }, { status: 404 });
    }
    // const message = dbMessage;
    return NextResponse.json(
      {
        messages: dbMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
