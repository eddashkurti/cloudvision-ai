import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { APP_CONFIG } from './config.js';

let classifier = null;

export async function loadImageClassifier() {
  await tf.ready();

  classifier = await mobilenet.load({
    version: APP_CONFIG.model.version,
    alpha: APP_CONFIG.model.alpha,
  });

  return {
    backend: tf.getBackend(),
  };
}

export async function classifyImage(imageElement) {
  if (!classifier) {
    throw new Error('The image classifier has not been loaded.');
  }

  return classifier.classify(imageElement, APP_CONFIG.predictionCount);
}
