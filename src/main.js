import './styles.css';
import { classifyImage, loadImageClassifier } from './model.js';
import {
  clearError,
  getElements,
  renderPredictions,
  resetWorkspace,
  setAnalyzing,
  setModelError,
  setModelLoading,
  setModelReady,
  showError,
  showImage,
} from './ui.js';
import { validateImageFile } from './validation.js';

const elements = getElements();
let modelReady = false;
let activeObjectUrl = null;
let analysisSequence = 0;

initialize();

async function initialize() {
  setModelLoading(elements);
  registerEventListeners();

  try {
    const { backend } = await loadImageClassifier();
    modelReady = true;
    setModelReady(elements, backend);
  } catch (error) {
    console.error('Failed to load MobileNet:', error);
    setModelError(elements);
  }
}

function registerEventListeners() {
  elements.chooseButton.addEventListener('click', (event) => {
    event.stopPropagation();
    openFilePicker();
  });

  elements.dropZone.addEventListener('click', (event) => {
    if (event.target.closest('button')) {
      return;
    }
    openFilePicker();
  });

  elements.dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  });

  elements.fileInput.addEventListener('change', () => {
    const [file] = elements.fileInput.files;
    void processImage(file);
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (modelReady) {
        elements.dropZone.classList.add('is-dragging');
      }
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.remove('is-dragging');
    });
  });

  elements.dropZone.addEventListener('drop', (event) => {
    if (!modelReady) {
      return;
    }

    const [file] = event.dataTransfer.files;
    void processImage(file);
  });

  elements.resetButton.addEventListener('click', () => {
    analysisSequence += 1;
    revokeActiveObjectUrl();
    resetWorkspace(elements);
    elements.dropZone.focus();
  });

  window.addEventListener('beforeunload', revokeActiveObjectUrl);
}

function openFilePicker() {
  if (modelReady && !elements.fileInput.disabled) {
    elements.fileInput.click();
  }
}

async function processImage(file) {
  clearError(elements);

  if (!modelReady) {
    showError(elements, 'The AI model is still loading. Please wait a moment and try again.');
    return;
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    showError(elements, validation.message);
    return;
  }

  analysisSequence += 1;
  const currentSequence = analysisSequence;

  revokeActiveObjectUrl();
  activeObjectUrl = URL.createObjectURL(file);
  showImage(elements, activeObjectUrl, file);
  setAnalyzing(elements, true);

  try {
    await waitForImage(elements.imagePreview);

    const startedAt = performance.now();
    const predictions = await classifyImage(elements.imagePreview);
    const elapsed = performance.now() - startedAt;

    if (currentSequence !== analysisSequence) {
      return;
    }

    renderPredictions(elements, predictions, elapsed);
  } catch (error) {
    console.error('Image classification failed:', error);
    if (currentSequence === analysisSequence) {
      setAnalyzing(elements, false);
      showError(elements, 'The image could not be analyzed. Try a different file.');
    }
  }
}

function waitForImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.() ?? Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', () => reject(new Error('Invalid image data.')), { once: true });
  });
}

function revokeActiveObjectUrl() {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}
