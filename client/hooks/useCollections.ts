import { create } from "zustand";

interface CollectionStore {
  collections: string[];
  setCollections: (collections: string[]) => void;
  currentCollection: string;
  setCurrentCollection: (newCollection: string) => void;
}

const useCollections = create<CollectionStore>((set) => ({
  collections: [],
  setCollections: (newCollections: string[]) => set({collections: newCollections}),
  currentCollection: "",
  setCurrentCollection: (newCollection: string) => set({currentCollection: newCollection})
}))

export default useCollections;