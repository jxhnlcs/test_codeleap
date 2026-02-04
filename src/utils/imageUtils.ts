/**
 * Convert File to Base64 string
 * @param file File to convert
 * @returns Promise with base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validate image file
 * @param file File to validate
 * @returns Object with isValid and error message
 */
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      error: 'File too large. Maximum size is 5MB.',
    };
  }

  return { isValid: true };
};

/**
 * Compress image if needed
 * @param base64 Base64 string
 * @param maxWidth Max width in pixels
 * @returns Promise with compressed base64
 */
export const compressImage = (base64: string, maxWidth = 1200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize if needed
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with quality compression
      const compressed = canvas.toDataURL('image/jpeg', 0.85);
      resolve(compressed);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

/**
 * Get image dimensions from base64
 */
export const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};
