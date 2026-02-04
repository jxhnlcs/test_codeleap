import { useState, useMemo, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useComments } from '../../hooks/useComments';
import { useUser } from '../../contexts/UserContext';
import { usePosts } from '../../hooks/usePosts';
import { Button } from '../Button';
import { MentionTextArea } from '../MentionTextArea';
import { renderTextWithMentions } from '../../utils/mentions';
import type { Comment } from '../../types';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  postId: number;
  postOwnerUsername: string;
  onUsernameClick?: (username: string) => void;
}

export function CommentSection({ postId, postOwnerUsername, onUsernameClick }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { username } = useUser();
  const { addComment, deleteComment, getComments, getCommentCount } = useComments();
  const { data } = usePosts(100, 0); // Get posts to extract usernames

  // Extract unique usernames for mention suggestions
  const availableUsers = useMemo(() => {
    if (!data?.results) return [];
    const usernames = data.results.map((post) => post.username);
    return [...new Set(usernames)].sort();
  }, [data]);

  // Auto-mention post owner when expanding
  useEffect(() => {
    if (isExpanded && newComment === '' && postOwnerUsername !== username) {
      setNewComment(`@${postOwnerUsername} `);
    }
  }, [isExpanded, postOwnerUsername, username]);

  const comments = getComments(postId);
  const commentCount = getCommentCount(postId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(postId, username, newComment.trim());
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      deleteComment(commentId, postId);
    }
  };

  const handleMentionClick = (mentionedUsername: string) => {
    if (onUsernameClick) {
      onUsernameClick(mentionedUsername);
    }
  };

  return (
    <div className={styles.container}>
      {/* Comments toggle */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CommentIcon />
        <span>
          {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </span>
        <ChevronIcon expanded={isExpanded} />
      </button>

      {/* Comments list and form */}
      {isExpanded && (
        <div className={styles.content}>
          {/* Comment input with mentions */}
          <div className={styles.inputSection}>
            <MentionTextArea
              id={`comment-${postId}`}
              placeholder="Write a comment... (Type @ to mention, Ctrl+Enter to post)"
              value={newComment}
              onChange={setNewComment}
              availableUsers={availableUsers}
              rows={2}
              onCtrlEnter={handleAddComment}
            />
            <Button
              onClick={handleAddComment}
              disabled={newComment.trim().length === 0}
            >
              Post
            </Button>
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
            <p className={styles.emptyState}>No comments yet. Be the first!</p>
          ) : (
            <div className={styles.comments}>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUsername={username}
                  onDelete={handleDeleteComment}
                  onUsernameClick={onUsernameClick}
                  onMentionClick={handleMentionClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUsername: string;
  onDelete: (commentId: string) => void;
  onUsernameClick?: (username: string) => void;
  onMentionClick?: (username: string) => void;
}

function CommentItem({ comment, currentUsername, onDelete, onUsernameClick, onMentionClick }: CommentItemProps) {
  const isOwner = comment.username === currentUsername;
  const timeAgo = formatDistanceToNow(new Date(comment.created_datetime), {
    addSuffix: true,
  });

  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader}>
        <button
          className={styles.commentUsername}
          onClick={() => onUsernameClick?.(comment.username)}
        >
          @{comment.username}
        </button>
        <span className={styles.commentTime}>{timeAgo}</span>
        {isOwner && (
          <button
            className={styles.deleteCommentButton}
            onClick={() => onDelete(comment.id)}
            aria-label="Delete comment"
          >
            <TrashIcon />
          </button>
        )}
      </div>
      <p className={styles.commentText}>
        {renderTextWithMentions(comment.content, onMentionClick)}
      </p>
    </div>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
