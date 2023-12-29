"use client";

import { useRouter } from "next/navigation";

import { publicEnv } from "@/lib/env/public";

const HomePage = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/auth/signup`);
  };

  return (
    <>
      <div className="flex items-center justify-center text-center font-bold">
        <p className="pl-8 font-mono text-xl  text-purple-400">
          Don't have an account?
        </p>
        <button
          className="px-4 py-2 text-center font-mono text-xl font-bold text-purple-600 underline-offset-4  hover:underline"
          onClick={handleClick}
        >
          {"Click here"}
        </button>
      </div>
    </>
  );
};

export default HomePage;
