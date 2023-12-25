"use client";

// import { MessagesContext } from "@/context/message";
// import { UserContext } from "@/context/user";
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { redirect, useParams } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import { publicEnv } from "@/lib/env/public";

// import type { newMessage } from "@/lib/types/db";

type newMessage = {
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
};

function ChatRoomHeader() {
  // const { sendMessage } = useContext(MessagesContext);
  // const { user } = useContext(UserContext);
  const { data: session } = useSession();

  const { chatroomId } = useParams();
  const otherpersonId = Array.isArray(chatroomId) ? chatroomId[0] : chatroomId;

  return (
    <div className="flex items-center gap-2 text-center">
      <Link
        className="rounded-lg bg-white px-2 py-1 text-sm text-gray-500 transition duration-200 ease-in-out hover:bg-gray-100"
        href="/MainPage/Message"
      >
        <ChevronLeft />
      </Link>
      <div>Other Dog Name</div>
    </div>
  );
}

export default ChatRoomHeader;
