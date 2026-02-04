import { useState, useRef } from 'react';
import { fileToBase64, validateImageFile, compressImage } from '../../utils/imageUtils';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 4 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      const newImages: string[] = [];

      for (const file of files) {
        if (images.length + newImages.length >= maxImages) {
          setError(`Maximum ${maxImages} images allowed`);
          break;
        }

        // Validate
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          setError(validation.error || 'Invalid file');
          break;
        }

        // Convert to base64
        const base64 = await fileToBase64(file);
        
        // Compress
        const compressed = await compressImage(base64, 1200);
        
        newImages.push(compressed);
      }

      onImagesChange([...images, ...newImages]);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Images (optional)</label>
        {images.length > 0 && (
          <span className={styles.count}>
            {images.length}/{maxImages}
          </span>
        )}
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className={styles.previews}>
          {images.map((image, index) => (
            <div key={index} className={styles.preview}>
              <img src={image} alt={`Upload ${index + 1}`} className={styles.image} />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(index)}
                aria-label="Remove image"
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {canAddMore && (
        <div className={styles.uploadSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
            id="image-upload"
          />
          <label htmlFor="image-upload" className={styles.uploadButton}>
            {isUploading ? (
              <>
                <LoadingIcon />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadIcon />
                <span>Add Image</span>
              </>
            )}
          </label>
          <span className={styles.hint}>JPG, PNG, GIF, WebP (max 5MB each)</span>
        </div>
      )}

      {/* Error message */}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.spinner}
    >
      <path
        d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
