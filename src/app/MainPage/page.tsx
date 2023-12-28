"use client";

import React from "react";
import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";

import { useDogsInfo } from "../../hooks/useDogsInfo";
import useUserInfo from "../../hooks/useUserInfo";

// import "./styles.css";

interface LikedItem {
  id: number;
  firstId: string;
  secondId: string;
  likeStatus: boolean;
}

// 定義 DogItem 的數據結構
interface DogItem {
  id: number;
  displayId: string;
  dogname: string;
  breed: string;
  gender: string;
  birthday: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  isExpanded: boolean;
}

function MainPage() {
  const [lastDirection, setLastDirection] = useState();
  const { dogsData, loading, error } = useDogsInfo();
  const { userId, username } = useUserInfo();
  const [filteredDogs, setFilteredDogs] = useState<DogItem[]>([]);
  const [swipedCardCount, setSwipedCardCount] = useState(0);
  const [noCardsLeft, setNoCardsLeft] = useState(false);
  const [dislikedDogs, setDislikedDogs] = useState<DogItem[]>([]);
  // const [swipedCards, setSwipedCards] = useState<Set<string>>(new Set());
  // const [animateCard, setAnimateCard] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchFilterDogs() {
      try {
        // 獲取 liked 數據
        const likedResponse = await fetch("/api/liked");
        const likedData: LikedItem[] = await likedResponse.json();

        // 獲取 alldogs 數據
        const dogsResponse = await fetch("/api/alldogs");
        const allDogsData: DogItem[] = await dogsResponse.json();

        // 過濾掉已經在 liked 表中的狗狗
        const userLikedIds = new Set(
          likedData
            .filter((item: LikedItem) => item.firstId === userId)
            .map((item: LikedItem) => item.secondId),
        );
        const unseenDogs = allDogsData.filter(
          (dog: DogItem) => !userLikedIds.has(dog.displayId),
        );

        // Filter out dogs that are marked as disliked
        const dislikedDogIds = new Set(
          likedData
            .filter(
              (item: LikedItem) => item.firstId === userId && !item.likeStatus,
            )
            .map((item: LikedItem) => item.secondId),
        );
        const dislikedDogs = allDogsData.filter((dog) =>
          dislikedDogIds.has(dog.displayId),
        );

        // Combine unseenDogs and dislikedDogs
        // 組合 unseenDogs 和 dislikedDogs，同時避免重複
        const combinedDogsIds = new Set();
        const combinedDogs = [];

        for (let dog of [...dislikedDogs, ...unseenDogs]) {
          if (!combinedDogsIds.has(dog.displayId)) {
            combinedDogs.push(dog);
            combinedDogsIds.add(dog.displayId);
          }
        }

        setFilteredDogs(combinedDogs);
        setDislikedDogs(dislikedDogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchFilterDogs();
    // console.log("noCardsLeft: ", noCardsLeft);
  }, [userId]);

  const sendLike = async (userId: string, dogDisplayId: string) => {
    try {
      const response = await fetch("/api/liked", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstId: userId,
          secondId: dogDisplayId,
          likeStatus: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submit Success:", result);
    } catch (error: any) {
      console.error("Submit Error:", error);
    }
  };

  const sendDislike = async (userId: string, dogDisplayId: string) => {
    try {
      const response = await fetch("/api/liked", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstId: userId,
          secondId: dogDisplayId,
          likeStatus: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submit Success:", result);
    } catch (error: any) {
      console.error("Submit Error:", error);
    }
  };
  // const handleSwipe = (direction: "left" | "right", dogDisplayId: string) => {
  //   setSwipedCards((prev) => {
  //     const newSwipedCards = new Set(prev);
  //     newSwipedCards.add(dogDisplayId);
  //     return newSwipedCards;
  //   });

  //   if (typeof userId === "string") {
  //     if (direction === "left") {
  //       sendDislike(userId, dogDisplayId);
  //     } else if (direction === "right") {
  //       sendLike(userId, dogDisplayId);
  //     }
  //   } else {
  //     console.error("UserId is undefined");
  //   }
  // };
  const swiped = (direction: any, dogDisplayId: string) => {
    console.log("removing: " + dogDisplayId);
    setLastDirection(direction);

    // 检查滑动方向
    if (direction === "left") {
      console.log("Swiped left: " + dogDisplayId);
      if (typeof userId === "string" && userId && dogDisplayId) {
        sendDislike(userId, dogDisplayId);
      } else {
        console.error("Invalid userId or dogDisplayId");
      }
    } else if (direction === "right") {
      console.log("Swiped right: " + dogDisplayId);
      // useSwipeInfo(swipedata.userId, swipedata.dogDisplayId);
      if (typeof userId === "string" && userId && dogDisplayId) {
        sendLike(userId, dogDisplayId);
      } else {
        console.error("Invalid userId or dogDisplayId");
      }
    }
    setSwipedCardCount((prevCount) => {
      // 更新後的計數
      const newCount = prevCount + 1;

      // console.log("swipedCardCount: " + newCount + "/" + filteredDogs.length);
      if (newCount === filteredDogs.length - 1) {
        // fetchDislikedDogs(); // Fetch disliked dogs
        // console.log("No cards left");
        setNoCardsLeft(true);
      }

      return newCount;
    });
  };
  // const animateSwipe = (direction: "left" | "right", dogDisplayId: string) => {
  //   setAnimateCard({ [dogDisplayId]: direction });
  //   setTimeout(() => {
  //     handleSwipe(direction, dogDisplayId);
  //     setAnimateCard((prev) => {
  //       const newAnim = { ...prev };
  //       delete newAnim[dogDisplayId];
  //       return newAnim;
  //     });
  //   }, 500); // duration of the animation
  // };
  // const dogsToDisplay = filteredDogs.length > 1 ? filteredDogs : dislikedDogs;
  // console.log(filteredDogs.length, dislikedDogs.length);
  // console.log("filteredDogs: ", filteredDogs);
  // console.log("dogsToDisplay: ", dogsToDisplay);

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const toggleDescription = (dogId: number) => {
    setFilteredDogs((prevDogs) =>
      prevDogs.map((dog) =>
        dog.id === dogId ? { ...dog, isExpanded: !dog.isExpanded } : dog,
      ),
    );
  };
  const renderContent = () => {
    if (noCardsLeft === true) {
      return <div className="text-center text-xl">你已經看完所有狗狗了！</div>;
    } else {
      return (
        <>
          {filteredDogs.map(
            (dog) =>
              userId !== dog.displayId && (
                <TinderCard
                  // className={`absolute rounded-2xl ${
                  //   animateCard[dog.displayId] === "left" ? "swipe-left" : ""
                  // } ${
                  //   animateCard[dog.displayId] === "right" ? "swipe-right" : ""
                  // }`}
                  className="absolute rounded-2xl border-2 border-purple-400 shadow-[0px_0px_60px_0px_rgba(0,0,0,0.2)]"
                  key={dog.displayId}
                  onSwipe={(dir) => swiped(dir, dog.displayId)}
                  onCardLeftScreen={() => outOfFrame(dog.dogname)}
                  preventSwipe={["up", "down"]}
                >
                  <div className="rounded-t-2xl bg-purple-200 p-4 pb-1 pt-6">
                    <div
                      style={{ backgroundImage: "url(" + dog.imageUrl + ")" }}
                      className="relative h-56 w-56 max-w-[300px] overflow-hidden rounded-xl bg-cover bg-center"
                    ></div>
                  </div>
                  <div className="flex max-w-64 flex-col rounded-b-2xl bg-purple-200 px-4 pb-4 shadow-lg">
                    <div className="w-full py-1 pl-1 font-bold">
                      <div className="flex items-end gap-3 text-3xl">
                        {dog.dogname}
                        {/* <div className="flex text-base text-zinc-500">
                          {calculateAge(dogInfo[0].birthday)}
                        </div> */}
                      </div>
                    </div>

                    <div className="gap-5 py-1 pl-2 font-bold">
                      <div className="my-1 flex items-center gap-2 text-base">
                        <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                          品種
                        </div>
                        <div className="flex text-xs text-zinc-500">
                          {dog.breed}
                        </div>
                      </div>
                      <div className="my-1 flex items-center gap-2 text-base">
                        <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                          性別
                        </div>
                        <div className="flex text-xs text-zinc-500">
                          {dog.gender}
                        </div>
                      </div>
                      <div className="my-1 flex items-center gap-2 text-base">
                        <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                          生日
                        </div>
                        <div className="flex text-xs text-zinc-500">
                          {dog.birthday}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center pl-1 font-bold text-zinc-600">
                      About me
                    </div>
                    <div className="my-1 flex items-center px-2 text-base text-gray-700">
                      <p
                        className={`line-clamp-2 text-start ${
                          dog.isExpanded ? "line-clamp-none" : ""
                        }`}
                        onClick={() => toggleDescription(dog.id)}
                      >
                        {dog.description}
                      </p>
                    </div>

                    {/* <div className="absolute bottom-0 left-0 right-0 flex justify-around p-4">
                      <button
                        className="rounded bg-red-500 px-4 py-2 text-white"
                        onClick={() => animateSwipe("left", dog.displayId)}
                      >
                        Dislike
                      </button>
                      <button
                        className="rounded bg-green-500 px-4 py-2 text-white"
                        onClick={() => animateSwipe("right", dog.displayId)}
                      >
                        Like
                      </button>
                    </div> */}
                  </div>
                </TinderCard>
              ),
          )}
        </>
      );
    }
  };
  return (
    <div className="flex h-screen w-[60%] flex-col items-center justify-center">
      <div className="flex h-[400px] items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}

export default MainPage;
