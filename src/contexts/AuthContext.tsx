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

    const activeAuth = auth;
    const activeDb = db;

    let unsubscribeDoc: (() => void) | null = null;
    let isMounted = true;

    const unsubscribeAuth = onAuthStateChanged(activeAuth, async (currentUser) => {
      if (!isMounted) return;
      
      setUser(currentUser);

      if (currentUser) {
        // Fetch custom user data from firestore
        try {
          const docRef = doc(activeDb, "users", currentUser.uid);

          // Update lastLogin safely 
          getDoc(docRef)
            .then((docSnap) => {
              if (docSnap.exists() && isMounted) {
                setDoc(
                  docRef,
                  { lastLogin: serverTimestamp() },
                  { merge: true },
                ).catch((err) => console.warn("Failed to update last login", err));
              }
            })
            .catch((err) => console.warn("Failed to get profile doc", err));

          unsubscribeDoc = onSnapshot(
            docRef,
            (docSnap) => {
              if (!isMounted) return;
              if (docSnap.exists()) {
                setUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
              } else {
                setUserData(null);
              }
              setLoading(false);
            },
            (error) => {
              console.error("Firestore snapshot error:", error);
              if (isMounted) {
                setUserData(null);
                setLoading(false);
              }
            },
          );
        } catch (error) {
          console.error("Auth context setup error:", error);
          if (isMounted) {
            setUserData(null);
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setUserData(null);
          setLoading(false);
        }
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
      }
    });

    return () => {
      isMounted = false;
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
