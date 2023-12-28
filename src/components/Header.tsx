// import Image from "next/image";
"use client";

import { useState } from "react";

import Link from "next/link";
import { Router } from "next/router";

import { PawPrint, MessageSquareText } from "lucide-react";

// import larry from "@/assets/larry.png";
import { cn } from "@/lib/utils/shadcn";

import ProfileButton from "./ProfileButton";

// import Image from "next/image";

export default function Header() {
  const [activeLink, setActiveLink] = useState("/MainPage");
  return (
    // aside is a semantic html tag for side content
    <aside className="flex h-screen flex-col justify-between px-6 py-6 ">
      <div className="flex flex-col gap-2">
        <div className="p-2">
          {/* <Link href="/">
            {/* <Image src={larry} alt="Larry the bird" width={40} height={40} /> */}
          {/* <div>Tindog Logo</div> */}
          {/* </Link>  */}
          <a
            className="flex-grow text-2xl font-bold text-purple-600 lg:text-4xl"
            href="/"
          >
            Tindog
          </a>
        </div>
        <HeaderButton
          Icon={PawPrint}
          text="Home"
          link="/MainPage"
          setActiveLink={setActiveLink}
          isActive={activeLink === "/MainPage"}
        />
        <HeaderButton
          Icon={MessageSquareText}
          text="Matches"
          link="/MainPage/Matches"
          setActiveLink={setActiveLink}
          isActive={activeLink === "/MainPage/Matches"}
        />
        {/* <HeaderButton Icon={Bell} text="Notifications" />
        <HeaderButton Icon={Mail} text="Messages" />
        <HeaderButton Icon={FileText} text="Lists" />
        <HeaderButton Icon={Bookmark} text="Bookmarks" />
        <HeaderButton Icon={Users} text="Communities" />
        <HeaderButton Icon={User} text="Profile" />
        <HeaderButton Icon={MoreHorizontal} text="More" /> */}
      </div>
      <ProfileButton
        setActiveLink={setActiveLink}
        isActive={activeLink === "/MainPage/DogPage"}
      />
    </aside>
  );
}

type HeaderButtonProps = {
  // allow size, and strokeWidth to be string to match lucide-react's size prop
  // this is basically a interface so that we can pass in custom component if we need to
  Icon: React.ComponentType<{
    size?: number | string;
    strokeWidth?: number | string;
  }>;
  text: string;
  link: any;
  isActive: boolean;
  setActiveLink: (link: string) => void;
};

function HeaderButton({
  Icon,
  text,
  isActive,
  setActiveLink,
  link,
}: HeaderButtonProps) {
  const handleClick = () => {
    setActiveLink(link);
  };
  return (
    <button className="group w-full" onClick={handleClick}>
      <Link href={link}>
        <div
          // prefix a class with hover: to make it only apply when the element is hovered
          className={`${
            isActive ? "bg-purple-100" : ""
          } flex w-full items-center gap-4 rounded-full p-2 transition-colors duration-300 group-hover:bg-gray-200 lg:pr-4`}
        >
          <div className="grid h-[40px] w-[40px] place-items-center">
            <Icon
              // now that we defined the interface for Icon, we can pass in the size and strokeWidth props safely
              size={26}
              strokeWidth={isActive ? 3 : 2}
            />
          </div>
          <span
            // the `cn` helper function basically concatenate your tailwind classes in a safe way
            // on the surface, it will remove any falsy values from the array, it also remove any redundant classes
            // this is useful for conditional classes
            // prefixing a class with max-lg: makes it only apply to screen size below lg, this is the tailwind way of media queries
            // likewise, prefixing a class with lg: makes it only apply to screen size above lg
            // read more about tailwind responsive design here: https://tailwindcss.com/docs/responsive-design
            className={cn("text-xl max-lg:hidden", isActive && "font-bold")}
          >
            {text}
          </span>
        </div>
      </Link>
    </button>
  );
}
