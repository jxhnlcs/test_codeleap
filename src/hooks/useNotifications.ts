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
  checkedPosts: Record<number, string>; // postId -> content hash (to detect changes)
}

function hashContent(content: string): string {
  // Simple hash to detect content changes
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

function getInitialState(): NotificationsState {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate and migrate from old format if needed
      return {
        notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
        checkedPosts: parsed.checkedPosts && typeof parsed.checkedPosts === 'object' 
          ? parsed.checkedPosts 
          : {},
      };
    }
  } catch (error) {
    console.warn('Failed to parse notifications from localStorage, resetting...');
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
  }
  return { notifications: [], checkedPosts: {} };
}

export function useNotifications(currentUsername: string) {
  const [state, setState] = useState<NotificationsState>(getInitialState);

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
      notifications: [newNotification, ...prev.notifications].slice(0, 50),
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  // Clear read notifications (called when closing dropdown)
  const clearReadNotifications = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => !n.read),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({ notifications: [], checkedPosts: {} });
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  // Check for mentions in posts
  const checkForMentions = useCallback(
    (posts: Array<{ id: number; username: string; title: string; content: string }>) => {
      if (!currentUsername) return;

      setState((prev) => {
        const newNotifications: Notification[] = [];
        const newCheckedPosts: Record<number, string> = { ...prev.checkedPosts };
        
        // Get existing notification post IDs to avoid duplicates
        const existingPostIds = new Set(prev.notifications.map((n) => n.postId));

        posts.forEach((post) => {
          // Skip own posts
          if (post.username.toLowerCase() === currentUsername.toLowerCase()) return;

          // Create content hash to detect changes
          const contentHash = hashContent(post.title + post.content);
          
          // Skip if already checked with same content
          if (prev.checkedPosts[post.id] === contentHash) return;

          // Check for mentions
          const mentionRegex = new RegExp(`@${currentUsername}\\b`, 'i');
          const hasMention = mentionRegex.test(post.content) || mentionRegex.test(post.title);

          if (hasMention && !existingPostIds.has(post.id)) {
            newNotifications.push({
              id: `${Date.now()}-${post.id}-${Math.random().toString(36).substring(7)}`,
              type: 'mention_post',
              postId: post.id,
              postTitle: post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title,
              fromUsername: post.username,
              content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
              createdAt: new Date().toISOString(),
              read: false,
            });
            existingPostIds.add(post.id); // Prevent duplicates within same batch
          }

          // Mark as checked
          newCheckedPosts[post.id] = contentHash;
        });

        // Only update if there are changes
        if (newNotifications.length === 0 && 
            Object.keys(newCheckedPosts).length === Object.keys(prev.checkedPosts).length) {
          return prev; // No changes, return same reference
        }

        return {
          ...prev,
          notifications: [...newNotifications, ...prev.notifications].slice(0, 50),
          checkedPosts: newCheckedPosts,
        };
      });
    },
    [currentUsername]
  );

  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAllAsRead,
    clearReadNotifications,
    clearAll,
    checkForMentions,
  };
}
