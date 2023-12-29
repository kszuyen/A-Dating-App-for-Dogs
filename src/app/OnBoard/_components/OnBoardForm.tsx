"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import LoadingModal from "@/components/LoadingModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import OnBoardInput from "./OnBoardInput";
import { useEdgeStore } from "@/lib/edgestore";
import { publicEnv } from "@/lib/env/public";

import DogImageInput from "./DogImageInput";

// import DogForm  from "./DogForm";
function OnBoardForm({}: {}) {
  const router = useRouter();
  const [dogData, setDogData] = useState({
    dogname: "",
    breed: "",
    gender: "",
    birthday: "",
    description: "",
  });
  const searchParams = useSearchParams();

  const edit = searchParams.get("edit");
  // from dogImageInput
  const [validatedImage, setValidatedImage] = useState<File | undefined>(
    undefined,
  );

  const [isImageValid, setIsImageValid] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { edgestore } = useEdgeStore();

  const [invalidDogname, setInvalidDogname] = useState<boolean>(false);
  const [invalidBreed, setInvalidBreed] = useState<boolean>(false);
  const [invalidGender, setInvalidGender] = useState<boolean>(false);
  const [invalidBirthday, setInvalidBirthday] = useState<boolean>(false);
  const [invalidDescription, setInvalidDescription] = useState<boolean>(false);

  const [invalidDognameLength, setInvalidDognameLength] =
    useState<boolean>(false);
  const [invalidDescriptionLength, setInvalidDescriptionLength] =
    useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    // console.log(e.target);
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
    if (!validatedImage || !isImageValid) {
      // console.log("invalid image");
      return;
    }
    if (dogData.dogname.length === 0) {
      setInvalidDogname(true);
      return;
    } else {
      setInvalidDogname(false);
    }
    if (dogData.dogname.length > 10) {
      setInvalidDognameLength(true);
      return;
    } else {
      setInvalidDognameLength(false);
    }
    if (dogData.breed.length === 0) {
      setInvalidBreed(true);
      return;
    } else {
      setInvalidBreed(false);
    }
    if (dogData.gender.length === 0) {
      setInvalidGender(true);
      return;
    } else {
      setInvalidGender(false);
    }
    if (dogData.birthday.length === 0) {
      setInvalidBirthday(true);
      return;
    } else {
      setInvalidBirthday(false);
    }
    if (dogData.description.length === 0) {
      setInvalidDescription(true);
      return;
    } else {
      setInvalidDescription(false);
    }
    if (dogData.description.length > 30) {
      setInvalidDescriptionLength(true);
      return;
    } else {
      setInvalidDescriptionLength(false);
    }
    setLoading(true);
    try {
      const res = await edgestore.myPublicImages.upload({
        file: validatedImage,
        input: { type: "post" },
        onProgressChange: (progress: number) => {
          setProgress(progress);
        },
      });

      // console.log(dogData);

      const response = await fetch("/api/dogs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dogname: dogData.dogname,
          breed: dogData.breed,
          gender: dogData.gender,
          birthday: dogData.birthday,
          description: dogData.description,
          imageUrl: res.url,
          thumbnailUrl: res.thumbnailUrl,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // const result = await response.json();
      // console.log("Submit Success:", result);
      router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/MainPage`);
    } catch (error) {
      console.error("Submit Error:", error);
    }
    setLoading(false);
  };
  if (loading) return <LoadingModal />;
  else {
    return (
      <>
        <div className="flex w-full items-center justify-center px-4 md:max-w-xs lg:max-w-sm xl:max-w-md">
          <Card className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
            <CardHeader className="flex flex-row bg-purple-500 p-4 text-lg font-semibold text-white">
              {edit === "true" && (
                <>
                  <Link
                    className="mr-2 flex justify-items-start rounded-lg bg-purple-50 px-2 py-1 text-sm text-gray-500 transition duration-200 ease-in-out hover:bg-gray-100"
                    href="/MainPage"
                  >
                    <p>Back</p>
                  </Link>
                </>
              )}
              <CardTitle className="flex flex-grow">
                {edit === "true" ? "Edit" : "Fill out"} your dog's info!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div>
                <DogImageInput
                  setValidatedImage={setValidatedImage}
                  setIsImageValid={setIsImageValid}
                  setProgress={setProgress}
                />
              </div>
              <form className="flex flex-col gap-4 font-mono ">
                <input
                  type="text"
                  name="dogname"
                  placeholder="狗狗的名字..."
                  value={dogData.dogname}
                  onChange={handleInputChange}
                  className="mt-3 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {invalidDogname && (
                  <div className="text-sm text-red-500">
                    請輸入狗狗的名字...
                  </div>
                )}
                {invalidDognameLength && (
                  <div className="text-sm text-yellow-500">狗狗名字過長</div>
                )}
                <input
                  type="text"
                  name="breed"
                  placeholder="狗狗的品種"
                  value={dogData.breed}
                  onChange={handleInputChange}
                  className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />{" "}
                {invalidBreed && (
                  <div className="text-sm text-red-500">請填寫狗狗的品種</div>
                )}
                <select
                  name="gender"
                  value={dogData.gender}
                  onChange={handleInputChange}
                  className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled hidden>
                    狗狗的性別
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {invalidGender && (
                  <div className="text-sm text-red-500">請填寫狗狗的性別</div>
                )}
                <input
                  type="text"
                  name="birthday"
                  placeholder="狗狗的生日"
                  onFocus={(e) => (e.target.type = "date")}
                  value={dogData.birthday} // Add this line
                  onChange={handleInputChange}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    if (e.target.value === "") {
                      e.target.type = "text";
                    }
                  }}
                  className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {invalidBirthday && (
                  <div className="text-sm text-red-500">請選擇狗狗的生日</div>
                )}
                <textarea
                  name="description"
                  placeholder="介紹一下您的狗狗吧"
                  value={dogData.description}
                  onChange={handleInputChange}
                  className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {invalidDescription && (
                  <div className="font-mono text-sm text-red-500">
                    介紹一下您的狗狗吧！
                  </div>
                )}
                {invalidDescriptionLength && (
                  <div className="font-mono text-sm text-yellow-500">
                    請以更簡短的方式描述狗狗
                  </div>
                )}
                <Button
                  type="button"
                  disabled={!isImageValid}
                  onClick={handleInfoSubmit}
                  // className="w-full rounded bg-white px-2 text-black hover:opacity-80"
                  className="w-full rounded bg-purple-400 p-2 text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Submit
                </Button>
                <div className="h-[6px] w-full overflow-hidden rounded border">
                  <div
                    className="h-full bg-black transition-all duration-150"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
}
export default OnBoardForm;
