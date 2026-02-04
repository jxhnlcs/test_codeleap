import { useState, useMemo } from 'react';
import type { Post, SortOption } from '../types';

export function usePostFilters(posts: Post[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by search term (title or content)
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by username
    if (usernameFilter) {
      filtered = filtered.filter((post) =>
        post.username.toLowerCase().includes(usernameFilter.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime();
        case 'oldest':
          return new Date(a.created_datetime).getTime() - new Date(b.created_datetime).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchTerm, usernameFilter, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    usernameFilter,
    setUsernameFilter,
    sortBy,
    setSortBy,
    filteredAndSortedPosts,
  };
}
