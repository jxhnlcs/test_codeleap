import { useState } from 'react';
import { ImageLightbox } from '../ImageLightbox';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className={styles.gallery}>
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.imageWrapper}
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={image}
              alt={`Attachment ${index + 1}`}
              className={styles.image}
              loading="lazy"
            />
            {images.length > 1 && (
              <div className={styles.imageOverlay}>
                <ExpandIcon />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

function ExpandIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
