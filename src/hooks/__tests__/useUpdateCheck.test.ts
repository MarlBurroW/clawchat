import { describe, it, expect } from 'vitest';
import { isNewer } from '../useUpdateCheck';

describe('isNewer', () => {
  it('returns true when remote major is higher', () => {
    expect(isNewer('2.0.0', '1.0.0')).toBe(true);
  });

  it('returns true when remote minor is higher', () => {
    expect(isNewer('1.5.0', '1.4.0')).toBe(true);
  });

  it('returns true when remote patch is higher', () => {
    expect(isNewer('1.4.2', '1.4.1')).toBe(true);
  });

  it('returns false when versions are equal', () => {
    expect(isNewer('1.4.1', '1.4.1')).toBe(false);
  });

  it('returns false when remote is older', () => {
    expect(isNewer('1.3.9', '1.4.0')).toBe(false);
  });

  it('handles missing patch segments', () => {
    expect(isNewer('1.1', '1.0.9')).toBe(true);
  });

  it('handles large version numbers', () => {
    expect(isNewer('1.66.1', '1.66.0')).toBe(true);
    expect(isNewer('1.66.0', '1.66.1')).toBe(false);
  });
});
