const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Delete all user conversations
exports.deleteAllConversations = functions.https.onCall(
  async (data, context) => {
    if (!data.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const userId = data.auth?.uid;

    try {
      const conversationsRef = db
        .collection("users")
        .doc(userId)
        .collection("conversations");
      const conversationsSnapshot = await conversationsRef.get();

      if (conversationsSnapshot.empty) {
        console.log(`No conversations found for userId: ${userId}`);
        return { success: true };
      }

      // Batch delete conversations and their messages
      const batch = db.batch();
      for (const convDoc of conversationsSnapshot.docs) {
        // Delete messages subcollection
        const messagesRef = convDoc.ref.collection("messages");
        const messagesSnapshot = await messagesRef.get();
        messagesSnapshot.docs.forEach((msgDoc) => {
          batch.delete(msgDoc.ref);
        });
        // Delete conversation document
        batch.delete(convDoc.ref);
      }

      await batch.commit();
      console.log(
        `Successfully deleted all conversations for userId: ${userId}`
      );
      return { success: true };
    } catch (error) {
      console.error("deleteAllConversations: Error:", {
        message: error.message,
        stack: error.stack,
      });
      throw new functions.https.HttpsError(
        "internal",
        `Failed to delete conversations: ${error.message}`
      );
    }
  }
);
