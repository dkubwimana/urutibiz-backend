import * as ort from 'onnxruntime-node';

/**
 * Run ONNX model for profile verification scoring.
 * @param modelPath Path to the ONNX model file
 * @param input Object with input tensors (e.g., { image: Float32Array, ... })
 * @returns The profile verification score (number)
 */
export async function runProfileVerification(modelPath: string, input: Record<string, ort.Tensor>): Promise<number> {
  const session = await ort.InferenceSession.create(modelPath);
  const results = await session.run(input);
  // Assume the output is a single score tensor (adjust as needed for your model)
  const outputKey = Object.keys(results)[0];
  const outputTensor = results[outputKey];
  if (outputTensor && outputTensor.data && outputTensor.data.length > 0) {
    return outputTensor.data[0] as number;
  }
  throw new Error('ONNX profile verification model did not return a score');
}

// Example usage:
// const score = await runProfileVerification('models/profile_verification.onnx', { image: imageTensor });
