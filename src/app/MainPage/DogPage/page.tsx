"use client";

import React, { useEffect, useState } from "react";

import { auth } from "@/lib/auth";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-sm overflow-hidden rounded bg-white p-4 shadow-lg">
        <h1 className="mb-2 text-xl font-bold">Dog Information</h1>
        {dogInfo ? (
          <div>
            <img
              className="h-48 w-full object-cover"
              src={dogInfo[0].imageUrl}
              alt={dogInfo[0].dogname}
            />
            <div className="px-6 py-4">
              <div className="mb-2 text-xl font-bold">{dogInfo[0].dogname}</div>
              <p className="text-base text-gray-700">
                Breed: {dogInfo[0].breed}
              </p>
              <p className="text-base text-gray-700">
                Gender: {dogInfo[0].gender}
              </p>
              <p className="text-base text-gray-700">
                Birthday: {dogInfo[0].birthday}
              </p>
              <p className="text-base text-gray-700">
                Description: {dogInfo[0].description}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-base text-gray-700">
            No dog information available.
          </p>
        )}
      </div>
    </div>
  );
}

export default DogPage;
