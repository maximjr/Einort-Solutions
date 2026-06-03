import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../lib/firebase";

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  role: "client" | "admin" | "super_admin";
  accountType: string;
  permissions: string[];
  isAdmin: boolean;
  createdAt: any;
  lastLogin?: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isFirebaseConfigured: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch custom user data from firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);

          // First, update lastLogin using a direct get/set to avoid snapshot loop if we write
          getDoc(docRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                setDoc(
                  docRef,
                  { lastLogin: serverTimestamp() },
                  { merge: true },
                ).catch(() => {});
              }
            })
            .catch(() => {});

          unsubscribeDoc = onSnapshot(
            docRef,
            (docSnap) => {
              if (docSnap.exists()) {
                setUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
              } else {
                setUserData(null);
              }
              setLoading(false);
            },
            () => {
              setUserData(null);
              setLoading(false);
            },
          );
        } catch (error) {
          setUserData(null);
          setLoading(false);
        }
      } else {
        setUserData(null);
        if (unsubscribeDoc) {
          unsubscribeDoc();
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, isFirebaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
