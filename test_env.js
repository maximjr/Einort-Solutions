import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, process.env.VITE_FIREBASE_DATABASE_ID);

async function test() {
  try {
    const userDocRef = doc(db, 'users', 'test_auth_uid_123');
    await setDoc(userDocRef, { name: "Test User", email: "test@example.com", accountType: "client" });
    console.log("Successfully wrote user");
    
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      console.log("Successfully read user:", snap.data());
    } else {
      console.log("User doc doesn't exist");
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
