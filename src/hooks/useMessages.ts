import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

// import { useDebounce } from "use-debounce";
import { pusherClient } from "@/lib/pusher/client";
// import type { Message, newNotShowMessage } from "@/lib/types/db";

type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: Date;
  };

type newNotShowMessage = {
messageId: string;
userId: string;
};

type PusherPayload = {
  // otherpersonId: User["id"];
  // document: Document;
  messages: Message[];
};

export const useMessages = () => {
  const { OtherUserId } = useParams();
  const otherpersonId = Array.isArray(OtherUserId) ? OtherUserId[0] : OtherUserId;
  // const otherpersonName = getNameFromId(otherpersonId);

  const [messages, setMessages] = useState<Message[] | null>(null);
  const [dbMessage, setDbMessage] = useState<Message[] | null>(null);

  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const notShowMessage = async (notShowMessage: newNotShowMessage) => {
    try {
      await fetch(`/api/notShowMessages`, {
        method: "POST",
        body: JSON.stringify(notShowMessage),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // const data = await res.json();
      // if (data?.message) {
      //   socket.emit("send_message", data.message);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const filterMessages = async (messages: Message[]) => {
    const res2 = await fetch(`/api/notShowMessages`);
    if (!res2.ok) {
      console.log(res2.json());
      router.push(`/chatrooms`);
      return;
    }
    const data2 = await res2.json();
    const allNotShowMessages = data2.notShowMessages;
    console.log(allNotShowMessages);
    const filteredNotShowMessages = allNotShowMessages.filter(
      (message: { userId: string; messageId: string }) =>
        message.userId === userId,
    );
    console.log(filteredNotShowMessages);
    const blockedMessageIds = filteredNotShowMessages.map(
      (message: { userId: string; messagesId: string }) => message.messagesId,
    );
    console.log(blockedMessageIds);
    const filteredMessages = messages.filter(
      (message) => !blockedMessageIds.includes(message.id),
    );
    console.log("filteredMessages");
    console.log(filteredMessages);
    return filteredMessages;
  };

  // 2nd use effect
  // Subscribe to pusher events
  useEffect(() => {
    if (!userId || !otherpersonId) return;
    // Private channels are in the format: private-...

    const channelName =
      userId > otherpersonId
        ? `private-${userId}_${otherpersonId}`
        : `private-${otherpersonId}_${userId}`;
    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind("message:post", async ({ messages }: PusherPayload) => {
        const filteredMessages = await filterMessages(messages);
        if (filteredMessages !== undefined) {
          setMessages(filteredMessages);
          setDbMessage(filteredMessages);
        }

        router.refresh();
      });
    } catch (error) {
      console.log("subscribe error");
      console.error(error);
      router.push("/chatrooms");
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
      console.log(messages);
      console.log(dbMessage);
      console.log("2nd use effect end");
    };
  }, [otherpersonId, router, userId]);

  // 3rd use effect
  useEffect(() => {
    if (!otherpersonId) return;
    const fetchMessages = async () => {
      const res1 = await fetch(`/api/messages/${otherpersonId}`);
      if (!res1.ok) {
        console.log(res1.json());
        router.push(`/chatrooms`);
        return;
      }
      const data = await res1.json();
      console.log(data.messages);

      const filteredMessages = await filterMessages(data.messages);

      // setMessages(data.messages);
      // setDbMessage(data.messages);
      if (filteredMessages !== undefined) {
        setMessages(filteredMessages);
        setDbMessage(filteredMessages);
      }
    };
    fetchMessages();
  }, [otherpersonId, router, notShowMessage]);

  return {
    userId,
    messages,
    notShowMessage,
  };
};