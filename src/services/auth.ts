import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../config/firebase';

// Google Auth Provider (singleton)
let googleProvider: GoogleAuthProvider | null = null;

const getGoogleProvider = (): GoogleAuthProvider => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    // Request specific scopes
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    // Customize provider
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  }
  return googleProvider;
};

/**
 * Sign in with Google
 * @returns UserCredential with user info
 * @throws Error if auth fails or Firebase not configured
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Please add credentials to .env file.');
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const provider = getGoogleProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Security: Verify user has email
    if (!result.user.email) {
      throw new Error('Email not provided by Google');
    }

    console.log('✅ Google sign-in successful:', result.user.displayName);
    return result;
  } catch (error: any) {
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked. Please allow popups for this site.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection.');
    }
    
    console.error('❌ Google sign-in error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  if (!auth) return;

  try {
    await firebaseSignOut(auth);
    console.log('✅ Sign-out successful');
  } catch (error) {
    console.error('❌ Sign-out error:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 * @returns Current user or null
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth?.currentUser || null;
};

/**
 * Extract username from user
 * Priority: displayName > email username
 */
export const extractUsername = (user: User): string => {
  if (user.displayName) {
    return user.displayName;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Anonymous User';
};

/**
 * Get user photo URL (with fallback)
 */
export const getUserPhotoURL = (user: User): string | null => {
  return user.photoURL;
};
