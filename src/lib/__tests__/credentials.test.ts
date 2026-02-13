import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStoredCredentials, storeCredentials, clearCredentials } from '../credentials';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];
  vi.clearAllMocks();
});

describe('getStoredCredentials', () => {
  it('returns null when nothing stored', () => {
    expect(getStoredCredentials()).toBeNull();
  });

  it('returns credentials when valid JSON stored', () => {
    store['pinchchat_credentials'] = JSON.stringify({ url: 'wss://gw.test', token: 'abc' });
    expect(getStoredCredentials()).toEqual({ url: 'wss://gw.test', token: 'abc' });
  });

  it('returns null for malformed JSON', () => {
    store['pinchchat_credentials'] = 'not-json';
    expect(getStoredCredentials()).toBeNull();
  });

  it('returns null if url is missing', () => {
    store['pinchchat_credentials'] = JSON.stringify({ token: 'abc' });
    expect(getStoredCredentials()).toBeNull();
  });

  it('returns null if token is missing', () => {
    store['pinchchat_credentials'] = JSON.stringify({ url: 'wss://gw' });
    expect(getStoredCredentials()).toBeNull();
  });
});

describe('storeCredentials', () => {
  it('stores credentials as JSON', () => {
    storeCredentials('wss://gw', 'tok');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'pinchchat_credentials',
      JSON.stringify({ url: 'wss://gw', token: 'tok' }),
    );
  });
});

describe('clearCredentials', () => {
  it('removes the key from localStorage', () => {
    store['pinchchat_credentials'] = 'something';
    clearCredentials();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('pinchchat_credentials');
  });
});
