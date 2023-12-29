"use client";

import React from "react";
import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";

import { useRouter } from "next/navigation";

import { useDogsInfo } from "../../hooks/useDogsInfo";
import useUserInfo from "../../hooks/useUserInfo";

import LoadingModal from "@/components/LoadingModal";
import { pusherClient } from "@/lib/pusher/client";

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
  // const [lastDirection, setLastDirection] = useState();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const { loading, error } = useDogsInfo();
  const { userId } = useUserInfo();
  const [filteredDogs, setFilteredDogs] = useState<DogItem[]>([]);
  const [swipedCardCount, setSwipedCardCount] = useState(0);
  const [noCardsLeft, setNoCardsLeft] = useState(false);
  // const [dislikedDogs, setDislikedDogs] = useState<DogItem[]>([]);
  // const [swipedCards, setSwipedCards] = useState<Set<string>>(new Set());
  // const [animateCard, setAnimateCard] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  // const [matched, setMatched] = useState<boolean>(false);
  useEffect(() => {
    if (!userId) return;
    // Private channels are in the format: private-...
    // Make a channel for the chatroom according to the 2 person's id
    const channelName = `private-${userId}`;
    try {
      pusherClient.subscribe(channelName);
      const matchDiv = document.getElementById("match-text")!;

      pusherClient.bind("liked:mainpage", (currentMatched: boolean) => {
        // setMatched(currentMatched);
        if (currentMatched) {
          matchDiv.style.display = "inline";

          setTimeout(function () {
            matchDiv.style.display = "none";
          }, 2200); // <-- time in milliseconds
        }
      });
    } catch (error) {
      console.log("subscribe error:", error);
    }
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [userId, router]);

  const MatchedText = () => {
    const [isMatched, setIsMatched] = useState(false);

    useEffect(() => {
      // Simulate a delay to show the effect over time
      const timeoutId = setTimeout(() => {
        setIsMatched(true);
      }, 2000);

      // Clear the timeout on component unmount to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }, []); // Run the effect only once on component mount

    const textStyle = {
      fontSize: isMatched ? "6rem" : "4rem", // Larger font size when matched
      fontWeight: "bold",
      color: isMatched ? "#66cdaa" : "purple", // Light green color when matched
      transition: "font-size 2s, color 2s", // Transition over 2 seconds for font size and color
    };

    return (
      <p className="text-4xl" style={textStyle}>
        Matched!
      </p>
    );
  };

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // 交換元素
    }
    return array;
  }
  useEffect(() => {
    if (!userId) return;
    async function fetchFilterDogs() {
      try {
        setPageLoading(true);

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

        // 分別洗牌
        const shuffledDislikedDogs = shuffleArray([...dislikedDogs]);
        const shuffledUnseenDogs = shuffleArray([...unseenDogs]);

        // 合併陣列
        const combinedDogs = [...shuffledDislikedDogs, ...shuffledUnseenDogs];

        setFilteredDogs(combinedDogs);
        if (combinedDogs.length === 0) {
          setNoCardsLeft(true);
        }
        setPageLoading(false);
        // setDislikedDogs(dislikedDogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchFilterDogs();
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
      // console.log("Submit Success:", result);
    } catch (error: any) {
      console.error("Submit Error:", error);
    }
  };
  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
      // console.log("Submit Success:", result);
    } catch (error: any) {
      console.error("Submit Error:", error);
    }
  };
  const swiped = (direction: any, dogDisplayId: string) => {
    // console.log("removing: " + dogDisplayId);
    // setLastDirection(direction);

    // 检查滑动方向
    if (direction === "left") {
      // console.log("Swiped left: " + dogDisplayId);
      if (typeof userId === "string" && userId && dogDisplayId) {
        sendDislike(userId, dogDisplayId);
      } else {
        console.error("Invalid userId or dogDisplayId");
      }
    } else if (direction === "right") {
      // console.log("Swiped right: " + dogDisplayId);
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

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  // if (loading) return <div>Loading...</div>;
  if (loading || pageLoading) return <LoadingModal />;
  if (error) return <div>Error: {error}</div>;
  const toggleDescription = (dogId: number) => {
    setFilteredDogs((prevDogs) =>
      prevDogs.map((dog) =>
        dog.id === dogId ? { ...dog, isExpanded: !dog.isExpanded } : dog,
      ),
    );
  };

  const renderContent = () => {
    return (
      <>
        {!noCardsLeft ? (
          <>
            {filteredDogs.map(
              (dog) =>
                userId !== dog.displayId && (
                  <TinderCard
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
                          <div className="flex text-base text-black opacity-50">
                            {calculateAge(dog.birthday)}
                          </div>
                        </div>
                      </div>

                      <div className="gap-5 py-1 pl-2 font-bold">
                        <div className="my-1 flex items-center gap-2 text-base">
                          <div className="rounded-2xl bg-slate-100 px-1 text-zinc-500">
                            品種
                          </div>
                          <div className="flex text-xs text-zinc-500">
                            {dog.breed}
                          </div>
                        </div>
                        <div className="my-1 flex items-center gap-2 text-base">
                          <div className="rounded-2xl bg-slate-100 px-1 text-zinc-500">
                            性別
                          </div>
                          <div className="flex text-xs text-zinc-500">
                            {dog.gender}
                          </div>
                        </div>
                        <div className="my-1 flex items-center gap-2 text-base">
                          <div className="rounded-2xl bg-slate-100 px-1 text-zinc-500">
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
                      <div className="my-1 flex h-auto items-center break-words px-2 text-base text-gray-700">
                        <p
                          className={`text-start ${
                            dog.isExpanded
                              ? "line-clamp-none h-auto w-52"
                              : "line-clamp-1"
                          }`}
                          onClick={() => toggleDescription(dog.id)}
                        >
                          {dog.description}
                        </p>
                      </div>
                    </div>
                  </TinderCard>
                ),
            )}
          </>
        ) : (
          <div className="text-center text-xl">你已經看完所有狗狗了！</div>
        )}
      </>
    );
  };
  return (
    <div className="flex h-screen w-[60%] flex-col items-center justify-center">
      <div className="flex h-[400px] items-center justify-center">
        {renderContent()}
      </div>
      <div
        id="match-text"
        className="absolute hidden items-center justify-center"
      >
        <MatchedText />
      </div>
    </div>
  );
}

export default MainPage;
