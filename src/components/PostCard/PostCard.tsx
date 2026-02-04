import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../types';
import { useUser } from '../../contexts/UserContext';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { username } = useUser();
  const isOwner = username === post.username;

  const timeAgo = formatDistanceToNow(new Date(post.created_datetime), {
    addSuffix: true,
  });

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{post.title}</h3>
        {isOwner && (
          <div className={styles.actions}>
            <button
              className={styles.iconButton}
              onClick={() => onDelete(post)}
              aria-label="Delete post"
            >
              <DeleteIcon />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => onEdit(post)}
              aria-label="Edit post"
            >
              <EditIcon />
            </button>
          </div>
        )}
      </header>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.username}>@{post.username}</span>
          <span className={styles.time}>{timeAgo}</span>
        </div>
        <p className={styles.text}>{post.content}</p>
      </div>
    </article>
  );
}

function DeleteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 6H5H21"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
