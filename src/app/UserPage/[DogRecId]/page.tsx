"use client";

import { ChangeEvent, useRef, useState } from "react";

// import styles from "../styles/Home.module.css";
import { inferenceSqueezenet } from "../../../utils/predict";

interface Props {
  height: number;
  width: number;
}

const ImageCanvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  var image: HTMLImageElement;
  const [inferencing, setInferencing] = useState("");
  const [confidence, setConfidence] = useState("");
  const [inferenceTime, setInferenceTime] = useState("");

  const submitInference = async () => {
    // Get the image data from the canvas and submit inference.
    var [inferenceResult, inferenceTime] = await inferenceSqueezenet(image.src);

    // Update the label and confidence
    setConfidence(`${(inferenceResult[0] * 100).toFixed(2)} % dog`);
    setInferenceTime(`Inference speed: ${inferenceTime} seconds`);
    setInferencing("");
  };
  const [previewImage, setPreviewImage] = useState<string>("");
  const RunInference = () => {
    // Get the image
    image = new Image();
    image.src = previewImage;

    // Clear out previous values.
    setInferencing(`Inferencing...`);
    setConfidence("");
    setInferenceTime("");

    // Draw the image on the canvas
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext("2d");
    image.onload = () => {
      ctx!.drawImage(image, 0, 0, props.width, props.height);
    };

    // Run the inference
    submitInference();
  };
  return (
    <>
      <button onClick={RunInference}>
        Run My_Dog_Classifier inference
      </button>
      <div className="mt-4">
        {/* <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image (.jpg)
            </label> */}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          // style={{ display: "none" }}
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
        />
        {/* {previewImage && (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(16 / 9) * 576}px` }}
              />
            )} */}
      </div>
      <br />
      <canvas ref={canvasRef} width={props.width} height={props.height} />
      <span>{inferencing}</span>
      <span>{confidence}</span>
      <span>{inferenceTime}</span>
    </>
  );
};

export default ImageCanvas;
