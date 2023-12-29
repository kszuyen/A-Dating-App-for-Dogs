// import { SessionProvider } from "next-auth/react";
// import { redirect, useRouter } from "next/navigation";

// import { eq } from "drizzle-orm";

// import { db } from "@/db";
// import { dogsTable } from "@/db/schema";
// // import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
// import { publicEnv } from "@/lib/env/public";

type Props = {
  children: React.ReactNode;
};

export default async function OnBoardLayout({ children }: Props) {
  // const router = useRouter();

  return (
    // overflow-hidden for parent to hide scrollbar
    <main className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
      <div className="w-full overflow-y-scroll bg-purple-50">{children}</div>
    </main>
  );
}
