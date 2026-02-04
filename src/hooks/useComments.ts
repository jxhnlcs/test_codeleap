import { useState, useEffect } from 'react';
import type { Comment } from '../types';

const COMMENTS_STORAGE_KEY = 'codeleap_comments';

interface CommentsState {
  [postId: number]: Comment[];
}

export function useComments() {
  const [comments, setComments] = useState<CommentsState>(() => {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const addComment = (postId: number, username: string, content: string) => {
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      postId,
      username,
      content,
      created_datetime: new Date().toISOString(),
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
  };

  const deleteComment = (commentId: string, postId: number) => {
    setComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((comment) => comment.id !== commentId),
    }));
  };

  const getComments = (postId: number): Comment[] => {
    return (comments[postId] || []).sort(
      (a, b) => new Date(a.created_datetime).getTime() - new Date(b.created_datetime).getTime()
    );
  };

  const getCommentCount = (postId: number): number => {
    return (comments[postId] || []).length;
  };

  return {
    addComment,
    deleteComment,
    getComments,
    getCommentCount,
  };
}
