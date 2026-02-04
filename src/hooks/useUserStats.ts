import { useMemo } from 'react';
import type { Post } from '../types';
import { useLikes } from './useLikes';

export interface UserStats {
  username: string;
  totalPosts: number;
  totalLikesReceived: number;
  firstPostDate: string | null;
  posts: Post[];
}

export function useUserStats(posts: Post[], username: string): UserStats {
  const { getLikes } = useLikes();

  return useMemo(() => {
    // Filter posts by username
    const userPosts = posts.filter((post) => post.username === username);
    
    // Calculate total likes received
    const totalLikesReceived = userPosts.reduce((sum, post) => {
      const { count } = getLikes(post.id);
      return sum + count;
    }, 0);

    // Get first post date
    const sortedPosts = [...userPosts].sort(
      (a, b) => new Date(a.created_datetime).getTime() - new Date(b.created_datetime).getTime()
    );
    const firstPostDate = sortedPosts.length > 0 ? sortedPosts[0].created_datetime : null;

    return {
      username,
      totalPosts: userPosts.length,
      totalLikesReceived,
      firstPostDate,
      posts: userPosts.sort(
        (a, b) => new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime()
      ),
    };
  }, [posts, username, getLikes]);
}
