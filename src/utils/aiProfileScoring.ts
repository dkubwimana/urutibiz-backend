import * as tf from '@tensorflow/tfjs-node';

/**
 * Example: Loads a TensorFlow.js model and runs inference on user KYC data.
 * Replace the model path and input preprocessing as needed for your use case.
 */

// Load your model once at startup (adjust path as needed)
let model: tf.GraphModel | null = null;
export async function loadAiProfileModel(modelPath: string) {
  model = await tf.loadGraphModel(modelPath);
}

/**
 * Run AI profile scoring using the loaded model.
 * @param inputData - Preprocessed input (e.g., image tensors, feature vectors)
 * @returns score (0-100)
 */
export async function runAiProfileScoring(inputData: tf.Tensor | tf.Tensor[]): Promise<number> {
  if (!model) throw new Error('AI profile model not loaded');
  const prediction = model.predict(inputData) as tf.Tensor;
  const score = (await prediction.data())[0];
  // Map/scale score to 0-100 if needed
  return Math.max(0, Math.min(100, score * 100));
}

// Example: Preprocessing helper (stub)
export async function preprocessKycDataForModel(documentImageBuffer: Buffer, selfieImageBuffer: Buffer): Promise<tf.Tensor[]> {
  // Improved preprocessing: center crop, resize, normalize to ImageNet mean/std
  function preprocessImage(imgBuffer: Buffer): tf.Tensor {
    let img = tf.node.decodeImage(imgBuffer, 3);
    // Center crop to square
    const [h, w] = img.shape.slice(0, 2);
    const size = Math.min(h, w);
    const top = Math.floor((h - size) / 2);
    const left = Math.floor((w - size) / 2);
    img = img.slice([top, left, 0], [size, size, 3]);
    // Resize to 224x224
    img = tf.image.resizeBilinear(img, [224, 224]);
    // Convert to float32 and normalize to [0,1]
    img = img.toFloat().div(255);
    // Normalize to ImageNet mean/std
    const mean = tf.tensor([0.485, 0.456, 0.406]);
    const std = tf.tensor([0.229, 0.224, 0.225]);
    img = img.sub(mean).div(std);
    // Add batch dimension
    return img.expandDims();
  }
  const docTensor = preprocessImage(documentImageBuffer);
  const selfieTensor = preprocessImage(selfieImageBuffer);
  return [docTensor, selfieTensor];
}
