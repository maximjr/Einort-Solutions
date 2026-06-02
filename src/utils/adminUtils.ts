import { runTransaction, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Updates the document for 'njeirheinard@gmail.com' in the 'users' collection, 
 * setting the 'role' field and 'accountType' field to 'super_admin' inside
 * a highly secure, atomic Firestore transaction.
 * 
 * @param uid The authenticated Firebase UID of the target user.
 * @param email The verified email address of the target user.
 */
export async function updateAdminRole(uid: string, email: string): Promise<boolean> {
  // Strict Zero-Trust Enforcer matching exactly 'njeirheinard@gmail.com'
  if (email !== 'njeirheinard@gmail.com') {
    throw new Error("Security Policy Exception: Unauthorized elevation attempt denied.");
  }

  if (!db) {
    throw new Error("Firestore instance is currently offline or not initialized.");
  }

  const userDocRef = doc(db, 'users', uid);

  console.log(`[adminUtils] Initiating atomic transaction for UID: ${uid} (Email: ${email})...`);

  try {
    const success = await runTransaction(db, async (transaction) => {
      const userSnapshot = await transaction.get(userDocRef);

      const payload = {
        role: 'super_admin',
        accountType: 'super_admin',
        email: email,
        updatedAt: new Date().toISOString()
      };

      if (!userSnapshot.exists()) {
        console.log(`[adminUtils] User doc does not exist yet. Initializing the doc with role: 'super_admin'.`);
        transaction.set(userDocRef, payload, { merge: true });
      } else {
        console.log(`[adminUtils] User doc exists. Atomically updating the 'role' and 'accountType' to 'super_admin'.`);
        transaction.update(userDocRef, {
          role: 'super_admin',
          accountType: 'super_admin',
          updatedAt: new Date().toISOString()
        });
      }
    });

    console.log(`[adminUtils] Transaction successfully committed for UID: ${uid}. Role updated to 'super_admin'.`);
    return true;
  } catch (err: any) {
    console.error(`[adminUtils] Error during role escalation transaction:`, err);
    throw err;
  }
}
