import { useState, useEffect } from "react";
import type { Dog } from "@/lib/types/db";

type matchesType = {
    id: string;
    dogname: string;
    breed: string;
    gender: "male" | "female";
    birthday: string;
    description: string;
    image_url: string;
    thumbnail_url: string;
    lastMessage: string | null;
    senderId: string | null;
    sentAt: string | null;
}

export function useMatches(): {
  matches: any[];
  loading: boolean;
} {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
      try {
        const response = await fetch(`/api/matches`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        // Process and format data if needed
        setMatches(data);
      } catch (error) {
        console.log(error);
        alert("error loading matches")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    matches, 
    loading
 };
}
