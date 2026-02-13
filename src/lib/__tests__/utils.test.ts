import { describe, it, expect } from 'vitest';
import { cn, genId, genIdempotencyKey } from '../utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const showHidden = false;
    expect(cn('base', showHidden && 'hidden', 'extra')).toBe('base extra');
  });

  it('resolves tailwind conflicts (twMerge)', () => {
    // twMerge deduplicates conflicting tailwind utilities
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined and null values', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});

describe('genId', () => {
  it('generates unique ids with default prefix', () => {
    const a = genId();
    const b = genId();
    expect(a).toMatch(/^req-\d+-\d+$/);
    expect(a).not.toBe(b);
  });

  it('uses custom prefix', () => {
    expect(genId('msg')).toMatch(/^msg-\d+-\d+$/);
  });
});

describe('genIdempotencyKey', () => {
  it('returns a non-empty string', () => {
    const key = genIdempotencyKey();
    expect(key.length).toBeGreaterThan(0);
  });

  it('generates unique keys', () => {
    const a = genIdempotencyKey();
    const b = genIdempotencyKey();
    expect(a).not.toBe(b);
  });
});
