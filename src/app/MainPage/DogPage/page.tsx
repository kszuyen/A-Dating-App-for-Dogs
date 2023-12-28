"use client";

import React, { useEffect, useState } from "react";

import LoadingModal from "@/components/LoadingModal";

// import { auth } from "@/lib/auth";

interface DogInfo {
  id: number;
  displayId: string;
  dogname: string;
  breed: string;
  gender: string;
  birthday: string;
  description: string;
  imageUrl: string;
}

function DogPage() {
  const [dogInfo, setDogInfo] = useState<DogInfo[]>([]);
  // const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/dogs`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDogInfo(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 條件式渲染
  if (loading) return <LoadingModal />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-sm overflow-hidden rounded-xl border-2 border-purple-400 bg-purple-200 p-4 shadow-lg drop-shadow-xl">
      <div className="mb-2 text-center text-2xl font-bold">Dog Profile</div>
      {dogInfo ? (
        <div>
          <div className="flex justify-center">
            <img
              className="h-56 w-56 rounded-lg object-cover"
              src={dogInfo[0].imageUrl}
              alt={dogInfo[0].dogname}
            />
          </div>
          <div className="">
            <div className="pl-1 pt-2 font-bold">
              <div className="flex items-end gap-3 text-3xl">
                {dogInfo[0].dogname}
                <div className="flex text-base text-zinc-500">
                  {calculateAge(dogInfo[0].birthday)}
                </div>
              </div>
            </div>
            <div className="gap-5 py-2 pl-2 font-bold">
              <div className="my-1 flex items-center gap-2 text-base">
                <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                  品種
                </div>
                <div className="flex text-xs text-zinc-500">
                  {dogInfo[0].breed}
                </div>
              </div>
              <div className="my-1 flex items-center gap-2 text-base">
                <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                  性別
                </div>
                <div className="flex text-xs text-zinc-500">
                  {dogInfo[0].gender}
                </div>
              </div>
              <div className="my-1 flex items-center gap-2 text-base">
                <div className="rounded-2xl bg-slate-200 px-1 text-zinc-500">
                  生日
                </div>
                <div className="flex text-xs text-zinc-500">
                  {dogInfo[0].birthday}
                </div>
              </div>
            </div>
            <button
              className="mb-2 flex items-center pl-1 font-bold text-zinc-600 hover:text-zinc-500"
              onClick={toggleDetails}
            >
              {/* {showDetails ? "Show less" : "About me"} */}
              About me
            </button>
            {showDetails && (
              <div className="my-1 flex items-center px-2 text-base text-gray-700">
                <p>{dogInfo[0].description}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-base text-gray-500">
          No dog information available.
        </p>
      )}
    </div>
  );
}

export default DogPage;
