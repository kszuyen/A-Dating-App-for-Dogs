import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { find } from "lodash";

import { pusherClient } from "@/lib/pusher/client";
import type { Dog } from "@/lib/types/db";

type matchesType = {
  dog: {
    id: string;
    dogname: string;
    breed: string;
    gender: "male" | "female";
    birthday: string;
    description: string;
    image_url: string;
    thumbnail_url: string;
  };
  lastMessage: {
    content: string | null;
    senderId: string | null;
    sentAt: Date | null;
  };
};

export function useMatches(): {
  matches: matchesType[];
  loading: boolean;
} {
  const [matches, setMatches] = useState<matchesType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    // Private channels are in the format: private-...
    // Make a channel for the chatroom according to the 2 person's id
    if (!userId) {
      return;
    }
    const channelName = `private-${userId}`;
    try {
      pusherClient.subscribe(channelName);

      pusherClient.bind("liked:matchpage", (newMatch: matchesType) => {
        setMatches((prev) => {
          if (find(prev, { dog: newMatch.dog })) {
            return prev;
          }

          return [newMatch, ...prev];
        });
      });
    } catch (error) {
      // console.log("subscribe error:", error);
      // router.push("/Matches");
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [router, userId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/matches/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log(data);
        // Process and format data if needed
        setMatches(data);
      } catch (error) {
        // console.log(error);
        alert("error loading matches");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    matches,
    loading,
  };
}
