import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadBookmarks, saveBookmarks, type Bookmark } from '../useBookmarks';

const STORAGE_KEY = 'pinchchat-bookmarks';

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

describe('loadBookmarks', () => {
  it('returns empty array when nothing stored', () => {
    expect(loadBookmarks()).toEqual([]);
  });

  it('returns parsed bookmarks from localStorage', () => {
    const bookmarks: Bookmark[] = [
      { messageId: 'msg1', sessionKey: 'sess1', preview: 'Hello', timestamp: 1000, bookmarkedAt: 2000 },
    ];
    store[STORAGE_KEY] = JSON.stringify(bookmarks);
    expect(loadBookmarks()).toEqual(bookmarks);
  });

  it('returns empty array on corrupt JSON', () => {
    store[STORAGE_KEY] = '{broken';
    expect(loadBookmarks()).toEqual([]);
  });
});

describe('saveBookmarks', () => {
  it('persists bookmarks to localStorage', () => {
    const bookmarks: Bookmark[] = [
      { messageId: 'msg1', sessionKey: 'sess1', preview: 'Test', timestamp: 1000, bookmarkedAt: 2000 },
    ];
    saveBookmarks(bookmarks);
    expect(JSON.parse(store[STORAGE_KEY]!)).toEqual(bookmarks);
  });

  it('overwrites existing bookmarks', () => {
    saveBookmarks([{ messageId: 'old', sessionKey: 's', preview: '', timestamp: 0, bookmarkedAt: 0 }]);
    saveBookmarks([{ messageId: 'new', sessionKey: 's', preview: '', timestamp: 0, bookmarkedAt: 0 }]);
    const stored = JSON.parse(store[STORAGE_KEY]!);
    expect(stored).toHaveLength(1);
    expect(stored[0].messageId).toBe('new');
  });
});
