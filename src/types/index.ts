export interface Post {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
}

export interface CreatePostPayload {
  username: string;
  title: string;
  content: string;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
}

export interface PostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export interface FilterOptions {
  search: string;
  username: string;
  sortBy: SortOption;
}
