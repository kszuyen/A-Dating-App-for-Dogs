import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function MainPageLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/error");
  }

  return (
    <div className="mx-auto flex">
      <SessionProvider>
        <Header />
        <main className="flex flex-grow flex-row items-center justify-between overflow-y-auto text-center">
          <Separator orientation="vertical" />
          {children}
          <Separator orientation="vertical" />
        </main>
      </SessionProvider>
    </div>
  );
}
