// import { NextRequest, NextResponse } from "next/server";

// import { and, eq } from "drizzle-orm";

// import { db } from "@/db";
// import { dogsTable } from "@/db/schema";
// import { auth } from "@/lib/auth";

// export async function GET(request: NextRequest) {
//   // Authenticate the session
//   const session = await auth();
//   if (!session || !session.user?.id) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   // Get the displayId from the session
//   const displayId = session.user.id;

//   try {
//     // Query the dog information based on displayId
//     const dogInfo = await db.query.dogsTable.findFirst({
//       where: eq(dogsTable.displayId, displayId),
//       with: {
//         columns: {
//           displayId: true,
//           dogname: true,
//           breed: true,
//           gender: true,
//           birthday: true,
//           description: true,
//           imageUrl: true,
//           thumbnailUrl: true,
//         },
//       },
//     });

//     // If no dog information is found
//     if (!dogInfo) {
//       return new Response(JSON.stringify({ error: "Dog Not Found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // If dog information is found, return it
//     return new Response(JSON.stringify(dogInfo), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     // Handle any other errors
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
