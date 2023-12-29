import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { dogsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function MainPageLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  } else {
    const [dogInfo] = await db
      .select()
      .from(dogsTable)
      .where(eq(dogsTable.displayId, session.user.id))
      .limit(1);
    if (!dogInfo) {
      redirect("/OnBoard");
    }
  }

  return (
    <div className="mx-auto flex">
      <SessionProvider>
        <div className="sticky top-0 h-screen ">
          <Header />
        </div>
        <main className="flex flex-grow flex-row items-center justify-between bg-purple-50 text-center">
          <Separator orientation="vertical" />
          {children}
          <Separator orientation="vertical" />
        </main>
      </SessionProvider>
    </div>
  );
}
