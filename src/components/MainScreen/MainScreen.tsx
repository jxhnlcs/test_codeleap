import { useState, useEffect } from 'react';
import { CreatePost } from '../CreatePost';
import { PostCard } from '../PostCard';
import { DeleteModal } from '../DeleteModal';
import { EditModal } from '../EditModal';
import { PostFilters } from '../PostFilters';
import { Pagination } from '../Pagination';
import { UserProfileModal } from '../UserProfileModal';
import { NotificationBell } from '../NotificationBell';
import { usePosts } from '../../hooks/usePosts';
import { usePostFilters } from '../../hooks/usePostFilters';
import { usePagination } from '../../hooks/usePagination';
import { useNotifications } from '../../hooks/useNotifications';
import { useUser } from '../../contexts/UserContext';
import type { Post } from '../../types';
import styles from './MainScreen.module.css';

export function MainScreen() {
  const { data, isLoading, isError } = usePosts(100, 0); // Fetch more to enable client-side pagination
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const { username, photoURL, isFirebaseUser, logout } = useUser();

  const allPosts = data?.results || [];

  // Notifications
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearReadNotifications,
    checkForMentions,
  } = useNotifications(username);

  // Check for mentions when posts load or change
  useEffect(() => {
    if (data?.results && data.results.length > 0 && username) {
      checkForMentions(data.results);
    }
  }, [data?.results, username, checkForMentions]);

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

  const handleUsernameClick = (clickedUsername: string) => {
    setSelectedUsername(clickedUsername);
  };

  const handleOwnProfileClick = () => {
    setSelectedUsername(username);
  };

  const closeProfileModal = () => {
    setSelectedUsername(null);
  };

  // Get photo URL for selected user (if they're logged in with Firebase)
  const selectedUserPhoto = selectedUsername === username && isFirebaseUser ? photoURL : null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>CodeLeap Network</h1>
        <div className={styles.headerActions}>
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
            onClearRead={clearReadNotifications}
            onNotificationClick={(notification) => {
              // Find and scroll to the post
              const postElement = document.getElementById(`post-${notification.postId}`);
              if (postElement) {
                postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                postElement.classList.add('notification-highlight');
                setTimeout(() => postElement.classList.remove('notification-highlight'), 2000);
              }
            }}
          />
          <button className={styles.userInfo} onClick={handleOwnProfileClick}>
            {photoURL && (
              <img 
                src={photoURL} 
                alt={username}
                className={styles.avatar}
                referrerPolicy="no-referrer"
              />
            )}
            <div className={styles.userDetails}>
              <span className={styles.username}>@{username}</span>
              {isFirebaseUser && (
                <span className={styles.badge}>
                  <GoogleIcon />
                  Google
                </span>
              )}
            </div>
          </button>
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
            <div key={post.id} id={`post-${post.id}`}>
              <PostCard
                post={post}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onUsernameClick={handleUsernameClick}
              />
            </div>
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

      {selectedUsername && (
        <UserProfileModal
          isOpen={true}
          onClose={closeProfileModal}
          username={selectedUsername}
          photoURL={selectedUserPhoto}
          onEditPost={handleEdit}
          onDeletePost={handleDelete}
        />
      )}
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

function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="currentColor"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="currentColor"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="currentColor"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="currentColor"
      />
    </svg>
  );
}
