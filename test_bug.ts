import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGBrMbJmhY-XKQe3HpSxLwtnpmcoxr_Xg",
  authDomain: "einort-solution.firebaseapp.com",
  projectId: "einort-solution",
  storageBucket: "einort-solution.firebasestorage.app",
  messagingSenderId: "532466186157",
  appId: "1:532466186157:web:889842307ffad3587e1324"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function test() {
  try {
    const cred = await signInWithEmailAndPassword(auth, "test1780493754298@example.com", "password123");
    console.log("Signed in UID:", cred.user.uid);
    
    // Check if the user is an admin
    const udoc = await getDoc(doc(db, "users", cred.user.uid));
    console.log("User doc:", udoc.exists() ? udoc.data() : "none");

    const q = query(
      collection(db, "projects"),
      where("userId", "==", cred.user.uid),
      orderBy("createdAt", "desc")
    );
    try {
        const snap = await getDocs(q);
        console.log("Docs:", snap.size);
    } catch(e: any) {
        console.error("Query failed:", e.message);
    }
    
    process.exit(0);
  } catch (e: any) {
    console.error("Auth Fail", e.message);
    process.exit(1);
  }
}
test();
