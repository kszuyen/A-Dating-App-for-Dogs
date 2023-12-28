"use client";

import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const handleClick = () => {
    console.log("Clicked Create Account");
    router.push("/auth/signup");
  };

  return (
    <>
      <div className="items-center text-center font-bold">
        <h1 className="pu-8 px-2 py-4 text-3xl ">Swipe Right@</h1>
        <h2 className="px-2 py-4 text-2xl">Meet other dogs!</h2>
        <button
          className="rounded-full bg-gradient-to-r from-blue-300 to-yellow-300 px-4 py-2 text-center text-xl font-bold hover:bg-gradient-to-r hover:from-blue-400 hover:to-yellow-400"
          onClick={handleClick}
        >
          {"Creat Account"}
        </button>
      </div>
    </>
  );
};

export default HomePage;
