const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}


const db = admin.firestore();

// Delete user account and profile
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  if (!data.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  const userId = data.auth.uid;

  try {
    // Delete Firestore user profile
    const userDoc = db.collection("users").doc(userId);
    await userDoc.delete();

    // Delete Firebase Authentication account
    await admin.auth().deleteUser(userId);

    console.log(`Successfully deleted user account and profile for userId: ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("deleteUserAccount: Error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new functions.https.HttpsError("internal", `Failed to delete account: ${error.message}`);
  }
});