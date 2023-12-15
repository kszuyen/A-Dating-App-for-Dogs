"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DogImageInput from "./DogImageInput";
import OnBoardInput from "./OnBoardInput";

function OnBoardForm({}: {}) {
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [dogname, setDogname] = useState<string>("");
  const [dogImage, setDogImage] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: redirect to the UserPage
    console.log("Submitted");
  };
  return (
    <>
      <Card className="min-w-[300px]">
        <CardHeader>
          <CardTitle>Fill out your dog's info!</CardTitle>
        </CardHeader>
        <CardContent className=" flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <OnBoardInput
              label="Dog name"
              type="text"
              value={dogname}
              setValue={setDogname}
            />

            <DogImageInput
              label="Dog image"
              type="file"
              value={dogImage}
              setValue={setDogImage}
            />
            <div className="text-sm text-gray-500"></div>

            <Button disabled={disableSubmit} type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default OnBoardForm;
