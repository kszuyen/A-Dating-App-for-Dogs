"use client";
import { ChangeEvent, useRef, useState } from 'react';
import { IMAGE_URLS } from '../data/sample-image-urls';
import { inferenceSqueezenet } from '../utils/predict';
import styles from '../styles/Home.module.css';

interface Props {
  height: number;
  width: number;
}

const ImageCanvas = (props: Props) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  var image: HTMLImageElement;
  const [topResultLabel, setLabel] = useState("");
  const [topResultConfidence, setConfidence] = useState("");
  const [inferenceTime, setInferenceTime] = useState("");
  const [dogClassification, setDogClassification] = useState("");
  
  // Load the image from the IMAGE_URLS array
  const getImage = () => {
    var sampleImageUrls: Array<{ text: string; value: string }> = IMAGE_URLS;
    var random = Math.floor(Math.random() * (9 - 0 + 1) + 0);
    return sampleImageUrls[random];
  }

  const submitInference = async () => {

    // Get the image data from the canvas and submit inference.
    var [inferenceResult,inferenceTime] = await inferenceSqueezenet(image.src);

    // Get the highest confidence.
    var topResult = inferenceResult[0];

    // Update the label and confidence
    setLabel(`${topResult.index} ${topResult.name.toUpperCase()}`);
    setConfidence(topResult.probability);
    setInferenceTime(`Inference speed: ${inferenceTime} seconds`);

    // Classify whether is dog or not
    if (topResult.index >= 151 && topResult.index <= 268)
    {
      setDogClassification("This is a dog.");
    } else {
      setDogClassification("This is not a dog.");
    }

  };
  const [previewImage, setPreviewImage] = useState<string>("");
  const RunInference = () => { 
    // Get the image
    image = new Image();
    // var sampleImage = getImage();
    image.src = previewImage;

    // Clear out previous values.
    setLabel(`Inferencing...`);
    setConfidence("");
    setInferenceTime("");
    setDogClassification("");

    // Draw the image on the canvas
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext('2d');
    image.onload = () => {
      ctx!.drawImage(image, 0, 0, props.width, props.height);
    }
   
    // Run the inference
    submitInference();
  };
  return (
    <>
      <button
        className={styles.grid}
        onClick={RunInference} >
        Run Resnet50 inference
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
      <br/>
      <canvas ref={canvasRef} width={props.width} height={props.height} />
      <span>{topResultLabel} {topResultConfidence}</span>
      <span>{inferenceTime}</span>
      <span>{dogClassification}</span>
    </>
  )

};

export default ImageCanvas;
