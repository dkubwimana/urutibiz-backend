import * as ort from 'onnxruntime-node';

export interface OnnxRunOptions {
  feeds: Record<string, ort.Tensor>;
  modelPath: string;
}

export async function runOnnxModel({ modelPath, feeds }: OnnxRunOptions) {
  const session = await ort.InferenceSession.create(modelPath);
  // All feeds must be ort.Tensor objects for onnxruntime-node
  const results = await session.run(feeds);
  return results;
}

// Example usage:
// const result = await runOnnxModel({
//   modelPath: 'path/to/model.onnx',
//   feeds: { input: inputTensor }
// });
