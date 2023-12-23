import { useState } from "react";

import Image from "next/image";

// import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import BagelAlbum from "./BagelAlbum.jpg";

export type PlayListProps = {
  id: string;
  name: string;
  lastMessage: string;
  //   cards: SongProps[];
};

type Props = PlayListProps & {
  mode: boolean;
};

export default function PlayList({
  mode: deleteMode,
  id,
  name,
  lastMessage, // or just pass the whole messages, and get the last message from messages
  //   messages,
}: Props) {
  const handleClickedMessage = async () => {
    console.log("Clicked a dog");
    // TODO
    // redirect to /MainPage/Message/[otherDogDisplayId]
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
    <div className="flex-auto">
      <div>
        <Button onClick={() => handleClickedMessage()} disabled={deleteMode}>
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
                  {name}
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
