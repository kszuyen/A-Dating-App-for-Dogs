"use client";

const Navbar = () => {
  return (
    <nav id="header" className="fixed top-0 z-30 w-full">
      <div className="container mx-auto mt-0 flex w-full flex-wrap items-center justify-between py-2">
        <div className="flex flex-row items-center pl-4 pt-2">
          <a
            className="flex-grow text-2xl font-bold text-purple-600 lg:text-4xl"
            href="#"
          >
            Tindog
          </a>
          <button className="rounded-full bg-gradient-to-r from-blue-300 to-yellow-300 px-2 py-1 text-center text-base font-bold text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-yellow-400">
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
