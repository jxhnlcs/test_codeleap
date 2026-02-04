import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CreatePostPayload, UpdatePostPayload } from '../types';

const POSTS_QUERY_KEY = ['posts'];

export function usePosts(limit = 10, offset = 0) {
  return useQuery({
    queryKey: [...POSTS_QUERY_KEY, limit, offset],
    queryFn: () => api.getPosts(limit, offset),
    staleTime: 10000, // 10 seconds
    refetchInterval: 15000, // Auto-refetch every 15 seconds to catch new mentions
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => api.createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePostPayload }) =>
      api.updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}
