import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
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

const TARGET_EMAIL = 'njeirheinard@gmail.com';
const TARGET_ROLE = 'super_admin';

async function grantAdmin() {
  try {
    console.log(`Locating user by email: ${TARGET_EMAIL}...`);
    const q = query(collection(db, 'users'), where('email', '==', TARGET_EMAIL));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      console.log("User not found in users collection.");
      process.exit(1);
    }
    
    const userDoc = snap.docs[0];
    const uid = userDoc.id;
    console.log(`User found. UID: ${uid}`);

    // Update users collection
    await setDoc(doc(db, 'users', uid), {
      accountType: TARGET_ROLE,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log(`Successfully updated users collection role to ${TARGET_ROLE}`);

    // Ensure they are also in the admins collection
    await setDoc(doc(db, 'admins', uid), {
      role: TARGET_ROLE,
      email: TARGET_EMAIL,
      assignedAt: serverTimestamp()
    }, { merge: true });
    console.log(`Successfully appended user to admins collection with role ${TARGET_ROLE}`);

    console.log(`Admin privileges granted!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Failed to grant admin access:", error);
    process.exit(1);
  }
}

grantAdmin();
