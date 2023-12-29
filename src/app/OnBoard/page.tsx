// "use client";
import { redirect, useRouter } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { dogsTable } from "@/db/schema";
// import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import OnBoardForm from "./_components/OnBoardForm";

type Props = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

async function OnBoardPage(props: Props) {
  const searchParams = props.searchParams;
  const edit = searchParams.edit;
  const session = await auth();

  if (!session?.user) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
  } else {
    const [dogInfo] = await db
      .select()
      .from(dogsTable)
      .where(eq(dogsTable.displayId, session.user.id))
      .limit(1);
    if (dogInfo && edit !== "true") {
      redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/MainPage`);
    }
  }
  return (
    <>
      <div className="h-full w-full bg-purple-50">
        <div className="flex h-full w-full flex-wrap items-center justify-center py-2">
          <div className="mx-auto mt-0 flex flex-col items-center">
            <a className="text-8xl font-black text-purple-600">Tindog</a>
            <div className="m-5 font-mono text-2xl font-bold">
              " It's a match! "
            </div>
          </div>
          <div className="mx-48 w-full px-4 md:max-w-xs lg:max-w-sm xl:max-w-md">
            <OnBoardForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default OnBoardPage;
