"use client";

import { div } from "ndarray-ops";

const Navbar = ({
  showForm,
  setShowForm,
  setIsSignUp,
}: {
  showForm: boolean;
  setShowForm: any;
  setIsSignUp: any;
}) => {
  const handleClick = () => {
    console.log("Clicked log in");
    setIsSignUp(false);
    setShowForm(true);
  };
  return (
    <nav id="header" className="top-0 z-30 w-full">
      <div className="container mx-auto mt-0 flex w-full flex-wrap items-center justify-center py-2">
        <div className="flex flex-row items-center">
          <a
            className="flex text-8xl font-black text-purple-600"
            href="MainPage"
          >
            Tindog
          </a>
        </div>
      </div>
      {!showForm && (
        <div className="mt-10 flex items-center justify-center">
          <button
            className="animate-bounce rounded-full bg-gradient-to-r from-blue-300 to-yellow-300 px-2 py-1 text-center text-base font-bold text-black hover:bg-gradient-to-r hover:from-blue-400 hover:to-yellow-400"
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
