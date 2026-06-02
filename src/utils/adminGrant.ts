import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Secures the super_admin role for 'njeirheinard@gmail.com'.
 * Performs a highly resilient write operation with retry/exponential backoff.
 * 
 * @param uid The verified authentication UID of the targeted user.
 * @param email The verified email address.
 */
export async function secureGrantSuperAdmin(uid: string, email: string): Promise<boolean> {
  // Enforce zero-trust email checking
  if (email !== 'njeirheinard@gmail.com') {
    throw new Error("Security Policy Exception: Unauthorized elevation attempt denied.");
  }

  // Client-side Firestore Atomic writes
  if (!db) {
    throw new Error("Firestore instance is currently offline or not initialized.");
  }

  console.log("[Firestore Grant] Initiating secure super_admin setup...");
  const userDocRef = doc(db, 'users', uid);
  const adminDocRef = doc(db, 'admins', uid);

  let retries = 5;
  let delay = 300;

  while (retries > 0) {
    try {
      console.log(`[secureGrantSuperAdmin] Attempting update (${retries} retries left)...`);
      
      // Perform direct set operations with merge
      try {
        await setDoc(userDocRef, {
          accountType: 'super_admin'
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      }

      try {
        await setDoc(adminDocRef, {
          role: 'super_admin',
          email: email,
          lastTransitionAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `admins/${uid}`);
      }

      console.log("[secureGrantSuperAdmin] Super admin role successfully granted.");
      return true;
    } catch (err: any) {
      // If it is the JSON-structured handleFirestoreError, throw it directly
      if (err instanceof Error && err.message.startsWith('{') && err.message.includes('authInfo')) {
        throw err;
      }
      
      retries--;
      if (retries === 0) {
        throw err;
      }
      console.warn(`[secureGrantSuperAdmin] Attempt failed, retrying in ${delay}ms...`, err);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // exponential backoff
    }
  }

  return false;
}
