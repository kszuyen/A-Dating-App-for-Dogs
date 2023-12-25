// import { useEffect, useState } from "react";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// import type { Dog } from "@/lib/types/db";

// export const useMatches = async () => {

// //   const [matches, setMatches] = useState<Dog[] | null>(null);
// //   const [dbMatches, setDbsetDbMatches] = useState<Dog[] | null>(null);

//   const router = useRouter();

//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const getMatches = async () => {
//     const res = await fetch(`/api/matches`);
//     if (!res.ok) {
//       console.log(res.json());
//       router.push(`/error`);
//       return;
//     }
//     const data = await res.json();
//     console.log(data);
//     return data.o;
//   };
//   const matches = await getMatches();
//   return {
//     userId,
//     matches
//   };
// };
import { useState, useEffect } from "react";
import type { Dog } from "@/lib/types/db";


export function useMatches(): {
  matches: Dog[];
} {
  const [matches, setMatches] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/matches`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Process and format data if needed
        setMatches(data);
      } catch (error) {
        console.log(error);
        alert("error loading matches")
      }
    };

    fetchData();
  }, []);

  return { 
    matches, 
 };
}
