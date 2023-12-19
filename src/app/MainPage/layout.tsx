import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
};

function UserPageLayout({ children }: Props) {
  return (
    // overflow-hidden for parent to hide scrollbar
    <div className="mx-auto flex max-w-6xl">
      <Header />
      <main className="flex min-h-screen w-full">
        <Separator orientation="vertical" />
        {children}
        {/* <Separator orientation="vertical" /> */}
      </main>
    </div>
  );
}

export default UserPageLayout;
