// OnBoardInput.tsx
import React, { useState } from "react";

import Link from "next/link";

import { SingleImageDropzone } from "../_components/single-image-dropzone";

import LoadingModal from "@/components/LoadingModal";
// import { Fullscreen } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useEdgeStore } from "@/lib/edgestore";
import { inference } from "@/lib/model/predict";

const DogImageInput: React.FC<{
  setValidatedImage: any;
  setIsImageValid: any;
  setProgress: any;
}> = ({ setValidatedImage, setIsImageValid, setProgress }) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [systemMessage, setSystemMessage] = useState<string>(
    "照片需經過系統審核\n上傳後點擊下方的Test Image來驗證",
  );
  const [file, setFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const submitInference = async () => {
    if (!previewImage) {
      setSystemMessage("請上傳照片！");
      return;
    }
    setLoading(true);
    const [inferenceResult, inferenceTimeResult] =
      await inference(previewImage);

    if (inferenceResult[0] > 0.8) {
      setIsImageValid(true);
      setSystemMessage("系統辨識狗狗成功！");
      setValidatedImage(file);
    } else {
      setIsImageValid(false);
      setSystemMessage("系統辨識狗狗失敗，請上傳一張更好的照片～");
    }
    setLoading(false);
  };

  if (loading) return <LoadingModal />;
  else {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-1.5">
        <div className="flex items-center justify-center">
          <SingleImageDropzone
            className=""
            width={200}
            height={200}
            value={file}
            onChange={(newFile?: File) => {
              setProgress(0);
              setFile(newFile);
              if (newFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImage(reader.result as string);
                };
                reader.readAsDataURL(newFile);
              }
            }}
          />
        </div>
        <div className="flex whitespace-pre-wrap text-center">
          <p className="font-mono ">{systemMessage}</p>
        </div>

        <Button
          type="button"
          onClick={submitInference}
          className="w-full bg-purple-400 p-2 text-white hover:bg-purple-500"
        >
          Test Image
        </Button>
      </div>
    );
  }
};
export default DogImageInput;
