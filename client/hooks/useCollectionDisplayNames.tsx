const useCollectionDisplayNames = (
  collections: string[],
  userId: string | undefined
) => {
  let updatedCollections: string[] = [];
  collections.forEach((collection) => {
    // user logged in
    if (userId && collection.includes(userId)) {
      updatedCollections = [
        ...updatedCollections,
        collection.replace(`${userId}___`, ""),
      ];
      // guest
    } else if (!userId && !collection.includes("___")) {
      updatedCollections = [...updatedCollections, collection];
    }
  });

  return updatedCollections;
};

export default useCollectionDisplayNames;
