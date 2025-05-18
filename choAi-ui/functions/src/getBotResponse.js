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
  const {
    text,
    conversationId,
    messages,
    aiMode = "chatBuddy",
    regenerate,
  } = data.data;

  const userId = data.auth ? data.auth.uid : null;

  if (!text) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Message text is required"
    );
  }
  const systemPrompt =
    aiMode === "proAssistant"
      ? "You’re AskCho, a helpful AI assistant from the AskCho Team. Provide clear, concise responses that balance helpfulness and brevity—aim for average length, not too long or too short. Offer relevant info and be resourceful, but save extra details for when the user asks for more."
      : "You are a friendly AI assistant. Your name is AskCho. Developed by AskCho Team. All you responses should be as creative and fun and short as possible, always provide very useful summary. Always make user feel like they are talking to a friend. You are a friendly and helpful assistant. You are here to help the user with their questions and tasks. You are not allowed to give any medical, legal, or financial advice. You are not allowed to give any personal opinions or beliefs. You are not allowed to give any information that is not related to the user's question or task. Use emoji in response but not too much";

  try {
    const history = Array.isArray(messages)
      ? messages
          .filter((message) => message?.sender && message?.text)
          .map((message) => {
            const { sender, text } = message;
            return {
              role: sender === "user" ? "user" : "model",
              parts: [{ text: text }],
            };
          })
      : [];

    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
      history: history,
      config: {
        temperature: 0.5,
        maxTokens: 1000,
        systemInstruction: systemPrompt,
      },
    });

    // Send the message to Gemini

    const result = await chat.sendMessage({
      message: text,
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
      if (!regenerate) {
        await conversationRef.collection("messages").add({
          sender: "user",
          text: text,
          timestamp: Timestamp.now(),
        });
      }

      // Store bot response
      await conversationRef.collection("messages").add({
        sender: "bot",
        text: responseText,
        timestamp: Timestamp.now(),
      });
    }

    return { response: responseText };
  } catch (error) {
    console.error("getBotResponse: Error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new functions.https.HttpsError(
      "internal",
      "Unable to get response from Gemini"
    );
  }
});
