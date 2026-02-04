import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { TextArea } from '../TextArea';
import { useCreatePost } from '../../hooks/usePosts';
import { useUser } from '../../contexts/UserContext';
import styles from './CreatePost.module.css';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { username } = useUser();
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      await createPost.mutateAsync({
        username,
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
    }
  };

  const isButtonDisabled = title.trim().length === 0 || content.trim().length === 0 || createPost.isPending;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>What's on your mind?</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="post-title"
          label="Title"
          placeholder="Hello world"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          id="post-content"
          label="Content"
          placeholder="Content here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.buttonWrapper}>
          <Button type="submit" disabled={isButtonDisabled}>
            {createPost.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}
