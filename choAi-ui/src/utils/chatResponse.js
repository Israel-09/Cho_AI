import { httpsCallable } from "firebase/functions";
import { functions, auth, db } from "../config/firebase";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";

const getGeminiResponse = httpsCallable(functions, "getBotResponse");
const createConversation = httpsCallable(functions, "createConversation");

export const sendGeminiMessage = async (
  input,
  setInput,
  messages,
  setMessages,
  setLoading,
  conversationId = null,
  setConversationId
) => {
  if (!input.trim()) return;

  console.log(
    "sendGeminiMessage: Processing input:",
    input,
    "Current messages:",
    messages
  ); // Debug log

  // Add user message, checking for duplicates
  const userMessage = { sender: "user", text: input };
  setMessages((prev) => {
    if (prev.some((msg) => msg.text === input && msg.sender === "user")) {
      console.log("sendGeminiMessage: Duplicate user message skipped:", input);
      return prev;
    }
    console.log("sendGeminiMessage: Adding user message:", input);
    return [...prev, userMessage];
  });

  setInput("");
  setLoading(true);

  try {
    let currentConversationId = conversationId;
    console.log("currentConversationId", currentConversationId);
    if (auth.currentUser && !conversationId) {
      const title = await getGeminiResponse({
        text: `Given the following text, generate a short and clear 
        summary or title  that best captures the main idea or purpose of the content. 
        The summary should be informative, relevant, and suitable as a title for a conversation or document. 
        Text: ${input}. Ensure the title is a simple sentence or phrase not more than 5 words, 
        without any markdown formatting. No quote, no column just a simple phrase/sentence

        example
          "text": "Hi! How are you!",
          expected output: "Greeting",

          "text": "Tell me about Donald Trump",
          expected output: "Donald Trump's bio request",
        
        `,
        conversationId: null,
       
      });


      const result = await createConversation({
        title: title.data.response,
        firstInput: input,
      });

      currentConversationId = result.data.conversationId;
      console.log("current conversation Id", currentConversationId);
      setConversationId(currentConversationId); // Update parent component
    }

    const response = await getGeminiResponse({
      text: input,
      conversationId: currentConversationId || undefined,
    });

    const botMessage = { sender: "bot", text: response.data.response };
    setMessages((prev) => {
      if (
        prev.some((msg) => msg.text === botMessage.text && msg.sender === "bot")
      ) {
        console.log(
          "sendGeminiMessage: Duplicate bot message skipped:",
          botMessage.text
        );
        return prev;
      }
      console.log("sendGeminiMessage: Adding bot message:", botMessage.text);
      return [...prev, botMessage];
    });
  } catch (error) {
    console.error("Error getting response:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "error", text: "Error getting response" },
    ]);
  } finally {
    setLoading(false);
  }
};

// New function to initialize and listen to a conversation
export const initializeConversation = (
  userId,
  conversationId,
  setMessages,
  setError
) => {
  if (!userId || !conversationId) {
    console.warn("initializeConversation: Missing userId or conversationId", {
      userId,
      conversationId,
    });
    setMessages([]);
    setError("Invalid user or conversation ID");
    return () => {};
  }

  const messagesRef = collection(
    db,
    "users",
    userId,
    "conversations",
    conversationId,
    "messages"
  );
  const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

  const unsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      if (snapshot.empty) {
        console.log(
          "initializeConversation: No messages found for conversation:",
          conversationId
        );
        setMessages([]);
        setError(null);
        return;
      }

      const messages = snapshot.docs.map((msgDoc) => {
        const data = msgDoc.data();
        console.log("initializeConversation: Message data:", data); // Debug raw data
        return {
          sender: data.sender || "unknown",
          text: data.text || data.message || "", // Fallback to 'message' if 'text' is missing
          timestamp:
            data.timestamp?.toDate() || data.createdAt?.toDate() || new Date(),
          isNew: false,
        };
      });
      console.log("initializeConversation: Mapped messages:", messages);
      setMessages(messages);
      setError(null);
    },
    (error) => {
      console.error("initializeConversation: Error:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      setError(`Failed to load messages: ${error.message}`);
      setMessages([]);
    }
  );

  return unsubscribe;
};
