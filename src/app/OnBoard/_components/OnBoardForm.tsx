"use client";

import { ChangeEvent, useState } from "react";

// import { signIn } from "next-auth/react";
// import Image from "next/image";
// Run: npx shadcn-ui@latest add button
// import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import OnBoardInput from "./OnBoardInput";
import { useEdgeStore } from "@/lib/edgestore";

import DogImageInput from "./DogImageInput";

// import DogForm  from "./DogForm";

interface DogData {
  dogname: string;
  // 您可以根據需要添加其他屬性，例如 breed, gender, birthday, description 等
}

function OnBoardForm({}: {}) {
  // const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  // const [dogname, setDogname] = useState<string>("");
  const [dogData, setDogData] = useState({
    dogname: "",
    breed: "",
    gender: "",
    birthday: "",
    description: "",
    imageUrl: "",
    thumbnailUrl: "",
  });
  const [dogImage, setDogImage] = useState<any>(null);
  const { edgestore } = useEdgeStore();

  const handleImageUpload = (url: string, thumbnailUrl: string) => {
    setDogData({ ...dogData, imageUrl: url, thumbnailUrl: thumbnailUrl });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === "date") {
      // 處理日期輸入的特殊情況
      finalValue = new Date(value).toISOString().split("T")[0];
    }
    setDogData({ ...dogData, [name]: finalValue });
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/dogs", {
        // 替换为您的API端点
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Submit Success:", result);
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dogImage) {
      console.log("No image selected");
      return;
    }

    try {
      const res = await edgestore.myPublicImages.upload({
        file: dogImage,
        input: { type: "post" },
      });
      console.log("Image URL:", res.url);
      // TODO: redirect to the UserPage or handle the response
    } catch (error) {
      console.error("Error uploading image:", error);
      // TODO: Handle the error appropriately
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100">
        <Card className="mx-auto mt-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
          <CardHeader className="bg-purple-500 p-4 text-lg font-semibold text-white">
            <CardTitle>Fill out your dog's info!</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div>
              <DogImageInput onImageUpload={handleImageUpload} />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="dogname"
                placeholder="Dog's name"
                value={dogData.dogname}
                onChange={handleInputChange}
                className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <input
                type="text"
                name="breed"
                placeholder="Breed"
                value={dogData.breed}
                onChange={handleInputChange}
                className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <select
                name="gender"
                value={dogData.gender}
                onChange={handleInputChange}
                className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <input
                type="date"
                name="birthday"
                placeholder="Birthday"
                value={dogData.birthday}
                onChange={handleInputChange}
                className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={dogData.description}
                onChange={handleInputChange}
                className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <button
                type="submit"
                onClick={handleInfoSubmit}
                className="w-full rounded bg-purple-400 p-2 text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Submit
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default OnBoardForm;
