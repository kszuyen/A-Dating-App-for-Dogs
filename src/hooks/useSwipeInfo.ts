// import { useState, useEffect } from "react";

// interface SwipeInfoHookReturn {
//   loading: boolean;
//   error: Error | null;
// }

// export function useSwipeInfo(
//   firstId: string,
//   secondId: string,
// ): SwipeInfoHookReturn {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     async function postSwipeInfo() {
//       if (!firstId || !secondId) {
//         return; // Don't run if IDs are not provided
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch("/api/liked", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ firstId, secondId }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Submit Success:", result);
//       } catch (error: any) {
//         // Using any for error type since we don't have a specific error type here.
//         console.error("Submit Error:", error);
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     postSwipeInfo();
//   }, [firstId, secondId]); // Dependencies

//   return { loading, error };
// }
