import { Modal } from '../Modal';
import { PostCard } from '../PostCard';
import { format } from 'date-fns';
import { useUserStats } from '../../hooks/useUserStats';
import { usePosts } from '../../hooks/usePosts';
import type { Post } from '../../types';
import styles from './UserProfileModal.module.css';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  photoURL?: string | null;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  username,
  photoURL,
  onEditPost,
  onDeletePost,
}: UserProfileModalProps) {
  const { data } = usePosts(100, 0);
  const allPosts = data?.results || [];
  const stats = useUserStats(allPosts, username);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            {photoURL ? (
              <img
                src={photoURL}
                alt={username}
                className={styles.avatar}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.userInfo}>
              <h2 className={styles.username}>@{username}</h2>
              {stats.firstPostDate && (
                <p className={styles.memberSince}>
                  Member since {format(new Date(stats.firstPostDate), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.totalPosts}</span>
            <span className={styles.statLabel}>Posts</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.totalLikesReceived}</span>
            <span className={styles.statLabel}>Likes Received</span>
          </div>
        </div>

        {/* Posts */}
        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Posts by @{username}</h3>
          {stats.posts.length === 0 ? (
            <p className={styles.emptyState}>No posts yet</p>
          ) : (
            <div className={styles.posts}>
              {stats.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
