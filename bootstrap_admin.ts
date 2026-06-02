import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function run() {
  try {
    const q = query(collection(db, 'users'), where('email', '==', 'njeirheinard@gmail.com'));
    const snap = await getDocs(q);
    if (snap.empty) {
      console.log("User not found!");
    } else {
      for (const userDoc of snap.docs) {
        console.log('User found:', userDoc.id);
        const uid = userDoc.id;
        
        // Ensure user is in admins collection
        await setDoc(doc(db, 'admins', uid), {
          role: 'super_admin',
          assignedAt: new Date().toISOString(),
          email: 'njeirheinard@gmail.com'
        }, { merge: true });
        
        // Also update users.role for safety
        await setDoc(doc(db, 'users', uid), {
          accountType: 'super_admin'
        }, { merge: true });
        
        console.log("Successfully granted SUPER_ADMIN to", uid);
      }
    }
  } catch (e) {
    console.error("Error setting admin:", e);
  } finally {
    process.exit(0);
  }
}

run();
