import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pinchchat-bookmarks';

export interface Bookmark {
  messageId: string;
  sessionKey: string;
  preview: string;
  timestamp: number;
  bookmarkedAt: number;
}

export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Bookmark[];
  } catch { /* noop */ }
  return [];
}

export function saveBookmarks(bookmarks: Bookmark[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch { /* noop */ }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks);

  const toggle = useCallback((messageId: string, sessionKey: string, preview: string, timestamp: number) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.messageId === messageId);
      const next = exists
        ? prev.filter(b => b.messageId !== messageId)
        : [...prev, { messageId, sessionKey, preview: preview.slice(0, 120), timestamp, bookmarkedAt: Date.now() }];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((messageId: string) => {
    return bookmarks.some(b => b.messageId === messageId);
  }, [bookmarks]);

  const getForSession = useCallback((sessionKey: string) => {
    return bookmarks
      .filter(b => b.sessionKey === sessionKey)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [bookmarks]);

  const remove = useCallback((messageId: string) => {
    setBookmarks(prev => {
      const next = prev.filter(b => b.messageId !== messageId);
      saveBookmarks(next);
      return next;
    });
  }, []);

  const clearSession = useCallback((sessionKey: string) => {
    setBookmarks(prev => {
      const next = prev.filter(b => b.sessionKey !== sessionKey);
      saveBookmarks(next);
      return next;
    });
  }, []);

  return { bookmarks, toggle, isBookmarked, getForSession, remove, clearSession };
}
