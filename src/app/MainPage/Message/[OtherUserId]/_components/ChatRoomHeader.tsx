"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import { useDogById } from "@/hooks/useDogById";

function ChatRoomHeader() {
  const { OtherUserId } = useParams();
  const displayId = Array.isArray(OtherUserId) ? OtherUserId[0] : OtherUserId;

  const { dogData } = useDogById(displayId);
  console.log(dogData);

  return (
    <div className="flex items-center gap-2 text-center">
      <Link
        className="rounded-lg bg-white px-2 py-1 text-sm text-gray-500 transition duration-200 ease-in-out hover:bg-gray-100"
        href="/MainPage/Message"
      >
        <ChevronLeft />
      </Link>
      <div>{dogData.dogname}</div>
    </div>
  );
}

export default ChatRoomHeader;
