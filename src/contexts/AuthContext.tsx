import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";

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
    let unsubscribeAuth: (() => void) | null = null;
    let unsubscribeDoc: (() => void) | null = null;
    let isMounted = true;
    let authTimeout: NodeJS.Timeout | null = null;

    const globalLoadingFailsafe = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 15000);

    // Dynamically import Firebase to split bundle
    import("../lib/firebase")
      .then(({ auth, db }) => {
        if (!auth || !db) {
          setLoading(false);
          return;
        }

        Promise.all([
          import("firebase/auth"),
          import("firebase/firestore"),
        ]).then(
          ([
            { onAuthStateChanged },
            { doc, getDoc, onSnapshot, setDoc, serverTimestamp },
          ]) => {
            if (!isMounted) return;

            unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
              if (!isMounted) return;
              if (authTimeout) clearTimeout(authTimeout);

              if (currentUser) {
                setUser(currentUser);
                setLoading(true);

                authTimeout = setTimeout(() => {
                  if (isMounted) setLoading(false);
                }, 10000);

                const docRef = doc(db, "users", currentUser.uid);

                getDoc(docRef)
                  .then((docSnap) => {
                    if (docSnap.exists() && isMounted) {
                      setDoc(
                        docRef,
                        { lastLogin: serverTimestamp() },
                        { merge: true },
                      ).catch(() => {});
                    }
                  })
                  .catch(() => {});

                if (unsubscribeDoc) {
                  unsubscribeDoc();
                }

                unsubscribeDoc = onSnapshot(
                  docRef,
                  (docSnap) => {
                    if (!isMounted) return;
                    if (authTimeout) clearTimeout(authTimeout);
                    clearTimeout(globalLoadingFailsafe);

                    if (docSnap.exists()) {
                      const data = docSnap.data();
                      setUserData({
                        uid: docSnap.id,
                        email: currentUser.email || "",
                        fullName:
                          currentUser.displayName || data?.fullName || "User",
                        role: data?.role || "client",
                        accountType: data?.accountType || "enterprise",
                        permissions: data?.permissions || [
                          "read_own_profile",
                          "read_own_projects",
                        ],
                        isAdmin:
                          data?.role === "admin" ||
                          data?.role === "super_admin" ||
                          !!data?.isAdmin,
                        createdAt: data?.createdAt,
                        lastLogin: data?.lastLogin,
                      } as UserData);
                      setLoading(false);
                    } else {
                      const creationTime = currentUser.metadata.creationTime;
                      const isNewlyCreated =
                        creationTime &&
                        Date.now() - new Date(creationTime).getTime() < 15000;

                      if (isNewlyCreated) {
                        setUserData(null);
                        authTimeout = setTimeout(() => {
                          if (isMounted) setLoading(false);
                        }, 10000);
                      } else {
                        setUserData(null);
                        setLoading(false);
                      }
                    }
                  },
                  (error) => {
                    if (isMounted) {
                      if (authTimeout) clearTimeout(authTimeout);
                      clearTimeout(globalLoadingFailsafe);
                      setUserData(null);
                      setLoading(false);
                    }
                  },
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
          },
        );
      })
      .catch((err) => {
        console.warn("Failed to load Firebase", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      clearTimeout(globalLoadingFailsafe);
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
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
