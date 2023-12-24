"use client";

import { useState } from "react";
import TinderCard from "react-tinder-card";

import { useDogsInfo } from "../../hooks/useDogsInfo";

// Adjust the import path as necessary

function MainPage() {
  const [lastDirection, setLastDirection] = useState();
  const { dogsData, loading, error } = useDogsInfo(); // Use the custom hook

  const swiped = (direction: any, dogDisplayId: string) => {
    console.log("removing: " + dogDisplayId);
    setLastDirection(direction);
    // Add your code here if needed
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex h-screen w-[60%] flex-col items-center justify-center">
        <div className="flex h-[400px] items-center justify-center">
          {dogsData.map((dog) => (
            <TinderCard
              className="absolute rounded-2xl shadow-[0px_0px_60px_0px_rgba(0,0,0,0.2)]"
              key={dog.displayId}
              onSwipe={(dir) => swiped(dir, dog.displayId)}
              onCardLeftScreen={() => outOfFrame(dog.dogname)}
              preventSwipe={["up", "down"]}
            >
              <div className="rounded-t-2xl bg-white p-10 pb-0">
                <div
                  style={{ backgroundImage: "url(" + dog.imageUrl + ")" }}
                  className="relative h-[400px] w-[100vw] max-w-[300px] overflow-hidden rounded-[20px] bg-cover bg-center"
                ></div>
              </div>
              <div className="flex rounded-b-2xl bg-white p-10 shadow-lg">
                <div className="flex w-1/2 flex-col justify-center">
                  <div className="mb-1 text-5xl font-bold text-gray-900">
                    {dog.dogname}
                  </div>
                </div>
                <div className="flex w-1/2 flex-col justify-center text-right">
                  <div className="text-sm text-gray-600">
                    生日 : {dog.birthday}
                  </div>
                  <div className="text-sm text-gray-600">
                    品種 : {dog.breed}
                  </div>
                  <div className="text-sm text-gray-600">
                    介紹 : {dog.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    性別 : {dog.gender}
                  </div>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainPage;
