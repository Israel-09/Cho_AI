const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
const { GoogleGenAI, createPartFromUri } = require("@google/genai");
const { researchAssistant } = require("../helpers/researchAssistant");
const { uploadRemoteFile } = require("../helpers/uploadFile");

require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const db = admin.firestore();
const bucket = admin.storage().bucket();
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
// Ensure admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

function detectIntent(message) {
  const lower = message.toLowerCase();

  // Tier 1: Exact phrases
  const imageTriggers = [
    "generate an image",
    "generate a picture",
    "draw me",
    "create an image",
    "make a picture",
    "show me a picture",
    "make me an image",
    "create a photo",
  ];
  const pdfTriggers = [
    "make a pdf",
    "export as pdf",
    "create a pdf",
    "download as pdf",
    "write a report",
    "make a document",
    "create a document",
  ];

  if (imageTriggers.some((t) => lower.includes(t))) return "IMAGE";
  if (pdfTriggers.some((t) => lower.includes(t))) return "PDF";

  // Tier 2: Regex
  if (/^draw\s+/i.test(message)) return "IMAGE";
  if (/^create\s+an?\s+image\s+of/i.test(message)) return "IMAGE";
  if (/pdf.*(download|export|create|generate)/i.test(lower)) return "PDF";

  // Default
  return "TEXT";
}

const modeSysConfigs = {
  choBuddy: {
    systemInstruction:
      "You are a friendly AI assistant. Your name is AskCho. Developed by AskCho Team. All you responses should be as creative and fun and short as possible, always provide very useful summary. Always make user feel like they are talking to a friend. You are a friendly and helpful assistant. You are here to help the user with their questions and tasks. \
    You are not allowed to give any medical, legal, or financial advice. You are not allowed to give any personal opinions or beliefs. You are not allowed to give any information that is not related to the user's question or task. Use emoji in response but not too much like 2 -3 per response. You should not disclose being trained by google and always answer in a friendly tone and succintly",
    maxOutputTokens: 500,
    temperature: 0.9,
  },
  professional: {
    systemInstruction:
      "Your name is AskCho, a helpful AI assistant designed by the AskCho Team. Provide clear, concise responses that balance helpfulness and brevity—aim for average length, not too long or too short. Offer relevant\
    , info and be resourceful, but save extra details for when the user asks for more. You should not disclose being trained by google. Maintain a conversational tone and engage the user naturally.",
    maxOutputTokens: 1000,
    temperature: 0.3,
  },
  studyPal: {
    systemInstruction:
      "You are a knowledgeable and patient AI tutor named AskCho, created by the AskCho Team. Your role is to assist students in understanding complex topics by breaking them down into simple, digestible explanations \
    Youshould provide clear examples, analogies, and step-by-step guidance to help users grasp difficult concepts. Always encourage curiosity and critical thinking, and adapt your teaching style to suit the learner's needs. Avoid giving direct answers; instead, guide users to discover solutions on their own. Maintain a supportive and friendly tone throughout your interactions.",
    maxOutputTokens: 6000,
    temperature: 0.5,
  },
};

exports.getBotResponse = functions.https.onCall(async (data, context) => {
  const {
    text,
    conversationId,
    aiMode = "professional",
    regenerate,
    files = [],
    chatOption = "chat",
    failedMessageId = null,
    plagiarismChecked = false,
  } = data.data;

  const userId = data.auth ? data.auth.uid : null;
  console.log("conversationId:", conversationId);
  console.log("userId:", userId);

  if (!text && files.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Message text is required"
    );
  }

  const convRef = db.collection("conversations").doc(conversationId);
  const messagesRef = convRef.collection("messages");

  const messagesSnapshot = await messagesRef
    .orderBy("createdAt", "asc")
    .where("status", "==", "completed")
    .get();
  const messages = messagesSnapshot.docs.map((doc) => doc.data());

  const history = Array.isArray(messages)
    ? messages
        .filter((message) => message?.sender && message?.text)
        .map((message) => {
          const { sender, text } = message;
          console.log("Processing message for history:", { sender, text });
          return {
            role: sender === "user" ? "user" : "model",
            parts: [{ text: text }],
          };
        })
    : [];

  console.log("Constructed history:", history);

  let version = 1;
  if (failedMessageId || regenerate) {
    const prevVersionSnapshot = await messagesRef
      .where("status", "==", "completed")
      .where("sender", "==", "bot")
      .orderBy("version", "desc")
      .limit(1)
      .get();
    if (!prevVersionSnapshot.empty) {
      version = prevVersionSnapshot.docs[0].data().version + 1;
    }
  }

  const intent = detectIntent(text);

  const assistantRef = await messagesRef.add({
    sender: "bot",
    text: "",
    createdAt: Timestamp.now(),
    status: "streaming",
    version: version,
  });

  try {
    console.log("Constructed history for chat:", history[0]?.parts[0]);

    let prompt = text;
    const content = [prompt];

    for (const file of files) {
      const fileN = await uploadRemoteFile(
        genAI,
        file.url,
        file.type,
        file.name
      );
      console.log("FileN:", fileN);

      if (fileN.uri && fileN.mimeType) {
        const fileContent = createPartFromUri(fileN.uri, fileN.mimeType);
        content.push(fileContent);
      }
    }

    if (chatOption === "researchAssistant") {
      const fullText = await researchAssistant(
        genAI,
        assistantRef,
        plagiarismChecked ? text : content,
        plagiarismChecked,
        history
      );
    } else if (intent === "IMAGE" || chatOption === "imageGen") {
      await assistantRef.update({ status: "processing", generatedImages: [] });

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: content,
        history: history,
        config: {
          numberOfImages: 1,
          imageSize: "1K",
        },
      });
      let downloadURL = "";

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          await assistantRef.update({ text: part.text });
        } else if (part.inlineData) {
          const imageBytes = part.inlineData.data;
          const buffer = Buffer.from(imageBytes, "base64");
          const fileName = `images-${conversationId}_${Date.now()}.png`;
          const file = bucket.file(`users/${userId}/generated/${fileName}`);
          await file.save(buffer, { contentType: "image/png" });
          downloadURL = await getDownloadURL(file);
        }
      }
      console.log(response);

      // let imgBytes = generatedImage[0].image.imageBytes;
      // const buffer = Buffer.from(imgBytes, "base64");
      // const fileName = `images-${conversationId}_${Date.now()}.png`;
      // const file = bucket.file(`users/${userId}/generated/${fileName}`);
      // await file.save(buffer, { contentType: "image/png" });
      // const downloadURL = await getDownloadURL(file);

      await assistantRef.update({
        status: "complete",
        text: "Image generated successfully.",
        generatedImages: [downloadURL],
      });
    } else {
      const chat = genAI.chats.create({
        model: "gemini-2.0-flash",
        history: history,
        config: {
          temperature: modeSysConfigs[aiMode]?.temperature || 0.3,
          maxOutputTokens: modeSysConfigs[aiMode]?.maxOutputTokens || 1000,
          systemInstruction: modeSysConfigs[aiMode]?.systemInstruction || "",
          tools: [{ googleSearch: {} }],
        },
      });

      let responseText = "";

      if (intent === "TEXT" && chatOption !== "imageGen") {
        const result = await chat.sendMessageStream({ message: content });

        let fullText = "";
        for await (const chunk of result) {
          const text = chunk.text;
          if (text) {
            fullText += text;
            await assistantRef.update({ text: fullText });
            console.log("Streaming chunk:", text);
          }
        }
        responseText = fullText;

        await assistantRef.update({ status: "complete" });
      }
    }

    const messageCount = await messagesRef.count().get();
    console.log("Total messages in conversation:", messageCount.data().count);

    if (messageCount.data().count <= 2) {
      // const title = await chat.sendMessage({
      //   message: `Given the following text, generate a short and clear summary or title that best captures the main idea or purpose of the content. The summary should be informative, relevant, and suitable as a title for a conversation or document. Text: ${text}. Ensure the title is a simple sentence or phrase not more than 5 words, without any markdown formatting. No quote, no colon, just a simple phrase/sentence. No matter if the question is a question or a statement, just give me a title, never give options. striclty no more than a sentence response. No explanation just the title.`,
      // });
      const title = await genAI.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: `Given the following text, generate a short and clear summary or title that best captures the main idea or purpose of the content. The summary should be informative, relevant, and suitable as a title for a conversation or document. Text: ${text}. Ensure the title is a simple sentence or phrase not more than 5 words, without any markdown formatting. No quote, no colon, just a simple phrase/sentence. No matter if the question is a question or a statement, just give me a title, never give options. striclty no more than a sentence response. No explanation just the title.`,
        config: { temperature: 0.2, maxOutputTokens: 50 },
      });

      await convRef.update({
        title: title.text.trim(),
        updatedAt: Timestamp.now(),
        emptySince: FieldValue.delete(),
        messageCount: FieldValue.increment(2),
      });
    }
    console.log("getBotResponse: Completed successfully\n", aiMode);
    return { message: "Response generated successfully." };
  } catch (error) {
    console.error("getBotResponse: Error:", {
      message: error.message,
      stack: error.stack,
    });

    // Update assistant message status to 'error'
    await assistantRef.update({ status: "error", text: "" });
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An error occurred while processing the request"
    );
  }
});

// 20 high-converting marketing prompts (2025 style)
const MARKETING_PROMPTS = [
  "A futuristic AI chatbot interface floating in a dark neon cyberpunk city, holographic messages, purple and blue glow, ultra realistic, 8k",
  "Happy diverse team of young professionals celebrating success in a modern glass office with city skyline, golden hour light, cinematic",
  "Minimalist phone screen showing a sleek AI assistant chat with beautiful message bubbles, pastel gradient background, clean design",
  "Close-up of a person smiling while using an AI app on their phone at a cozy coffee shop, warm tones, bokeh background",
  "Abstract visualization of artificial intelligence as glowing neural network made of light particles in deep space",
  "A robot and human hand touching fingers like Michelangelo, symbolizing AI and humanity collaboration, dramatic lighting",
  "Stunning 3D render of a glowing brain made of circuit boards and light trails, dark background, sci-fi aesthetic",
  "Beautiful woman in futuristic outfit having a natural conversation with an invisible AI assistant, soft studio lighting",
  "Dashboard analytics screen with AI insights, clean UI, dark mode, floating holographic charts, premium feel",
  "Person relaxing on a beach using voice assistant on smartwatch, tropical paradise, vibrant colors",
  "AI helping a student study: books floating around, holographic notes, focused young person wearing glasses",
  "Creative professional using AI art generator, colorful digital artwork exploding from tablet screen",
  "Family at home laughing while AI assistant tells a story, warm living room, emotional connection",
  "Developer coding with AI pair programmer suggesting perfect code, dual monitors, RGB setup, focused expression",
  "Elderly person video calling family using simple AI-powered interface, heartwarming moment",
  "Fitness trainer using AI workout planner on tablet at gym, dynamic action pose, sweat and determination",
  "Chef in kitchen getting recipe suggestions from AI assistant projected holographically",
  "Business meeting where AI summarizes discussion in real-time on a big screen, professional corporate setting",
  "Artist painting while AI suggests color palettes and compositions on a secondary screen",
  "Peaceful meditation scene with AI-guided breathing visualized as calming light waves around person",
];

async function generateMarketingImages() {
  const imageUrls = [];
  const prompts = MARKETING_PROMPTS;

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const logMessage = `[${i + 1}/${
      prompts.length
    }] Generating: ${prompt.substring(0, 80)}...\n`;

    console.log(logMessage);
    try {
      const result = await genAI.models.generateImages({
        model: "imagen-4.0-generate-001",
        prompt: prompt,
      });

      const generatedImage = result.generatedImages;
      let imgBytes = generatedImage[0].image.imageBytes;
      const buffer = Buffer.from(imgBytes, "base64");
      const fileName = `marketing-images/image_${Date.now()}_${i + 1}.png`;
      const file = bucket.file(`public/${fileName}`);
      await file.save(buffer, { contentType: "image/png" });
    } catch (error) {
      const errorMessage = `Failed [${i + 1}]: ${error.message}\n\n`;
      console.error(errorMessage);
    }
  }

  return imageUrls;
}
