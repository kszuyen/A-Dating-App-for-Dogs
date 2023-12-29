import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Bone } from "lucide-react";

import useUserInfo from "@/hooks/useUserInfo";
import { publicEnv } from "@/lib/env/public";
import { pusherClient } from "@/lib/pusher/client";
import { Dog } from "@/lib/types/db";

type Props = Dog & {
  content: string | null;
  senderId: string | null;
  sentAt: Date | null;
};

type Message = {
  senderId: string;
  content: string | null;
  // sentAt: Date;
};

type fullMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
};

type PusherPayload = {
  newMessage: fullMessage;
};

export default function DogCard({
  id,
  dogname,
  breed,
  gender,
  birthday,
  description,
  image_url,
  thumbnail_url,
  content,
  senderId,
  sentAt,
}: Props) {
  const { userId } = useUserInfo();
  const router = useRouter();
  const [mode, setMode] = useState<boolean>(true);
  const handleClickedCard = async () => {
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/MainPage/Matches/${id}`);
  };

  function limit(string = "", limit = 0) {
    if (string.length < limit) {
      return string;
    } else {
      return string.substring(0, limit) + "...";
    }
  }

  const [lM, setLM] = useState<Message>({
    content: content,
    senderId: senderId || "",
    // sentAt: sentAt || null,
  });

  useEffect(() => {
    if (!userId || !id) return;

    // Private channels are in the format: private-...
    // Make a channel for the chatroom according to the 2 person's id
    const channelName =
      userId > id ? `private-${userId}_${id}` : `private-${id}_${userId}`;
    try {
      pusherClient.subscribe(channelName);
      pusherClient.bind("message:post", ({ newMessage }: PusherPayload) => {
        setLM({
          content: newMessage.content,
          senderId: newMessage.senderId,
          // sentAt: newMessage.sentAt,
        });
      });
    } catch (error) {
      console.log("subscribe error:", error);
      router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/Matches`);
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [id, router, userId]);

  return (
    <div className="flex items-center">
      <div className="">
        <Paper className="h-full w-60 pb-2">
          <div className="flex items-center justify-center">
            <Button
              className="rounded-full"
              onClick={() => {
                // e.stopPropagation();
                setMode(!mode);
              }}
            >
              <Bone className="my-1" />
            </Button>
          </div>
          <div className="mb-5 flex items-center justify-center">
            <Button
              className="flex h-full w-5/6"
              onClick={() => {
                handleClickedCard();
              }}
            >
              {mode ? (
                <div>
                  <img
                    className="h-48 w-full object-cover"
                    src={image_url}
                    alt={dogname}
                  />
                  <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />
                  <div className="flex flex-col justify-between">
                    <div className="">
                      <Typography
                        variant="h6"
                        style={{
                          textAlign: "center",
                          textTransform: "none",
                        }}
                      >
                        {limit(dogname, 11)}
                      </Typography>
                    </div>
                    <div className="py-1">
                      <Typography
                        //   variant="h5"
                        style={{ textAlign: "center", textTransform: "none" }}
                      >
                        {lM.content ? (
                          <>
                            {lM.senderId == userId ? (
                              <span className="text-gray-500">you: </span>
                            ) : (
                              <></>
                            )}
                            <span className="text-gray-500">
                              {limit(lM.content, 15)}
                            </span>
                          </>
                        ) : (
                          <span>Click to start chat!</span>
                        )}
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" flex h-full w-full items-center rounded-xl bg-slate-200 p-3 shadow-lg">
                  <div className="flex w-full flex-col justify-center break-words text-left ">
                    <div className="mb-1 text-center text-3xl font-bold text-gray-900">
                      {limit(dogname, 11)}
                    </div>
                    <div className="gap-5 py-1 pl-2 font-bold">
                      <div className="my-1 flex items-center gap-2 text-base">
                        <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                          生日
                        </div>
                        <div className="flex text-xs text-zinc-500">
                          {birthday}
                        </div>
                      </div>
                      <div className="my-1 flex items-center gap-2 text-base">
                        <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                          品種
                        </div>
                        <div className="flex text-xs text-zinc-500">
                          {breed}
                        </div>
                      </div>

                      <div className="my-1 flex items-center gap-2 text-base">
                        <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                          性別
                        </div>
                        <div className="flex text-xs text-zinc-500">
                          {gender}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center pl-1 font-bold text-zinc-600 hover:text-zinc-500">
                      About me
                    </div>
                    <div className="my-1 flex items-center px-2 text-base text-gray-700">
                      <p>{limit(description, 55)}</p>
                    </div>
                  </div>
                </div>
              )}
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
}
