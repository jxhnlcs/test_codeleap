import styles from './StorageWarning.module.css';

interface StorageWarningProps {
  usedFormatted: string;
  percentage: number;
  onClearAll: () => void;
  onClearAttachments: () => void;
  onDismiss: () => void;
}

export function StorageWarning({
  usedFormatted,
  percentage,
  onClearAll,
  onClearAttachments,
  onDismiss,
}: StorageWarningProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <WarningIcon />
          <h2 className={styles.title}>Storage Almost Full</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Your browser's local storage is almost full. This may prevent the app from saving new data like images, likes, and comments.
          </p>

          <div className={styles.usageBar}>
            <div className={styles.usageLabel}>
              <span>Storage Used</span>
              <span className={styles.usageValue}>{usedFormatted} / 5 MB</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${percentage >= 80 ? styles.danger : styles.warning}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className={styles.percentage}>{percentage.toFixed(0)}% used</span>
          </div>

          <div className={styles.info}>
            <InfoIcon />
            <p>
              Most storage is used by <strong>images</strong>. Clearing attachments will remove all uploaded images from posts but keep your likes, comments, and notifications.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.dismissButton} onClick={onDismiss}>
            Dismiss
          </button>
          <button className={styles.clearAttachmentsButton} onClick={onClearAttachments}>
            <TrashIcon />
            Clear Images Only
          </button>
          <button className={styles.clearAllButton} onClick={onClearAll}>
            <TrashIcon />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01"
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
