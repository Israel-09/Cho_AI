import { httpsCallable } from "firebase/functions";
import { functions, auth, db } from "../config/firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

const getBotResponse = httpsCallable(functions, "getBotResponse");
const createConversation = httpsCallable(functions, "createConversation");

export const sendMessage = async (input, setInput, messages, setMessages) => {
  if (!input.trim()) return;
  try {
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    // Add user message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    const response = await getBotResponse({
      text: input,
      conversationId: null,
      messages,
      aiMode: "proAssistant",
      regenerate: false,
      files: [],
      deepSearch: false,
    });

    console.log("Response from getBotResponse:", response);
    const botMessage = {
      id: Date.now() + 1,
      text: response.data.response,
      sender: "bot",
    };
    // Add bot message using functional update
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    console.log("Bot message set:", [...messages, newMessage, botMessage]);
  } catch (error) {
    console.log("Error sending message to Firebase:", error);
    console.error("Error sending message:", error);
  }
};
