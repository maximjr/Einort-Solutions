import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, AuthErrorCodes, AuthError } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { logClientActivity } from '../utils/activityLogger';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'developer' | 'designer' | 'client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userRole: UserRole | null;
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Resolve Role Status
        try {
          // Automatic bootstrap for the designated super admin
          if (currentUser.email === 'njeirheinard@gmail.com') { // Super admin fallback
            try {
              const adminRef = doc(db, 'admins', currentUser.uid);
              const adminSnap = await getDoc(adminRef);
              if (!adminSnap.exists()) {
                await setDoc(adminRef, { role: 'super_admin', email: currentUser.email });
              }
            } catch (bootstrapErr) {
              console.warn("Could not bootstrap super admin:", bootstrapErr);
            }
          }

          // 1. Check if user exists in the admin hierarchy
          let adminDoc;
          try {
            adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          } catch (err: any) {
             // If they don't have permission to read the admins collection, they definitely aren't an admin.
             // We can safely swallow this and fall back to the users collection.
             adminDoc = { exists: () => false, data: () => null };
          }

          if (adminDoc.exists()) {
             const role = adminDoc.data()?.role as UserRole;
             setIsAdmin(['super_admin', 'admin', 'manager'].includes(role));
             setUserRole(role);
          } else {
             // 2. Otherwise consult general users directory
             let userDoc;
             try {
                userDoc = await getDoc(doc(db, 'users', currentUser.uid));
             } catch (err: any) {
                // If this fails and it's a permission error, they might be freshly signed up
                // and the backend triggers haven't populated the DB, or rules are strict.
                userDoc = { exists: () => false, data: () => null };
             }
             
             if (userDoc.exists()) {
               let role = (userDoc.data()?.accountType as UserRole) || 'client';
               // Prevent users from granting themselves admin roles via userDoc accountType
               if (['super_admin', 'admin', 'manager'].includes(role)) {
                 role = 'client';
               }
               setIsAdmin(false);
               setUserRole(role);
             } else {
               // Fallback if neither document was successfully read or exists
               setIsAdmin(false);
               setUserRole('client');
             }
          }
        } catch (e: any) {
          if (e?.code === 'unavailable' || e?.message?.includes('offline')) {
            console.warn("Could not check admin status: Client is offline");
          } else {
            console.error("Error checking role status:", e);
          }
          setIsAdmin(false);
          setUserRole('client');
        }
      } else {
        setIsAdmin(false);
        setUserRole(null);
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
        const newUserData: Record<string, any> = {
          uid: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          accountType: 'client',
          onboardingStatus: 'pending'
        };

        const displayName = additionalData?.fullName || user.displayName;
        if (displayName) newUserData.displayName = displayName;

        const phone = additionalData?.phoneNumber || user.phoneNumber;
        if (phone) newUserData.phoneNumber = phone;

        if (user.photoURL) newUserData.photoURL = user.photoURL;

        await setDoc(userRef, newUserData);
      } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      }
    } catch (err) {
      console.warn("Could not sync user to Firestore: ", err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, phoneNumber?: string) => {
    if (!auth) {
      throw new Error("Auth initialization skipped because Firebase was not configured.");
    }
    let userRecord = null;
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      userRecord = result.user;
      
      // Await profile update so that the auth object gets the correct displayName immediately
      await updateProfile(userRecord, { displayName: fullName });
      
      // Send email verification
      await import('firebase/auth').then(({ sendEmailVerification }) => {
        sendEmailVerification(userRecord!).catch(console.error);
      });
      
      // Sync to Firestore immediately so that the role/user doc is ready
      await syncUserToFirestore(userRecord, { fullName, phoneNumber });
      
      logClientActivity(userRecord.uid, userRecord.email, 'logged_in', 'User registered and logged in');
    } catch (error: any) {
      // Rollback auth user creation if Firestore sync fails or any other error happens after auth creation
      if (userRecord && error.code !== 'auth/email-already-in-use') {
        try {
          await userRecord.delete();
        } catch (delError) {
          console.error("Failed to rollback user creation:", delError);
        }
      }

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
      // Run database sync sequentially
      await syncUserToFirestore(result.user);
      
      logClientActivity(result.user.uid, result.user.email, 'logged_in', 'User authenticated');
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
    <AuthContext.Provider value={{ user, loading, isAdmin, userRole, signUpWithEmail, loginWithEmail, resetPassword, signOut }}>
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
