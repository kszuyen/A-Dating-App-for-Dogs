"use client";

import DogCard from "./_components/DogCard";

function MessagePage() {
  const matches = [
    {
      displayId: "a",
      dogname: "Richard Hendricks",
      url: "./img/richard.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Erlich Bachman",
      url: "./img/richard.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Monica Hall",
      url: "./img/monica.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Jared Dunn",
      url: "./img/jared.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Dinesh Chugtai",
      url: "./img/dinesh.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Richard Hendricks",
      url: "./img/richard.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Erlich Bachman",
      url: "./img/richard.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Monica Hall",
      url: "./img/monica.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Jared Dunn",
      url: "./img/jared.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      displayId: "a",
      dogname: "Dinesh Chugtai",
      url: "./img/dinesh.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
  ];

  return (
    <>
      {/* <h1>Default Message page</h1>
      <h2>Select a Match to start chat.</h2>
      <h3>list out the matches...</h3> */}
      <div>
        {/* <Toolbar className="flex flex-row">
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item>
              <Typography variant="h6" component="div">
                Matches
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                // label="Search Matched Dogs"
                variant="outlined"
                sx={{ width: "100%" }}
                autoFocus
                // defaultValue={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Searched matched dogs"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className="w-60"
                // onClick={() => setNewListDialogOpen(true)}
              > */}
        {/* <AddIcon className="mr-2" /> */}
        {/* Add a Playlist
              </Button>
            </Grid>
          </Grid>
        </Toolbar> */}
        {/* <div className="flex flex-row"> */}
        {/* <div className="overflow-hidden"> */}
        <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matches.map((dog) => (
            <DogCard
              id={""}
              name={dog.dogname}
              lastMessage={"message"}
              key={dog.displayId}
              {...dog}
              mode={false}
            />
          ))}
          {/* </div> */}
        </div>
      </div>
    </>
  );
}

export default MessagePage;
