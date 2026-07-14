import { describe, expect, it } from 'vitest';
import { formatFileSize, getConfidenceLevel, validateImageFile } from '../src/validation.js';

function createFile({ type = 'image/jpeg', size = 1024, name = 'photo.jpg' } = {}) {
  return { type, size, name };
}

describe('validateImageFile', () => {
  it('accepts a supported image within the size limit', () => {
    expect(validateImageFile(createFile())).toEqual({ valid: true, message: '' });
  });

  it('rejects unsupported file formats', () => {
    const result = validateImageFile(createFile({ type: 'image/svg+xml' }));
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Unsupported file type');
  });

  it('rejects images larger than 8 MB', () => {
    const result = validateImageFile(createFile({ size: 9 * 1024 * 1024 }));
    expect(result.valid).toBe(false);
    expect(result.message).toContain('too large');
  });
});

describe('getConfidenceLevel', () => {
  it('returns high confidence at 70 percent and above', () => {
    expect(getConfidenceLevel(0.7).label).toBe('High confidence');
  });

  it('returns medium confidence from 40 to below 70 percent', () => {
    expect(getConfidenceLevel(0.55).label).toBe('Medium confidence');
  });

  it('returns low confidence below 40 percent', () => {
    expect(getConfidenceLevel(0.2).label).toBe('Low confidence');
  });
});

describe('formatFileSize', () => {
  it('formats byte values for display', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(8 * 1024 * 1024)).toBe('8.0 MB');
  });
});
