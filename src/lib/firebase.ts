import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBgZkkDSUz-_bPpCA7t2UAd3Qrw1TeY6js",
  authDomain: "new-einort-web.firebaseapp.com",
  projectId: "new-einort-web",
  storageBucket: "new-einort-web.firebasestorage.app",
  messagingSenderId: "80255620883",
  appId: "1:80255620883:web:b422bd14ad45842eedace6",
  measurementId: "G-SCP4L95TFC"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let isFirebaseConfigured = false;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  isFirebaseConfigured = true;
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { app, auth, db, analytics, isFirebaseConfigured };
