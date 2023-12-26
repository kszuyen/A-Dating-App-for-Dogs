"use client";

import { useRouter } from "next/navigation";

import { MoreHorizontal } from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import { useDogById } from "@/hooks/useDogById";
import useUserInfo from "@/hooks/useUserInfo";

export default function ProfileButton() {
  const { userId, username } = useUserInfo();

  const { dogData } = useDogById(userId || "");
  const router = useRouter();

  return (
    <button
      // className="flex items-center gap-2 rounded-full p-3 text-start"
      className="flex items-center gap-2 rounded-full p-3 text-start transition-colors duration-300 hover:bg-gray-200"
      // go to home page without any query params to allow the user to change their username and handle
      // see src/components/NameDialog.tsx for more details
      onClick={() => router.push("/MainPage/DogPage")}
    >
      {userId && <UserAvatar displayId={userId} />}
      <div className="max-lg w-40">
        <p className="text-sm font-bold">{username ?? "..."}</p>
        <p className="text-sm text-gray-500">with {dogData.dogname}</p>
      </div>
      <MoreHorizontal size={24} className="max-lg:hidden" />
    </button>
  );
}
