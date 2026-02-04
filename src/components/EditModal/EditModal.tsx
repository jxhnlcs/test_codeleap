import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { TextArea } from '../TextArea';
import type { Post } from '../../types';
import { useUpdatePost } from '../../hooks/usePosts';
import styles from './EditModal.module.css';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export function EditModal({ isOpen, onClose, post }: EditModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const updatePost = useUpdatePost();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSave = async () => {
    if (post && title.trim() && content.trim()) {
      await updatePost.mutateAsync({
        id: post.id,
        payload: {
          title: title.trim(),
          content: content.trim(),
        },
      });
      onClose();
    }
  };

  const isButtonDisabled = title.trim().length === 0 || content.trim().length === 0 || updatePost.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>Edit item</h2>
        <div className={styles.form}>
          <Input
            id="edit-title"
            label="Title"
            placeholder="Hello world"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            id="edit-content"
            label="Content"
            placeholder="Content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} disabled={updatePost.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isButtonDisabled}>
            {updatePost.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
