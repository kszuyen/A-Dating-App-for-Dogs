// import Header from "@/components/Header";
// import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
};

function SigninLayout({ children }: Props) {
  return (
    // overflow-hidden for parent to hide scrollbar
    // <div className="mx-auto flex max-w-6xl">{children}</div>
    <>{children}</>
  );
}

export default SigninLayout;
