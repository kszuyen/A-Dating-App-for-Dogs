import { useState } from "react";

// import Image from "next/image";
import { useRouter } from "next/navigation";

// import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Bone } from "lucide-react";

import { Dog } from "@/lib/types/db";

type Props = Dog & {
  lastMessage: string | null;
  senderId: string | null;
  sentAt: string | null;
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
  lastMessage,
  senderId,
  sentAt,
}: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<boolean>(true);
  const handleClickedCard = async () => {
    router.push(`/MainPage/Matches/${id}`);
  };

  function limit(string = "", limit = 0) {
    return string.substring(0, limit);
  }

  return (
    <div className="flex items-center">
      <div className="bg-purple-400">
        <Paper className="h-80 w-60">
          <Button
            className="absolute right-0 top-0"
            onClick={(e) => {
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
                      {dogname}
                    </Typography>
                  </div>
                  <div className="py-1">
                    <Typography
                      //   variant="h5"
                      style={{ textAlign: "center", textTransform: "none" }}
                    >
                      {lastMessage ? (
                        <span className="text-gray-500">{lastMessage}</span>
                      ) : (
                        <span>Click to start chat!</span>
                      )}
                    </Typography>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center rounded-b-xl bg-white p-4 shadow-lg">
                {/* <div className="flex w-1/2 flex-col justify-center"> */}

                {/* </div> */}
                <div className="flex max-w-56 flex-col justify-center text-left">
                  <div className="mb-1 text-center text-3xl font-bold text-gray-900">
                    {dogname}
                  </div>
                  <div className="text-sm text-gray-600">生日 : {birthday}</div>
                  <div className="text-sm text-gray-600">品種 : {breed}</div>

                  <div className="text-sm text-gray-600">性別 : {gender}</div>
                  <div className="text-sm text-gray-600">
                    介紹 : {description}
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
