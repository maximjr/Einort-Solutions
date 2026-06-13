import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app:       FirebaseApp | null = null;
let auth:      Auth        | null = null;
let db:        Firestore   | null = null;
let analytics: Analytics   | null = null;

const allEnvVarsPresent = Object.values(firebaseConfig).every(Boolean);

if (!allEnvVarsPresent) {
  console.error(
    "[Firebase] Missing environment variables. " +
    "Copy .env.example to .env.local and fill in all VITE_FIREBASE_* values."
  );
}

try {
  app  = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db   = getFirestore(app);

  isSupported()
    .then((yes) => { if (yes && app) analytics = getAnalytics(app!); })
    .catch(() => { /* Analytics unavailable in this environment */ });
} catch (error) {
  console.error("[Firebase] Initialization failed:", error);
}

// True only when all env vars are present AND the SDK initialised successfully.
// Previously hardcoded `= true` regardless of actual init state.
export const isFirebaseConfigured = allEnvVarsPresent && app !== null;

export { app, auth, db, analytics };
