const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const db = admin.firestore();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.getBotResponse = functions.https.onCall(async (data, context) => {
  const userMessage = data.data.text;
  const conversationId = data.data.conversationId;
  const userId = data.auth ? data.auth.uid : null;

  if (!userMessage) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Message text is required"
    );
  }

  try {
    let history = [];
    if (userId && conversationId) {
      const messagesRef = db
        .collection("users")
        .doc(userId)
        .collection("conversations")
        .doc(conversationId)
        .collection("messages")
        .orderBy("timestamp", "asc");

      const messagesSnapshot = await messagesRef.get();
      if (!messagesSnapshot.exists) {
        history = [];
      }

      history = messagesSnapshot.docs
        .map((doc) => {
          const { sender, text } = doc.data();
          return {
            role: sender === "user" ? "user" : "model",
            parts: [{ text: text }],
          };
        })
        .filter((entry) => entry !== null);
    }

    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
      history: history,
      config: {
        temperature: 0.5,
        maxTokens: 1000,
        systemInstruction:
          "You are a friendly AI assistant.  Your name is AskCho. Developed by AskCho Team. All you responses should be as creative and a bit fun and short as possible. Always make user feel like they are talking to a friend. You are a friendly and helpful assistant. You are here to help the user with their questions and tasks. You are not allowed to give any medical, legal, or financial advice. You are not allowed to give any personal opinions or beliefs. You are not allowed to give any information that is not related to the user's question or task.",
      },
    });

    const result = await chat.sendMessage({
      message: userMessage,
    });
    const responseText = result.text;

    // Store messages only for authenticated users with a valid conversationId
    if (userId && conversationId) {
      const conversationRef = db
        .collection("users")
        .doc(userId)
        .collection("conversations")
        .doc(conversationId);

      // Verify conversation exists
      const conversationDoc = await conversationRef.get();
      if (!conversationDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Conversation not found"
        );
      }

      // Store user message
      await conversationRef.collection("messages").add({
        sender: "user",
        text: userMessage,
        timestamp: Timestamp.now(),
      });

      // Store bot response
      await conversationRef.collection("messages").add({
        sender: "bot",
        text: responseText,
        timestamp: Timestamp.now(),
      });
    }
    console.log("I delivered", responseText);
    return { response: responseText };
  } catch (error) {
    console.error("Error in getBotResponse:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Unable to get response from Gemini"
    );
  }
});
