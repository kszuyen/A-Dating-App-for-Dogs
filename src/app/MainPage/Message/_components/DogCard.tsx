import { useState } from "react";

import Image from "next/image";

// import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import BagelAlbum from "./BagelAlbum.jpg";

export type PlayListProps = {
  id: string;
  name: string;
  description: string;
  //   cards: SongProps[];
};

type Props = PlayListProps & {
  mode: boolean;
};

export default function PlayList({
  mode: deleteMode,
  id,
  name,
  description,
  //   cards,
}: Props) {
  //   const [openNewCardDialog, setOpenPlayListPage] = useState(false);

  //   const { fetchLists } = useCards();
  const handleClickedMessage = async () => {
    console.log("Clicked a dog");
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
        {/* {deleteMode ? (
          <div className="grid place-items-center">
            <button>
              <IconButton color="error" onClick={handleDelete}>
                {/* <DeleteIcon /> */}
        {/* </IconButton>
            </button>
          </div>
        ) : null} */}
        <Button onClick={() => handleClickedMessage()} disabled={deleteMode}>
          <Paper>
            <Image
              src={BagelAlbum}
              alt="Bagel Album"
              width={200}
              height={200}
            />
            <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <Typography
                  variant="h5"
                  style={{ textAlign: "left", textTransform: "none" }}
                >
                  {name}
                </Typography>
              </div>
            </div>
          </Paper>
        </Button>
      </div>
    </div>
  );
}
