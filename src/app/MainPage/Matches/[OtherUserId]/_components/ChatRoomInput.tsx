"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import useUserInfo from "@/hooks/useUserInfo";

type newMessage = {
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
};

function ChatRoomInput() {
  const { userId } = useUserInfo();

  const { OtherUserId } = useParams();
  const otherUserId = Array.isArray(OtherUserId) ? OtherUserId[0] : OtherUserId;
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    if (!userId) return;
    const sendMessage = async (message: Omit<newMessage, "sentAt">) => {
      try {
        const res = await fetch(`/api/messages/${otherUserId}`, {
          method: "POST",
          body: JSON.stringify(message),
          headers: {
            "Content-Type": "application/json",
          },
        });
        await res.json();
      } catch (error) {
        console.log(error);
      }
    };
    sendMessage({
      senderId: userId,
      receiverId: otherUserId,
      content: content,
    });
    setContent("");
  };
  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Aa"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text-md flex-1 rounded-md border border-gray-300 p-1 outline-none transition duration-200 ease-in-out focus:border-gray-600"
      />
      <button
        type="submit"
        className="rounded-lg bg-black px-2 py-1 text-sm text-white transition duration-200 ease-in-out hover:bg-gray-700"
      >
        Send
      </button>
    </form>
  );
}

export default ChatRoomInput;
