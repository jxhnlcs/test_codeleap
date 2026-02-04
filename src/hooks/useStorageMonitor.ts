import { useState, useEffect, useCallback } from 'react';

const STORAGE_WARNING_THRESHOLD = 4 * 1024 * 1024; // 4MB - warn before hitting 5MB limit

interface StorageInfo {
  used: number;
  usedFormatted: string;
  percentage: number;
  isNearLimit: boolean;
}

export function useStorageMonitor() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    usedFormatted: '0 KB',
    percentage: 0,
    isNearLimit: false,
  });
  const [showWarning, setShowWarning] = useState(false);

  const calculateStorageUsage = useCallback(() => {
    let totalSize = 0;

    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += item.length * 2; // UTF-16 encoding = 2 bytes per char
          }
        }
      }
    } catch (e) {
      console.warn('Error calculating storage usage:', e);
    }

    const percentage = Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100);
    const isNearLimit = totalSize >= STORAGE_WARNING_THRESHOLD;

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    setStorageInfo({
      used: totalSize,
      usedFormatted: formatSize(totalSize),
      percentage,
      isNearLimit,
    });

    // Show warning if near limit
    if (isNearLimit) {
      setShowWarning(true);
    }

    return { totalSize, isNearLimit };
  }, []);

  // Check storage on mount and periodically
  useEffect(() => {
    calculateStorageUsage();

    // Check every 30 seconds
    const interval = setInterval(calculateStorageUsage, 30000);
    return () => clearInterval(interval);
  }, [calculateStorageUsage]);

  // Listen for storage events (changes from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      calculateStorageUsage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [calculateStorageUsage]);

  const clearAllStorage = useCallback(() => {
    const keysToKeep = ['codeleap_username']; // Keep user logged in
    const keysToRemove: string[] = [];

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    
    setShowWarning(false);
    calculateStorageUsage();
  }, [calculateStorageUsage]);

  const clearAttachmentsOnly = useCallback(() => {
    localStorage.removeItem('codeleap_attachments');
    setShowWarning(false);
    calculateStorageUsage();
  }, [calculateStorageUsage]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  return {
    storageInfo,
    showWarning,
    clearAllStorage,
    clearAttachmentsOnly,
    dismissWarning,
    recheckStorage: calculateStorageUsage,
  };
}
