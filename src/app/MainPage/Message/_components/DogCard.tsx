import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

// import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Dog } from "@/lib/types/db";

import BagelAlbum from "./BagelAlbum.jpg";

// export type DogCardProps = {
//   id: string;
//   name: string;
//   lastMessage: string;
//   //   cards: SongProps[];
// };

type Props = Dog & {
  lastMessage: string;
  mode: boolean;
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
  mode,
}: Props) {
  const router = useRouter();

  const handleClickedCard = async () => {
    console.log("Clicked a dog");
    // console.log(id);
    // TODO
    router.push(`Message/${id}`);
  };

  const handleDelete = async () => {
    // try {
    //   await deleteList(id);
    //   fetchLists();
    // } catch (error) {
    //   alert("Error: Failed to delete list");
    // }
    console.log("handle delete");
  };

  return (
    <div className="flex">
      <div>
        <Button onClick={() => handleClickedCard()} disabled={false}>
          <Paper>
            <Image
              src={BagelAlbum}
              alt="Bagel Album"
              width={200}
              height={200}
            />
            <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />
            <div className="flex flex-col justify-between">
              <div className="">
                <Typography
                  variant="h6"
                  style={{ textAlign: "center", textTransform: "none" }}
                >
                  {dogname}
                </Typography>
              </div>
              <div>
                <Typography
                  //   variant="h5"
                  style={{ textAlign: "left", textTransform: "none" }}
                >
                  {lastMessage ? (
                    <span className="text-gray-500">{lastMessage}</span>
                  ) : (
                    <span>Click to start chat!</span>
                  )}
                </Typography>
              </div>
            </div>
          </Paper>
        </Button>
      </div>
    </div>
  );
}
