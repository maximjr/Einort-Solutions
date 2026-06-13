import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../lib/firebase";

export interface UserData {
  uid:         string;
  email:       string;
  fullName:    string;
  role:        "client" | "admin" | "super_admin";
  accountType: string;
  permissions: string[];
  isAdmin:     boolean;
  createdAt:   unknown;
  lastLogin?:  unknown;
}

interface AuthContextType {
  user:                 User | null;
  userData:             UserData | null;
  loading:              boolean;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user:                 null,
  userData:             null,
  loading:              true,
  isFirebaseConfigured: false,
});

function mapUserData(user: User, data: Record<string, unknown>): UserData {
  return {
    uid:         user.uid,
    email:       user.email ?? "",
    fullName:    user.displayName || (data.fullName as string) || "User",
    role:        (data.role as UserData["role"]) || "client",
    accountType: (data.accountType as string) || "enterprise",
    permissions: (data.permissions as string[]) || ["read_own_profile", "read_own_projects"],
    isAdmin:     data.role === "admin" || data.role === "super_admin" || !!data.isAdmin,
    createdAt:   data.createdAt,
    lastLogin:   data.lastLogin,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let unsubDoc:          (() => void) | null = null;
    let newAccountTimeout: ReturnType<typeof setTimeout> | null = null;

    const clearNewAccountTimeout = () => {
      if (newAccountTimeout) { clearTimeout(newAccountTimeout); newAccountTimeout = null; }
    };

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      // Clean up previous user's document subscription and pending timers
      unsubDoc?.();
      unsubDoc = null;
      clearNewAccountTimeout();

      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const docRef = doc(db!, "users", currentUser.uid);

      // Update last-login without blocking the auth render cycle
      setDoc(docRef, { lastLogin: serverTimestamp() }, { merge: true }).catch(() => {});

      unsubDoc = onSnapshot(
        docRef,
        (snap) => {
          clearNewAccountTimeout();

          if (snap.exists()) {
            setUserData(mapUserData(currentUser, snap.data() as Record<string, unknown>));
          } else {
            // Race condition: the Firestore document may not exist yet for accounts
            // that were just created (Cloud Function write is in-flight). The listener
            // stays active and will fire again once the document appears.
            setUserData(null);
          }
          setLoading(false);
        },
        () => {
          clearNewAccountTimeout();
          setUserData(null);
          setLoading(false);
        }
      );

      // Safety valve: if a newly-created account's document never appears within 5s,
      // stop showing the loading screen so the UI isn't blocked indefinitely.
      const creationTime = currentUser.metadata.creationTime;
      const isNewlyCreated =
        !!creationTime && Date.now() - new Date(creationTime).getTime() < 15_000;

      if (isNewlyCreated) {
        newAccountTimeout = setTimeout(() => setLoading(false), 5_000);
      }
    });

    return () => {
      unsubAuth();
      unsubDoc?.();
      clearNewAccountTimeout();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
