import { SessionProvider } from "next-auth/react";

import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
};

function UserPageLayout({ children }: Props) {
  return (
    // overflow-hidden for parent to hide scrollbar
    <div className="flex">
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

export default UserPageLayout;
