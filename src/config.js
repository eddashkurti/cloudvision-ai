export const APP_CONFIG = Object.freeze({
  maxFileSizeBytes: 8 * 1024 * 1024,
  supportedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  predictionCount: 3,
  model: {
    version: 2,
    alpha: 1.0,
  },
});

export const CONFIDENCE_LEVELS = Object.freeze({
  HIGH: {
    label: 'High confidence',
    minimum: 0.7,
    className: 'is-high',
  },
  MEDIUM: {
    label: 'Medium confidence',
    minimum: 0.4,
    className: 'is-medium',
  },
  LOW: {
    label: 'Low confidence',
    minimum: 0,
    className: 'is-low',
  },
});
