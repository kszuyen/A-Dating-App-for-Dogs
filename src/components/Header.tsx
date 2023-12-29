"use client";

import { useState } from "react";

import Link from "next/link";

import { PawPrint, MessageSquareText } from "lucide-react";

import { cn } from "@/lib/utils/shadcn";

import ProfileButton from "./ProfileButton";

export default function Header() {
  const [activeLink, setActiveLink] = useState("/MainPage");
  return (
    // aside is a semantic html tag for side content
    <aside className="flex h-screen  min-h-screen flex-col justify-between px-4 py-2 sm:w-32 md:w-48 lg:w-56 xl:w-64">
      {/* <aside className="fixed left-0 top-0 flex h-screen flex-col justify-between px-2  [&>*]:my-auto"> */}
      <div className="flex flex-col gap-2">
        <div className="p-2">
          <a
            className="flex-grow  px-4 pt-2 text-2xl font-bold text-purple-600 sm:px-0 md:text-3xl lg:text-4xl"
            href="/MainPage"
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
          <div className="grid h-[40px] w-[40px] place-items-center px-4  max-lg:flex-grow">
            <Icon
              // now that we defined the interface for Icon, we can pass in the size and strokeWidth props safely
              size={26}
              strokeWidth={isActive ? 3 : 2}
            />
          </div>
          <span
            className={cn(
              "flex-grow pr-4 text-xl max-lg:hidden",
              isActive && "font-bold",
            )}
          >
            {text}
          </span>
        </div>
      </Link>
    </button>
  );
}
