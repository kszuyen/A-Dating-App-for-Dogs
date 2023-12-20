"use client";

import { ChangeEvent, useState } from "react";

// import { signIn } from "next-auth/react";
// import Image from "next/image";

// Run: npx shadcn-ui@latest add button
// import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DogImageInput from "./DogImageInput";
// import OnBoardInput from "./OnBoardInput";
import { useEdgeStore } from "@/lib/edgestore";
// import DogForm  from "./DogForm";

interface DogData {
  dogname: string;
  // 您可以根據需要添加其他屬性，例如 breed, gender, birthday, description 等
}

function OnBoardForm({}: {}) {
  // const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  // const [dogname, setDogname] = useState<string>("");
  const [dogData, setDogData] = useState({
    dogname: '',
    breed: '',
    gender: '',
    birthday: '',
    description: '',
});
  const [dogImage, setDogImage] = useState<any>(null);
  const { edgestore } = useEdgeStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === "date") {
      // 處理日期輸入的特殊情況
      finalValue = new Date(value).toISOString().split('T')[0];
    }
    setDogData({ ...dogData, [name]: finalValue });
  };
  

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/dogs', { // 替换为您的API端点
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Submit Success:', result);
    } catch (error) {
      console.error('Submit Error:', error);
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
      <Card className="min-w-[300px]">
        <CardHeader>
          <CardTitle>Fill out your dog's info!</CardTitle>
        </CardHeader>
        <CardContent className=" flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* <OnBoardInput
              label="Dog name"
              type="text"
              value={dogname || ""}
              setValue={setDogname}
            /> */}
            {/* <DogForm dogData={dogData} setDogData={setDogData} />
             */}

            <input 
              type="text"
              name="dogname" 
              placeholder="Dog's name" 
              value={dogData.dogname} 
              onChange={handleInputChange} 
              className="border p-2"
            />

            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={dogData.breed}
              onChange={handleInputChange}
              className="border p-2"
            />

            <select name="gender" value={dogData.gender} onChange={handleInputChange} className="border p-2">
              {/* <option value="">Select Gender</option> */}
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="date"
              name="birthday"
              placeholder="Birthday"
              value={dogData.birthday}
              onChange={handleInputChange}
              className="border p-2"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={dogData.description}
              onChange={handleInputChange}
              className="border p-2"
            />

            <button 
              type="submit" 
              onClick={handleInfoSubmit}
              className="w-full bg-blue-500 text-white p-2"
            >
              Submit
            </button>

            <DogImageInput
              // label="Dog image"
              // value={dogImage}
              // setDogImage={setDogImage}
              // setDisableSubmit={setDisableSubmit}
            />
            <div className="text-sm text-gray-500"></div>

            {/* <Button disabled={disableSubmit} type="submit" className="w-full">
              Submit
            </Button> */}
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default OnBoardForm;
