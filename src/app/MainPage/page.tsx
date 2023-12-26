"use client";

import React from "react";
import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";

import { useDogsInfo } from "../../hooks/useDogsInfo";
import useUserInfo from "../../hooks/useUserInfo";

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
}

function MainPage() {
  const [lastDirection, setLastDirection] = useState();
  const { dogsData, loading, error } = useDogsInfo();
  const { userId, username } = useUserInfo();
  const [filteredDogs, setFilteredDogs] = useState<DogItem[]>([]);
  const [swipedCardCount, setSwipedCardCount] = useState(0);
  const [noCardsLeft, setNoCardsLeft] = useState(false);
  const [dislikedDogs, setDislikedDogs] = useState<DogItem[]>([]);

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
        const likedIds = new Set(
          likedData.map((item: LikedItem) => item.secondId),
        );
        const unseenDogs = allDogsData.filter(
          (dog: DogItem) => !likedIds.has(dog.displayId),
        );

        // Filter out dogs that are marked as disliked
        const dislikedDogIds = new Set(
          likedData
            .filter((item) => !item.likeStatus)
            .map((item) => item.secondId),
        );
        const dislikedDogs = allDogsData.filter((dog) =>
          dislikedDogIds.has(dog.displayId),
        );

        // Combine unseenDogs and dislikedDogs
        const combinedDogs = [...dislikedDogs, ...unseenDogs];

        setFilteredDogs(combinedDogs);
        setDislikedDogs(dislikedDogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchFilterDogs();
    // console.log("noCardsLeft: ", noCardsLeft);
  }, []);

  // const fetchDislikedDogs = async () => {
  //   try {
  //     setNoCardsLeft(true);
  //     // Fetch liked data
  //     const likedResponse = await fetch("/api/liked");
  //     const likedData: LikedItem[] = await likedResponse.json();

  //     // Fetch all dogs data
  //     const dogsResponse = await fetch("/api/alldogs");
  //     const allDogsData: DogItem[] = await dogsResponse.json();

  //     // Filter out dogs that are marked as disliked in the liked table
  //     const dislikedDogIds = new Set(
  //       likedData
  //         .filter((item) => !item.likeStatus)
  //         .map((item) => item.secondId),
  //     );
  //     const dislikedDogs = allDogsData.filter((dog: DogItem) =>
  //       dislikedDogIds.has(dog.displayId),
  //     );

  //     setDislikedDogs(dislikedDogs);
  //     console.log("dislikedDogs: ", dislikedDogs);
  //   } catch (error) {
  //     console.error("Error fetching disliked dogs:", error);
  //   }
  // };

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
  // const dogsToDisplay = filteredDogs.length > 1 ? filteredDogs : dislikedDogs;
  // console.log(filteredDogs.length, dislikedDogs.length);
  // console.log("filteredDogs: ", filteredDogs);
  // console.log("dogsToDisplay: ", dogsToDisplay);

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // return (
  //   <>
  //     <div className="flex h-screen w-[60%] flex-col items-center justify-center">
  //       <div className="flex h-[400px] items-center justify-center">
  //         {/* {showSpecialCard && (
  //           <TinderCard
  //             className="special-card-styling"
  //             key="special-card"
  //             onSwipe={swipeSpecialCard}
  //             preventSwipe={["up", "down"]}
  //           >
  //             <div>這是一個特殊卡片，滑動來重新獲取所有卡片</div>
  //           </TinderCard>
  //         )} */}
  //         {filteredDogs.map(
  //           (dog) =>
  //             userId !== dog.displayId && (
  //               <TinderCard
  //                 className="absolute rounded-2xl shadow-[0px_0px_60px_0px_rgba(0,0,0,0.2)]"
  //                 key={dog.displayId}
  //                 onSwipe={(dir) => swiped(dir, dog.displayId)}
  //                 onCardLeftScreen={() => outOfFrame(dog.dogname)}
  //                 preventSwipe={["up", "down"]}
  //               >
  //                 <div className="rounded-t-2xl bg-white p-10 pb-0">
  //                   <div
  //                     style={{ backgroundImage: "url(" + dog.imageUrl + ")" }}
  //                     className="relative h-[400px] w-[100vw] max-w-[300px] overflow-hidden rounded-[20px] bg-cover bg-center"
  //                   ></div>
  //                 </div>
  //                 <div className="flex rounded-b-2xl bg-white p-10 shadow-lg">
  //                   <div className="flex w-1/2 flex-col justify-center">
  //                     <div className="mb-1 text-5xl font-bold text-gray-900">
  //                       {dog.dogname}
  //                     </div>
  //                   </div>
  //                   <div className="flex w-1/2 flex-col justify-center text-right">
  //                     <div className="text-sm text-gray-600">
  //                       生日 : {dog.birthday}
  //                     </div>
  //                     <div className="text-sm text-gray-600">
  //                       品種 : {dog.breed}
  //                     </div>
  //                     <div className="text-sm text-gray-600">
  //                       介紹 : {dog.description}
  //                     </div>
  //                     <div className="text-sm text-gray-600">
  //                       性別 : {dog.gender}
  //                     </div>
  //                   </div>
  //                 </div>
  //               </TinderCard>
  //             ),
  //         )}
  //       </div>
  //     </div>
  //   </>
  // );
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
