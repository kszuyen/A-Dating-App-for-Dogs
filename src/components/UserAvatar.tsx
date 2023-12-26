"use client";

import { useDogById } from "@/hooks/useDogById";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils/shadcn";

type UserAvatarProps = {
  displayId: string;
  className?: string;
};

export default function UserAvatar({ displayId, className }: UserAvatarProps) {
  const { dogData } = useDogById(displayId);
  // const { avatarURL } = useUserInfo();
  const avatarURL = dogData.imageUrl;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarURL}
      alt="user avatar"
      width={48}
      height={48}
      className={cn(className, "rounded-full")}
    />
  );
}
