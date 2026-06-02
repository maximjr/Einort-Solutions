import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// You must set GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to your Firebase Admin Service Account Key JSON file
// e.g. export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
admin.initializeApp({
  projectId: "einortsolution" // Change this if your project ID differs
});

const db = admin.firestore();
const auth = admin.auth();

const TARGET_EMAIL = 'njeirheinard@gmail.com';
const TARGET_ROLE = 'super_admin';

async function grantAdmin() {
  try {
    console.log(`Locating user by email: ${TARGET_EMAIL}...`);
    const userRecord = await auth.getUserByEmail(TARGET_EMAIL);
    const uid = userRecord.uid;
    console.log(`User found. UID: ${uid}`);

    // Update users collection
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      accountType: TARGET_ROLE,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ Successfully updated users collection role to ${TARGET_ROLE}`);

    // Ensure they are also in the admins collection
    const adminRef = db.collection('admins').doc(uid);
    await adminRef.set({
      role: TARGET_ROLE,
      email: TARGET_EMAIL,
      assignedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ Successfully appended user to admins collection with role ${TARGET_ROLE}`);

    console.log(`\n🎉 Admin privileges granted!`);
    console.log(`The user can now log in and will be instantly redirected to the Admin Dashboard.`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to grant admin access:", error);
    process.exit(1);
  }
}

grantAdmin();
