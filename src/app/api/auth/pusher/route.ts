import { type NextRequest, NextResponse } from "next/server";

// import { and, eq } from "drizzle-orm";

// import { db } from "@/db";
// import { usersToDocumentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;

    // channel name is in the format: private-<docId>
    const channelName = channel.slice(8);
    if (!channelName) {
      return NextResponse.json(
        { error: "Invalid channel name" },
        { status: 400 },
      );
    }

    // Get the document from the database
    // const [docOwnership] = await db
    //   .select()
    //   .from(usersToDocumentsTable)
    //   .where(
    //     and(
    //       eq(usersToDocumentsTable.userId, session.user.id),
    //       eq(usersToDocumentsTable.documentId, docId),
    //     ),
    //   );
    // if (!docOwnership) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const userData = {
      user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      userData,
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      },
    );
  }
}