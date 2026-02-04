import { useState, useMemo } from 'react';
import { Button } from '../Button';
import { MentionInput } from '../MentionInput';
import { MentionTextArea } from '../MentionTextArea';
import { ImageUpload } from '../ImageUpload';
import { useCreatePost, usePosts } from '../../hooks/usePosts';
import { useUser } from '../../contexts/UserContext';
import { useAttachments } from '../../hooks/useAttachments';
import styles from './CreatePost.module.css';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const { username } = useUser();
  const createPost = useCreatePost();
  const { addAttachment } = useAttachments();
  const { data } = usePosts(100, 0); // Get posts to extract usernames

  // Extract unique usernames for mention suggestions
  const availableUsers = useMemo(() => {
    if (!data?.results) return [];
    const usernames = data.results.map((post) => post.username);
    return [...new Set(usernames)].sort();
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const result = await createPost.mutateAsync({
        username,
        title: title.trim(),
        content: content.trim(),
      });
      
      // Save images to localStorage
      if (images.length > 0 && result.id) {
        images.forEach((image) => {
          addAttachment(result.id, image);
        });
      }
      
      setTitle('');
      setContent('');
      setImages([]);
    }
  };

  const isButtonDisabled = title.trim().length === 0 || content.trim().length === 0 || createPost.isPending;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>What's on your mind?</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <MentionInput
          id="post-title"
          label="Title"
          placeholder="Hello world (Type @ to mention someone)"
          value={title}
          onChange={setTitle}
          availableUsers={availableUsers}
        />
        <MentionTextArea
          id="post-content"
          label="Content"
          placeholder="Content here... (Type @ to mention someone)"
          value={content}
          onChange={setContent}
          availableUsers={availableUsers}
        />
        <ImageUpload images={images} onImagesChange={setImages} maxImages={4} />
        <div className={styles.buttonWrapper}>
          <Button type="submit" disabled={isButtonDisabled}>
            {createPost.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}
