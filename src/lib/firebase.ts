import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app: any;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let isFirebaseConfigured = false;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.replace(/^"|"$/g, '').replace(/^'|'$/g, ''),
};

try {
  // Rigorously validate required environment variables to prevent silent crashes
  // Vercel might supply only partial env variables.
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.appId
  ) {
    throw new Error("Missing critical Firebase environment variables.");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseConfigured = true;
} catch (error) {
  console.warn("Firebase initialization skipped or failed:", error);
  // Silent fallback objects typed as any so the app doesn't crash on syntax errors, 
  // but we intercept it at the UI layer (App.tsx).
  isFirebaseConfigured = false;
  auth = {} as ReturnType<typeof getAuth>;
  db = {} as ReturnType<typeof getFirestore>;
}

export { app, auth, db, isFirebaseConfigured };
