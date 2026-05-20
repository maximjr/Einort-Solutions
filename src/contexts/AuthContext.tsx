import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, AuthErrorCodes, AuthError } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUpWithEmail: (email: string, password: string, fullName: string, phoneNumber?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Quick check for the hardcoded super admin
        if (currentUser.email === 'njeirheinard@gmail.com') {
          setIsAdmin(true);
        } else {
          // Check for admin document
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsAdmin(adminDoc.exists() && ['admin', 'super_admin'].includes(adminDoc.data()?.role));
          } catch (e) {
            console.error("Error checking admin status:", e);
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserToFirestore = async (user: User, additionalData?: { phoneNumber?: string, fullName?: string }) => {
    if (!db) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: additionalData?.fullName || user.displayName,
          phoneNumber: additionalData?.phoneNumber || user.phoneNumber,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          accountType: 'user',
          onboardingStatus: 'completed'
        });
      } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }

      // Auto-provision Super Admin on first login if it's the specific email
      if (user.email === 'njeirheinard@gmail.com') {
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
          await setDoc(adminRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: 'super_admin',
            permissions: ['full_access'],
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isActive: true
          });
        } else {
          await setDoc(adminRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
      }

    } catch (err) {
      console.warn("Could not sync user to Firestore (database might not be initialized): ", err);
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, phoneNumber?: string) => {
    if (!auth) {
      throw new Error("Auth initialization skipped because Firebase was not configured.");
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: fullName });
      await syncUserToFirestore(result.user, { fullName, phoneNumber });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('User already exists. Sign in?');
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Auth initialization skipped because Firebase was not configured.");
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUserToFirestore(result.user);
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        throw new Error('Password or Email Incorrect');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
     if (!auth) {
      throw new Error("Auth initialization skipped because Firebase was not configured.");
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error resetting password", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUpWithEmail, loginWithEmail, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
