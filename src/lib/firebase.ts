import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app: any;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;
let isFirebaseConfigured = false;

const firebaseConfig = {
  apiKey: "AIzaSyBgZkkDSUz-_bPpCA7t2UAd3Qrw1TeY6js",
  authDomain: "new-einort-web.firebaseapp.com",
  projectId: "new-einort-web",
  storageBucket: "new-einort-web.firebasestorage.app",
  messagingSenderId: "80255620883",
  appId: "1:80255620883:web:b422bd14ad45842eedace6",
  measurementId: "G-SCP4L95TFC",
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
