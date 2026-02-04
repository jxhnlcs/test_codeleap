import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthChange, signOut as firebaseSignOut, extractUsername, getUserPhotoURL } from '../services/auth';
import { isFirebaseConfigured } from '../config/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

interface UserContextType {
  username: string;
  photoURL: string | null;
  isFirebaseUser: boolean;
  firebaseUser: FirebaseUser | null;
  setUsername: (username: string) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'codeleap_username';

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || '';
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  // Listen to Firebase auth changes
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    const unsubscribe = onAuthChange((user) => {
      if (user) {
        // Firebase user signed in
        const displayName = extractUsername(user);
        const photo = getUserPhotoURL(user);
        
        setFirebaseUser(user);
        setUsernameState(displayName);
        setPhotoURL(photo);
        localStorage.setItem(STORAGE_KEY, displayName);
        
        console.log('🔐 Firebase user authenticated:', displayName);
      } else {
        // No Firebase user
        setFirebaseUser(null);
        setPhotoURL(null);
        
        // Keep local username if exists
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setUsernameState('');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem(STORAGE_KEY, newUsername);
  };

  const logout = async () => {
    // Sign out from Firebase if user is Firebase authenticated
    if (firebaseUser) {
      try {
        await firebaseSignOut();
        console.log('🔓 Firebase sign-out successful');
      } catch (error) {
        console.error('❌ Firebase sign-out error:', error);
      }
    }
    
    // Clear local state
    setUsernameState('');
    setFirebaseUser(null);
    setPhotoURL(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        photoURL,
        isFirebaseUser: firebaseUser !== null,
        firebaseUser,
        setUsername,
        isLoggedIn: username.length > 0,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
