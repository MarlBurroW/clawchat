import { describe, it, expect } from 'vitest';
import { buildImageSrc } from '../image';

describe('buildImageSrc', () => {
  it('returns URL when url is provided', () => {
    expect(buildImageSrc('image/png', undefined, 'https://example.com/img.png'))
      .toBe('https://example.com/img.png');
  });

  it('prefers url over base64 data', () => {
    expect(buildImageSrc('image/png', 'abc123', 'https://example.com/img.png'))
      .toBe('https://example.com/img.png');
  });

  it('builds data URL from base64 data', () => {
    expect(buildImageSrc('image/png', 'abc123'))
      .toBe('data:image/png;base64,abc123');
  });

  it('builds data URL for jpeg', () => {
    expect(buildImageSrc('image/jpeg', 'xyz'))
      .toBe('data:image/jpeg;base64,xyz');
  });

  it('returns empty string when neither url nor data provided', () => {
    expect(buildImageSrc('image/png')).toBe('');
  });

  it('returns empty string with undefined data and no url', () => {
    expect(buildImageSrc('image/webp', undefined, undefined)).toBe('');
  });
});
