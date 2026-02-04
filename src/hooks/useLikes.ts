import { useState, useEffect } from 'react';

const LIKES_STORAGE_KEY = 'codeleap_likes';

interface LikesState {
  [postId: number]: {
    count: number;
    likedBy: string[];
  };
}

export function useLikes() {
  const [likes, setLikes] = useState<LikesState>(() => {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
  }, [likes]);

  const toggleLike = (postId: number, username: string) => {
    setLikes((prev) => {
      const postLikes = prev[postId] || { count: 0, likedBy: [] };
      const hasLiked = postLikes.likedBy.includes(username);

      if (hasLiked) {
        return {
          ...prev,
          [postId]: {
            count: Math.max(0, postLikes.count - 1),
            likedBy: postLikes.likedBy.filter((user) => user !== username),
          },
        };
      } else {
        return {
          ...prev,
          [postId]: {
            count: postLikes.count + 1,
            likedBy: [...postLikes.likedBy, username],
          },
        };
      }
    });
  };

  const getLikes = (postId: number) => {
    return likes[postId] || { count: 0, likedBy: [] };
  };

  const hasLiked = (postId: number, username: string) => {
    const postLikes = likes[postId];
    return postLikes ? postLikes.likedBy.includes(username) : false;
  };

  return { toggleLike, getLikes, hasLiked };
}
