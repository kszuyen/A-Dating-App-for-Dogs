import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

// import { useDebounce } from "use-debounce";
import { pusherClient } from "@/lib/pusher/client";

type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: Date;
  };

type PusherPayload = {
  messages: Message[];
};

export const useMessages = () => {
  const { OtherUserId } = useParams();
  const otherUserId = Array.isArray(OtherUserId) ? OtherUserId[0] : OtherUserId;
  // const otherpersonName = getNameFromId(otherpersonId);

  const [messages, setMessages] = useState<Message[] | null>(null);
//   const [dbMessage, setDbMessage] = useState<Message[] | null>(null);

  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 2nd use effect
  // Subscribe to pusher events
  useEffect(() => {
    // if (!userId || !otherUserId) return;
    // Private channels are in the format: private-...

    // const channelName =
    //   userId > otherUserId
    //     ? `private-${userId}_${otherUserId}`
    //     : `private-${otherUserId}_${userId}`;
    const channelName = "private-channel";
        console.log(channelName);
        console.log("here")
    // try {
      pusherClient.subscribe(channelName);
      pusherClient.bind("message:post", async ({ messages }: PusherPayload) => {
        // const filteredMessages = await fetchMessages(messages);
        // if (messages !== undefined) {
        setMessages(messages);
        console.log(messages);
        // setDbMessage(messages);
        // }
        // router.refresh();
      });
    // } catch (error) {
    //   console.log("subscribe error");
    //   console.error(error);
    //   router.push("/Message");
    // }
    console.log("subscribed:", channelName, "message:post");
    console.log(messages);
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
      console.log("unsubscribed");
      console.log(messages);
    //   console.log(dbMessage);
      console.log("2nd use effect end");
    };
  }, [otherUserId, router, userId]);

  // 3rd use effect
  useEffect(() => {
    if (!otherUserId) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${otherUserId}`);
      if (!res.ok) {
        console.log(res.json());
        router.push(`/Message`);
        return;
      }
    const data = await res.json();
    console.log("3rd use effect");

      console.log(data.messages);
      setMessages(data.messages);
    //   setDbMessage(data.messages);
      router.refresh();
    };
    fetchMessages();
  }, [otherUserId, router]);

  return {
    userId,
    messages,
  };
};