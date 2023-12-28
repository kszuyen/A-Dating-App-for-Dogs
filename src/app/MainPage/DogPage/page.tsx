"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const handleClick = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to leave this page?",
    );
    if (userConfirmed) {
      // User clicked 'OK'
      router.push("/OnBoard");
    } else {
      // User clicked 'Cancel'
      // Optionally handle the cancelation
    }
  };
  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  // const toggleDetails = () => {
  //   setShowDetails(!showDetails);
  // };
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
    <>
      <div className="flex flex-col rounded-xl border-2 border-purple-400 bg-purple-200 p-4 shadow-lg drop-shadow-xl">
        <div className="mb-2 flex items-center justify-center p-5 text-center text-3xl font-bold">
          Dog Profile
        </div>
        {dogInfo ? (
          <div className="flex flex-col">
            <div className="flex">
              <div className="flex justify-center">
                <img
                  className="h-56 w-56 rounded-lg object-cover px-1"
                  src={dogInfo[0].imageUrl}
                  alt={dogInfo[0].dogname}
                />
              </div>
              <div className="mb-6 flex">
                <div className="p-5 font-bold">
                  <div className="flex items-end gap-3 text-3xl">
                    {dogInfo[0].dogname}
                    <div className="flex text-base text-black opacity-50">
                      {calculateAge(dogInfo[0].birthday)}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-4">
                    <div className="my-1 flex items-center gap-2 text-base">
                      <div className="rounded-2xl bg-slate-100 px-1 text-zinc-500">
                        品種
                      </div>
                      <div className="flex text-xs text-zinc-500">
                        {dogInfo[0].breed}
                      </div>
                    </div>
                    <div className="my-1 flex items-center gap-2 text-base">
                      <div className="rounded-2xl bg-slate-100 px-1 text-zinc-500">
                        性別
                      </div>
                      <div className="flex text-xs text-zinc-500">
                        {dogInfo[0].gender}
                      </div>
                    </div>
                    <div className="my-1 flex items-center gap-2 text-base">
                      <div className="rounded-2xl bg-slate-100 px-1 text-zinc-500">
                        生日
                      </div>
                      <div className="flex text-xs text-zinc-500">
                        {dogInfo[0].birthday}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col break-words px-2 py-2 text-lg">
              <div className="pb-2 font-bold text-zinc-600 ">About me</div>
              <div className="mb-3 flex h-auto w-96 text-left">
                {dogInfo[0].description}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-base text-gray-500">
            No dog information available.
          </p>
        )}
      </div>
      <div className="flex items-center justify-center py-3 ">
        <button
          className="font-mono text-base font-bold text-gray-400"
          onClick={handleClick}
        >
          <p className="underline-offset-1 hover:text-gray-500 hover:underline">
            Want to change dog profile?
          </p>
        </button>
      </div>
    </>
  );
}

export default DogPage;
