"use client";

import type { MouseEvent } from "react";
import { useState } from "react";

import { ScrollArea } from "@radix-ui/react-scroll-area";

// import { eq } from "drizzle-orm";
// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { db } from "@/db";
// import { messagesTable, usersTable } from "@/db/schema";
import { useMessages } from "@/hooks/useMessages";

// import { newNotShowMessage } from "@/lib/types/db";

function ChatRoomMessages() {
  const { userId, messages, notShowMessage } = useMessages();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    messageId: string,
    personId: string | undefined,
  ) => {
    e.preventDefault();
    console.log(messageId);
    console.log(personId);

    if (personId !== undefined) {
      notShowMessage({
        messageId: messageId,
        userId: personId,
      });
    }
  };

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const [isSelected, setIsSelected] = useState(false);
  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    index: number,
  ) => {
    event.preventDefault();
    setSelectedMessageIndex(index);
    setIsSelected(true);
  };

  // const closeContextMenu = () => {
  //   setIsSelected(false);
  // };
  //   const [pinnedMessage, setPinnedMessage] = useState<string | null>(null);

  return (
    <div className="px-2 pt-4">
      {/* {pinnedMessage && (
        <div className="absolute">Pinned Message: {pinnedMessage}</div>
      )} */}

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
                className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6 ${
                  isSender ? "bg-black text-white" : " bg-gray-200 text-black"
                }`}
                onContextMenu={(e) => handleContextMenu(e, index)}
              >
                {message.content}
              </div>
              {isSelected && selectedMessageIndex == index && (
                <ScrollArea className="h-54 w-48 rounded-md border">
                  <div className="p-4">
                    <>
                      <form
                        className="flex gap-2"
                        onSubmit={(e) => {
                          handleSubmit(e, message.id, message.receiverId);
                          handleSubmit(e, message.id, message.senderId);
                          setIsSelected(false);
                        }}
                      >
                        <button
                          // type="withdraw"
                          className="rounded-lg bg-black px-2 py-1 text-xs text-white transition duration-200 ease-in-out hover:bg-gray-700"
                        >
                          withdraw message (for both)
                        </button>
                      </form>

                      <Separator className="my-2" />
                      <form
                        className="flex gap-2"
                        onSubmit={(e) => {
                          handleSubmit(e, message.id, userId);
                          setIsSelected(false);
                        }}
                      >
                        <button
                          // type="withdraw"
                          className="rounded-lg bg-black px-2 py-1 text-xs text-white transition duration-200 ease-in-out hover:bg-gray-700"
                        >
                          delete message (only for me)
                        </button>
                      </form>
                      {/* <Separator className="my-2" />
                      <form
                        className="flex gap-2"
                        onSubmit={() => {
                          setPinnedMessage(message.content);
                          setIsSelected(false);
                        }}
                      >
                        <button
                          // type="withdraw"
                          className="rounded-lg bg-black px-2 py-1 text-xs text-white transition duration-200 ease-in-out hover:bg-gray-700"
                        >
                          pin this message
                        </button>
                      </form> */}
                    </>
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatRoomMessages;
