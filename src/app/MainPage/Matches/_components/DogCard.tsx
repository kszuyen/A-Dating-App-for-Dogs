import { useEffect, useState } from "react";

// import Image from "next/image";
import { useRouter } from "next/navigation";

// import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Bone } from "lucide-react";

import useUserInfo from "@/hooks/useUserInfo";
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
    router.push(`/MainPage/Matches/${id}`);
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
      router.push("/Matches");
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [id, router, userId]);

  return (
    <div className="flex items-center">
      <div className="bg-purple-400">
        <Paper className="h-80 w-60">
          <Button
            className="absolute right-0 top-0"
            onClick={() => {
              // e.stopPropagation();
              setMode(!mode);
            }}
          >
            <Bone />
          </Button>
          <Button
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
              <div className="flex max-w-[60] items-center rounded-b-xl bg-white p-4 shadow-lg">
                {/* <div className="flex w-1/2 flex-col justify-center"> */}

                {/* </div> */}
                <div className="flex max-w-48 flex-col justify-center break-words text-left ">
                  <div className="mb-1 text-center text-3xl font-bold text-gray-900">
                    {limit(dogname, 11)}
                  </div>
                  <div className="text-sm text-gray-600">生日 : {birthday}</div>
                  <div className="text-sm text-gray-600">品種 : {breed}</div>

                  <div className="text-sm text-gray-600">性別 : {gender}</div>
                  <div className="text-sm text-gray-600">
                    介紹 : {limit(description, 55)}
                  </div>
                </div>
              </div>
            )}
          </Button>
        </Paper>
      </div>
    </div>
  );
}
