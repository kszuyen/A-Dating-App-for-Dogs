import { RefObject, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

// import { useDebounce } from "use-debounce";
import { pusherClient } from "@/lib/pusher/client";
import { find } from "lodash";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
};

type PusherPayload = {
  newMessage: Message;
};

export const useMessages = (bottomRef: RefObject<HTMLDivElement>) => {
    const [loading, setLoading] = useState<boolean>(true);
  const { OtherUserId } = useParams();
  const otherUserId = Array.isArray(OtherUserId) ? OtherUserId[0] : OtherUserId;
  // const otherpersonName = getNameFromId(otherpersonId);

  const [messages, setMessages] = useState<Message[]>([]);
  
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 2nd use effect
  // Subscribe to pusher events
  useEffect(() => {
    if (!userId || !otherUserId) return;

    // Private channels are in the format: private-...
    // Make a channel for the chatroom according to the 2 person's id
    const channelName =
      userId > otherUserId
        ? `private-${userId}_${otherUserId}`
        : `private-${otherUserId}_${userId}`;
    try {
      pusherClient.subscribe(channelName);
      bottomRef?.current?.scrollIntoView();

      pusherClient.bind("message:post", ({ newMessage }: PusherPayload) => {

        setMessages((prev) => {
          if (find(prev, { id: newMessage.id })) {
            return prev;
          }
  
          return [...prev, newMessage]
        });
        // setMessages(messages);
        // bottomRef?.current?.scrollIntoView();
        setLoading(false);
        console.log("bottom");

      });
    } catch (error) {
      console.log("subscribe error:", error);
      router.push("/Matches");
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [otherUserId, router, userId]);

  // 3rd use effect
  useEffect(() => {
    if (!otherUserId) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${otherUserId}`);
      if (!res.ok) {
        console.log(res.json());
        router.push(`/Matches`);
        return;
      }
    const data = await res.json();
    console.log("3rd use effect");

      setMessages(data.messages);
      setLoading(false);

    //   router.refresh();
    };
    fetchMessages();
  }, [otherUserId, router]);

  // scroll to bottom if messages changed
  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
    // console.log("scrolled");
  }, [messages])

  return {
    userId,
    messages,
    loading,
  };
};