import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyD4rkzKGjM22RtylSeNt5tFqADIceyW9X8",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "einortsolution.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "einortsolution",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "einortsolution.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "254828728723",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:254828728723:web:c0b148ab5acbd186075866"
};

const app = !getApps().length ? initializeApp(config) : getApp();
const db = getFirestore(app);

async function run() {
  try {
     await setDoc(doc(db, "users", "test2"), { hello: "world2" });
     console.log("Success write!");
  } catch(e) {
     console.error(e);
  } finally {
     process.exit(0);
  }
}
run();
