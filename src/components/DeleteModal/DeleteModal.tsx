import { Modal } from '../Modal';
import { Button } from '../Button';
import type { Post } from '../../types';
import { useDeletePost } from '../../hooks/usePosts';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export function DeleteModal({ isOpen, onClose, post }: DeleteModalProps) {
  const deletePost = useDeletePost();

  const handleDelete = async () => {
    if (post) {
      await deletePost.mutateAsync(post.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>Are you sure you want to delete this item?</h2>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} disabled={deletePost.isPending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deletePost.isPending}>
            {deletePost.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
