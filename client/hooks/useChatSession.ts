import { create } from "zustand";

interface ChatSessionStore {
  sessionID: string | null;
  setSessionID: (newSessionID: string) => void;
  chatHistory: string[];
  setChatHistory: (update: string[] | ((oldChatHistory: string[]) => string[])) => void;
  loadingResponse: boolean;
  setLoadingResponse: (newLoadingResponse: boolean) => void;
}

const useChatSession = create<ChatSessionStore>((set) => ({
  sessionID: null,
  setSessionID: (newSessionID: string) => set({sessionID: newSessionID}),
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
}))

export default useChatSession;