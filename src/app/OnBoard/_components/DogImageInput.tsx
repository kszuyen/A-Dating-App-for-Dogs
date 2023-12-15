"use client";

import React, { useState, ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add input label
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inference } from "@/lib/model/predict";

type Props = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

function OnBoardInput({ label, value, setValue }: Props) {
  var image: HTMLImageElement;
  const [previewImage, setPreviewImage] = useState<string>("");

  const [inferencing, setInferencing] = useState("");
  const [confidence, setConfidence] = useState("");
  const [inferenceTime, setInferenceTime] = useState("");
  const submitInference = async () => {
    // Get the image data from the canvas and submit inference.
    var [inferenceResult, inferenceTime] = await inference(image.src);

    // Update the label and confidence
    setConfidence(`${(inferenceResult[0] * 100).toFixed(2)} % dog`);
    setInferenceTime(`Inference speed: ${inferenceTime} seconds`);
    setInferencing("");
  };
  const RunInference = () => {
    // Get the image
    image = new Image();
    image.src = previewImage;

    // Clear out previous values.
    setInferencing(`Inferencing...`);
    setConfidence("");
    setInferenceTime("");

    // Draw the image on the canvas
    // const canvas = canvasRef.current;
    // const ctx = canvas!.getContext("2d");
    // image.onload = () => {
    //   ctx!.drawImage(image, 0, 0, props.width, props.height);
    // };

    // Run the inference
    submitInference();
  };
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label>{label}</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="file"
          value={value}
          accept="image/*"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (event?.target?.files?.[0]) {
              const file = event.target.files[0];
              const reader = new FileReader();
              reader.onloadend = () => {
                setPreviewImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />{" "}
        <Button type="button" onClick={RunInference}>
          Test
        </Button>
      </div>
      <span>{inferencing}</span>
      <span>{confidence}</span>
      <span>{inferenceTime}</span>
    </div>
  );
}

export default OnBoardInput;
