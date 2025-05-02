const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

require("dotenv").config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create a new conversation (authenticated users only)
exports.createConversation = functions.https.onCall(async (data, context) => {
  if (!data.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const userId = data.auth.uid;
  const title = data.data.title;

  try {
    const conversationRef = await db
      .collection("users")
      .doc(userId)
      .collection("conversations")
      .add({
        title: title,
        createdAt: Timestamp.now(),
      });
    console.log(conversationRef);
    return { conversationId: conversationRef.id, title: title };
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to create conversation"
    );
  }
});

exports.getConversations = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!data.auth) {
    console.error("getConversations: Unauthenticated request");
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const userId = data.auth.uid;
  console.log("getConversations: Fetching for userId:", userId);

  try {
    // Fetch the last 10 conversations, ordered by createdAt descending
    const conversationsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("conversations")
      .orderBy("createdAt", "desc")
      .limit(10) // Limit to 10 most recent conversations
      .get();

    const conversations = await Promise.all(
      conversationsSnapshot.docs.map(async (doc) => {
        // Fetch the last message for preview (limit to 1 for efficiency)
        const messagesSnapshot = await doc.ref
          .collection("messages")
          .orderBy("timestamp", "desc")
          .limit(1) // Only need the most recent message
          .get();
        const lastMessage = messagesSnapshot.docs[0]?.data() || null;

        return {
          id: doc.id,
          title: doc.data().title || "Untitled",
          createdAt: doc.data().createdAt?.toDate().toISOString() || null,
          lastMessage: lastMessage
            ? {
                sender: lastMessage.sender,
                text: lastMessage.text,
                timestamp:
                  lastMessage.timestamp?.toDate().toISOString() || null,
              }
            : null,
        };
      })
    );

    console.log(
      "getConversations: Fetched",
      conversations.length,
      "conversations for user:",
      userId
    );
    return { conversations };
  } catch (error) {
    console.error(
      "getConversations: Error fetching conversations for user:",
      userId,
      error
    );
    throw new functions.https.HttpsError(
      "internal",
      "Unable to get conversations: " + error.message
    );
  }
});

exports.getConversation = functions.https.onCall(async (data, context) => {
  if (!data.auth) {
    console.error("getConversation: Unauthenticated request");
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const userId = data.auth.uid;
  const conversationId = data.data.conversationId;

  console.log(
    "getConversation: Fetching conversation for user:",
    userId,
    "conversationId:",
    conversationId
  );

  if (!conversationId) {
    console.error("getConversation: Missing conversationId");
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Conversation ID is required"
    );
  }

  try {
    const conversationRef = db
      .collection("users")
      .doc(userId)
      .collection("conversations")
      .doc(conversationId);

    const conversationDoc = await conversationRef.get();

    if (!conversationDoc.exists) {
      console.error("getConversation: Conversation not found:", conversationId);
      throw new functions.https.HttpsError(
        "not-found",
        "Conversation not found"
      );
    }

    // Fetch all messages in the conversation
    const messagesSnapshot = await conversationRef
      .collection("messages")
      .orderBy("timestamp", "asc")
      .get();

    const messages = messagesSnapshot.docs.map((msgDoc) => ({
      sender: msgDoc.data().sender,
      text: msgDoc.data().text,
      timestamp:
        msgDoc.data().timestamp?.toDate().toISOString() ||
        new Date().toISOString(),
    }));

    const conversation = {
      id: conversationDoc.id,
      title: conversationDoc.data().title,
      createdAt:
        conversationDoc.data().createdAt?.toDate().toISOString() ||
        new Date().toISOString(),
      messages: messages, // Array of all messages
    };

    console.log("getConversation: Successfully fetched conversation:", {
      id: conversation.id,
      title: conversation.title,
      messageCount: messages.length,
    });
    return { conversation };
  } catch (error) {
    console.error("getConversation: Error fetching conversation:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to get conversation: " + error.message
    );
  }
});
