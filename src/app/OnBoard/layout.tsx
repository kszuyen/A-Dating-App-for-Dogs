import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";
// import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function OnBoardLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  } else {
    const [dogInfo] = await db
      .select()
      .from(dogsTable)
      .where(eq(dogsTable.displayId, session.user.id))
      .limit(1);
    if (dogInfo) {
      redirect("/MainPage");
    }
  }

  return (
    // overflow-hidden for parent to hide scrollbar
    <main className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
      <SessionProvider>
        <div className="w-full overflow-y-scroll bg-purple-50">{children}</div>
      </SessionProvider>
    </main>
  );
}
