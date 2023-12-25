"use client";

import type { MouseEvent } from "react";
import { useRef, useState } from "react";

import { ScrollArea } from "@radix-ui/react-scroll-area";

// import { eq } from "drizzle-orm";
// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { db } from "@/db";
// import { messagesTable, usersTable } from "@/db/schema";
import { useMessages } from "@/hooks/useMessages";

// import { newNotShowMessage } from "@/lib/types/db";

function ChatRoomMessages() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { userId, messages } = useMessages(bottomRef);
  if (!messages) {
    return <div>Start a conversation!!</div>;
  }

  return (
    <>
      <div className="px-2 pt-4">
        {messages?.map((message, index) => {
          const isSender = message.senderId === userId;
          return (
            <div key={index} className="w-full pt-1">
              <div
                className={`flex flex-row items-end gap-2 ${
                  isSender && "justify-end"
                }`}
              >
                <div
                  className={`max-w-[60%] rounded-2xl px-3 py-2 leading-6 ${
                    isSender ? "bg-black text-white" : " bg-gray-200 text-black"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </>
  );
}

export default ChatRoomMessages;
