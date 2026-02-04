import { useState, useEffect, useCallback } from 'react';

const NOTIFICATIONS_STORAGE_KEY = 'codeleap_notifications';

export interface Notification {
  id: string;
  type: 'mention_post' | 'mention_comment';
  postId: number;
  postTitle: string;
  fromUsername: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  lastCheckedPostIds: number[];
}

export function useNotifications(currentUsername: string) {
  const [state, setState] = useState<NotificationsState>(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { notifications: [], lastCheckedPostIds: [] };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setState((prev) => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50), // Keep max 50
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({ notifications: [], lastCheckedPostIds: [] });
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  // Check for mentions in posts
  const checkForMentions = useCallback(
    (posts: Array<{ id: number; username: string; title: string; content: string }>) => {
      if (!currentUsername) return;

      const mentionRegex = new RegExp(`@${currentUsername}\\b`, 'gi');

      posts.forEach((post) => {
        // Skip own posts
        if (post.username === currentUsername) return;

        // Skip already checked posts
        if (state.lastCheckedPostIds.includes(post.id)) return;

        // Check for mentions in content
        if (mentionRegex.test(post.content) || mentionRegex.test(post.title)) {
          addNotification({
            type: 'mention_post',
            postId: post.id,
            postTitle: post.title,
            fromUsername: post.username,
            content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          });
        }
      });

      // Update checked post IDs
      const newPostIds = posts.map((p) => p.id);
      setState((prev) => ({
        ...prev,
        lastCheckedPostIds: [...new Set([...prev.lastCheckedPostIds, ...newPostIds])].slice(-200),
      }));
    },
    [currentUsername, state.lastCheckedPostIds, addNotification]
  );

  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAllAsRead,
    markAsRead,
    clearAll,
    checkForMentions,
  };
}
