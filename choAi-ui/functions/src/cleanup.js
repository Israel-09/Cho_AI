// functions/src/cleanup.js
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}


exports.cleanupEmptyConversations = onSchedule("every 30 minutes", async () => {
  const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;

  const emptyConvos = await admin
    .firestore()
    .collection("conversations")
    .where("emptySince", "<=", new Date(thirtyMinsAgo))
    .where("messageCount", "==", 0)
    .get();

  const batch = admin.firestore().batch();
  emptyConvos.docs.forEach((doc) => batch.delete(doc.ref));

  await batch.commit();
  console.log(`Cleaned up ${emptyConvos.size} empty conversations`);
});

exports.cleanupExpiredConversations = onSchedule("every 24 hours", async () => {
  const now = Date.now();
  const expiredConvos = await admin
    .firestore()
    .collection("conversations")
    .where("expiresAt", "<=", now)
    .get();
  const batch = admin.firestore().batch();
  expiredConvos.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Cleaned up ${expiredConvos.size} expired conversations`);
});
