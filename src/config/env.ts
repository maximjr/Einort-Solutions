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

export const safeFirebaseConfig = {
  apiKey: "AIzaSyD4rkzKGjM22RtylSeNt5tFqADIceyW9X8",
  authDomain: "einortsolution.firebaseapp.com",
  projectId: "einortsolution",
  storageBucket: "einortsolution.firebasestorage.app",
  messagingSenderId: "254828728723",
  appId: "1:254828728723:web:c0b148ab5acbd186075866"
};

export const isFirebaseConfigured = (): boolean => true;

// Evaluate if Google Auth can safely run
export const isGoogleAuthEnabled = (): boolean => {
  return typeof ENV.GOOGLE_CLIENT_ID === 'string' && ENV.GOOGLE_CLIENT_ID.length > 0 && isFirebaseConfigured();
};


