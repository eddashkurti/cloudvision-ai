import { APP_CONFIG, CONFIDENCE_LEVELS } from './config.js';

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, message: 'Select an image before continuing.' };
  }

  if (!APP_CONFIG.supportedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Unsupported file type. Please choose a JPEG, PNG or WebP image.',
    };
  }

  if (file.size === 0) {
    return { valid: false, message: 'The selected file is empty.' };
  }

  if (file.size > APP_CONFIG.maxFileSizeBytes) {
    return {
      valid: false,
      message: `The selected image is too large. The maximum size is ${formatFileSize(APP_CONFIG.maxFileSizeBytes)}.`,
    };
  }

  return { valid: true, message: '' };
}

export function getConfidenceLevel(probability) {
  if (probability >= CONFIDENCE_LEVELS.HIGH.minimum) {
    return CONFIDENCE_LEVELS.HIGH;
  }

  if (probability >= CONFIDENCE_LEVELS.MEDIUM.minimum) {
    return CONFIDENCE_LEVELS.MEDIUM;
  }

  return CONFIDENCE_LEVELS.LOW;
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = value >= 10 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

export function formatPredictionLabel(label) {
  return label
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/\b\w/g, (character) => character.toUpperCase()))
    .join(' · ');
}
