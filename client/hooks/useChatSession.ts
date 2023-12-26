import { Database } from "@/types_db";
import { create } from "zustand";

interface ChatSessionStore {
  sessionID: string | null;
  setSessionID: (newSessionID: string) => void;
  chatTitle: string;
  setChatTitle: (newChatTitle: string) => void;
  chatHistory: string[];
  setChatHistory: (update: string[] | ((oldChatHistory: string[]) => string[])) => void;
  loadingResponse: boolean;
  setLoadingResponse: (newLoadingResponse: boolean) => void;
  savedChats: Database['public']['Tables']['chats']['Row'][] | null;
  setSavedChats: (newSavedChats: Database['public']['Tables']['chats']['Row'][] | null) => void;
  loadingSavedChat: boolean;
  setLoadingSavedChat: (newLoadingSavedChat: boolean) => void;
}

const useChatSession = create<ChatSessionStore>((set) => ({
  sessionID: null,
  setSessionID: (newSessionID: string) => set({sessionID: newSessionID}),
  chatTitle: "",
  setChatTitle: (newChatTitle: string) => set({chatTitle: newChatTitle}),
  chatHistory: [],
  setChatHistory: (update) => {
    if (typeof update === 'function') {
      set((state) => ({chatHistory: update(state.chatHistory)}))
    } else {
      set({chatHistory: update})
    }
  },
  loadingResponse: false,
  setLoadingResponse: (isLoading) => set({loadingResponse: isLoading}),
  savedChats: null,
  setSavedChats: (newSavedChats) => set({savedChats: newSavedChats}),
  loadingSavedChat: false,
  setLoadingSavedChat: (isLoading) => set({loadingSavedChat: isLoading}),
}))

export default useChatSession;