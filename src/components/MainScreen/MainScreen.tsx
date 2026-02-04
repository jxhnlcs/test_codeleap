import { useState, useEffect } from 'react';
import { CreatePost } from '../CreatePost';
import { PostCard } from '../PostCard';
import { DeleteModal } from '../DeleteModal';
import { EditModal } from '../EditModal';
import { PostFilters } from '../PostFilters';
import { Pagination } from '../Pagination';
import { usePosts } from '../../hooks/usePosts';
import { usePostFilters } from '../../hooks/usePostFilters';
import { usePagination } from '../../hooks/usePagination';
import { useUser } from '../../contexts/UserContext';
import type { Post } from '../../types';
import styles from './MainScreen.module.css';

export function MainScreen() {
  const { data, isLoading, isError } = usePosts(100, 0); // Fetch more to enable client-side pagination
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const { username, logout } = useUser();

  const allPosts = data?.results || [];

  const {
    searchTerm,
    setSearchTerm,
    usernameFilter,
    setUsernameFilter,
    sortBy,
    setSortBy,
    filteredAndSortedPosts,
  } = usePostFilters(allPosts);

  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(filteredAndSortedPosts, 5); // 5 posts per page

  // Reset to page 1 when filters change
  useEffect(() => {
    goToPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, usernameFilter, sortBy]);

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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>CodeLeap Network</h1>
        <div className={styles.headerActions}>
          <span className={styles.username}>@{username}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <CreatePost />

        <PostFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          usernameFilter={usernameFilter}
          onUsernameFilterChange={setUsernameFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalPosts={filteredAndSortedPosts.length}
        />

        <div className={styles.posts}>
          {isLoading && <p className={styles.message}>Loading posts...</p>}
          {isError && <p className={styles.message}>Error loading posts. Please try again.</p>}
          {!isLoading && currentItems.length === 0 && (
            <p className={styles.message}>
              {allPosts.length === 0
                ? 'No posts yet. Be the first to post!'
                : 'No posts match your filters.'}
            </p>
          )}
          {currentItems.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>

        {!isLoading && currentItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        )}
      </main>

      <DeleteModal isOpen={postToDelete !== null} onClose={closeDeleteModal} post={postToDelete} />

      <EditModal isOpen={postToEdit !== null} onClose={closeEditModal} post={postToEdit} />
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17L21 12L16 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
