import { useState, useEffect, useCallback, useRef } from 'react';
import { playNotificationSound } from '../lib/notificationSound';

const APP_NAME = 'PinchChat';
let baseTitle = APP_NAME;

/** Update the base title (e.g. with active session name). Called by App. */
export function setBaseTitle(sessionLabel?: string) {
  baseTitle = sessionLabel ? `${sessionLabel} — ${APP_NAME}` : APP_NAME;
  // Refresh document.title if tab is visible (no unread badge)
  if (!document.hidden) {
    document.title = baseTitle;
  }
}
const SOUND_KEY = 'pinchchat-notification-sound';
const hasNotificationAPI = typeof Notification !== 'undefined';

/**
 * Hook that manages browser notifications, tab title badge,
 * and notification sounds when new messages arrive while the tab is not focused.
 */
export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem(SOUND_KEY);
    return stored === null ? true : stored === 'true';
  });
  const isVisibleRef = useRef(!document.hidden);
  const permissionRef = useRef(hasNotificationAPI ? Notification.permission : 'denied' as NotificationPermission);

  // Track tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        // Reset unread when tab becomes visible
        setUnreadCount(0);
        document.title = baseTitle;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Update tab title when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${baseTitle}`;
    }
  }, [unreadCount]);

  // Request permission on first user interaction
  useEffect(() => {
    if (!hasNotificationAPI || permissionRef.current !== 'default') return;
    const requestOnInteraction = () => {
      if (permissionRef.current === 'default') {
        Notification.requestPermission().then(p => {
          permissionRef.current = p;
        });
      }
      document.removeEventListener('click', requestOnInteraction);
    };
    document.addEventListener('click', requestOnInteraction);
    return () => document.removeEventListener('click', requestOnInteraction);
  }, []);

  // Persist sound preference
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem(SOUND_KEY, String(next));
      // Play a preview when enabling so user knows what it sounds like
      if (next) playNotificationSound(0.3);
      return next;
    });
  }, []);

  const notify = useCallback((title: string, body?: string) => {
    if (isVisibleRef.current) return; // Tab is focused, no need

    setUnreadCount(c => c + 1);

    // Play notification sound
    if (soundEnabled) {
      playNotificationSound(0.3);
    }

    // Send browser notification if permitted
    if (hasNotificationAPI && permissionRef.current === 'granted') {
      try {
        const n = new Notification(title, {
          body: body?.slice(0, 200),
          icon: '/logo.png',
          tag: 'pinchchat-message', // Collapse multiple into one
          silent: soundEnabled, // Don't double-play system sound if we have our own
        });
        // Auto-close after 5s
        setTimeout(() => n.close(), 5000);
        // Focus tab on click
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
        // Notifications not supported (e.g. some mobile browsers)
      }
    }
  }, [soundEnabled]);

  return { notify, unreadCount, soundEnabled, toggleSound };
}
