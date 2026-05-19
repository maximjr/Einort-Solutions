import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { safeFirebaseConfig, ENV, isFirebaseConfigured } from '../config/env';

// Avoid duplicate initialization
const createFirebaseApp = () => {
  if (!isFirebaseConfigured()) return null;
  if (!getApps().length) {
    return initializeApp(safeFirebaseConfig!);
  }
  return getApp();
};

export const app = createFirebaseApp();
export const db = app ? getFirestore(app, ENV.FIREBASE_DATABASE_ID || undefined) : null as unknown as ReturnType<typeof getFirestore>;
export const auth = app ? getAuth(app) : null as unknown as ReturnType<typeof getAuth>;
