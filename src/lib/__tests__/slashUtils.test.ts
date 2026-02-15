import { describe, it, expect } from 'vitest';
import { shouldShowSlashMenu } from '../slashUtils';

describe('shouldShowSlashMenu', () => {
  it('returns true for a slash at the start', () => {
    expect(shouldShowSlashMenu('/status')).toBe(true);
  });

  it('returns true for slash with leading spaces', () => {
    expect(shouldShowSlashMenu('  /help')).toBe(true);
  });

  it('returns false for text without slash', () => {
    expect(shouldShowSlashMenu('hello')).toBe(false);
  });

  it('returns false if slash is not at start', () => {
    expect(shouldShowSlashMenu('hello /cmd')).toBe(false);
  });

  it('returns false if text contains newline', () => {
    expect(shouldShowSlashMenu('/cmd\nmore')).toBe(false);
  });

  it('returns true for just a slash', () => {
    expect(shouldShowSlashMenu('/')).toBe(true);
  });
});
