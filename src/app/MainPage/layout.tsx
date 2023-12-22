import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function UserPageLayout({ children }: Props) {
  const session = await auth();
  console.log(session);
  if (!session?.user) {
    redirect("/error");
  }
  return (
    <div className="flex overflow-hidden">
      <SessionProvider>
        <Header />
        <main className="flex flex-grow flex-row items-center justify-between text-center">
          <Separator orientation="vertical" />
          {children}
          <Separator orientation="vertical" />
        </main>
      </SessionProvider>
    </div>
  );
}

// export default UserPageLayout;

// function Auth({ children }) {
//   // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
//   const { status } = useSession({ required: true });

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   return children;
// }
