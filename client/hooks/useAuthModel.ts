import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  setIsOpen: () => void;
  setIsClosed: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  setIsOpen: () => set({isOpen: true}),
  setIsClosed: () => set({isOpen: false})
}))

export default useAuthModal;