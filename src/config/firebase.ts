import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Validate environment variables
const validateFirebaseConfig = (): FirebaseConfig => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // Check if all required fields are present
  const missingFields = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    console.warn(
      '⚠️  Firebase config incomplete. Missing:',
      missingFields.join(', ')
    );
    console.warn('📝 Create a .env file based on .env.example');
  }

  return config;
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export const initializeFirebase = (): { app: FirebaseApp; auth: Auth } | null => {
  try {
    const config = validateFirebaseConfig();
    
    // Only initialize if config is valid
    if (!config.apiKey || !config.projectId) {
      console.warn('🔥 Firebase not configured. Auth features disabled.');
      return null;
    }

    app = initializeApp(config);
    auth = getAuth(app);

    console.log('✅ Firebase initialized successfully');
    return { app, auth };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return null;
  }
};

// Export auth instance (lazy initialization)
export const getFirebaseAuth = (): Auth | null => {
  if (!auth) {
    const firebase = initializeFirebase();
    return firebase?.auth || null;
  }
  return auth;
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};
