const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getStorage, getBytes } = require("firebase-admin/storage");
const { Timestamp } = require("firebase-admin/firestore");
const { GoogleGenAI, createPartFromUri } = require("@google/genai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const db = admin.firestore();
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

async function uploadRemoteFile(url, type, displayName) {
  console.log("Uploading file from URL:", url);
  const fileBuffer = await fetch(url).then((response) =>
    response.arrayBuffer()
  );

  const fileBlob = new Blob([fileBuffer], { type: type });

  const file = await genAI.files.upload({
    file: fileBlob,
    config: {
      displayName: displayName,
    },
  });

  // Wait for the file to be processed.
  let getFile = await genAI.files.get({ name: file.name });
  while (getFile.state === "PROCESSING") {
    getFile = await genAI.files.get({ name: file.name });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
  if (file.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  return file;
}

exports.getBotResponse = functions.https.onCall(async (data, context) => {
  const {
    text,
    conversationId,
    messages,
    aiMode = "chatBuddy",
    regenerate,
    files = [],
    deepSearch = false,
  } = data.data;

  const userId = data.auth ? data.auth.uid : null;

  if (!text && files.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Message text is required"
    );
  }

  const systemPrompt =
    aiMode === "proAssistant"
      ? "Your name is AskCho, a helpful AI assistant designed by the AskCho Team. Provide clear, concise responses that balance helpfulness and brevity—aim for average length, not too long or too short. Offer relevant info and be resourceful, but save extra details for when the user asks for more. You should not disclose being trained by google ."
      : "You are a friendly AI assistant. Your name is AskCho. Developed by AskCho Team. All you responses should be as creative and fun and short as possible, always provide very useful summary. Always make user feel like they are talking to a friend. You are a friendly and helpful assistant. You are here to help the user with their questions and tasks. You are not allowed to give any medical, legal, or financial advice. You are not allowed to give any personal opinions or beliefs. You are not allowed to give any information that is not related to the user's question or task. Use emoji in response but not too much like 2 -3 per response. You should not disclose being trained by google ";

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

    let prompt = text;
    if (deepSearch) {
      prompt = `You are to conduct a deep search to find relevant information and guide to help the user. The query is to be carefully resarched then include 5-10 relevant links to the user. The link should follow the proper markdown formatting [title](link), otherwise there'll be problem in the rendering. Do not include the instruction in the output. 
        Let your response follow this format:
        [Inroduction to the topic]
        [a comprehensive answer to the question/query]

        Here are some links that might help you for further research:
        [link Title](link 1)
        ...
        [Link Title](link n)

        The query is: """${text}""" `;
    }
    const content = [prompt];

    for (const file of files) {
      const fileN = await uploadRemoteFile(file.url, file.type, file.name);
      console.log("FileN:", fileN);

      if (fileN.uri && fileN.mimeType) {
        const fileContent = createPartFromUri(fileN.uri, fileN.mimeType);
        content.push(fileContent);
      }
    }

    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
      history: history,
      config: {
        temperature: 0.5,
        maxTokens: deepSearch ? 4000 : 2000,
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    // Send the message to Gemini
    const result = await chat.sendMessage({
      message: content,
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
          files: files,
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
