import type { Post, CreatePostPayload, UpdatePostPayload, PostsResponse } from '../types';

const API_BASE_URL = 'https://dev.codeleap.co.uk/careers/';

export const api = {
  async getPosts(limit = 10, offset = 0): Promise<PostsResponse> {
    const response = await fetch(`${API_BASE_URL}?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  },

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return response.json();
  },

  async updatePost(id: number, payload: UpdatePostPayload): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    return response.json();
  },

  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  },
};
