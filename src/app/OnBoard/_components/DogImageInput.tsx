// OnBoardInput.tsx
import React, { useState } from "react";

import Link from "next/link";

import { SingleImageDropzone } from "../_components/single-image-dropzone";

// import { Fullscreen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { inference } from "@/lib/model/predict";

const DogImageInput: React.FC<{
  onImageUpload: (url: string, thumbnailUrl: string) => void;
}> = ({ onImageUpload }) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [inferencing, setInferencing] = useState<string>("");
  const [confidence, setConfidence] = useState<string>("");
  const [inferenceTime, setInferenceTime] = useState<string>("");
  const [isImageValid, setIsImageValid] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();

  const submitInference = async () => {
    if (!previewImage) return;

    setInferencing("Inferencing...");
    const [inferenceResult, inferenceTimeResult] =
      await inference(previewImage);

    setConfidence(`${(inferenceResult[0] * 100).toFixed(2)}% dog`);
    setInferenceTime(`Inference speed: ${inferenceTimeResult} seconds`);
    setInferencing("");
    setIsImageValid(inferenceResult[0] > 0.5);
  };

  const uploadImage = async () => {
    if (file && isImageValid) {
      const res = await edgestore.myPublicImages.upload({
        file,
        input: { type: "post" },
        onProgressChange: (progress: number) => {
          setProgress(progress);
        },
      });
      setUrls({
        url: res.url,
        thumbnailUrl: res.thumbnailUrl,
      });
      if (res && res.url && res.thumbnailUrl) {
        onImageUpload(res.url, res.thumbnailUrl); // Call the callback function here
      }
    }
  };

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
      <Button
        type="button"
        onClick={submitInference}
        className="w-full bg-purple-400 p-2 text-white hover:bg-purple-500"
      >
        Test Image
      </Button>
      {/* {inferencing && <span>{inferencing}</span>}
      {confidence && <span>{confidence}</span>}
      {inferenceTime && <span>{inferenceTime}</span>} */}
      <Button
        type="button"
        disabled={!isImageValid}
        onClick={uploadImage}
        className="w-full rounded bg-white px-2 text-black hover:opacity-80"
      >
        Upload to Database
      </Button>
      <div className="h-[6px] w-full overflow-hidden rounded border">
        <div
          className="h-full bg-black transition-all duration-150"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      {/* {urls?.url && (
        <Link href={urls.url} target="_blank">
          URL
        </Link>
      )}
      {urls?.thumbnailUrl && (
        <Link href={urls.thumbnailUrl} target="_blank">
          THUMBNAIL
        </Link>
      )} */}
    </div>
  );
};

export default DogImageInput;
