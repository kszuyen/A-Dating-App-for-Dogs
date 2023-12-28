"use client";

import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import LoadingModal from "@/components/LoadingModal";
// import Navbar from "@/components/Navbar";
import { useDogById } from "@/hooks/useDogById";
import useUserInfo from "@/hooks/useUserInfo";

import OnBoardForm from "./_components/OnBoardForm";

function OnBoardPage() {
  // const { userId } = useUserInfo();
  // if (!userId) {
  //   redirect("/");
  // }
  // const router = useRouter();
  // const { dogData, loading, error } = useDogById(userId);
  // if (dogData.displayId) {
  //   router.push("/MainPage");
  // }
  // if (loading) return <LoadingModal />;
  // else if (error) return <p>Error: {error}</p>;
  // else
  return (
    <>
      <div className="h-full w-full bg-purple-50">
        <div className="flex h-full w-full flex-wrap items-center justify-center py-2">
          <div className="mx-auto mt-0 flex flex-col items-center">
            <a className="text-8xl font-black text-purple-600" href="/">
              Tindog
            </a>
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
