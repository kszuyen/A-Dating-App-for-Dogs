"use client";

import type { MouseEvent } from "react";
import { useRef, useState } from "react";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { format } from "date-fns";

import LoadingModal from "@/components/LoadingModal";
import UserAvatar from "@/components/UserAvatar";
// import { eq } from "drizzle-orm";
// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { db } from "@/db";
// import { messagesTable, usersTable } from "@/db/schema";
import { useMessages } from "@/hooks/useMessages";

// import { newNotShowMessage } from "@/lib/types/db";

function ChatRoomMessages() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { userId, messages, loading } = useMessages(bottomRef);
  if (loading) {
    return <LoadingModal />;
  }
  if (!messages) {
    return <div>Start a conversation!!</div>;
  }
  const todayDate = format(new Date(), "P");

  return (
    <>
      <div className="px-2 pt-4">
        {messages?.map((message, index) => {
          const isSender = message.senderId === userId;
          if (isSender) {
            return (
              <div key={index} className="w-full pt-1">
                <div
                  className={`flex flex-row items-end justify-end gap-2
                  `}
                >
                  <div className="text-xs text-gray-400">
                    {todayDate == format(new Date(message.sentAt), "P")
                      ? format(new Date(message.sentAt), "p")
                      : format(new Date(message.sentAt), "p MMM/dd")}
                  </div>
                  <div
                    className={`max-w-[60%] rounded-2xl bg-black px-3 py-2 leading-6 text-white`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="w-full pt-1">
                <div className={`flex flex-row items-end gap-2 `}>
                  <div
                    className={`max-w-[60%] rounded-2xl bg-gray-200 px-3 py-2  leading-6 text-black`}
                  >
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-400">
                    <div>
                      {todayDate == format(new Date(message.sentAt), "P")
                        ? format(new Date(message.sentAt), "p")
                        : format(new Date(message.sentAt), "p MMM/dd")}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          // return (
          // <div key={index} className="w-full pt-1">
          //   <div
          //     className={`flex flex-row items-end gap-2 ${
          //       isSender && "justify-end"
          //     }`}
          //   >
          //     <div className="text-xs text-gray-400">
          //       {format(new Date(message.sentAt), "p")}
          //     </div>
          //     <div
          //       className={`max-w-[60%] rounded-2xl px-3 py-2 leading-6 ${
          //         isSender ? "bg-black text-white" : " bg-gray-200 text-black"
          //       }`}
          //     >
          //       {message.content}
          //     </div>
          //   </div>
          // </div>
          // <div className={`flex gap-3 p-2 ${isSender && "justify-end"}`}>
          //   {/* <div className={`${isSender && "order-2"}`}>
          //     <UserAvatar displayId={message.senderId} />
          //   </div> */}
          //   <div className={`flex flex-col gap-1 ${isSender && "items-end"}`}>
          //     <div
          //       className={`rounded-2xl px-3 py-2 leading-4 ${
          //         isSender ? "bg-black text-white" : " bg-gray-200 text-black"
          //       }`}
          //     >
          //       <div>{message.content}</div>
          //     </div>
          //     <div className="flex items-center gap-1">
          //       <div className="text-xs text-gray-400">
          //         {format(new Date(message.sentAt), "p")}
          //       </div>
          //     </div>
          //   </div>
          // </div>
          // );
        })}
        <div ref={bottomRef} />
      </div>
    </>
  );
}

export default ChatRoomMessages;
