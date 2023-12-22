"use client";

import { useState } from "react";
import TinderCard from "react-tinder-card";

function UserPage() {
  const [lastDirection, setLastDirection] = useState();

  //TODO: get dogs and images from db
  const dogs = [
    {
      id: "a",
      dogname: "Richard Hendricks",
      url: "./img/richard.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      id: "a",
      dogname: "Erlich Bachman",
      url: "./img/richard.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      id: "a",
      dogname: "Monica Hall",
      url: "./img/monica.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      id: "a",
      dogname: "Jared Dunn",
      url: "./img/jared.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
    {
      id: "a",
      dogname: "Dinesh Chugtai",
      url: "./img/dinesh.jpg",
      breed: "a",
      gender: "male",
      birthday: "",
      discription: "I am a dog",
    },
  ];
  const swiped = (direction: any, nameToDelete: string) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  return (
    <>
      {/* <div>MainPage</div>
      <div>Add swipe functions here</div> */}
      <div className="flex h-screen w-[60%] flex-col items-center justify-center">
        <div className="h-[450px] w-[135vw] max-w-[390px]">
          {dogs.map((dog) => (
            <TinderCard
              className="absolute"
              key={dog.dogname}
              onSwipe={(dir) => swiped(dir, dog.dogname)}
              onCardLeftScreen={() => outOfFrame(dog.dogname)}
              preventSwipe={["up", "down"]}
            >
              <div
                style={{ backgroundImage: "url(" + dog.url + ")" }}
                className="relative h-[450px] w-[120vw] max-w-[390px] rounded-[20px] bg-white bg-cover bg-center shadow-[0px_0px_60px_0px_rgba(0,0,0,0.30)]"
              >
                <h3>{dog.dogname}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserPage;
