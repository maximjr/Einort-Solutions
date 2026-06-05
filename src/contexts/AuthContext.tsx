import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

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
  isFirebaseConfigured: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] Initialization started");
    if (!auth || !db) {
      console.log("[AuthProvider] Firebase auth or db not found, aborting initialization.");
      setLoading(false);
      return;
    }

    const activeAuth = auth;
    const activeDb = db;

    let unsubscribeDoc: (() => void) | null = null;
    let isMounted = true;
    let authTimeout: NodeJS.Timeout | null = null;

    // Failsafe: if we stay in loading for >15 seconds on initial mount, force load complete.
    const globalLoadingFailsafe = setTimeout(() => {
      if (isMounted) {
        console.warn("[AuthProvider] Initialization failsafe triggered: 15s timeout reached. Forcing loading false.");
        setLoading(false);
      }
    }, 15000);

    const unsubscribeAuth = onAuthStateChanged(activeAuth, async (currentUser) => {
      console.log(`[AuthProvider] Auth state changed. User ID: ${currentUser?.uid || 'none'}, Email: ${currentUser?.email || 'none'}`);
      
      if (!isMounted) return;
      
      // Clear previous timeout if any
      if (authTimeout) clearTimeout(authTimeout);

      if (currentUser) {
        setUser(currentUser);
        setLoading(true);

        // Failsafe specifically for this auth state change
        authTimeout = setTimeout(() => {
           if (isMounted) {
             console.warn("[AuthProvider] Auth state change failsafe triggered: 10s timeout reached waiting for Firestore. Forcing loading false.");
             setLoading(false);
           }
        }, 10000);

        const docRef = doc(activeDb, "users", currentUser.uid);

        // Safely trace and update last login timestamp in background without blocking
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists() && isMounted) {
            setDoc(
              docRef,
              { lastLogin: serverTimestamp() },
              { merge: true }
            ).catch(err => console.warn("[AuthProvider] Failed to update last login:", err));
          }
        }).catch(err => {
          console.warn("[AuthProvider] Warning trying to update last login during auth stabilization:", err);
        });

        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }

        console.log(`[AuthProvider] Subscribing to user profile document: users/${currentUser.uid}`);
        unsubscribeDoc = onSnapshot(
          docRef,
          (docSnap) => {
            console.log(`[AuthProvider] Firestore snapshot received. Exists: ${docSnap.exists()}`);
            if (!isMounted) return;
            
            // Success - clear timeouts
            if (authTimeout) clearTimeout(authTimeout);
            clearTimeout(globalLoadingFailsafe);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData({
                uid: docSnap.id,
                email: currentUser.email || "",
                fullName: currentUser.displayName || data?.fullName || "User",
                role: data?.role || "client",
                accountType: data?.accountType || "enterprise",
                permissions: data?.permissions || ["read_own_profile", "read_own_projects"],
                isAdmin: data?.role === "admin" || data?.role === "super_admin" || !!data?.isAdmin,
                createdAt: data?.createdAt,
                lastLogin: data?.lastLogin,
              } as UserData);
              setLoading(false);
            } else {
              // Gracefully handle first-time registration latency:
              const creationTime = currentUser.metadata.creationTime;
              const isNewlyCreated = creationTime && (Date.now() - new Date(creationTime).getTime() < 15000);

              if (isNewlyCreated) {
                console.log("[AuthProvider] Newly authenticated user. Waiting for profile document generation...");
                setUserData(null);
                
                // Keep loading until document generates, but with a timeout
                authTimeout = setTimeout(() => {
                  if (isMounted) {
                    console.warn("[AuthProvider] Newly authenticated user profile generation timeout (10s)");
                    setLoading(false);
                  }
                }, 10000);
              } else {
                console.warn(`[AuthProvider] User document not found for existing user ${currentUser.uid}`);
                setUserData(null);
                setLoading(false);
              }
            }
          },
          (error) => {
            console.error("[AuthProvider] Real-time profile sync failed:", error);
            if (isMounted) {
              if (authTimeout) clearTimeout(authTimeout);
              clearTimeout(globalLoadingFailsafe);
              setUserData(null);
              setLoading(false);
            }
          }
        );
      } else {
        clearTimeout(globalLoadingFailsafe);
        setUser(null);
        setUserData(null);
        setLoading(false);

        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
      }
    });

    return () => {
      isMounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      clearTimeout(globalLoadingFailsafe);
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, isFirebaseConfigured: true }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
