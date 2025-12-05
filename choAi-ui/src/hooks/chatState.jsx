// store/chatStore.js
import { create } from "zustand";
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  createNewConversation,
  startGuestSession,
} from "../utils/chatResponse";

let messageUnsub = null;

const useChatStore = create((set, get) => ({
  user: null,
  conversations: [],
  currentConversationId: null,
  aiMode: "professional",
  chatOption: "chat",
  messages: [],
  loading: false,
  loadingMessages: false,
  error: null,
  botTyping: false,
  isChatting: false,
  input: "",
  navOpen: false,
  plagiarismChecked: false,
  conversationsLoading: false,

  // Setters
  setPlagiarismChecked: (plagiarismChecked) => set({ plagiarismChecked }),
  setUser: (user) => set({ user }),
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (currentConversationId) =>
    set({ currentConversationId }),
  setAiMode: (aiMode) => set({ aiMode }),
  setChatOption: (chatOption) => set({ chatOption }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setBotTyping: (botTyping) => set({ botTyping }),
  setIsChatting: (isChatting) => set({ isChatting }),
  setInput: (input) => set({ input }),
  setLoadingMessages: (loadingMessages) => set({ loadingMessages }),

  setNavOpen: (open) => set({ navOpen: open }),
  toggleNav: () => set((state) => ({ navOpen: !state.navOpen })),
  

  fetchConversations: async (userId) => {
    set({ conversationsLoading: true, error: null });
    try {
      const q = query(
        collection(db, "conversations"),
        where("userId", "==", userId),
        where("messageCount", ">", 0),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const loadedConversations = [];
        snapshot.forEach((doc) => {
          loadedConversations.push({ id: doc.id, ...doc.data() });
        });
        set({
          conversations: loadedConversations,
          conversationsLoading: false,
        });
      });

      messageUnsub?.();
      messageUnsub = unsub;

      return () => unsub();
    } catch (error) {
      set({ error: error.message, conversationsLoading: false });
      return () => {};
    }
  },

  createConversation: async (userId, chatOption = "chat") => {
    try {
      set({ loading: true, error: null, chatOption: chatOption });
      const convId = await createNewConversation(userId, chatOption);

      set({ currentConversationId: convId, loading: false });
      console.log(
        "Created new conversation with ID:",
        convId,
        "---options---",
        chatOption
      );
      return convId;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  startGuestConversation: async () => {
    try {
      const convId = await startGuestSession();
      set({ currentConversationId: convId });
      return convId;
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  fetchMessages: async (currentConversationId) => {
    if (!currentConversationId) return;
    set({ loading: true, error: null });
    try {
      const conversationRef = doc(db, "conversations", currentConversationId);
      const docSnap = await getDoc(conversationRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          chatOption: data.chatOption || "chat",
          aiMode: data.aiMode || "professional",
        });
      }
      const q = query(
        collection(db, "conversations", currentConversationId, "messages"),
        orderBy("createdAt")
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const currentMessages = get().messages; // Get current state
        const loaded = [];
        snapshot.forEach((doc) => {
          loaded.push({ id: doc.id, ...doc.data() });
        });

        let newBotTyping = get().botTyping; // Default to current value

        if (loaded.length > currentMessages.length) {
          const newMsgs = loaded.slice(currentMessages.length);
          // Only set false if a new bot message was added; otherwise keep current (true after user send)
          // if (newMsgs.some((msg) => msg.sender === "bot")) {
          //   newBotTyping = false;
          // }
          set({
            messages: [...currentMessages, ...newMsgs],
            loading: false,
            loadingMessages: false,
            botTyping: newBotTyping,
          });
        } else {
          // For full reloads (rare), set based on last message
          newBotTyping =
            loaded.length > 0 && loaded[loaded.length - 1].sender === "bot"
              ? false
              : true;
          set({
            messages: loaded,
            loading: false,
            loadingMessages: false,
            isChatting: loaded.length > 0,
            botTyping: newBotTyping,
          });
        }
      });
      return unsub;
    } catch (error) {
      set({ error: error.message, loading: false });
      return () => {};
    }
  },

  updateAiMode: async (currentConversationId, newMode) => {
    set({ aiMode: newMode });

    if (currentConversationId) {
      const conversationRef = doc(db, "conversations", currentConversationId);
      await updateDoc(conversationRef, { aiMode: newMode });
    }
  },

  updateChatOption: async (currentConversationId, option) => {
    set({ chatOption: option });
    if (currentConversationId) {
      const conversationRef = doc(db, "conversations", currentConversationId);
      await updateDoc(conversationRef, { chatOption: option });
    }
  },
  resetChatState: () => {
    messageUnsub?.();
    messageUnsub = null;
    set({
      currentConversationId: null,
      messages: [],
      input: "",
      botTyping: false,
      isChatting: false,
      error: null,
      aiMode: "professional",
      chatOption: "chat",
      loading: false,
      loadingMessages: false,
      plagiarismChecked: false,
    });
  },
}));

export default useChatStore;
