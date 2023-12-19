import _ from "lodash";
import * as ort from "onnxruntime-web";

export async function runModel(preprocessedData: any): Promise<[any, number]> {
  // Create session and set options. See the docs here for more options:
  //https://onnxruntime.ai/docs/api/js/interfaces/InferenceSession.SessionOptions.html#graphOptimizationLevel
  const session = await ort.InferenceSession.create(
    "./_next/static/chunks/pages/My_Dog_Classifier.onnx",
    // "./src/model/My_Dog_Classifier.onnx",
    { executionProviders: ["webgl"], graphOptimizationLevel: "all" },
  );
  console.log("Inference session created");
  // Run inference and get results.
  var [results, inferenceTime] = await runInference(session, preprocessedData);
  return [results, inferenceTime];
}

async function runInference(
  session: ort.InferenceSession,
  preprocessedData: any,
): Promise<[any, number]> {
  // Get start time to calculate inference time.
  const start = new Date();
  // create feeds with the input name from model export and the preprocessed data.
  const feeds: Record<string, ort.Tensor> = {};
  feeds[session.inputNames[0]] = preprocessedData;

  // Run the session inference.
  const outputData = await session.run(feeds);
  // Get the end time to calculate inference time.
  const end = new Date();
  // Convert to seconds.
  const inferenceTime = (end.getTime() - start.getTime()) / 1000;
  // Get output results with the output name from the model export.
  const output = outputData[session.outputNames[0]];
  //Get the softmax of the output data. The softmax transforms values to be between 0 and 1
  var outputSoftmax = softmax(Array.prototype.slice.call(output.data));
  console.log(outputSoftmax);
  //Get the top 5 results.
  // var results = imagenetClassesTopK(outputSoftmax, 5);
  // console.log('results: ', results);
  return [outputSoftmax, inferenceTime];
}

//The softmax transforms values to be between 0 and 1
function softmax(resultArray: number[]): any {
  // Get the largest value in the array.
  const largestNumber = Math.max(...resultArray);
  // Apply exponential function to each result item subtracted by the largest number, use reduce to get the previous result number and the current number to sum all the exponentials results.
  const sumOfExp = resultArray
    .map((resultItem) => Math.exp(resultItem - largestNumber))
    .reduce((prevNumber, currentNumber) => prevNumber + currentNumber);
  //Normalizes the resultArray by dividing by the sum of all exponentials; this normalization ensures that the sum of the components of the output vector is 1.
  return resultArray.map((resultValue, index) => {
    return Math.exp(resultValue - largestNumber) / sumOfExp;
  });
}
