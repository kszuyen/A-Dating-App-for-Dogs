// Language: typescript
// Path: react-next\utils\predict.ts
import { getImageTensorFromPath } from "./imageHelper";
import { runModel } from "./modelHelper";

export async function inference(path: string): Promise<[any, number]> {
  // 1. Convert image to tensor
  const imageTensor = await getImageTensorFromPath(path);
  // 2. Run model
  const [predictions, inferenceTime] = await runModel(imageTensor);
  // 3. Return predictions and the amount of time it took to inference.
  return [predictions, inferenceTime];
}
