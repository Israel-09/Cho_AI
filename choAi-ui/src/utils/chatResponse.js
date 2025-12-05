import { httpsCallable } from "firebase/functions";
import { functions, auth, db } from "../config/firebase";
import { collection, query, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import userChatStore from "../hooks/chatState";
import { use } from "react";

const getGeminiResponse = httpsCallable(functions, "getBotResponse");
const createConversation = httpsCallable(functions, "createConversation");

export const sendGeminiMessage = async (
  input,
  setLoading,
  aiMode,
  conversationId = null,
  isRegenerate = false,
  files = [],
  chatOption = "chat",
  plagiarismChecked = false,
  failedMessageId = null
) => {
  const messages = []; // Removed messages parameter
  const { setInput } = userChatStore.getState();

  if (!input.trim() && files.length === 0 && !isRegenerate) return;

  setLoading(true);
  console.log("sendGeminiMessage: Files to send:", files);

  //save input to local storage to avoid data loss
  localStorage.setItem("choAi_draftMessage", input);
  setInput("");

  try {
    let currentConversationId = conversationId;

    if (!isRegenerate) {
      // add user message to the conversation if not regenerating
      const messageRef = await addDoc(
        collection(db, "conversations", conversationId, "messages"),
        {
          text: input,
          sender: "user",
          createdAt: serverTimestamp(),
          files: files,
          status: "completed",
        }
      );
    }

    // Prepare file metadata for the backend
    const fileMetadata = files.map((file) => ({
      name: file.name,
      url: file.url,
      type: file.type,
    }));

    console.log("sendGeminiMessage: File metadata prepared:", fileMetadata);

    // Get bot response
    const response = await getGeminiResponse({
      text: input,
      conversationId: currentConversationId || undefined,
      aiMode: aiMode,
      regenerate: isRegenerate,
      files: fileMetadata,
      chatOption: chatOption,
      failedMessageId: failedMessageId,
      plagiarismChecked: plagiarismChecked,
    });

    console.log("sendGeminiMessage: Bot response received:", response.data);

    // Clear input after sending

    localStorage.removeItem("choAi_draftMessage");

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("sendGeminiMessage: Error getting response:", error);
    userChatStore.setState({
      error: "Failed to get response. Please try again.",
      input: localStorage.getItem("choAi_draftMessage") || "",
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

export const createNewConversation = async (userId, chatOption = "chat") => {
  const ref = await addDoc(collection(db, "conversations"), {
    title: "New conversation",
    preview: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isTemp: !userId,
    expiresAt: userId ? null : Date.now() + 24 * 60 * 60 * 1000,
    messageCount: 0,
    userId: userId || "",
    emptySince: serverTimestamp(),
    chatOption: chatOption,
  });

  return ref.id;
};

export const startGuestSession = async () => {
  console.log("Starting guest session...");
  const guestToken = uuidv4().replace(/-/g, "").slice(0, 20); // "guest_abc123xyz"

  const convRef = await addDoc(collection(db, "conversations"), {
    userId: null,
    isTemp: true,
    guestToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    title: "New chat",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    messageCount: 0,
    emptySince: serverTimestamp(),
  });

  // // Save token in localStorage (survives refresh)
  // localStorage.setItem("guestToken", guestToken);
  // localStorage.setItem("currentConvId", convRef.id);

  return convRef.id;
};
