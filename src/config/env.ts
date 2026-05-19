// src/config/env.ts
import firebaseFileConfig from '../../firebase-applet-config.json';

export const ENV = {
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || firebaseFileConfig?.apiKey || '',
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseFileConfig?.authDomain || '',
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseFileConfig?.projectId || '',
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseFileConfig?.storageBucket || '',
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseFileConfig?.messagingSenderId || '',
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || firebaseFileConfig?.appId || '',
  FIREBASE_DATABASE_ID: (firebaseFileConfig as any)?.firestoreDatabaseId || '',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  MODE: import.meta.env.MODE,
  IS_DEV: import.meta.env.MODE === 'development',
};

// Evaluate if Firebase can safely run
export const isFirebaseConfigured = (): boolean => {
  return (
    typeof ENV.FIREBASE_API_KEY === 'string' && ENV.FIREBASE_API_KEY.length > 0 &&
    typeof ENV.FIREBASE_PROJECT_ID === 'string' && ENV.FIREBASE_PROJECT_ID.length > 0
  );
};

// Evaluate if Google Auth can safely run
export const isGoogleAuthEnabled = (): boolean => {
  return typeof ENV.GOOGLE_CLIENT_ID === 'string' && ENV.GOOGLE_CLIENT_ID.length > 0 && isFirebaseConfigured();
};

export const safeFirebaseConfig = isFirebaseConfigured() ? {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
} : null;
