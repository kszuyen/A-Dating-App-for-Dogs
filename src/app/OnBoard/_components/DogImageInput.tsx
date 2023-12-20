// OnBoardInput.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SingleImageDropzone } from "../_components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { inference } from "@/lib/model/predict";

const DogImageInput: React.FC = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [inferencing, setInferencing] = useState<string>("");
  const [confidence, setConfidence] = useState<string>("");
  const [inferenceTime, setInferenceTime] = useState<string>("");
  const [isImageValid, setIsImageValid] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();

  const submitInference = async () => {
    if (!previewImage) return;

    setInferencing("Inferencing...");
    const [inferenceResult, inferenceTimeResult] = await inference(previewImage);

    setConfidence(`${(inferenceResult[0] * 100).toFixed(2)}% dog`);
    setInferenceTime(`Inference speed: ${inferenceTimeResult} seconds`);
    setInferencing("");
    setIsImageValid(inferenceResult[0] > 0.5);
  };

  const uploadImage = async () => {
    if (file && isImageValid) {
      await edgestore.myPublicImages.upload({
        file,
        input: { type: "post" },
        onProgressChange: (progress: number) => {
          // Handle progress
        },
      });
      // Handle successful upload
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        onChange={(newFile?: File) => {
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
      <Button type="button" onClick={submitInference}>
        Test Image
      </Button>
      {inferencing && <span>{inferencing}</span>}
      {confidence && <span>{confidence}</span>}
      {inferenceTime && <span>{inferenceTime}</span>}
      <Button type="button" disabled={!isImageValid} onClick={uploadImage}>
        Upload to Database
      </Button>
    </div>
  );
};

export default DogImageInput;
