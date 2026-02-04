import { useState, useEffect } from 'react';

const ATTACHMENTS_STORAGE_KEY = 'codeleap_attachments';

interface AttachmentsState {
  [postId: number]: string[]; // Array of base64 images
}

export function useAttachments() {
  const [attachments, setAttachments] = useState<AttachmentsState>(() => {
    const stored = localStorage.getItem(ATTACHMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(ATTACHMENTS_STORAGE_KEY, JSON.stringify(attachments));
  }, [attachments]);

  const addAttachment = (postId: number, imageBase64: string) => {
    setAttachments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), imageBase64],
    }));
  };

  const removeAttachment = (postId: number, imageBase64: string) => {
    setAttachments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).filter((img) => img !== imageBase64),
    }));
  };

  const getAttachments = (postId: number): string[] => {
    return attachments[postId] || [];
  };

  return {
    addAttachment,
    removeAttachment,
    getAttachments,
  };
}
