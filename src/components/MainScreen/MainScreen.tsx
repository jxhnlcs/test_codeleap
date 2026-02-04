import { useState } from 'react';
import { CreatePost } from '../CreatePost';
import { PostCard } from '../PostCard';
import { DeleteModal } from '../DeleteModal';
import { EditModal } from '../EditModal';
import { usePosts } from '../../hooks/usePosts';
import type { Post } from '../../types';
import styles from './MainScreen.module.css';

export function MainScreen() {
  const { data, isLoading, isError } = usePosts(20, 0);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const handleDelete = (post: Post) => {
    setPostToDelete(post);
  };

  const handleEdit = (post: Post) => {
    setPostToEdit(post);
  };

  const closeDeleteModal = () => {
    setPostToDelete(null);
  };

  const closeEditModal = () => {
    setPostToEdit(null);
  };

  // Sort posts by created_datetime (most recent first)
  const sortedPosts = data?.results
    ? [...data.results].sort(
        (a, b) => new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime()
      )
    : [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>CodeLeap Network</h1>
      </header>

      <main className={styles.main}>
        <CreatePost />

        <div className={styles.posts}>
          {isLoading && <p className={styles.message}>Loading posts...</p>}
          {isError && <p className={styles.message}>Error loading posts. Please try again.</p>}
          {sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
          {!isLoading && sortedPosts.length === 0 && (
            <p className={styles.message}>No posts yet. Be the first to post!</p>
          )}
        </div>
      </main>

      <DeleteModal
        isOpen={postToDelete !== null}
        onClose={closeDeleteModal}
        post={postToDelete}
      />

      <EditModal
        isOpen={postToEdit !== null}
        onClose={closeEditModal}
        post={postToEdit}
      />
    </div>
  );
}
