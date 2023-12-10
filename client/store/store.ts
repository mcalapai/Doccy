import { create } from 'zustand';

// Define the state and actions that the store will handle
type State = {
  chatHistory: string[];
  setChatHistory: (update: string[] | ((userChatHistory:string[]) => string[])) => void;
};

// Create the store
export const useStore = create<State>(set => ({
  chatHistory: [],
  setChatHistory: (update) => {
    if (typeof update === 'function') {
    set((state) => ({chatHistory: update(state.chatHistory)}));
  } else {
      set({chatHistory: update});
  }},
}));