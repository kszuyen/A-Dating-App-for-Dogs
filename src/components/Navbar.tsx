"use client";

import { useRouter } from "next/navigation";

import { div } from "ndarray-ops";

const Navbar = ({ showButton }: { showButton: boolean }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/auth/signin");
  };
  return (
    <nav id="header" className="top-0 z-30 w-full">
      <div className="container mx-auto mt-0 flex w-full flex-wrap items-center justify-center py-2">
        <div className="flex flex-row items-center">
          <a className="flex text-8xl font-black text-purple-600" href="/">
            Tindog
          </a>
        </div>
      </div>
      {showButton && (
        <div className="m-5 flex flex-row items-center justify-center font-mono text-2xl font-bold">
          " It's a match! "
        </div>
      )}
      {showButton && (
        <div className="mb-5 mt-10 flex items-center justify-center">
          <button
            className="animate-bounce rounded-full bg-gradient-to-r from-purple-400 to-rose-400 px-4 py-2 text-center font-mono text-3xl font-bold text-zinc-100 hover:bg-gradient-to-r hover:from-purple-300 hover:to-rose-300 "
            onClick={handleClick}
          >
            Log in
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
