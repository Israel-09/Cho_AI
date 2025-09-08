import { httpsCallable } from "firebase/functions";
import { functions, auth, db } from "../config/firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

const getGeminiResponse = httpsCallable(functions, "getBotResponse");
const createConversation = httpsCallable(functions, "createConversation");

export const sendGeminiMessage = async (
  input,
  setInput,
  messages,
  setMessages,
  setLoading,
  aiMode,
  conversationId = null,
  setConversationId,
  isRegenerate = false,
  setResponseHistory,
  files = [],
  deepSearch = false
) => {
  if (!input.trim() && files.length === 0 && !isRegenerate) return;

  setLoading(true);
  console.log("sendGeminiMessage: Files to send:", files);

  try {
    let currentConversationId = conversationId;

    // Handle conversation creation for new conversations
    if (auth.currentUser && !conversationId && !isRegenerate) {
      const titleResponse = await getGeminiResponse({
        text: `Given the following text, generate a short and clear summary or title that best captures the main idea or purpose of the content. The summary should be informative, relevant, and suitable as a title for a conversation or document. Text: ${input}. Ensure the title is a simple sentence or phrase not more than 5 words, without any markdown formatting. No quote, no colon, just a simple phrase/sentence. No matter if the question is a question or a statement, just give me a title.

        example:
          "text": "Hi! How are you!",
          expected output: "Greeting",

          "text": "Tell me about Donald Trump",
          expected output: "Donald Trump's bio request",
        `,
        conversationId: null,
        aiMode: "proAssistant",
        regenerate: false,
        files: [],
        deepSearch: false,
      });

      const result = await createConversation({
        title: titleResponse.data.response,
        firstInput: input,
      });

      currentConversationId = result.data.conversationId;
      console.log(
        "sendGeminiMessage: Current conversation ID:",
        currentConversationId
      );
      setConversationId(currentConversationId);
    }

    // If regenerating, remove the last bot message from state and database
    if (isRegenerate) {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage.sender !== "bot") {
          console.log("sendGeminiMessage: No bot message to regenerate");
          return prev;
        }
        updatedMessages.pop(); // Remove last bot message from state

        // Delete the last bot message from Firestore
        if (auth.currentUser && currentConversationId) {
          console.log("sendGeminiMessage: Deleting bot message from Firestore");
          const messageRef = collection(
            db,
            "users",
            auth.currentUser.uid,
            "conversations",
            currentConversationId,
            "messages"
          );

          const messageQuery = query(
            messageRef,
            where("text", "==", lastMessage.text),
            where("sender", "==", "bot"),
            limit(1)
          );

          getDocs(messageQuery)
            .then((querySnapshot) => {
              if (querySnapshot.empty) {
                console.log("sendGeminiMessage: No matching bot message found");
                return;
              }
              querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref).catch((error) => {
                  console.error(
                    "sendGeminiMessage: Error deleting bot message:",
                    error
                  );
                });
              });
            })
            .catch((error) => {
              console.error(
                "sendGeminiMessage: Error querying bot message:",
                error
              );
            });
        }
        return updatedMessages;
      });
    }

    // Add user message (skip if regenerating)
    if (!isRegenerate) {
      const userMessage = { sender: "user", text: input };
      setMessages((prev) => {
        if (prev.some((msg) => msg.text === input && msg.sender === "user")) {
          console.log(
            "sendGeminiMessage: Duplicate user message skipped:",
            input
          );
          return prev;
        }
        console.log("sendGeminiMessage: Adding user message:", input);
        return [...prev, userMessage];
      });
      setInput("");
    }

    // Prepare file metadata for the backend
    const fileMetadata = files.map((file) => ({
      name: file.name,
      url: file.url,
      type: file.type,
    }));

    console.log("sendGeminiMessage: File metadata prepared:", fileMetadata);

    console.log("Messages", messages);
    // Get bot response
    const response = await getGeminiResponse({
      text: input,
      conversationId: currentConversationId || undefined,
      messages,
      aiMode: aiMode,
      regenerate: isRegenerate,
      files: fileMetadata,
      deepSearch: deepSearch,
    });

    const botMessage = {
      sender: "bot",
      text: response.data.response,
      isNew: true,
    };

    // Update response history
    setResponseHistory((prev) => {
      const newHistory = isRegenerate ? [...prev, botMessage] : [botMessage];
      console.log("sendGeminiMessage: Updated responseHistory:", newHistory);
      return newHistory;
    });

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
    console.error("sendGeminiMessage: Error getting response:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "error", text: "Error getting response" },
    ]);
  } finally {
    setLoading(false);
  }
};

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
        setMessages([]);
        setError(null);
        return;
      }

      const messages = snapshot.docs.map((msgDoc) => {
        const data = msgDoc.data();
        return {
          sender: data.sender || "unknown",
          text: data.text || data.message || "",
          timestamp:
            data.timestamp?.toDate() || data.createdAt?.toDate() || new Date(),
          isNew: false,
          files: data.files || null,
        };
      });
      console.log("initializeConversation: Messages loaded:", messages);
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
